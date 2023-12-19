import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  ArrayUnique,
  Min,
  IsUUID,
  IsNotEmpty,
  IsDate,
} from 'class-validator';
import { RegisterClientDto } from 'src/clients/dtos/registerClient.dto';
import { CartDto } from './shoppingCartsAndOrders.dto';

export class OrderDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Cart Id',
    example: '123e4567-e89b-12d3-a456-426',
  })
  id: string;

  @IsNumber()
  @ApiProperty({
    description: 'quantity of the items present in the carts',
    example: 10,
  })
  totalPrice: number;


  @IsNotEmpty()
  @IsArray()
  cartItems: CartDto[];

  @IsUUID()
  @ApiProperty({
      description: 'category id that this product belongs to',
      type:RegisterClientDto

  })
  userId: RegisterClientDto;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'users home address',
    example: 'Number 21 street name , Kasoa, Ghana',
    type: String,
    required: false,
  })
  homeAddress?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'this is the local ghana post address',
    example: 'GHP-234234-345234',
    type: String,
    required: false,
  })
  gpsAddress?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Ghana country code',
    example: 'GH',
    type: String,
    required: true,
  })
  country?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'users region of residence',
    example: 'Ashanti Region',
    type: String,
    required: false,
  })
  region?: string;
}
