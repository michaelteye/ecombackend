import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from 'src/modules/main/entities/abstract.entity';
import { ProductCategoryEntity } from './product_categories.entity';
import { ReviewEntity } from './review.entity';
import { WishListEnity } from 'src/modules/wishlist/entities/wishlist.entity';
import { CartEntity } from 'src/modules/shoppingCartsAndOrders/entities/cart.entity';
@Entity()
export class ProductsEntity extends AbstractEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50 })
    name: string;

    @Column({ length: 225 })
    description: string

    @Column({ type: "decimal", precision: 12, scale: 2 })
    price: number;

    @Column('text',{array:true, nullable:true})
    images:string[]

    @Column({ type:'int'})
    stockQuantity:number;

    @Column()
    sku: string

    @Column()
    material:string;

    @Column()
    width:string;

    @Column()
    thickness:string;

    @Column('simple-array',{nullable:true})
    itemSizes:number[];

    @ManyToOne(() => ProductCategoryEntity, (category) => category.products,{
        cascade: true,
        nullable: true,
        onDelete: 'CASCADE'
    })  
    @JoinColumn({ name: 'categoryId' })
    category: ProductCategoryEntity;

    @Column({ type:'uuid', nullable: true})
    categoryId:string

    @OneToMany(()=>ReviewEntity, (review)=>review.product)
     reviews:ReviewEntity[]

    @OneToMany(()=>WishListEnity,(wishlist)=>wishlist.productId)
     wishlist:WishListEnity[]

    @OneToMany(()=>CartEntity,(cartItems)=>cartItems.productId)
     cartItems:CartEntity[]
    
    
}
