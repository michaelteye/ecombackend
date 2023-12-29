import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Client } from './entities/registerClient.entity';
import { authEntity } from 'src/modules/authUsers/entities/authUser.entity';
import { ReviewEntity } from 'src/modules/product/entities/review.entity';
import { ProductsEntity } from 'src/modules/product/entities/product.entity';
import { ReviewController } from 'src/modules/product/controller/productReview.controller';
import { ProductReviewService } from 'src/modules/product/service/productReview.service';
import { WishListEnity } from 'src/modules/wishlist/entities/wishlist.entity';
import { AddressEntity } from './entities/address.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Client,
      authEntity,
      ReviewEntity,
      ProductsEntity,
      WishListEnity,
      AddressEntity
    ]),
  ],
  controllers: [ClientsController, ReviewController],
  providers: [ClientsService, ProductReviewService],
  exports: [ClientsService],
})
export class ClientsModule {}
