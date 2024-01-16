import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Authmodule } from './modules/authUsers/authUser.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ProductModule } from './modules/product/product.module';
import { CartModule } from './modules/shoppingCartsAndOrders/shoppingCartsAndOrders.module';
import { WishListModule } from './modules/wishlist/wishlist.module';
import { MailerConfigModule } from './modules/mailer/mailer.module';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService)=>({
        type: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: parseInt(configService.get('DB_PORT')) || 5432,
        username: configService.get('DB_USERNAME') || 'postgres',
        password: configService.get('DB_PASSWORD') || 'demo201744',
        database: configService.get('DB_DATABASE') || 'RingHouse',
        entities: [__dirname + '/../**/*.entity.js'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ClientsModule,
    Authmodule,
    ProductModule,
    WishListModule,
    CartModule,
    MailerConfigModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
