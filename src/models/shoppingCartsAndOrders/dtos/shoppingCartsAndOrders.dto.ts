import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import {
    IsString,
    IsNumber,
    IsArray,
    IsOptional,
    ArrayUnique,
    Min,
    IsUUID,
    IsNotEmpty,
    IsDate
  } from 'class-validator';


export class CartDto{
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "Cart Id",
        example:"123e4567-e89b-12d3-a456-426"

    })
    id:string

    @IsNumber()
    @ApiProperty({
        description: "quantity of the items present in the carts",
        example: 10
    })
    quantity:number;

    @IsNumber()
    @Min(0)
    @ApiProperty({
        description: "subtotal of the items present in the carts",
        example: 100.99
    })
    subtotal:number;

    @IsString()
    @ApiProperty({
        description: "status of the cart",
        example: "active"
    })
    productId: string;

    @IsString()
    @ApiProperty({
        description:'description of the product',
        example:'This is a good product for you to buy.'
    })
    productTitle:string;

    @IsString()
    @ApiProperty({
        description:'description of the product',
        example:'This is a good product for you to buy.'
    })
    productDescription:string;

    @IsString({each:true, message:'Each image must be a string'})
    @ApiProperty({
        type:String,
        description:'Images of the products',
        example:['image1','image2'],
    })
    productImage:string;
}