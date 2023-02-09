import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MSG_OK } from '../core/constants';
import { Status } from './entities/status.entity';
import { StatusMockService } from './status.mock.spec';
import { StatusService } from './status.service';

describe('StatusService', () => {
  let statusService: StatusService;
  let statusServiceMock = new StatusMockService();
  const createStatusDto = StatusMockService.createStatusDto;
  const updateStatusDto = StatusMockService.updateStatusDto;
  const idStatus = StatusMockService.idStatus;
  const idStatusDocument = StatusMockService.idStatusDocument;
  const listStatus = StatusMockService.listStatus;
  const reportChart = StatusMockService.reportChart;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatusService,
        {
          provide: getRepositoryToken(Status),
          useValue: statusServiceMock,
        },
      ],
    }).compile();

    statusService = module.get<StatusService>(StatusService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(statusService).toBeDefined();
  });

  it('validate createStatus Ok', async () => {
    const spySave = jest.spyOn(statusServiceMock, 'save').mockResolvedValueOnce(null);
    const { message } = await statusService.createStatus(createStatusDto);
    expect(message).toEqual(MSG_OK);
    expect(spySave).toBeCalledWith(createStatusDto);
  });

  it('validate createStatus Error', async () => {
    const spySaveError = jest.spyOn(statusServiceMock, 'save').mockRejectedValueOnce(new Error());
    await expect(statusService.createStatus(createStatusDto)).rejects.toThrowError(
      new InternalServerErrorException('Scuedio un error al registrar status'),
    );
    expect(spySaveError).toBeCalledWith(createStatusDto);
  });

  it('validate getStatusByIdStatusDocument Ok', async () => {
    const spyFind = jest.spyOn(statusServiceMock, 'find').mockResolvedValueOnce(listStatus);
    const data = await statusService.getStatusByIdStatusDocument(idStatusDocument);
    expect(spyFind).toBeCalled();
    expect(data).toEqual(listStatus);
  });

  it('validate getStatusByIdStatusDocument Error', async () => {
    const spyFindError = jest.spyOn(statusServiceMock, 'find').mockRejectedValueOnce(new Error());
    await expect(statusService.getStatusByIdStatusDocument(idStatusDocument)).rejects.toThrowError(
      new InternalServerErrorException('Sucedio un error al obtener status'),
    );
    expect(spyFindError).toBeCalled();
  });

  it('validate updateStatus Ok', async () => {
    const spyUpdateOk = jest.spyOn(statusServiceMock, 'update').mockResolvedValueOnce(null);
    const { message } = await statusService.updateStatus(idStatus, updateStatusDto);
    expect(message).toEqual(MSG_OK);
    expect(spyUpdateOk).toBeCalledWith(idStatus, {
      observations: updateStatusDto.observations,
      status: updateStatusDto.status,
    });
  });

  it('Validate updateStatus Error', async () => {
    const spyUpdateOk = jest.spyOn(statusServiceMock, 'update').mockRejectedValueOnce(new Error());
    await expect(statusService.updateStatus(idStatus, updateStatusDto)).rejects.toThrowError(
      new InternalServerErrorException('Error al actualizar status'),
    );
    expect(spyUpdateOk).toBeCalled();
  });

  it('validate deleteStatus Ok', async () => {
    const spyDeleteOk = jest.spyOn(statusServiceMock, 'delete').mockResolvedValueOnce(null);
    const { message } = await statusService.deleteStatus(idStatus);
    expect(message).toEqual(MSG_OK);
    expect(spyDeleteOk).toBeCalledWith({ idStatus });
  });

  it('validate deleteStatus Error', async () => {
    const spyDeleteError = jest
      .spyOn(statusServiceMock, 'delete')
      .mockRejectedValueOnce(new Error());
    await expect(statusService.deleteStatus(idStatus)).rejects.toThrowError(
      new InternalServerErrorException('Error al eliminar status'),
    );
    expect(spyDeleteError).toBeCalled();
  });

  it('validate reportChartStatus Ok', async () => {
    const {
      dateRange: [initDate, endDate],
    } = reportChart;
    const spyQuery = jest.spyOn(statusServiceMock, 'query').mockResolvedValueOnce([]);
    await statusService.reportChartStatus(StatusMockService.reportChart);
    expect(spyQuery).toBeCalledWith('CALL REPORT_CHART_STATUS_DOCUMENT(?,?)', [initDate, endDate]);
  });

  it('validate reportChartStatusByIdDocument Ok', async () => {
    const {
      dateRange: [initDate, endDate],
    } = reportChart;
    const spyQuery = jest.spyOn(statusServiceMock, 'query').mockResolvedValueOnce([]);
    await statusService.reportChartStatusByIdDocument(idStatusDocument, reportChart);
    expect(spyQuery).toBeCalledWith('CALL REPORT_CHART_STATUS_DOCUMENT_BY_ID_DOCUMENT(?,?,?)', [
      idStatusDocument,
      initDate,
      endDate,
    ]);
  });
});
