import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Client } from './entities/registerClient.entity';
import { authEntity } from 'src/authUsers/entities/authUser.entity';
import { ReviewEntity } from 'src/models/product/entities/review.entity';
import { ProductsEntity } from 'src/models/product/entities/product.entity';
import { ReviewController } from 'src/models/product/controller/productReview.controller';
import { ProductReviewService } from 'src/models/product/service/productReview.service';
import { WishListEnity } from 'src/models/wishlist/entities/wishlist.entity';
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
