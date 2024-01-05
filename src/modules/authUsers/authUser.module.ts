import { Module } from '@nestjs/common';
import { AuthService } from './services/authUsers.service';
import { ClientsModule } from 'src/modules/clients/clients.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshTokenIdsStorage } from './refreshToken.strategy';
import { AuthController } from './controllers/authUsers.controller';
import { ClientsService } from 'src/modules/clients/clients.service';
import { authEntity } from './entities/authUser.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/modules/clients/entities/registerClient.entity';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh-token.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { SessionSerializer } from './utils/Serializer';
import { AdminService } from './services/adminUser.service';
import { AdminUserController } from './controllers/adminUser.controller';
import { AdminEntity } from './entities/admin_user.entity';
import { RoleAuthGuard } from './guards/roles.auth.guard';
import { ConfigService } from '@nestjs/config';
import { BlacklistService } from './services/authUserLogOut.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([authEntity, Client,AdminEntity]),
    ClientsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    AuthService,
    AdminService,
    LocalStrategy,
    JwtStrategy,
    ClientsService,
    JwtRefreshTokenStrategy,
    GoogleStrategy,
    SessionSerializer,
    RoleAuthGuard,
    ConfigService,
    BlacklistService
  ],
  exports: [AuthService,AdminService,RoleAuthGuard,],
  controllers: [AuthController,AdminUserController],
})
export class Authmodule {}
