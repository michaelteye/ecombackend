import { Module } from "@nestjs/common";
import { ProductsEntity } from "./entities/product.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductCategoryEntity } from "./entities/product_categories.entity";
import { ProductController } from "./controller/product.controller";
import { ProductService } from "./service/product.service";
import { CategoriesService } from "./service/productcategory.service";
import { CategoryController } from "./controller/productCategory.controller";
import { ReviewEntity } from "./entities/review.entity";
import { ProductReviewService } from "./service/productReview.service";
import { ReviewController } from "./controller/productReview.controller";
import { Client } from "src/modules/clients/entities/registerClient.entity";
import { WishListEnity } from "../wishlist/entities/wishlist.entity";
import { MulterModule } from "@nestjs/platform-express";

@Module({
    imports: [
        MulterModule.register({
            dest: './uploads'
        }),
        TypeOrmModule.forFeature([ProductsEntity,ProductCategoryEntity,ReviewEntity,Client,WishListEnity ])
    ],
    controllers:[ProductController,CategoryController,ReviewController], 
    providers:[ProductService,CategoriesService,ProductReviewService],
    exports:[ProductService,CategoriesService,ProductReviewService]
})
export class ProductModule {}