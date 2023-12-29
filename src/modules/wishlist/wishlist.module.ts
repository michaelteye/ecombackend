import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WishListService } from "./Service/wishlist.service";
import { WishListController } from "./controller/wishlist.controller";
import { WishListEnity } from "./entities/wishlist.entity";
import { ProductsEntity } from "../product/entities/product.entity";
import { Client } from "src/modules/clients/entities/registerClient.entity";
import { CartEntity } from "../shoppingCartsAndOrders/entities/cart.entity";


@Module({
    imports: [TypeOrmModule.forFeature([WishListEnity,ProductsEntity,Client,CartEntity])],
    controllers:[WishListController],
    providers:[WishListService],
    exports:[WishListService]
})
export class WishListModule{}