import { Test, TestingModule } from '@nestjs/testing';
import { StatusController } from './status.controller';
import { StatusMockService } from './status.mock.spec';
import { StatusService } from './status.service';

describe('StatusController', () => {
  let statusController: StatusController;
  let mockService = new StatusMockService();
  const createStatusDto = StatusMockService.createStatusDto;
  const updateStatusDto = StatusMockService.updateStatusDto;
  const idStatus = StatusMockService.idStatus;
  const idStatusDocument = StatusMockService.idStatusDocument;
  const reportChart = StatusMockService.reportChart;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusController],
      providers: [
        {
          provide: StatusService,
          useValue: mockService,
        },
      ],
    }).compile();

    statusController = module.get<StatusController>(StatusController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(statusController).toBeDefined();
  });

  it('validate createStatus', async () => {
    const spyCreateStatus = jest.spyOn(mockService, 'createStatus');
    await statusController.createStatus(createStatusDto);
    expect(spyCreateStatus).toBeCalledWith(createStatusDto);
  });

  it('validate getStatusByIdStatusDocument', async () => {
    const spyGetStatusByIdStatusDocument = jest.spyOn(mockService, 'getStatusByIdStatusDocument');
    await statusController.getStatusByIdStatusDocument(idStatusDocument);
    expect(spyGetStatusByIdStatusDocument).toBeCalledWith(idStatusDocument);
  });

  it('validate updateStatus', async () => {
    const spyUpdateStatus = jest.spyOn(mockService, 'updateStatus');
    await statusController.updateStatus(idStatus, updateStatusDto);
    expect(spyUpdateStatus).toBeCalledWith(idStatus, updateStatusDto);
  });

  it('validate deleteStatus', async () => {
    const spyDeleteStatus = jest.spyOn(mockService, 'deleteStatus');
    await statusController.deleteStatus(idStatus);
    expect(spyDeleteStatus).toBeCalledWith(idStatus);
  });

  it('validate reportChartStatus', async () => {
    const spyReportChartStatus = jest.spyOn(mockService, 'reportChartStatus');
    await statusController.reportChartStatus(reportChart);
    expect(spyReportChartStatus).toBeCalledWith(reportChart);
  });

  it('validate reportChartStatusByIdDocument', async () => {
    const spyReportChartStatusByIdDocument = jest.spyOn(
      mockService,
      'reportChartStatusByIdDocument',
    );
    await statusController.reportChartStatusByIdDocument(idStatusDocument, reportChart);
    expect(spyReportChartStatusByIdDocument).toBeCalledWith(idStatusDocument, reportChart);
  });
});
