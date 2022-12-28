import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Constants } from '@core/constants/Constant';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async getDocumentByName(name: string): Promise<Document> {
    try {
      const document = await this.documentRepository.findOneOrFail({ where: { name: name } });
      this.logger.log({ message: 'Documento buscado es', document });
      return document;
    } catch (error) {
      this.logger.error(`Sucedio un error al buscar el document ${name}`);
      this.logger.error(error);
      throw new InternalServerErrorException('Sucedio un error al buscar el documento');
    }
  }

  async createDocument(createDocumentDto: CreateDocumentDto) {
    this.logger.log({ message: 'Creando documento', createDocumentDto });
    try {
      await this.documentRepository.save(createDocumentDto);
      return { message: Constants.MSG_OK, info: 'Se creo exitosamente el documento' };
    } catch (error) {
      this.logger.error({ message: 'Error al crear documento', error });
      throw new InternalServerErrorException('Error al crear documento');
    }
  }

  async getAllDocuments() {
    return this.documentRepository.find();
  }

  async updateDocument(idDocument: number, updateDocumentDto: UpdateDocumentDto) {
    try {
      await this.documentRepository.update(idDocument, {
        name: updateDocumentDto.name,
        requirements: updateDocumentDto.requirements,
      });
      return { message: Constants.MSG_OK, info: 'Se actualizo exitosamente el documento' };
    } catch (error) {
      this.logger.error({ message: 'Sucedio un error al actualizar el documento', error });
      throw new InternalServerErrorException('Sucedio un error al actualizar el documento');
    }
  }

  async deleteDocument(idDocument: number) {
    this.logger.log(`Eliminando documento codigo: ${idDocument}`);
    try {
      await this.documentRepository.delete({ idDocument });
      return { message: Constants.MSG_OK, info: 'Se elimino exitosamente el documento' };
    } catch (error) {
      this.logger.error({ message: 'Sucedio un error al eliminar el documento', error });
      throw new InternalServerErrorException('Sucedio un error al eliminar el documento');
    }
  }
}
