import { CartEntity } from "../entities/cart.entity";
import { ProductsEntity } from "src/models/product/entities/product.entity";
import { Client } from "src/clients/entities/registerClient.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CartDto } from "../dtos/shoppingCartsAndOrders.dto";
import { NotAcceptableException, NotFoundException } from "@nestjs/common";

export class CartService{
    constructor(
        @InjectRepository(CartEntity) private cartRepo:Repository<CartEntity>,
        @InjectRepository(ProductsEntity) private ProductRepo: Repository<ProductsEntity>,
        @InjectRepository(Client) private UserRepo: Repository<Client>,


    ){}

    async AddToCart(userId:string, productId:string, input:CartDto):Promise<CartEntity>{
        try{
            const product = await this.ProductRepo.findOne({where:{id:productId}})

            // validating stock quantity
            if(product.stockQuantity < input.quantity){
                throw new NotAcceptableException(`sorry we do not have enough product to satisfy your request we can only 
                provide ${product.stockQuantity} `)
            }
    
            if (!product) {
                throw new NotFoundException(`Product with ID ${productId} not found.`);
              }
    
              const user = await this.UserRepo.findOne({where:{id:userId}})
              if (!user){
                throw new NotFoundException(`User with Id ${userId} not found`);
              }
    
            const existCartItems = await this.cartRepo.findOne({where:{userId:userId, productId:productId}})
            if(existCartItems){
                existCartItems.quantity += input.quantity
                existCartItems.subtotal = existCartItems.quantity * product.price;
                return  await this.cartRepo.save(existCartItems);
            }
            
            //[]  calculating the subtotal of the product
              const price = product.price
              console.log('the price is>>>',price)
              const amount = input.quantity
              const subtotal = price * amount
    
              const addCart = new CartEntity()
              addCart.productId = product.id;
              addCart.userId= user.id;
              addCart.subtotal= input.subtotal
              addCart.quantity = input.quantity
              addCart.productTitle = product.name
              addCart.productDescription = product.description
              addCart.productImage = product.images[0]
              console.log('the response from the card is >>>',addCart)
              return await this.cartRepo.save(addCart);
        }
        catch(err){
            console.error('The Error message is >>>', err)
            throw err
        } 
    }

    async getAllCarts():Promise<CartEntity[]>{
        const allCarts = await this.cartRepo.find()
        return allCarts
    }

    async RemoveCart(id:string):Promise<void>{
        let cart = await this.cartRepo.findOne({where:{id:id}})
        if(!cart){
            throw new NotFoundException(`Cart with id ${id} not found`)
        }
        try{
            await this.cartRepo.remove(cart)
        }
        catch(err){
            console.error('the error mesasage is>>>',err)
            throw err
        }
      }



}