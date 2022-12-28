import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Constants } from '@core/constants/Constant';
import { ReportChart } from '@core/interface/charts';
import { CreateStatusDto } from './dto/create-status.dto';
import { Status } from './entities/status.entity';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class StatusService {
  private readonly logger = new Logger(StatusService.name);
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  async createStatus(createStatusDto: CreateStatusDto) {
    this.logger.log({ message: 'Registrando status', createStatusDto });
    try {
      const status = await this.statusRepository.save(createStatusDto);
      this.logger.log({ message: 'status registrado es', status });
      return { message: Constants.MSG_OK, info: 'Se registro exitosamente el Status' };
    } catch (error) {
      this.logger.error({ message: 'Sucedio un error al registrar status', createStatusDto });
      this.logger.error(error);
      throw new InternalServerErrorException('Scuedio un error al registrar status');
    }
  }

  async getStatusByIdStatusDocument(idStatusDocument: string) {
    this.logger.log(`Buscando idStatusDocument ${idStatusDocument}`);
    try {
      const listStatusDocument = await this.statusRepository.find({
        where: {
          idStatusDocument,
        },
        order: {
          idStatus: 'DESC',
        },
      });

      if (!listStatusDocument) {
        throw new Error('List Status Not Found');
      }

      return listStatusDocument;
    } catch (error) {
      this.logger.error({ message: 'Sucedio un error al obtener status' });
      this.logger.error(error);
      throw new InternalServerErrorException('Sucedio un error al obtener status');
    }
  }

  async updateStatus(idStatus: number, updateStatusDto: UpdateStatusDto) {
    try {
      await this.statusRepository.update(idStatus, {
        observations: updateStatusDto.observations,
        status: updateStatusDto.status,
      });

      return { message: Constants.MSG_OK, info: 'Status Actualizado correctamente' };
    } catch (error) {
      console.error(error);
      this.logger.error({ message: 'Error al actualizar status', error });
      throw new InternalServerErrorException('Error al actualizar status');
    }
  }

  async deleteStatus(idStatus: number) {
    try {
      await this.statusRepository.delete({ idStatus });
      return { message: Constants.MSG_OK, info: 'Status Elimina correctamente' };
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar status');
    }
  }

  async reportChartStatus({ dateRange: [initDate, endDate] }: ReportChart) {
    this.logger.log({ message: 'Obteniendo datos para Status Chart' });
    const [reportChartStatus] = await this.statusRepository.query(
      'CALL REPORT_CHART_STATUS_DOCUMENT(?,?)',
      [initDate, endDate],
    );
    return reportChartStatus;
  }

  async reportChartStatusByIdDocument(id: string, { dateRange: [initDate, endDate] }: ReportChart) {
    this.logger.log({ message: 'Obteniendo datos para Status Chart By Document' });
    const [reportChartStatus] = await this.statusRepository.query(
      'CALL REPORT_CHART_STATUS_DOCUMENT_BY_ID_DOCUMENT(?,?,?)',
      [id, initDate, endDate],
    );
    return reportChartStatus;
  }
}
