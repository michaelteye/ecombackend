import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './clients/entities/registerClient.entity';
import { authEntity } from './authUsers/entities/authUser.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Authmodule } from './authUsers/authUser.module';
import { ProductModule } from './models/product/product.module';
import { WishListModule } from './models/wishlist/wishlist.module';
import { CartModule } from './models/shoppingCartsAndOrders/shoppingCartsAndOrders.module';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: parseInt(configService.get('DB_PORT')) || 5432,
        username: configService.get('DB_USERNAME') || 'postgres',
        password: configService.get('DB_PASSWORD') || 'demo201744',
        database: configService.get('DB_DATABASE') || 'RingHouse',
        // entities: [
        //   ReviewEntity,
        //   ProductsEntity,
        //   authEntity,
        //   Client,
        //   ProductCategoryEntity,
        //   WishListEnity,
        //   CartEntity
        // ],
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
