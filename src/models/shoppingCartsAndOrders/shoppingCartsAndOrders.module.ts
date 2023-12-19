import { CartService } from './services/carts.service';
import { CartController } from './controllers/cart.controller';
import { CartEntity } from './entities/cart.entity';
import { ProductsEntity } from '../product/entities/product.entity';
import { Client } from 'src/clients/entities/registerClient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OrderService } from './services/Order.service';
import { OrderController } from './controllers/Order.controller';
import { OrderEntity } from './entities/Order.entity';
import { AddressEntity } from 'src/clients/entities/address.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductsEntity,
      Client,
      CartEntity,
      OrderEntity,
      AddressEntity,
    ]),
  ],
  controllers: [CartController, OrderController],
  providers: [CartService, OrderService],
  exports: [CartService],
})
export class CartModule {}
