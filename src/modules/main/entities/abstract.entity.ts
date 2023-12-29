import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    
} from 'typeorm'

export class AbstractEntity{
    

    @CreateDateColumn({ nullable:true })
    createdAt: Date;

    @UpdateDateColumn({ nullable:true })
    updatedAt: Date;
}