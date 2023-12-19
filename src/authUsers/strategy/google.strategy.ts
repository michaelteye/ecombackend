import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/clients/entities/registerClient.entity';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from '../services/authUsers.service';
import { ClientsService } from 'src/clients/clients.service';
import { authEntity } from '../entities/authUser.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private clientService: ClientsService,

    @InjectRepository(Client) private userRepository: Repository<Client>,
    @InjectRepository(authEntity)
    private authRepository: Repository<authEntity>,
  ) {
    super({
      clientID:
        '236041089559-04hbi064123dt4vpi86n5ffuojg8uf9l.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3001/api/auth/google/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);

    const email = profile.emails[0].value;
    const emailexist = await this.clientService.findByEmail(email);
    if (emailexist) {
      throw new HttpException(
        'your email already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = new Client();
    newUser.firstName = profile.name.givenName;
    newUser.lastName = profile.name.familyName;
    newUser.userName = profile.displayName;
    newUser.email = email;
    newUser.provider = profile.provider
    const savedUsers = await this.userRepository.save(newUser);

    const auth = new authEntity();
    auth.userName = profile.displayName
    auth.email = email;
    auth.userId = savedUsers.id;
    auth.provider = profile.provider

    await this.authRepository.save(auth);

    return savedUsers;

  }
}
