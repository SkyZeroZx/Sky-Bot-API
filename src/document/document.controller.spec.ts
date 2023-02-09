import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentServiceMock } from './document.mock.spec';
import { DocumentService } from './document.service';

describe('DocumentController', () => {
  let documentController: DocumentController;
  let mockService = new DocumentServiceMock();
  const createDocumentDto = DocumentServiceMock.createDocumentDto;
  const updateDocumentDto = DocumentServiceMock.updateDocumentDto;
  const idDocument = DocumentServiceMock.idDocument;
  const name = DocumentServiceMock.name;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: DocumentService,
          useValue: mockService,
        },
      ],
    }).compile();

    documentController = module.get<DocumentController>(DocumentController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(documentController).toBeDefined();
  });

  it('validate createDocument', async () => {
    const spyCreateDocument = jest.spyOn(mockService, 'createDocument');
    await documentController.createDocument(createDocumentDto);
    expect(spyCreateDocument).toBeCalledWith(createDocumentDto);
  });

  it('validate getAllDocuments', async () => {
    const spyGetAllDocuments = jest.spyOn(mockService, 'getAllDocuments');
    await documentController.getAllDocuments();
    expect(spyGetAllDocuments).toBeCalled();
  });

  it('validate getDocumentByName', async () => {
    const spyGetDocumentByName = jest.spyOn(mockService, 'getDocumentByName');
    await documentController.getDocumentByName(name);
    expect(spyGetDocumentByName).toBeCalled();
  });

  it('validate updateDocument', async () => {
    const spyUpdateDocument = jest.spyOn(mockService, 'updateDocument');
    await documentController.updateDocument(idDocument, updateDocumentDto);
    expect(spyUpdateDocument).toBeCalledWith(idDocument, updateDocumentDto);
  });

  it('validate deleteDocument', async () => {
    const spyDeleteDocument = jest.spyOn(mockService, 'deleteDocument');
    await documentController.deleteDocument(idDocument);
    expect(spyDeleteDocument).toBeCalledWith(idDocument);
  });
});
