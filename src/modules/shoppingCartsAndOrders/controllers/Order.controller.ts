import {
    Controller,
    Request,
    Post,
    UseGuards,
    Body,
    Get,
    Param,
    UnauthorizedException,
  } from '@nestjs/common';
import { OrderService } from "../services/Order.service";
import { OrderEntity } from "../entities/Order.entity";
import { OrderDto } from "../dtos/order.dto";
import { ApiTags, ApiBearerAuth, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CartEntity } from '../entities/cart.entity';



@ApiTags('Order And CheckOut')
@Controller('order')
export class OrderController{
    constructor(private readonly orderService: OrderService) {}

    @Post(':userId/checkout')
    @ApiResponse({
        status: 201, 
        description: 'The record has been successfully created.',
        type:OrderDto
    })
   async checkout(
    @Param('userId') userId:string,
    @Body() checkoutDto:OrderDto
   ):Promise<OrderEntity>{
    const cartItems:CartEntity[] = checkoutDto.cartItems.map((item)=>{
        const cartItem = new CartEntity()
        cartItem.productId = item.productId
        cartItem.quantity = item.quantity
        return cartItem
    })
    return await this.orderService.Checkout(userId, cartItems, checkoutDto);
   }
    

}