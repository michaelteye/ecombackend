import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from 'src/modules/main/entities/abstract.entity';
import { ProductsEntity } from 'src/modules/product/entities/product.entity';
import { Client } from 'src/modules/clients/entities/registerClient.entity';

@Entity()

export class WishListEnity extends AbstractEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(()=>ProductsEntity, (product)=>product.wishlist)
    @JoinColumn({name:'productId'})
    product: ProductsEntity;

    @Column('uuid')
    productId:string


    @ManyToOne(()=>Client, (user)=>user.wishlist)
    @JoinColumn({name:'userId'})
    user: Client;

    @Column('uuid')
    userId:string
}