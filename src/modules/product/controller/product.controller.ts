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
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Alias } from 'typeorm/query-builder/Alias';
import { AuthRoles, RoleAuthGuard } from 'src/modules/authUsers/guards/roles.auth.guard';
import { AuthUserRole } from 'src/modules/authUsers/types/auth-user.roles';
import { JwtAuthGuard } from 'src/modules/authUsers/guards/jwt-auth.guard';
import { ProductCategoryEntity } from '../entities/product_categories.entity';

@ApiTags('Products')
@ApiBearerAuth('JWT')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @AuthRoles(AuthUserRole.Admin)
  @UseGuards(JwtAuthGuard,RoleAuthGuard)
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
  @AuthRoles(AuthUserRole.Admin) 
  @UseGuards(JwtAuthGuard,RoleAuthGuard)
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

  @AuthRoles(AuthUserRole.Admin) 
  @UseGuards(JwtAuthGuard,RoleAuthGuard)
  @Delete('delete/:id')
  @ApiResponse({
    status: 204,
    description: 'The product has been successfully deleted.',
  })
  @ApiParam({ name: 'id', required: true, type: String })
  async delete(@Param('id') productId: string): Promise<ProductsEntity> {
    return await this.productService.DeleteProduct(productId);
  }

  // @AuthRoles(AuthUserRole.Admin || AuthUserRole.User) 
  // @UseGuards(JwtAuthGuard,RoleAuthGuard)
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
  async GetAllVailableProduct(
   @Query('page') page:number = 1,
   @Query('perPage') perPage:number=20
    ) {
      const {product,totalPages,pageNumbers} = await this.productService.GetAllProducts(page, perPage)
    return{
      product,totalPages,pageNumbers
    }
  }

  @Get('/category/:categoryName')
  async getProductsByCategory(
    @Param('categoryName') categoryName: string,
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 20,
  ) {
    try {
      const { products, totalPages, pageNumbers } = await this.productService.getProductsByCategoryName(categoryName, page, perPage);
      return { products, totalPages, pageNumbers };
    } catch (error) {
      return { error: error.message };
    }
  }
  @Get('rating/:productId')
  getProductRating(@Param('productId') productId:string){
    return this.productService.getProductRating(productId);
  }
  




  // @Get(':categoryId')
  // @ApiQuery({
  //   name: 'pageNumber', 
  //   required: false,
  //   explode: true,
  // })
  // @ApiResponse({
  //   status: 201,
  //   description: 'All products fetched successfully.',
  //   type:FilterDto
  // })
  // async GetProductByCategory(
  //   @Param('categoryId') categoryId:string,
  //   @Query('page') page:number = 1,
  //   @Query('perPage') perPage:number=20
  // ){
  //  const {productsCategory,totalPages} = await this.productService.GetProductsByCategory(categoryId,page,perPage);
  //  return{
  //   productsCategory,totalPages
  // }
  // }
  //get product by id

  // @AuthRoles(AuthUserRole.Admin) 
  // @UseGuards(JwtAuthGuard,RoleAuthGuard)
  @Get('item/:id')
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
