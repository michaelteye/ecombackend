import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/modules/clients/entities/registerClient.entity';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from '../services/authUsers.service';
import { ClientsService } from 'src/modules/clients/clients.service';
import { authEntity } from '../entities/authUser.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private clientService: ClientsService,
    private configService: ConfigService,

    @InjectRepository(Client) private userRepository: Repository<Client>,
    @InjectRepository(authEntity)
    private authRepository: Repository<authEntity>,
  ) {
    // super({
    //   clientID:
    //     '236041089559-04hbi064123dt4vpi86n5ffuojg8uf9l.apps.googleusercontent.com',
    //   clientSecret: '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',
    //   callbackURL: 'http://localhost:3001/api/auth/google/redirect',
    //   scope: ['profile', 'email'],
    // });
    super({
      clientID:
        configService.get<string>('GOOGLE_CLIENT_ID') ||
        process.env.GOOGLE_CLIENT_ID || '236041089559-04hbi064123dt4vpi86n5ffuojg8uf9l.apps.googleusercontent.com',
      clientSecret:
        configService.get<string>('GOOGLE_CLIENT_SECRET') || 
        process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        configService.get<string>('GOOGLE_CALLBACK_URL') ||
        process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
    console.log(
      'GOOGLE_CLIENT_ID:',
      configService.get<string>('GOOGLE_CLIENT_ID'),
    );
    console.log(
      'GOOGLE_CLIENT_SECRET:',
      configService.get<string>('GOOGLE_CLIENT_SECRET'),
    );
    console.log(
      'GOOGLE_CALLBACK_URL:',
      configService.get<string>('GOOGLE_CALLBACK_URL'),
    );
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
    newUser.provider = profile.provider;
    const savedUsers = await this.userRepository.save(newUser);

    const auth = new authEntity();
    auth.userName = profile.displayName;
    auth.email = email;
    auth.userId = savedUsers.id;
    auth.provider = profile.provider;

    await this.authRepository.save(auth);

    return savedUsers;
  }
}
