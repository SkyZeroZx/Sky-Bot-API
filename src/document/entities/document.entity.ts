import { IsNotEmpty, MaxLength } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { StatusDocument } from '../../status-document/entities/status-document.entity';

@Entity()
@Unique(['name'])
export class Document {
  @PrimaryGeneratedColumn()
  @OneToMany(() => StatusDocument, (StatusDocument) => StatusDocument.idDocument)
  idDocument: number;

  @Column('varchar', { length: 150 })
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @Column('text')
  @IsNotEmpty()
  requirements: string;
}
