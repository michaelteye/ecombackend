import {Inject, Injectable} from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'
import { ClientsService } from 'src/clients/clients.service';
import { Client } from 'src/clients/entities/registerClient.entity'
import { AuthService } from '../services/authUsers.service'

@Injectable()

export class SessionSerializer extends PassportSerializer {
    constructor(
        private authService: AuthService,
        private clientService: ClientsService
    ){
        super();
    }

    serializeUser(user: any, done: Function) {
        console.log('Serializer User');
        done(null, user);
    }

    async deserializeUser(payload: any, done: Function) {
           const client = await this.clientService.FindAUser(payload.id);
           console.log('Deserialize User');
           console.log(client);
           return client ? done(null, client) : done(null, null)
    }
}