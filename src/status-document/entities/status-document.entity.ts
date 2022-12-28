import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Attachment } from '../../attachment/entities/attachment.entity';
import { Document } from '../../document/entities/document.entity';
import { Status } from '../../status/entities/status.entity';
import { Student } from '../../student/entities/student.entity';

@Entity()
export class StatusDocument {
  @PrimaryColumn({ type: 'varchar', length: 45 })
  @OneToMany(() => Status, (Status) => Status.idStatusDocument, {
    nullable: false,
  })
  @OneToMany(() => Attachment, (Attachment) => Attachment.idStatusDocument, {
    nullable: false,
  })
  idStatusDocument: string;

  @ManyToOne(() => Student, (Student) => Student.idStudent, {
    nullable: false,
  })
  @JoinColumn({name : 'idStudent'})
  @Column()
  idStudent: string;

  @ManyToOne(() => Document, (Document) => Document.idDocument, {
    nullable: false,
  })
  @JoinColumn({name : 'idDocument'})
  @Column()
  idDocument: number;
}
