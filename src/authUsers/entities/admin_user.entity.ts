import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { AbstractEntity } from 'src/main/entities/abstract.entity';

  
  @Entity()
  export class AdminEntity extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 20, nullable: true })
    firstName: string;
  
    @Column({ type: 'varchar', length: 15, nullable: true })
    lastName: string;
  
    @Column({ type: 'varchar', length: 250, nullable: true })
    password: string;
  
    @Column({ type: 'varchar', length: 50, nullable: true })
    email: string;
  
  }
  