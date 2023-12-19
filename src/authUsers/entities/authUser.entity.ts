import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Entity,
} from 'typeorm';
import { Client } from 'src/clients/entities/registerClient.entity';
import * as bcrypt from 'bcrypt'
import { Exclude } from 'class-transformer';
import { STRATEGY_STATUS } from 'src/clients/entities/enums/strategy.enum';
import { AuthUserRole } from '../types/auth-user.roles';



@Entity()
export class authEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  // joining the column with the user entity
  // @Exclude()
  @Column('text', { nullable: false, array: true, default: '{}' })
  roles?: AuthUserRole[];

  @OneToOne(() => Client, (client) => client.authUser, {
    cascade: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  client: Client;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  userName: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  password: string;

  @Column('enum',{enum:STRATEGY_STATUS, default: STRATEGY_STATUS.local_auth})
  provider?: STRATEGY_STATUS | String

  // @Column({ type: 'enum', enum: ['local', 'google'], nullable: true, default:'local' })
  // provider: string;

  async validatePassword(password: string):Promise<boolean>{
    return await bcrypt.compareSync(password, this.password);
  }

  @Column({ type:'varchar', length:20, nullable:true})
  phone: string;

  @Column({ type: 'varchar', length: 200, nullable:true })
  email?: string | null;

  @CreateDateColumn({ type: 'date', nullable:false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'date', nullable:false })
  updatedAt: Date;
}
