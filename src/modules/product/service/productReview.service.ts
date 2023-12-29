import { ProductReviewDto } from "../dtos/productReview.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReviewEntity } from "../entities/review.entity";
import { Repository } from "typeorm";
import { ProductsEntity } from "../entities/product.entity";
import { Client } from "src/modules/clients/entities/registerClient.entity";

export class ProductReviewService{
    constructor(
        @InjectRepository(ReviewEntity) private readonly reviewRepository:Repository<ReviewEntity>,
        @InjectRepository(ProductsEntity) private readonly productRepository:Repository<ProductsEntity>,
        @InjectRepository(Client) private clientRepo : Repository <Client>
    ){}

    async CreateProductReview(input:ProductReviewDto):Promise<ReviewEntity>{
        const newReview = new ReviewEntity()
        const productId = new ProductsEntity()
        const userId = new Client()

        const product = await this.getproductById(productId.id)
        const user  = await this.getUserById(userId.id)


        newReview.title = input.title;
        newReview.description = input.description;
        newReview.rating = input.rating;
        newReview.productId  = product.id
        newReview.clientId = user.id
        console.log('the new review is >>>', newReview)
        return await this.reviewRepository.save(newReview);
    }

    async UpdateReview(reviewId:string, updateReview:ProductReviewDto):Promise<ReviewEntity>{
        const existingReview = await this.reviewRepository.findOne({ where: { id:reviewId }})
        if(!existingReview){
            throw new NotFoundException('Could not find review')
        }
        existingReview.title = updateReview.title
        existingReview.description = updateReview.description
        existingReview.rating = updateReview.rating
        return await this.reviewRepository.save(existingReview);
    } 

    async DeleteReview(reviewId:string):Promise<void>{
        const existingReview = await this.reviewRepository.findOne({ where:{ id:reviewId }})
        if(!existingReview){
            throw new NotFoundException('Could not find Review')
        }
        await this.reviewRepository.remove(existingReview);
    }
    async GetAllReview():Promise<ReviewEntity[]>{
        return await this.reviewRepository.find()
    }

    async getproductById(id:string){
        const productId = await this.productRepository.findOne({where:{id:id}})
        return productId 
    }

    async getUserById(userId:string){
        const getuserId = await this.clientRepo.findOne({where:{id:userId }})
        return getuserId
    }
}