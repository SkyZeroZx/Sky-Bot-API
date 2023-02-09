import { Test, TestingModule } from '@nestjs/testing';
import { AwsS3Service } from './aws-s3.service';

import { RequestTimeoutException } from '@nestjs/common';
import { MSG_OK } from '../../constants';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CommomMock } from '../../mocks/common.mock.spec';
import { AttachmentServerResponse } from '../../interface/attachment-server';
import { Any } from 'typeorm';

const mockUploadInstance = {
  upload: jest.fn().mockReturnThis(),
  done: jest.fn(),
  promise: jest.fn(),
};

jest.mock('@aws-sdk/lib-storage', () => {
  return { Upload: jest.fn(() => mockUploadInstance) };
});

describe('AwsS3Service', () => {
  let awsS3Service: AwsS3Service;
  let configService: ConfigService;
  let mockService = new CommomMock();
  let url = 'upload-awesome-attachment';
  const attachmentServerResponse: AttachmentServerResponse = {
    message: MSG_OK,
    info: 'archivo subido satisfactoriamente',
    Location: 'http:localhost',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        AwsS3Service,
        {
          provide : ConfigService,
          useValue : mockService,
        },
        {
          provide: HttpService,
          useValue: mockService,
        },
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);

    awsS3Service = module.get<AwsS3Service>(AwsS3Service);
  });

  it('should be defined', () => {
    expect(awsS3Service).toBeDefined();
  });

  it('Validate uploadFile OK', async () => {
    mockUploadInstance.promise.mockResolvedValueOnce(MSG_OK);
    await awsS3Service.uploadFile(null, 'FileNameMock');
    expect(mockUploadInstance.done).toBeCalled();
  });

  it('Validate uploadFile Error', async () => {
    mockUploadInstance.done.mockImplementationOnce(() => {
      throw new Error();
    });
    await expect(awsS3Service.uploadFile(null, 'FileNameMock')).rejects.toThrowError(
      new RequestTimeoutException({
        message: 'Sucedio un error al subir el archivo',
      }),
    );
  });

  it('validate uploadAttachment ok', async () => {
    jest.spyOn(configService,'get').mockReturnValue('awesome');  
    const spyUploadAxios = jest
      .spyOn(mockService.axiosRef, 'post')
      .mockImplementationOnce(async () => {
        return { data: attachmentServerResponse };
      });
    const data = await awsS3Service.uploadAttachment(url);
    expect(data).toEqual(attachmentServerResponse);
    expect(spyUploadAxios).toBeCalledWith(expect.anything(), { url });
    
  });

  it('validate uploadAttachment error', async () => {
    const spyUploadAxios = jest
      .spyOn(mockService.axiosRef, 'post')
      .mockRejectedValueOnce(new Error());
    await expect(awsS3Service.uploadAttachment(url)).rejects.toThrowError(
      new RequestTimeoutException('Sucedio un error al subir el archivo'),
    );

    expect(spyUploadAxios).toBeCalled();
  });
});
