import { AdminService } from "../services/adminUser.service";
import { signInDto } from "../dtos/authUsers.dto";
import { RegisterAdmintDto } from "src/modules/clients/dtos/registerClient.dto";
import { AdminEntity as Admin } from "../entities/admin_user.entity";
import {
    Controller,
    Request,
    Post,
    UseGuards,
    Body,
    Get,
    Param,
    UnauthorizedException,
  } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from "../guards/local-auth.guard";

@ApiTags('ADMIN ACCESS')
@Controller('admin')
export class AdminUserController{
    constructor(
        private adminService:AdminService
    ){}
    @Post('register')
    async createClient(@Body() clientDto: RegisterAdmintDto): Promise<Admin> {
      return await this.adminService.CreateAdminUser(clientDto);
    }
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() signInDto: signInDto):Promise<Admin>{
      return this.adminService.LoginIn(signInDto);
    }
}