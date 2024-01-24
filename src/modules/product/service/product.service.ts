import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDto } from '../dtos/product.dto';
import { ProductsEntity } from '../entities/product.entity';
import { ProductCategoryEntity } from '../entities/product_categories.entity';
export class ProductService {
  constructor(
    @InjectRepository(ProductsEntity)
    private readonly productRepository: Repository<ProductsEntity>,
    @InjectRepository(ProductCategoryEntity)
    private readonly categoryRepository: Repository<ProductCategoryEntity>,
  ) {}
  async CreateProduct(input: ProductDto): Promise<ProductsEntity> {
    try {
      const category = await this.getProductCategoryId(input.categoryId);
      const newproductAlert = new ProductsEntity();
      newproductAlert.name = input.name;
      newproductAlert.description = input.description;
      newproductAlert.price = input.price;
      newproductAlert.images = input.image;
      newproductAlert.material = input.material;
      newproductAlert.itemSizes = input.itemSizes;
      newproductAlert.stockQuantity = input.stockQuantity;
      newproductAlert.thickness = input.thickness;
      newproductAlert.width = input.thickness;
      newproductAlert.sku = input.sku;
      newproductAlert.categoryId = category.id;
      return await this.productRepository.save(newproductAlert);
    } catch (err) {
      throw new Error(err);
    }
  }

  async UpdateProduct(
    productId: string,
    updateProduct: ProductDto,
  ): Promise<ProductsEntity>{
    const existingProduct = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!existingProduct){
      throw new NotFoundException('Product not found');
    }
    existingProduct.name = updateProduct.name;
    existingProduct.description = updateProduct.description;
    existingProduct.price = updateProduct.price;
    existingProduct.images = updateProduct.image;
    existingProduct.material = updateProduct.material;
    existingProduct.itemSizes = updateProduct.itemSizes;
    existingProduct.stockQuantity = updateProduct.stockQuantity;
    existingProduct.thickness = updateProduct.thickness;
    existingProduct.width = updateProduct.width;
    return await this.productRepository.save(existingProduct);
  }

  async DeleteProduct(productId: string): Promise<ProductsEntity> {
    const existingProduct = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }
    return await this.productRepository.remove(existingProduct);
  }

  async GetAllProducts(
    page: number = 1,
    perPage: number = 20,
  ): Promise<{
    product: ProductsEntity[];
    totalPages: number;
    pageNumbers: number[];
  }> {
    const [product, total] = await this.productRepository.findAndCount({
      order: { createdAt: 'DESC' },
      take: perPage,
      skip: (page - 1) * perPage,
    });
    const totalPages = Math.ceil(total / perPage);
    console.log('the number of pages are given as >>>', product.length);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    return { product, totalPages, pageNumbers };
  }

  async getProductRating(productId:string):Promise<number>{
    const product = await this.productRepository.findOne({
      relations:['reviews'],
      where:{id : productId}
    })
    if(!product){
      throw new NotFoundException('Product not found')
    }

    const totalReviews = product.reviews.length
    if(totalReviews === 0){
      return 0
    }

    const totalRating = product.reviews.reduce((sum, review)=> sum + review.rating, 0)
    return Math.round(totalRating/totalReviews)
  }

  async getProductsByCategoryName(
    categoryName: string,
    page: number = 1,
    perPage: number = 20,
    ): Promise<{ products: ProductsEntity[]; totalPages: number,pageNumbers: number[]; }> {
    try{
        const category = await this.categoryRepository.findOne({
            where: { categoryName },
          });
          console.log('the value of the category is >>>', category)
      
          if (!category) {
            throw new NotFoundException('Category not found');
          }
          const [products, total] = await this.productRepository.findAndCount(
              {
                where: { categoryId: category.id },
                order: { createdAt: 'DESC'},
                take: perPage,
                skip: (page - 1) * perPage,
              },
            );
            const totalPages = Math.ceil(total / perPage);
            const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
            return { products, totalPages,pageNumbers };
    }
    catch(err){
        throw new Error(err.message);
    }
  }  

  async GetProductByCateGoryId():Promise<ProductsEntity>{
    const findByCategoryId = await this.productRepository.findOne({
        select : ["categoryId"],
    })
    return;
  }
  async SearchAndFilterProducts(alias: string) {
    return this.productRepository.createQueryBuilder(alias);
  }
  async getProductById(productId: string): Promise<ProductsEntity> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  

  async getProductCategoryId(id: string): Promise<ProductCategoryEntity>{
    return await this.categoryRepository.findOne({
      where: {id},
    });
  }
}
