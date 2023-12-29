import { CategoriesService } from '../service/productcategory.service';
import { ProductCategoryDto } from '../dtos/productcategory.dto';
import { ProductCategoryEntity } from '../entities/product_categories.entity';
import { JwtAuthGuard } from 'src/modules/authUsers/guards/jwt-auth.guard';
import { Request } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { RoleAuthGuard,AuthRoles } from 'src/modules/authUsers/guards/roles.auth.guard';
import { AuthUserRole } from 'src/modules/authUsers/types/auth-user.roles';

@ApiTags('Products')
// @ApiBearerAuth('JWT')
@Controller('categories')
// @UseGuards(RoleAuthGuard)
export class CategoryController {
  constructor(private categoryService: CategoriesService) {}

  // @UsePipes(new ValidationPipe())
  @AuthRoles(AuthUserRole.Admin)
  @UseGuards(JwtAuthGuard,RoleAuthGuard)
  @Post('create')
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: ProductCategoryDto,
  })
  //useGuard goes here
  async CreateProduct(
    @Body() productcategoryDto: ProductCategoryDto
  ): Promise<ProductCategoryEntity> {
    
    return await this.categoryService.CreateCategory(productcategoryDto);
  }

  @UsePipes(new ValidationPipe())
  @Put('update/:id')
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
    type: ProductCategoryDto,
  })
  async update(
    @Param('id') id: string,
    @Body() categoryDto: ProductCategoryDto,
  ): Promise<ProductCategoryEntity> {
    const updatedProduct = await this.categoryService.UpdateCategory(
      id,
      categoryDto,
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
  async delete(@Param('id') productId: string): Promise<void> {
    await this.categoryService.DeleteCategory(productId);
  }

  @UsePipes(new ValidationPipe())
  @Get('allcategory')
  @ApiQuery({
    name: 'pageNumber',
    required: false,
    explode: true,
  })
  @ApiResponse({
    status: 201,
    description: 'All products fetched successfully.',
    type: ProductCategoryDto,
  })
  async getAllCateGory(): Promise<ProductCategoryEntity[]> {
    return await this.categoryService.GetAllCategory();
  }
  //get product by id

  @UsePipes(new ValidationPipe())
  @Get(':id')
  @ApiResponse({
    status: 201,
    description: 'The product has been returned.',
    type: ProductCategoryDto,
  })
  @ApiParam({ name: 'id', required: true, type: String })
  async getAsingleProduct(
    @Param('id') categoryId: string,
  ): Promise<ProductCategoryEntity> {
    return await this.categoryService.getCategoryById(categoryId);
  }
}
