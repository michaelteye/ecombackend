import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  UnauthorizedException,
  Delete,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { type } from 'os';
import { CartDto } from 'src/models/shoppingCartsAndOrders/dtos/shoppingCartsAndOrders.dto';
import { WishListService } from '../Service/wishlist.service';

@ApiTags('WishList')
@Controller('wishlist')
export class WishListController {
  constructor(private readonly wishlistService: WishListService) {}

  @Post('add/:userId/:productId')
  @ApiParam({
    name: 'userId',
    description: 'User Id of the user who is adding a product to the wishlist',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product id to add to the wishlist',
  })
  @ApiResponse({
    status: 201,
    description: 'Added Product To Wishlist',
  })
  async addWishList(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return await this.wishlistService.addWistList(userId, productId);
  }

    @Get(':userId')
    @ApiParam({
        name:'userId',
        description: "User ID"
    })
    @ApiResponse({
        status: 200,
        description:"Fetched all products added by a particular user"
    })
    async getAllWishList(@Param('userId') userId:string){
        const result = await this.wishlistService.getWishlist(userId);
        return result;
    }

    @Delete('delete/:userId')
    @ApiParam({
        name: 'userId',
        description: 'User Id of the user whose wishlist item will be deleted.'
    })
    @ApiResponse({
        status: 204,
        description: 'Deleted All Items From The Wishlist Of A User.'  
    })
    async clearWishList(@Param('userId') userId:string){
        await this.wishlistService.clearWishlist(userId)
    }

    @Post(':productId')
    @ApiParam({
        name: 'productId',
        description: 'Product Id Which You Want To Remove From Your Wishlist.',
        type:String
    })
    @ApiParam({
        name: 'userId',
        description: 'userId Id Which You Want To Remove From Your Wishlist.',
        type:String
    })

    @ApiResponse({
        status: 203,
        description: 'Removed Item From Wishlist Successfully',
        type:String
    })
    async moveProductToCart(
        @Param('productId') productId:string,
        @Param('userId') userId:string,
        @Body() cartdto:CartDto
    ){
        return await this.wishlistService.moveProductToCart(userId, productId,cartdto)
    }

}
