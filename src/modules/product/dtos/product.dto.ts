import { ApiProperty, ApiResponse, OmitType } from '@nestjs/swagger';
import { ProductCategoryDto } from './productcategory.dto';
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


export class ProductDto{
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
      type: String,
    })
    id: string;


    @IsString()
    @ApiProperty({ 
        description: 'Product name',
        example: 'product1' 
    })
    name:string

    @IsNumber()
    @ApiProperty({
        
        description:'amount on a single product',
        example:'GHS 10.00'
    })
    price:number;

    @IsString()
    @ApiProperty({
        description:'description of the product',
        example:'This is a good product for you to buy.'
    })
    description:string;

    @IsArray({message:'Image is suppose to be an array'})
    @IsString({each:true, message:'Each image must be a string'})
    @ArrayUnique((value)=>value, {message:'Image must be unique'})
    @ApiProperty({
        type:[String],
        description:'Images of the products',
        example:['image1','image2'],

    })
    image?:string[]

    @IsNumber({ maxDecimalPlaces: 0, allowNaN: false }, { message: 'Stock quantity must be an integer' })
    @Min(0, { message: 'Stock quantity cannot be negative' })
    @ApiProperty({
        description: 'stock quantity',
        example: 50,

    })
    stockQuantity: number;
  
    @IsString({ message: 'SKU must be a string' })
    @ApiProperty({
        description: 'SKU code for this product',
        example: 'PRODUCT_1',
    })
    sku: string;
  
    @IsString({ message: 'Material must be a string' })
    @ApiProperty({
        description: 'The material used in making this product',
        example: 'wood',
    })
    material: string;
  
    @IsString({ message: 'Width must be a string' })
    @ApiProperty({
        description: 'width of the product',
        example: '30cm',
    })
    width: string;
  
    @IsString({ message: 'Thickness must be a string' })
    @ApiProperty({
        description: 'thickness of the product',
        example: '4mm',
    })
    thickness: string;
  
    @IsArray({ message: 'Size options must be an array' })
    @IsString({ each: true, message: 'Each size option must be a string' })
    @ApiProperty({
        type:[String],
        isArray:true ,
        description: 'size options available for this product',
        example: ['S','M','L']

    })
    sizeOptions: number[];
  
    @IsUUID()
    @ApiProperty({
        description: 'category id that this product belongs to',
        type:ProductCategoryDto

    })
    categoryId: string;


    @IsDate()
    @ApiProperty({
        description: 'date when this product was created',
        example: new Date(),
    })
    createdAt: Date;

    @IsDate()
    @ApiProperty({
        description: 'date when this product was created',
        example: new Date(),
    })
    updatedAt: Date;
}

export class FilterDto extends OmitType(ProductDto,[
    'categoryId',
    'description',
    'image',
    'material',
    'sizeOptions',
    'stockQuantity',
    'thickness',
    'updatedAt',
    'createdAt',
    'sku',
    'width'
]){
    @IsOptional()
    @IsString()
    name:string;

    @IsOptional()
    @IsNumber()
    price:number
}
