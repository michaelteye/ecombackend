import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../entities/Order.entity';
import { AddressEntity } from 'src/clients/entities/address.entity';
import { CartEntity } from '../entities/cart.entity';
import { OrderDto } from '../dtos/order.dto';

export class OrderService {
  constructor(
    @InjectRepository(OrderEntity) private orderRepo: Repository<OrderEntity>,
    @InjectRepository(AddressEntity)
    private addressRepo: Repository<AddressEntity>,
  ) {}

  async Checkout(
    userId: string,
    cartItem: CartEntity[],
    input: OrderDto,
  ): Promise<OrderEntity> {
    //calulating the total items
    let totalPrice = cartItem.reduce(
      (total, items) => total + items.subtotal,
      0,
    );

    const existingAddress = await this.addressRepo.findOne({ where: { userId: userId } });

    if (existingAddress) {
      existingAddress.country = input.country;
      existingAddress.gpsAddress = input.gpsAddress;
      existingAddress.homeAddress = input.homeAddress;
      existingAddress.region = input.region;
  
      // Save the updated address
      await this.addressRepo.save(existingAddress);
    }

    const address = new AddressEntity();
    address.country = input.country;
    address.gpsAddress = input.gpsAddress;
    address.homeAddress = input.homeAddress;
    address.region = input.region;
    
    await this.addressRepo.save(address)

    const order = new OrderEntity();
    order.totalPrice = totalPrice;
    order.items = cartItem;

    return await this.orderRepo.save(order);
  }
}
