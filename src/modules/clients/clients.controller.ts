import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { RegisterClientDto } from './dtos/registerClient.dto';
import { Client } from './entities/registerClient.entity';

@ApiTags('USER')
@Controller('clients')
export class ClientsController {
    constructor( private clientsService:ClientsService ){}

    @Post('register')
    async createClient(@Body() clientDto : RegisterClientDto):Promise<Client>{
       return await this.clientsService.CreateUser(clientDto)
    }

    @Get('all')
    async getClients():Promise<Client[]>{
        return await this.clientsService.FindAllUser()
    }
    @Get('user/:id')
    async getAUser(@Param('id') id){
        return  await   this.clientsService.FindAUser(id);
    }
    async DeleteUser(@Param('id') id){
        return await this.clientsService.FinDAndDelete(id)
    }

    @Put('user/update/:id')
    async UpdateUser( @Param('id') id:string, @Body() update:RegisterClientDto):Promise<Client>{
            return await this.clientsService.UpdateUser(update, id)
    }
}
