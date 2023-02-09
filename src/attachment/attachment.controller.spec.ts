import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentController } from './attachment.controller';
import { AttachmentMockService } from './attachment.mock.spec';
import { AttachmentService } from './attachment.service';

describe('AttachmentController', () => {
  let attachmentController: AttachmentController;
  let mockService = new AttachmentMockService();
  const createAttachmentDto = AttachmentMockService.createAttachmentDto;
  const idStatusDocument = AttachmentMockService.idStatusDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttachmentController],
      providers: [
        {
          provide: AttachmentService,
          useValue: mockService,
        },
      ],
    }).compile();

    attachmentController = module.get<AttachmentController>(AttachmentController);
  });

  it('should be defined', () => {
    expect(attachmentController).toBeDefined();
  });

  it('validate registerAttachment', async () => {
    const spyRegisterAttachment = jest.spyOn(mockService, 'registerAttachment');
    await attachmentController.registerAttachment(createAttachmentDto);
    expect(spyRegisterAttachment).toBeCalledWith(createAttachmentDto);
  });

  it('validate getAttachmentsByIdStatusDocument', async () => {
    const spyGetAttachmentsByIdStatusDocument = jest.spyOn(
      mockService,
      'getAttachmentsByIdStatusDocument',
    );
    await attachmentController.getAttachmentsByIdStatusDocument(idStatusDocument);
    expect(spyGetAttachmentsByIdStatusDocument).toBeCalledWith(idStatusDocument);
  });
});
