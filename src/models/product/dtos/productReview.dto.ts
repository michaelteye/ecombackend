import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNumber,
    IsArray,
    IsOptional,
    ArrayUnique,
    Min,
    IsUUID,
} from 'class-validator';

export class ProductReviewDto{
    @IsString()
    @ApiProperty({ 
        description: 'title of review',
        example: 'about the delivery' 
    })
    title:string

    @IsString()
    @ApiProperty({
        description:'description of the review of the product',
        example:'This is a good product for you to buy.'
    })
    description:string;

    @IsNumber()
    @Min(1)
    @ApiProperty({
        description:'rating of the product',
        example:5

    })
    rating:number;
}