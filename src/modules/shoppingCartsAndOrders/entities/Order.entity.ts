import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { CartEntity } from './cart.entity';
import { Client } from 'src/modules/clients/entities/registerClient.entity';

@Entity()

export class OrderEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ManyToOne(() => Client)
    @JoinColumn({ name: 'userId' })
    user: Client;
    @Column()
    userId: string;
  
    @OneToMany(() => CartEntity, (cart) => cart.order)
    items: CartEntity[];
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalPrice: number;
}