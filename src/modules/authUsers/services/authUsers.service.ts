import { InjectRepository } from '@nestjs/typeorm';
import { ClientsService } from 'src/modules/clients/clients.service';
import { Repository } from 'typeorm';
import { authEntity } from '../entities/authUser.entity';
import { JwtService } from '@nestjs/jwt';
import { authUserDto, signInDto } from '../dtos/authUsers.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { BlacklistService } from './authUserLogOut.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  RegisterClientDto,
  signInWithGoogleDto,
  RegisterWithGoogleDto,
} from 'src/modules/clients/dtos/registerClient.dto';
import { JwtRefreshTokenStrategy } from '../strategy/jwt-refresh-token.strategy';
import { Client } from 'src/modules/clients/entities/registerClient.entity';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  resetTokens: { email: string; token: string; timestamp: number }[] = [];
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);
  private readonly smtpTransport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'bad313cf8d0c11',
      pass: 'e113c0e7ddacb3',
    },
  });
  constructor(
    private clientsService: ClientsService,
    @InjectRepository(authEntity)
    @InjectRepository(authEntity)
    private readonly authRepository: Repository<authEntity>,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    private blacklistService: BlacklistService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const client = await this.clientsService.findByEmail(email);

    if (client) {
      const isPasswordValid = await bcrypt.compare(password, client.password);
      if (isPasswordValid) {
        const { password, ...results } = client;
        return results;
      }
    }
    return null;
  }

  async registerWithGoogleA(user: RegisterWithGoogleDto) {
    try {
      const newUser = await this.authRepository.create(user);
      return this.authRepository.save(newUser);
    } catch (err) {}
  }

  async signIn(signInDto: signInDto): Promise<any> {
    try {
      const { email, password } = signInDto;
      console.log('the email is given as >>', email);

      const checkUserEmail = await this.clientsService.findByEmail(email);

      if(!checkUserEmail){
          throw new UnauthorizedException('User not found')
      }

      //verify password using bcrypt
      const isPasswordValid = await bcrypt.compare(
        password,
        checkUserEmail.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid Password');
      }
      console.log('the valid password is given as >>>', isPasswordValid);

      const payload = {
        sub: checkUserEmail.id,
        email: checkUserEmail.email,
        role: checkUserEmail.roles,
      };
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
      // throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);
      throw new Error('Wrong credentials')
    }
  }


  async logout(token: string): Promise<void> {
    // Add the token to the blacklist upon logout
    this.blacklistService.addToBlacklist(token);
    // Perform any other necessary cleanup
  }


  //

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ access_token: string }> {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken);
      //await this.refreshTokenIdsStorage.validate(decoded.sub, refreshToken);
      const payload = { sub: decoded.sub, email: decoded.email };
      const accessToken = await this.jwtService.signAsync(payload);
      console.log('the refresh token is >>>', accessToken);
      return { access_token: accessToken };
    } catch (error) {
      this.logger.error(`Error: ${error.message}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.clientsService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    // Remove expiration tokens

    const currentTime = Date.now();
    this.resetTokens = this.resetTokens.filter(
      (rt) => currentTime - rt.timestamp < 3600000,
    );

    //Generate a reset token based on the user's email and a secret key
    const resetToken = this.generateResetToken(user.email);

    // storen the reset token and its timestamp
    this.resetTokens.push({ email, token: resetToken, timestamp: currentTime });

    // Sends the reset token email
    await this.sendPasswordResetEmail(email, resetToken);
  }

  async verifyPasswordResetToken(
    email: string,
    token: string,
  ): Promise<boolean> {
    const expectedToken = this.generateResetToken(email);
    return token === expectedToken;
  }

  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
  ): Promise<void> {
    const resetToken = this.resetTokens.find(
      (rt) => rt.email === email && rt.token === token,
    );

    if (!resetToken) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Validate token expiration (e.g., tokens older than 1 hour are invalid)
    const currentTime = Date.now();
    if (currentTime - resetToken.timestamp > 3600000) {
      throw new UnauthorizedException('Expired reset token');
    }

    const user = await this.authRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update the user's password
    user.password = newPassword;
    await this.authRepository.save(user);

    // Remove the used reset token
    this.resetTokens.splice(this.resetTokens.indexOf(resetToken), 1);
  }

  private generateResetToken(email: string): string {
    return `${email}-${uuidv4}`;
  }
  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
  ): Promise<void> {
    const resetLink = `http://localhost:3001/api/auth/reset?token=${resetToken}`;
    await this.mailerService.sendMail({
      to:email,
      subject:'Password Reset Request',
      template:'resetPassword',
      context:{
        resetLink
      }
    })
  }
}
