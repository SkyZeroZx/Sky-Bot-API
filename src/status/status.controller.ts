import { Controller, Get, Post, Body, Param, Patch, ParseIntPipe, Delete } from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReportChart } from '@core/interface/charts';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Auth, PermissionsDecorator as Permissions } from '@core/decorators';
import { ADMIN, EMPLOYEE, PERMISSIONS, STUDENT } from '@core/config';

@ApiTags('Status')
@ApiBearerAuth()
@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post()
  @Auth([ADMIN, EMPLOYEE])
  @ApiOperation({ summary: 'Creacion de status sobre un documento registrado' })
  createStatus(@Body() createStatusDto: CreateStatusDto) {
    return this.statusService.createStatus(createStatusDto);
  }

  @Get(':idStatusDocument')
  @Permissions([PERMISSIONS.use.webhook])
  @ApiOperation({ summary: 'Consulta de status por idStatusDocument' })
  getStatusByIdStatusDocument(@Param('idStatusDocument') idStatusDocument: string) {
    return this.statusService.getStatusByIdStatusDocument(idStatusDocument);
  }

  @Patch(':idStatus')
  @Auth([ADMIN, STUDENT])
  @ApiOperation({ summary: 'Actualiza Status segun IdStatus' })
  updateStatus(
    @Param('idStatus', ParseIntPipe) idStatus: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.statusService.updateStatus(idStatus, updateStatusDto);
  }

  @Delete(':idStatus')
  @Auth([ADMIN, STUDENT])
  @ApiOperation({ summary: 'Elimina Status segun IdStatus' })
  deleteStatus(@Param('idStatus', ParseIntPipe) idStatus: number) {
    return this.statusService.deleteStatus(idStatus);
  }

  @Post('/chart-status')
  @Auth([ADMIN, STUDENT])
  @ApiOperation({ summary: 'Datos para charts por busqueda de fechas' })
  reportChartStatus(@Body() reportChart: ReportChart) {
    return this.statusService.reportChartStatus(reportChart);
  }

  @Post('/chart-status/:id')
  @Auth([ADMIN, STUDENT])
  @ApiOperation({ summary: 'Datos para charts por busqueda de fechas y id documento' })
  reportChartStatusByIdDocument(@Param('id') id: string, @Body() reportChart: ReportChart) {
    return this.statusService.reportChartStatusByIdDocument(id, reportChart);
  }
}
