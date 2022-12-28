import {
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { MinLength, IsNotEmpty, IsEmail, MaxLength } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { Constants } from '@core/constants/Constant';
import { Notification } from '../../notification/entities/notification.entity';

@Entity()
@Unique(['username', 'dni'])
export class User {
  @PrimaryGeneratedColumn()
  @JoinColumn()
  @OneToMany(() => Notification, (Notificacion) => Notificacion.id, {
    nullable: false,
  })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @MinLength(6)
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @Column()
  @IsNotEmpty()
  role: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;

  @Column('varchar', { length: 80 })
  @MinLength(2)
  @MaxLength(80)
  @IsNotEmpty()
  name: string;

  @Column('varchar', { length: 120 })
  @MinLength(2)
  @MaxLength(120)
  @IsNotEmpty()
  fatherLastName: string;

  @Column('varchar', { length: 120 })
  @MinLength(2)
  @MaxLength(120)
  @IsNotEmpty()
  motherLastName: string;

  @Column('varchar', { length: 35, default: Constants.STATUS_USER.CREATE })
  status: string;

  @Column('boolean', { default: true })
  firstLogin: boolean;

  @Column('text', { default: null })
  photo: string;

  @Column('varchar', { length: 9, default: null })
  @MinLength(9)
  @MaxLength(9)
  @IsNotEmpty()
  phone: string;

  @Column('varchar', { length: 8 })
  @MinLength(8)
  @MaxLength(8)
  @IsNotEmpty()
  dni: string;
}
