import { Test, TestingModule } from '@nestjs/testing';
import { AuthMockService } from '../auth/auth.mock.spec';
import { StatusDocumentController } from './status-document.controller';
import { StatusDocumentMock } from './status-document.mock.spec';
import { StatusDocumentService } from './status-document.service';

describe('StatusDocumentController', () => {
  let statusDocumentController: StatusDocumentController;
  let mockService = new StatusDocumentMock();
  const createStatusDocumentDto = StatusDocumentMock.createStatusDocumentDto;
  const idStatusDocument = StatusDocumentMock.idStatusDocument;
  const dni = StatusDocumentMock.dni;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusDocumentController],
      providers: [
        {
          provide: StatusDocumentService,
          useValue: mockService,
        },
      ],
    }).compile();

    statusDocumentController = module.get<StatusDocumentController>(StatusDocumentController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(statusDocumentController).toBeDefined();
  });

  it('validate createStatusDocument', async () => {
    const spyCreateStatusDocument = jest.spyOn(mockService, 'createStatusDocument');
    await statusDocumentController.createStatusDocument(createStatusDocumentDto);
    expect(spyCreateStatusDocument).toBeCalledWith(createStatusDocumentDto);
  });

  it('validate getStudentDocument', async () => {
    const spyGetStudentDocument = jest.spyOn(mockService, 'getStudentDocument');
    await statusDocumentController.getStudentDocument(StatusDocumentMock.pageOptionsDto);
    expect(spyGetStudentDocument).toBeCalledWith(StatusDocumentMock.pageOptionsDto);
  });

  it('validate getStatusDocumentById', async () => {
    const spyGetStatusDocumentById = jest.spyOn(mockService, 'getStatusDocumentById');
    await statusDocumentController.getStatusDocumentById(idStatusDocument);
    expect(spyGetStatusDocumentById).toBeCalledWith(idStatusDocument);
  });

  it('validate getStatusDocumentByDni', async () => {
    const spyGetStatusDocumentByDni = jest.spyOn(mockService, 'getStatusDocumentByDni');
    await statusDocumentController.getStatusDocumentByDni(AuthMockService.user);
    expect(spyGetStatusDocumentByDni).toBeCalledWith(AuthMockService.user.dni);
  });
});
