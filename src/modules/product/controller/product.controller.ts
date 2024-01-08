import { ProductService } from '../service/product.service';
import { ProductDto,FilterDto } from '../dtos/product.dto';
import { ProductsEntity } from '../entities/product.entity';
import { ProductCategoryDto } from '../dtos/productcategory.dto';
import { query, Request } from 'express';
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
  Req,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Alias } from 'typeorm/query-builder/Alias';

@ApiTags('Products')
@ApiBearerAuth('JWT')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  // @UsePipes(new ValidationPipe())
  @Post('create')
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type:ProductDto
  })
  //useGuard goes here
  async CreateProduct(
    @Body() productDto: ProductDto
  ): Promise<ProductsEntity> {
      return await this.productService.CreateProduct(
      productDto,
    );
  }
  @UsePipes(new ValidationPipe())
  @Put('update/:id')
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
    type:ProductDto
  })
  async update(
    @Param('id') id: string,
    @Body() productDto: ProductDto,
  ): Promise<ProductsEntity> {
    const updatedProduct = await this.productService.UpdateProduct(
      id,
      productDto,
    );
    return updatedProduct;
  }

  @UsePipes(new ValidationPipe())
  @Delete('delete/:id')
  @ApiResponse({
    status: 204,
    description: 'The product has been successfully deleted.',
  })
  @ApiParam({ name: 'id', required: true, type: String })
  async delete(@Param('id') productId: string): Promise<ProductsEntity> {
    return await this.productService.DeleteProduct(productId);
  }

  @UsePipes(new ValidationPipe())
  @Get('allproduct')
  @ApiQuery({
    name: 'pageNumber',
    required: false,
    explode: true,
  })
  @ApiResponse({
    status: 201,
    description: 'All products fetched successfully.',
    type:ProductDto
  })
  async getAllProduct(): Promise<ProductsEntity[]> {
    return await this.productService.GetAllProducts();
  }

  @UsePipes(new ValidationPipe())
  @Get('all')
  @ApiQuery({
    name: 'pageNumber',
    required: false,
    explode: true,
  })
  @ApiResponse({
    status: 201,
    description: 'All products fetched successfully.',
    type:FilterDto
  })
  async QueryProducts(@Query() filterDto:FilterDto, @Req() req:Request) {
   
    const builder = await this.productService.SearchAndFilterProducts('products');
    if(req.query.s){
      builder.where('products.name LIKE :s OR products.description LIKE :s', { s: `%${req.query.s}%` });
    }

    const sortProduct = req.query.sort;
    if(sortProduct){
      builder.orderBy('products.price', (sortProduct as string).toUpperCase() === 'DESC' ? 'DESC' : 'ASC');

    }

    const page:number = parseInt(req.query.page as any) || 1
    const perPage = 9
    const total = await builder.getCount()
    builder.offset((page-1) * perPage).limit(perPage)

    if(filterDto.name){
      builder.andWhere('products.name LIKE :name', { name: `%${filterDto.name}%`})
    }

    if (filterDto.price) {
      builder.andWhere('products.price >= :minPrice', { minPrice: filterDto.price });
    }
    
    return{
      data: await builder.getMany(),
        total,
        page,
        last_page: Math.ceil(total / perPage)
    }
  }


  //get product by id

  @UsePipes(new ValidationPipe())
  @Get(':id')
  @ApiResponse({
    status: 201,
    description: 'The product has been returned.',
    type:ProductDto
  })
  @ApiParam({ name: 'id', required: true, type: String })
  async getAsingleProduct(@Param('id') productId: string): Promise<ProductsEntity> {
    return await this.productService.getProductById(productId);
  }

 
}
