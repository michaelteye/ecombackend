import { ProductReviewService } from "../service/productReview.service";
import { ReviewEntity } from "../entities/review.entity";
import { ProductReviewDto } from "../dtos/productReview.dto";
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Reviews')
@ApiBearerAuth('JWT')
@Controller('reviews')
export class ReviewController {
    constructor(private productReviewService: ProductReviewService) {}
  
    @UsePipes(new ValidationPipe())
    @Post('create')
    @ApiResponse({
      status: 201,
      description: 'The product has been successfully created.',
      type:ProductReviewDto
    })
    //useGuard goes here
    async CreateReview(
      @Body() productReviewDto: ProductReviewDto,
    ): Promise<ReviewEntity> {
      return await this.productReviewService.CreateProductReview(productReviewDto)
    }
  
    @UsePipes(new ValidationPipe())
    @Put('update/:id')
    @ApiParam({ name: 'id', required: true, type: String })
    @ApiResponse({
      status: 200,
      description: 'The review has been successfully updated.',
      type:ProductReviewDto
    })
    async updateReview(
      @Param('id') id: string,
      @Body() productReviewDto: ProductReviewDto,
    ): Promise<ReviewEntity> {
      const updatedProduct = await this.productReviewService.UpdateReview(
        id,
        productReviewDto,
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
    async delete(@Param('id') reviewId: string): Promise<void> {
       await this.productReviewService.DeleteReview(reviewId);
    }
  
    @UsePipes(new ValidationPipe())
    @Get('allreviews')
    @ApiQuery({
      name: 'pageNumber',
      required:false,
      explode:true,
    })
    @ApiResponse({
      status: 201,
      description: 'all review fetched successfully.',
      type:ProductReviewDto
    })
    async getAllCateGory(): Promise<ReviewEntity[]>{
      return await this.productReviewService.GetAllReview();
    }
  }
  

