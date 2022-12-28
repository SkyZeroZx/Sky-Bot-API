import { IsNotEmpty, MaxLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StatusDocument } from '../../status-document/entities/status-document.entity';

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  idStatus: number;

  @Column()
  @CreateDateColumn()
  registerDate: Date;

  @ManyToOne(() => StatusDocument, (StatusDocument) => StatusDocument.idStatusDocument, {
    nullable: false,
  })
  @JoinColumn({name : 'idStatusDocument'})
  idStatusDocument: string;

  @Column('varchar', { length: 50 })
  @IsNotEmpty()
  @MaxLength(50)
  status: string;

  @Column('text')
  observations: string;
}
