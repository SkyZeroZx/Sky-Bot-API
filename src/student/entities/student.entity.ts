import { IsNotEmpty, MaxLength, MinLength, IsEmail } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryColumn, Unique } from 'typeorm';
import { StatusDocument } from '../../status-document/entities/status-document.entity';

@Entity()
@Unique(['dni', 'email'])
export class Student {
  @PrimaryColumn({ type: 'varchar', length: 35 })
  @MaxLength(35)
  @OneToMany(() => StatusDocument, (StatusDocument) => StatusDocument.idStudent)
  idStudent: string;

  @Column('varchar', { length: 80 })
  @IsNotEmpty()
  name: string;

  @Column('varchar', { length: 120 })
  @MaxLength(120)
  @IsNotEmpty()
  lastName: string;

  @Column('varchar', { length: 9 })
  @MaxLength(9)
  phone: string;

  @Column('varchar', { length: 1 })
  @MaxLength(1)
  caracterValidation: string;

  @Column('varchar', { length: 8 })
  dni: string;

  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
