import { MSG_OK } from '../core/constants';
import { AttachmentServerResponse } from '../core/interface/attachment-server';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { Attachment } from './entities/attachment.entity';

export class AttachmentMockService {
  public findBy = jest.fn().mockReturnThis();
  public save = jest.fn().mockReturnThis();
  public uploadAttachment = jest.fn().mockReturnThis();
  public registerAttachment = jest.fn().mockReturnThis();
  public getAttachmentsByIdStatusDocument = jest.fn().mockReturnThis();

  public static readonly idStatusDocument: string = '23432432';

  public static readonly listAttachment: Attachment[] = [
    {
      idAttachment: 1,
      idStatusDocument: '324234AWESOME',
      url: 'AWESOME_URL',
      createDate: new Date('12-12-2015'),
    },
  ];

  public static readonly createAttachmentDto: CreateAttachmentDto = {
    idStatusDocument: '324234AWESOME',
    listUrl: [
      'http://localhost:4200/for-upload-image-1',
      'http://localhost:4200/for-upload-image-2',
    ],
  };

  public static readonly attachmentServerResponse: AttachmentServerResponse = {
    message: MSG_OK,
    info: 'TODO SALIO BIEN',
    Location: 'http://localhost:3000/awesome-image',
  };
}
