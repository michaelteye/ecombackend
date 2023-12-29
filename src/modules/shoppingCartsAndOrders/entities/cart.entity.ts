// cart.entity.ts
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from 'src/modules/main/entities/abstract.entity';
import { Client } from 'src/modules/clients/entities/registerClient.entity'; // Import your UserEntity
import { ProductsEntity } from 'src/modules/product/entities/product.entity';
import { OrderEntity } from './Order.entity';


@Entity()
export class CartEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client, (user) => user.cart)
  @JoinColumn({name:'userId'})
  user: Client;

  @Column('uuid')
  userId:string

  @ManyToOne(() => ProductsEntity, (product) => product.cartItems)
  @JoinColumn({ name: "productId" })
  product: ProductsEntity;

  @Column("uuid")
  productId: string;

  @ManyToOne(()=>OrderEntity, (order) => order.items)
  @JoinColumn({name:"orderId"})
  order: OrderEntity;
  @Column("uuid",{nullable:true})
  orderId?: string;

  @Column({ type: 'int' })
  quantity: number; // You may want to add a quantity property if needed

  @Column({ type: 'int' })
  subtotal:number

  @Column({ type: 'text' }) // Add a column for the product image
  productImage: string;

  @Column({ type: 'text' }) // Add a column for the product title
  productTitle: string;

  @Column({ type: 'text' }) // Add a column for the product description
  productDescription: string;

  // Add any other properties you need, e.g., total price, timestamp, etc.
}
