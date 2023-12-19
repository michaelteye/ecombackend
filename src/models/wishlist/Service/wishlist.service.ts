import { ProductsEntity } from 'src/models/product/entities/product.entity';
import { Repository } from 'typeorm';
import { Client } from 'src/clients/entities/registerClient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WishListEnity } from '../entities/wishlist.entity';
import { CartEntity } from 'src/models/shoppingCartsAndOrders/entities/cart.entity';
import { CartDto } from 'src/models/shoppingCartsAndOrders/dtos/shoppingCartsAndOrders.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
export class WishListService {
  constructor(
    @InjectRepository(WishListEnity)
    private wishlistRepo: Repository<WishListEnity>,
    @InjectRepository(ProductsEntity)
    private productRepo: Repository<ProductsEntity>,
    @InjectRepository(Client) private userRepo: Repository<Client>,
    @InjectRepository(CartEntity) private cartRepo: Repository<CartEntity>,
  ) {}

  async addWistList( userId: string,productId: string): Promise<WishListEnity> {
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }

      const product = await this.productRepo.findOne({ where: { id: productId } });

      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found.`);
      }

      const newWishlist = new WishListEnity();
      newWishlist.userId = user.id;
      newWishlist.productId = product.id;

      return await this.wishlistRepo.save(newWishlist);
    } catch (err) {
      console.error('Error:', err);
      throw err;
    }
  }

  async getWishlist(userId: string): Promise<WishListEnity[]> {
    return this.wishlistRepo.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }

  async RemoveWishList(id: string): Promise<any> {
    const existingWishLIst = await this.wishlistRepo.findOne({
      where: { id: id },
    });
    if (!existingWishLIst) {
      throw new Error('No such item found');
    }
    return await this.wishlistRepo.remove(existingWishLIst);
  }

  async clearWishlist(userId: string): Promise<WishListEnity[]> {
    let allProduct = await this.wishlistRepo.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
    return await this.wishlistRepo.remove(allProduct);
  }

  async moveProductToCart(
    userId: string,
    productId: string,
    input: CartDto,
  ): Promise<CartEntity> {
    const wishlistItem = await this.cartRepo.findOne({
      where: { user: { id: userId }, product: { id: productId } },
      relations: ['product'],
    });
    if (!wishlistItem) {
      throw new Error('The Product is not in the wishlist');
    }

    if (wishlistItem.product.stockQuantity < 1) {
      throw new BadRequestException('Out of Stock');
    }

    const price = wishlistItem.product.price;
    const quantity = input.quantity;

    const subtotal = price * quantity;

    const cartItem = new CartEntity();
    cartItem.userId = wishlistItem.userId;
    cartItem.productId = wishlistItem.productId;
    cartItem.quantity = input.quantity ? input.quantity : 1;
    cartItem.subtotal = subtotal;

    await this.cartRepo.save(cartItem);

    await this.cartRepo.remove(wishlistItem);
    return cartItem;
  }

  //get the CalculateSubTotal
}
