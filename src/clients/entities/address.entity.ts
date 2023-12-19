import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, OneToOne } from 'typeorm';
import { Client } from './registerClient.entity';

@Entity()
export class AddressEntity{
    @PrimaryGeneratedColumn('uuid') 
    id: number;

    @Column('text', { nullable: true })
    homeAddress?: string;
  
    @Column('text', { nullable: true })
    country?: string;
  
    @Column('text', { nullable: true })
    region?: string;

    @Column('text', { nullable: true })
    gpsAddress?: string;

    @OneToOne(() => Client, (user) => user.address, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user?: Client;
  
    @Column('uuid')
    userId?: string;
}