import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MSG_OK } from '../core/constants';
import { DocumentServiceMock } from './document.mock.spec';
import { DocumentService } from './document.service';
import { Document } from './entities/document.entity';

describe('DocumentService', () => {
  let documentService: DocumentService;
  let mockService = new DocumentServiceMock();
  const document = DocumentServiceMock.document;
  const name = DocumentServiceMock.documentName;
  const createDocumentDto = DocumentServiceMock.createDocumentDto;
  const idDocument = DocumentServiceMock.idDocument;
  const updateDocumentDto = DocumentServiceMock.updateDocumentDto;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockService,
        },
      ],
    }).compile();

    documentService = module.get<DocumentService>(DocumentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(documentService).toBeDefined();
  });

  it('Validate getDocumentByName Ok', async () => {
    const spyFindOneOrFail = jest
      .spyOn(mockService, 'findOneOrFail')
      .mockResolvedValueOnce(document);
    const responseDocument = await documentService.getDocumentByName(name);
    expect(spyFindOneOrFail).toBeCalledWith({ where: { name: name } });
    expect(responseDocument).toEqual(document);
  });

  it('Validate getDocumentByName Error', async () => {
    const spyFindOneOrFail = jest
      .spyOn(mockService, 'findOneOrFail')
      .mockRejectedValueOnce(new Error());
    await expect(documentService.getDocumentByName(name)).rejects.toThrowError(
      new InternalServerErrorException('Sucedio un error al buscar el documento'),
    );
    expect(spyFindOneOrFail).toBeCalled();
  });

  it('Validate createDocument Ok', async () => {
    const spySave = jest.spyOn(mockService, 'save').mockResolvedValueOnce(null);
    const { message } = await documentService.createDocument(createDocumentDto);
    expect(message).toEqual(MSG_OK);
    expect(spySave).toBeCalled();
  });

  it('Validate createDocument Error', async () => {
    const spySaveError = jest.spyOn(mockService, 'save').mockRejectedValueOnce(new Error());
    await expect(documentService.createDocument(createDocumentDto)).rejects.toThrowError(
      new InternalServerErrorException('Error al crear documento'),
    );
    expect(spySaveError).toBeCalled();
  });

  it('Validate getAllDocuments', async () => {
    const spyFind = jest.spyOn(mockService, 'find').mockResolvedValueOnce(null);
    await documentService.getAllDocuments();
    expect(spyFind).toBeCalled();
  });

  it('validate updateDocument Ok', async () => {
    const spyUpdate = jest.spyOn(mockService, 'update').mockResolvedValueOnce(null);
    const { message } = await documentService.updateDocument(idDocument, updateDocumentDto);
    expect(spyUpdate).toBeCalledWith(idDocument, {
      name: updateDocumentDto.name,
      requirements: updateDocumentDto.requirements,
    });
    expect(message).toEqual(MSG_OK);
  });

  it('validate updateDocument error', async () => {
    const spyUpdate = jest.spyOn(mockService, 'update').mockRejectedValueOnce(new Error());
    await expect(
      documentService.updateDocument(idDocument, updateDocumentDto),
    ).rejects.toThrowError(
      new InternalServerErrorException('Sucedio un error al actualizar el documento'),
    );
    expect(spyUpdate).toBeCalled();
  });

  it('validate deleteDocument ok', async () => {
    const spyDelete = jest.spyOn(mockService, 'delete').mockResolvedValueOnce(null);
    const { message } = await documentService.deleteDocument(idDocument);
    expect(spyDelete).toBeCalled();
    expect(message).toEqual(MSG_OK);
  });

  it('validate deleteDocument error', async () => {
    const spyDelete = jest.spyOn(mockService, 'delete').mockRejectedValueOnce(new Error());

    await expect(documentService.deleteDocument(idDocument)).rejects.toThrowError(
      new InternalServerErrorException('Sucedio un error al eliminar el documento'),
    );

    expect(spyDelete).toBeCalled();
  });
});
