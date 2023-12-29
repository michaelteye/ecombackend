import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductsEntity } from "./product.entity";
import { AbstractEntity } from "src/modules/main/entities/abstract.entity";

@Entity()

export class ProductCategoryEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    categoryName:string;

    @OneToMany(() => ProductsEntity, product => product.category)
   public  products: ProductsEntity[]

}