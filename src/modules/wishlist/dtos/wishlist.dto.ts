import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsArray } from "class-validator";
import { ProductDto } from "src/modules/product/dtos/product.dto";
import { RegisterClientDto } from "src/modules/clients/dtos/registerClient.dto";



export class WishListDto{
    @ApiProperty({
        example: '1', 
        description:'Id of the user'
    })
    @IsString()
    id:string

    @ApiProperty({
        example:'ab9492e8-2150-41dd-9f86-e75a205fe6c9',
        description:'provide the product id',
        
    })
    productId:string

    @ApiProperty({
        example:'ab9492e8-2150-41dd-9f86-e75a205fe6c9',
        description:'provide the user id',
        
    })
    userId:string


}