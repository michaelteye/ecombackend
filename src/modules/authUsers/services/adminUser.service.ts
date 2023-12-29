import { Client } from "src/modules/clients/entities/registerClient.entity";
import { authEntity } from "../entities/authUser.entity";
import { AdminEntity } from "../entities/admin_user.entity";
import { RegisterAdmintDto } from "src/modules/clients/dtos/registerClient.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt'
import { HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { signInDto } from "../dtos/authUsers.dto";
import { JwtService } from "@nestjs/jwt";
import { AuthRoles } from "../guards/roles.auth.guard";
import { AuthUserRole } from "../types/auth-user.roles";

export class AdminService{
    constructor(
        @InjectRepository(AdminEntity) private adminRepo:Repository<AdminEntity>,
        @InjectRepository(authEntity) private userAuthRepo:Repository<authEntity>,
        @InjectRepository(Client) private userRepo:Repository<Client>,
        private jwtService: JwtService,
    ){}


    async CreateAdminUser(request:RegisterAdmintDto):Promise<AdminEntity>{
        const salt = 10;
        const hash = await bcrypt.hash(request.password, salt)

        let newAdmin=new AdminEntity();
         newAdmin.firstName = request.firstName;
         newAdmin.lastName = request.lastName;
         newAdmin.email = request.email;
         newAdmin.password = hash; 

         const newUser = new Client()
         newUser.firstName = request.firstName
         newUser.lastName = request.lastName
         newUser.email = request.email
         newUser.roles = [AuthUserRole.Admin]
         newUser.password = hash
         await this.userRepo.save(newUser)

         const authUser = new authEntity()
         authUser.email = request.email;
         authUser.phone = request.phone;
         authUser.roles = [AuthUserRole.Admin]
         authUser.password = hash;
         await this.userAuthRepo.save(authUser)

         return await this.adminRepo.save({...newAdmin})
      
   // register client
     }

     async LoginIn(signInDto: signInDto): Promise<any> {
        try {
        
          const { email, password } = signInDto;
          console.log('the email is given as >>', email)
       
          const checkUserEmail = await this.findByAdminEmail(email);
      
          //verify password using bcrypt
          const isPasswordValid = await bcrypt.compare(password, checkUserEmail.password)
          if (!isPasswordValid){
            throw new UnauthorizedException("Invalid Password")
          }
          console.log('the valid password is given as >>>', isPasswordValid)
    
    
          const payload = { sub: checkUserEmail.id, email: checkUserEmail.email, roles:checkUserEmail.roles };
          console.log('the payload is ', payload);
    
          const accessToken = await this.jwtService.signAsync(payload);
          const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '1d',
          });
          return {
            access_token: accessToken,
            refresh_token: refreshToken,
          };
        } catch (err) {
          throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);
        }
      }
     async findByAdminEmail(email:string):Promise< Client | undefined>{
        return this.userRepo.findOne({ where: {email}})
     }
}