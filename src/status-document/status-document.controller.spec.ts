import { Test, TestingModule } from '@nestjs/testing';
import { StatusDocumentController } from './status-document.controller';
import { StatusDocumentService } from './status-document.service';

describe('StatusDocumentController', () => {
  let controller: StatusDocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusDocumentController],
      providers: [StatusDocumentService],
    }).compile();

    controller = module.get<StatusDocumentController>(StatusDocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
