import { ProductCategoryEntity } from "../entities/product_categories.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { NotFoundException,ConflictException, HttpException, HttpStatus } from "@nestjs/common";
import { ProductCategoryDto } from "../dtos/productcategory.dto";


export class CategoriesService{
    constructor(
        @InjectRepository(ProductCategoryEntity) private readonly categoryRepository: Repository<ProductCategoryEntity>
    ){}

    async CreateCategory(input:ProductCategoryDto):Promise<ProductCategoryEntity>{
        const newCategory = new ProductCategoryEntity()
        const findCategory = await this.categoryRepository.findOne({where:{categoryName:input.name}})

        try{
            if(findCategory){
                // console.log("This Category Name is already exist");
                // throw new ConflictException(`Category '${findCategory}' already exists.`)
                throw new HttpException(`Category '${findCategory}' already exists.`,HttpStatus.FORBIDDEN)
            }
            newCategory.categoryName = input.name
            return await this.categoryRepository.save(newCategory)
        }
        catch(err){
            throw new HttpException(`Category '${input.name}' already exists.`,HttpStatus.FORBIDDEN)
        }
    }

    async UpdateCategory(categoryId:string, updateCategory:ProductCategoryDto):Promise<ProductCategoryEntity>{
        const existingCategory = await this.categoryRepository.findOne({ where:{ id:categoryId }})
        if(!existingCategory){
            throw new NotFoundException('Could not find Category')
        }
        existingCategory.categoryName = updateCategory.name
        return await this.categoryRepository.save(existingCategory);
    }

    async DeleteCategory(categoryId:string):Promise<void>{
        const existingCategory = await this.categoryRepository.findOne({ where:{ id:categoryId }})
        if(!existingCategory){
            throw new NotFoundException('Could not find Category')
        }
        await this.categoryRepository.remove(existingCategory);
    }

    async GetAllCategory():Promise<ProductCategoryEntity[]>{
        return await this.categoryRepository.find()
    }

    async getCategoryById(categoryId: string): Promise<ProductCategoryEntity> {
        const category = await this.categoryRepository.findOne({where:{id:categoryId}});
    
        if (!category) {
          throw new NotFoundException('Product not found');
        }
        return category;
      } 
    async getCategoryByName(categoryName: string):Promise<ProductCategoryEntity>{
         return await this.categoryRepository.findOne({where:{categoryName:categoryName}})
    }
}