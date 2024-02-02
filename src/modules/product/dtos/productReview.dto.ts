import { ApiProperty } from '@nestjs/swagger';
// import { FileUpload } from 'nestjs-form-data';
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

   
    // @FileUpload({ required: true })
    @ApiProperty({
        description:'showing the ring on customers hands',
        example:'https://www.booky.png'
    })
    image: Express.Multer.File;

    @IsString()
    @ApiProperty({
        description:'the id of the product that is pass',
        example:'c4ee7cb5-b3a5-4700-b3ae-36656cc229ee'
    })
    productId:string;

    @IsString()
    @ApiProperty({
        description:'the id of the client that is pass',
        example:'c4ee7cb5-b3a5-4700-b3ae-36656cc229ee'
    })
    clientId:string;
}