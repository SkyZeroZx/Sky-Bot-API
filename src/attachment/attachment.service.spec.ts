import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AwsS3Service } from '@core/services';
import { AttachmentMockService } from './attachment.mock.spec';
import { AttachmentService } from './attachment.service';
import { Attachment } from './entities/attachment.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { MSG_OK } from '../core/constants';

describe('AttachmentService', () => {
  let attachmentService: AttachmentService;
  let mockService = new AttachmentMockService();
  const idStatusDocument = '12312312';
  const attachmentServerResponse = AttachmentMockService.attachmentServerResponse;
  const createAttachmentDto = AttachmentMockService.createAttachmentDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttachmentService,
        {
          provide: getRepositoryToken(Attachment),
          useValue: mockService,
        },
        {
          provide: AwsS3Service,
          useValue: mockService,
        },
      ],
    }).compile();

    attachmentService = module.get<AttachmentService>(AttachmentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(attachmentService).toBeDefined();
  });

  it('validate registerAttachment ok', async () => {
    const times = createAttachmentDto.listUrl.length;
    const spyUploadAttachment = jest
      .spyOn(mockService, 'uploadAttachment')
      .mockResolvedValue(attachmentServerResponse);
    const spySave = jest.spyOn(mockService, 'save').mockResolvedValue(null);
    const { message } = await attachmentService.registerAttachment(createAttachmentDto);
    expect(message).toEqual(MSG_OK);
    expect(spySave).toBeCalled();
    expect(spyUploadAttachment).toBeCalledTimes(times);
  });

  it('validate registerAttachment Error', async () => {
    const spyUploadAttachment = jest
      .spyOn(mockService, 'uploadAttachment')
      .mockRejectedValue(new Error());
    await expect(attachmentService.registerAttachment(createAttachmentDto)).rejects.toThrowError(
      new InternalServerErrorException('Sucedio un error al registrar el adjunto'),
    );
    expect(spyUploadAttachment).toBeCalled();
  });

  it('validate getAttachmentsByIdStatusDocument', async () => {
    const listAttachment = AttachmentMockService.listAttachment;
    const spyFindBy = jest.spyOn(mockService, 'findBy').mockResolvedValueOnce(listAttachment);
    const data = await attachmentService.getAttachmentsByIdStatusDocument(idStatusDocument);
    expect(data).toEqual(listAttachment);
    expect(spyFindBy).toBeCalled();
  });

  it('validate getAttachmentsByIdStatusDocument error', async () => {
    const spyFindBy = jest.spyOn(mockService, 'findBy').mockRejectedValueOnce(new Error());
    await expect(
      attachmentService.getAttachmentsByIdStatusDocument(idStatusDocument),
    ).rejects.toThrowError(
      new InternalServerErrorException('Sucedio un error al obtener adjuntos'),
    );
    expect(spyFindBy).toBeCalled();
  });
});
