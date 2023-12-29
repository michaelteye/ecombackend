import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../jwt-payload.interface';
import { ClientsService } from 'src/modules/clients/clients.service';
import { jwtConstants } from '../constants';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor( private usersService:ClientsService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey: jwtConstants.secret
        })
    }

    async validate(payload:JwtPayload):Promise<any>{
        const user = await this.usersService.FindAUser(payload.sub)

        if(!user){
            throw new UnauthorizedException();
        }
        return user;
    }
}