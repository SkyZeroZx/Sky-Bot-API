import { ReportChart } from '../core/interface/charts';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Status } from './entities/status.entity';

export class StatusMockService {
  public save = jest.fn().mockReturnThis();
  public find = jest.fn().mockReturnThis();
  public update = jest.fn().mockReturnThis();
  public delete = jest.fn().mockReturnThis();
  public query = jest.fn().mockReturnThis();

  public static readonly idStatusDocument: string = '25';

  public static readonly idStatus: number = 625;

  public static readonly reportChart: ReportChart = {
    dateRange: [new Date('25-02-1999').toDateString(), new Date('25-02-1999').toDateString()],
  };

  public static readonly updateStatusDto: UpdateStatusDto = {
    status: '',
    observations: '',
  };

  public static readonly listStatus: readonly Status[] = [
    {
      idStatus: 1,
      registerDate: new Date('25-02-1999'),
      idStatusDocument: '1',
      status: 'Awesome Status Document',
      observations: 'Awesome Observations',
    },
  ];

  public createStatus = jest.fn().mockReturnThis();
  public getStatusByIdStatusDocument = jest.fn().mockReturnThis();
  public updateStatus = jest.fn().mockReturnThis();
  public deleteStatus = jest.fn().mockReturnThis();
  public reportChartStatus = jest.fn().mockReturnThis();
  public reportChartStatusByIdDocument = jest.fn().mockReturnThis();

  public static readonly createStatusDto: CreateStatusDto = {
    idStatusDocument: '',
    status: '',
    observations: '',
  };
}
