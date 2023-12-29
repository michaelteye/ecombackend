import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from 'src/modules/clients/entities/registerClient.entity';
import { AbstractEntity } from 'src/modules/main/entities/abstract.entity';
import { ProductsEntity } from './product.entity';

@Entity()
export class ReviewEntity extends AbstractEntity{
    @PrimaryGeneratedColumn('uuid') 
    id: string;

    @Column({type:'text', nullable:true})
    title:string;

    @Column({type:'varchar', nullable:true})
    description:string;

    @Column({type:'int', nullable:true, default:0})
    rating:number;
    
    @ManyToOne(() => Client, (user)=> user.reviews)
    @JoinColumn({name:"clientId"})
    user:Client
    
    @Column('uuid')
    clientId:string

    @ManyToOne(()=>ProductsEntity ,(a)=> a.product)
     @JoinColumn({ name: 'productId' })
     product: ProductsEntity

     @Column('uuid')
     productId?: string;
}
