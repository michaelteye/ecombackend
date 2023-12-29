import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProductCategoryDto {
  @IsString({ message: 'adding the name of the product category' })
  @ApiProperty({
    description: 'The name of the product category',
    example: 'Engagement Ring',
  })
  name: string;
}
