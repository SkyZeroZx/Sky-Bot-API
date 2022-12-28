import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Logger,
  Param,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteUserDto } from './dto/delete-user.dto';
import { User as UserEntity } from '../user/entities/user.entity';
import { UserDecorator as User, Auth } from '@core/decorators';
import { UserReponse, GenericResponse } from '@core/swagger/response';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, maxSizeFile } from '@core/helpers/fileFilter.helper';
import { PageOptionsDto } from '@core/interface/pagination';
import { ADMIN, ALL_ROLES } from '@core/config';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(UserController.name);

  @Post()
  @Auth([ADMIN])
  @ApiOperation({ summary: 'Creacion de nuevo usuario' })
  @ApiResponse(UserReponse.createUser)
  create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('Creando usuario');
    return this.userService.create(createUserDto);
  }

  @Get()
  @Auth([ADMIN])
  @ApiOperation({ summary: 'Listado de todos los usuarios' })
  @ApiResponse(UserReponse.findAll)
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    this.logger.log('Listando Usuarios');
    return this.userService.findAll(pageOptionsDto);
  }

  @Get('/profile')
  @Auth([...ALL_ROLES])
  @ApiOperation({ summary: 'Obtener perfil personal por usuario logeado' })
  @ApiResponse(UserReponse.profile)
  async profile(@User() user: UserEntity) {
    this.logger.log({ message: `Perfil del usuario obtenido`, user });
    return this.userService.getUserById(user.id);
  }

  @Patch()
  @Auth([...ALL_ROLES])
  @ApiOperation({ summary: 'Actualizar usuario de manera administrativa' })
  @ApiResponse(GenericResponse.response)
  update(@Body() updateUserDto: UpdateUserDto, @User() user: UserEntity) {
    this.logger.log('Actualizando usuario');
    return this.userService.update(updateUserDto, user);
  }

  @Delete(':username')
  @Auth([ADMIN])
  @ApiOperation({ summary: 'Eliminar usuario del sistema' })
  @ApiResponse(GenericResponse.response)
  remove(@Param() deleteUserDto: DeleteUserDto) {
    this.logger.log('Eliminando usuario');
    return this.userService.remove(deleteUserDto);
  }

  @Post('/photo')
  @Auth([...ALL_ROLES])
  @ApiOperation({ summary: 'Registar la foto del usuario , no mayor 5MB' })
  @UseInterceptors(FileInterceptor('file', { fileFilter: fileFilter }))
  @ApiResponse(GenericResponse.response)
  savePhotoUser(@UploadedFile() file: Express.Multer.File, @User() user: UserEntity) {
    this.logger.log('Registrando foto usuario');
    maxSizeFile(file);
    return this.userService.savePhotoUser(file, user);
  }
}
