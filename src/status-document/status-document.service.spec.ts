import { Test, TestingModule } from '@nestjs/testing';
import { StatusDocumentService } from './status-document.service';

describe('StatusDocumentService', () => {
  let service: StatusDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusDocumentService],
    }).compile();

    service = module.get<StatusDocumentService>(StatusDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
