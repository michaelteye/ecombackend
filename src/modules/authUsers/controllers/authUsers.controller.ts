import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/authUsers.service';
import { signInDto } from '../dtos/authUsers.dto';
import { RegisterClientDto } from 'src/modules/clients/dtos/registerClient.dto';
import { Client } from 'src/modules/clients/entities/registerClient.entity';
import { ClientsService } from 'src/modules/clients/clients.service';
import { BlacklistService } from '../services/authUserLogOut.service';
import { JwtRefreshTokenGuard } from '../guards/jwt-refresh-token.guard';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { ApiTags } from '@nestjs/swagger';

// import

@ApiTags('AUTHENTICATION')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private clientsService: ClientsService,
    private  blacklistService: BlacklistService
  ) {}

  @Post('register')
  async createClient(@Body() clientDto: RegisterClientDto): Promise<Client> {
    return await this.clientsService.CreateUser(clientDto);
  }

  // @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() signInDto: signInDto):Promise<Client> {
    return this.authService.signIn(signInDto);
  }

  @Post('logout')
  async logout(@Headers('authorization') authHeader: string): Promise<any> {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }
    const [, token] = authHeader.split(' ');
    try {
      await this.blacklistService.addToBlacklist(token); // Add token to blacklist upon logout
      return { message: 'Logged out successfully' };
    } catch(error){
      throw new UnauthorizedException('Failed to logout');
    }
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refresh_token);
  }
  // @UseGuards(GoogleOauthGuard)
  // //
  // async auth(){}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect() {
    return { msg: 'ok' };
  }

  @Post('')
  async requestPasswordReset(@Body() body: { email: string }) {
    // Request a password reset for the specified email
    await this.authService.requestPasswordReset(body.email);
    // Handle success and return a response
    return { message: 'Password reset email sent successfully' };
  }

  @Post('reset/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    // Find the user's email associated with the reset token
    // const resetToken = this.authService.findResetToken(token);
    const resetToken = this.authService.resetTokens.find(
        (rt) => rt.token === token,
      );
  
    if (!resetToken) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  
    // Assuming you have the user's email associated with the reset token
    const email = resetToken.email;
  
    await this.authService.resetPassword(email, token, newPassword);
    // Handle success and return a response
    return { message: 'Password reset successful' };
  }
}
