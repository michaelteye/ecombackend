import { CartEntity } from '../entities/cart.entity';
import { CartDto } from '../dtos/shoppingCartsAndOrders.dto';
import { CartService } from '../services/carts.service';
import {
    Body,
    Controller,
    Post,
    ValidationPipe,
    UsePipes,
    Put,
    Param,
    Delete,
    Get,
  } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Carts')
@ApiBearerAuth('JWT')
@Controller('carts')
export class CartController{
    constructor(private cartService:CartService){}

  @Post('create/:userId/:productId')
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type:CartDto
  })
  async CreateProduct(
    @Body() cartDto: CartDto,
    @Param('userId') userId:string,
    @Param('productId') productId:string,

  ): Promise<CartEntity> {
    return await this.cartService.AddToCart(
        userId,productId,cartDto,
    );
  }

  @Get('')
  @ApiResponse({
    status: 200,
    description: 'Returns all carts for a specific user.',
    isArray: true,
    type:CartDto
  })
  async getAllCarts():Promise<CartEntity[]>{
    const carts = await this.cartService.getAllCarts();
    return carts
  }

  @Delete('delete/:id')
  @ApiResponse({
    status: 200,
    description: 'card remove successfully',
  })
  @ApiParam({
    name:'id',
    required:true,
    example:"5f8d6b49e73a1"
  })
  async deleteCartItem(
    @Param('id') id:string
  ){
     await this.cartService.RemoveCart(id);
     return {
        message : "remove successfully",
     }
  }

}