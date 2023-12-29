import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { authEntity } from 'src/modules/authUsers/entities/authUser.entity';
import { AbstractEntity } from 'src/modules/main/entities/abstract.entity';
import { STRATEGY_STATUS } from './enums/strategy.enum';
import { ReviewEntity } from 'src/modules/product/entities/review.entity';
import { WishListEnity } from 'src/modules/wishlist/entities/wishlist.entity';
import { CartEntity } from 'src/modules/shoppingCartsAndOrders/entities/cart.entity';
import { OrderEntity } from 'src/modules/shoppingCartsAndOrders/entities/Order.entity';
import { AddressEntity } from './address.entity';
import { AuthUserRole } from 'src/modules/authUsers/types/auth-user.roles';


@Entity()
export class Client extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => authEntity, (auth) => auth.client)
  authUser: authEntity;

  @OneToMany(() => OrderEntity, (items) => items.userId)
    items: OrderEntity[];

  @Column({ type: 'varchar', length: 50, nullable:false })
  firstName: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  userName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  email: string;

  @Column({ type: 'date', nullable: true })
  dateofBirth: Date;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'enum', enum: ['m', 'f', 'u'], nullable: true })
  gender: string;

  @Column('text', { nullable: false, array: true, default: '{}' })
  roles?: AuthUserRole[];

  @Column('enum',{enum:STRATEGY_STATUS, default: STRATEGY_STATUS.local_auth})
  provider?: STRATEGY_STATUS | String

  @OneToMany(()=>ReviewEntity, review=>review.user)
  reviews: ReviewEntity[];

  @OneToMany(()=>WishListEnity, (wishlist)=>wishlist.userId)
  wishlist: WishListEnity[]

  @OneToMany(()=>CartEntity,(cart)=>cart.productId)
  cart:CartEntity[]

  @OneToOne(() => AddressEntity, (a) => a.user, {
    cascade: true,
  })
  address?: AddressEntity;
}
