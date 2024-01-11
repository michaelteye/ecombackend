import { ProductsEntity } from "../entities/product.entity";
import { ProductDto } from "../dtos/product.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductCategoryEntity } from "../entities/product_categories.entity";
import { ProductCategoryDto } from "../dtos/productcategory.dto";
import { HttpCode, NotFoundException } from "@nestjs/common";
export class ProductService{
    
    constructor(
        @InjectRepository(ProductsEntity) private readonly productRepository: Repository<ProductsEntity>,
        @InjectRepository(ProductCategoryEntity) private readonly categoryRepository: Repository<ProductCategoryEntity>
    ){}

    async CreateProduct(input:ProductDto):Promise<ProductsEntity>{
        const category = await this.getProductCategoryId(input.categoryId)
        // newCategory.categoryName = cateinput.name
        //second method of creating the product
        const newproductAlert = new ProductsEntity();
        newproductAlert.name= input.name;
        newproductAlert.description= input.description;
        newproductAlert.price= input.price;
        newproductAlert.images = input.image;
        newproductAlert.material = input.material;
        newproductAlert.sizeOptions = input.sizeOptions;
        newproductAlert.stockQuantity = input.stockQuantity;
        newproductAlert.thickness = input.thickness;
        newproductAlert.width = input.thickness;
        newproductAlert.sku = input.sku;
        newproductAlert.categoryId = category.id
        console.log('the value is >>>',newproductAlert)
        return await this.productRepository.save(newproductAlert)   
    }

    async UpdateProduct(productId:string, updateProduct: ProductDto):Promise<ProductsEntity>{
        const existingProduct = await this.productRepository.findOne({where:{id:productId }})
        if(!existingProduct){
            throw new NotFoundException('Product not found')
        }
        existingProduct.name  = updateProduct.name
        existingProduct.description = updateProduct.description
        existingProduct.price = updateProduct.price
        existingProduct.images = updateProduct.image
        existingProduct.material = updateProduct.material
        existingProduct.sizeOptions = updateProduct.sizeOptions
        existingProduct.stockQuantity = updateProduct.stockQuantity
        existingProduct.thickness = updateProduct.thickness
        existingProduct.width = updateProduct.width
        return await this.productRepository.save(existingProduct)
    }

    async DeleteProduct(productId:string):Promise<ProductsEntity>{
        const existingProduct = await this.productRepository.findOne({ where:{ id:productId }})
        if(!existingProduct){
            throw new NotFoundException('Product not found');
        }
        return await this.productRepository.remove(existingProduct)
    }

    async GetAllProducts(
        page: number = 1,
        perPage: number = 20,

    ):Promise<{product:ProductsEntity[]; totalPages:number}>{
        const [product, total] = await this.productRepository.findAndCount({
            order:{createdAt:'DESC'},
            take:perPage,
            skip:(page -1) * perPage
        },
        
     )
     console.log('the total is >>>',total)
        const totalPages = Math.ceil( total / perPage )
        return { product,totalPages }
    }
    async SearchAndFilterProducts(alias:string){
        return this.productRepository.createQueryBuilder(alias)
       }
    async getProductById(productId: string): Promise<ProductsEntity> {
        const product = await this.productRepository.findOne({where:{id:productId}});
    
        if (!product) {
          throw new NotFoundException('Product not found');
        }
    
        return product;
      }


    async getProductCategoryId(id:string):Promise<ProductCategoryEntity>{
        return await this.categoryRepository.findOne({where:{id}})
   ;
    }
}