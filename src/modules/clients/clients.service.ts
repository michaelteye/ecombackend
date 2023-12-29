import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/registerClient.entity';
import { RegisterClientDto,signInWithGoogleDto,RegisterAdmintDto } from './dtos/registerClient.dto';
import { authEntity } from 'src/modules/authUsers/entities/authUser.entity';
import { AdminEntity } from 'src/modules/authUsers/entities/admin_user.entity';
import * as bcrypt from 'bcrypt'
import * as argon2 from 'argon2'
import { AuthUserRole } from 'src/modules/authUsers/types/auth-user.roles';
@Injectable()
export class ClientsService {
    constructor(
        @InjectRepository(Client) private readonly userRepository: Repository<Client>,
        @InjectRepository(authEntity) private readonly authRepository: Repository<authEntity>,

         ){}

        

         private mapClientToDTO(client: Client) {
            const clientDTO: any = { ...client };
            delete clientDTO.authUser; // Exclude the circular reference property
            return clientDTO;
          }
         async CreateUser(input: RegisterClientDto):Promise<Client>{

            // hash  the password
           
            //   let passwordToHash = this.doesContainSpecial(input.password)
               const salt = 10;
               const hash = await bcrypt.hash(input.password, salt)
   
               const registerUser = new Client();
               registerUser.firstName = input.firstName;
               registerUser.lastName  = input.lastName;
               console.log('the value for the firstname and lastName is >>>', input.firstName + input.lastName)
               if(input.password.length < 8 ){
                  throw new HttpException('Password must be at least 8 characters',HttpStatus.BAD_REQUEST);
               }

               if(input.password && (input.password.length) < 8){
                     throw new HttpException('This Password is already exist',HttpStatus.CONFLICT);
               }
               registerUser.password = hash; 
               registerUser.email = input.email;
               registerUser.age = input.age;
               registerUser.gender = input.gender;
               registerUser.userName = input.userName;
               registerUser.provider = input.provider
               registerUser.roles = [AuthUserRole.User]
               // const salt = await bcrypt.genSalt()
   
               const auth = new authEntity()
               // const hash = await this.hashData(input.password);
   
               auth.password = hash
               auth.roles = [AuthUserRole.User]
               auth.userName = input.userName
               if(input.email){
                  const emailExist = await this.findByEmail(input.email)
                  if(emailExist)
                     throw new HttpException('Email  already exist',HttpStatus.BAD_REQUEST)
               }
               auth.email = input.email
               if(input.phone && input.phone.length !== 12 ){
                  throw new HttpException("Phone number must be 12 digits",HttpStatus.BAD_REQUEST)
               }
               auth.phone = input.phone;
               auth.client = registerUser;
               registerUser.authUser = auth;
               auth.userId = registerUser.id
               auth.provider = registerUser.provider
               
               const saveAuth = await this.authRepository.save(auth)
               registerUser.authUser = saveAuth
               
               await this.userRepository.save(registerUser)
               return this.mapClientToDTO(registerUser);
            // return responseDTO;
         }

         // register a user with google

         async registerWithGoogle(user: signInWithGoogleDto):Promise<any>{
            try{
              
              const newUser = await this.userRepository.create(user);
               return this.userRepository.save(newUser);
            }
            catch(err){
            }
         }

         async FindAllUser():Promise<Client[]>{
            return await this.userRepository.find();
         }
         checkUser = (email:string)=>{
            const userEmail = this.userRepository.findOne({where:{email}})
            return userEmail;
         }
      async FindAUser(id:string):Promise<Client>{
         return await this.userRepository.findOne({where:{id}})
      }
      async FinDAndDelete(id: string):Promise<void>{
         const userToDelete = await this.userRepository.findOne({where:{id}})

         if(!userToDelete){
            throw new NotFoundException(`User with ID ${id} not found`);
         }
         await this.userRepository.remove(userToDelete)
      }

      async UpdateUser(UserToupdate:RegisterClientDto,id:string):Promise<Client>{
            const userToUpdate = await this.userRepository.findOne({where:{id}})
            if(userToUpdate){
               const updateAUser = new Client()
               updateAUser.age = UserToupdate.age
               updateAUser.firstName  = UserToupdate.firstName;
               updateAUser.lastName = UserToupdate.lastName;
               updateAUser.userName = UserToupdate.userName;
               
               const UpdatedUser = Object.assign(updateAUser, UserToupdate)
               return await this.userRepository.save(UpdatedUser)
            }
      }

      async findByEmail(email:string):Promise< Client | undefined>{
         return this.userRepository.findOne({ where: {email}})
      }

      

      //check for special characters in password
      doesContainSpecial(characters:any){
         const specialChars = ["!", "@", "#", "$", "%", "&", "*", "_", "-", "?"];
         for(let i = 0; i < characters.length; i++){
            if(characters.includes(specialChars[i])) 
            return true
         }
         throw new Error('password must contain characters as well')
      }

      async passwordExist(password:string):Promise<Client | undefined>{
         return this.userRepository.findOne({where:{password}})
      }

     
}
