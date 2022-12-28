import { IsNotEmpty } from 'class-validator';
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
export class Attachment {
  @PrimaryGeneratedColumn()
  idAttachment: number;

  @ManyToOne(() => StatusDocument, (StatusDocument) => StatusDocument.idStatusDocument, {
    nullable: false,
  })
  @JoinColumn({name : 'idStatusDocument'})
  idStatusDocument: string;

  @Column('text')
  @IsNotEmpty()
  url: string;

  @Column()
  @CreateDateColumn()
  createDate: Date;
}
