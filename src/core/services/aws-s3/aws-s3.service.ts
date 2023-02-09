import { Injectable, Logger, RequestTimeoutException } from '@nestjs/common';
import { Upload } from '@aws-sdk/lib-storage';
import { CompleteMultipartUploadOutput, S3Client } from '@aws-sdk/client-s3';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ATTACHMENT_SERVER_URL } from '@core/constants';
import { AttachmentServerResponse } from '@core/interface/attachment-server';

@Injectable()
export class AwsS3Service {
  private readonly attachmentServerUrl = this.configService.get<string>(ATTACHMENT_SERVER_URL);
  private readonly logger = new Logger(AwsS3Service.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(imageBuffer: Buffer, filename: string): Promise<CompleteMultipartUploadOutput> {
    this.logger.log(`Subiendo archivo ${filename}`);
    try {
      const parallelUploads3 = new Upload({
        client: new S3Client({ region: process.env.AWS_REGION }),
        params: {
          Bucket: process.env.AWS_BUCKET,
          Key: filename,
          Body: imageBuffer,
        },
      });

      await parallelUploads3.done();
      // For error certificate not recognized security
      return { Location: `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${filename}` };
    } catch (error) {
      this.logger.error({ message: 'Sucedio un error al subir el archivo', error });
      throw new RequestTimeoutException('Sucedio un error al subir el archivo');
    }
  }

  async uploadAttachment(url: string): Promise<AttachmentServerResponse> {
    try {
      const { data } = await this.httpService.axiosRef.post<AttachmentServerResponse>(
        this.attachmentServerUrl,
        {
          url,
        },
      );
      this.logger.log({ message: 'Upload attachment response', data });
      return data;
    } catch (error) {
      this.logger.error({ message: 'Sucedio un error al subir el archivo', error });
      throw new RequestTimeoutException('Sucedio un error al subir el archivo');
    }
  }
}
