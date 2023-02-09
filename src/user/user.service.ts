import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transporter } from '@core/config';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { generate } from 'generate-password';
import { fileNamer } from '@core/helpers';
import { Auth0Service, AwsS3Service } from '@core/services';
import { CreateUserData } from 'auth0';
import { PageOptionsDto, PageDto, PageMetaDto } from '@core/interface/pagination';
import { MAIL_CREATE_USER, IS_BLOCKED, MSG_OK } from '@core/constants';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly awsS3Service: AwsS3Service,
    private readonly auth0Service: Auth0Service,
  ) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.log({ message: 'Registrando usuario', info: createUserDto });

    const { message } = await this.findUserByEmail(createUserDto.username);
    if (message !== MSG_OK) {
      throw new BadRequestException('El correo del usuario ya existe');
    }

    let user: User;

    let generatePassword: string = generate({
      length: 13,
      numbers: true,
      symbols: ')(?@$%_{}[]',
    });

    try {
      user = await this.userRepository.save(createUserDto);

      const auth0UserData: CreateUserData = {
        family_name: user.fatherLastName + ' ' + user.motherLastName,
        given_name: user.name,
        email: user.username.toLowerCase(),
        email_verified: false,
        password: generatePassword,
        connection: this.auth0Service.connection,
        user_metadata: {
          userId: user.id,
          userRole: user.role,
          dni: user.dni,
          status: user.status,
        },
      };

      await this.auth0Service.management.createUser(auth0UserData);
    } catch (error) {
      this.logger.error({ message: `Sucedio un error al crear al usuario`, info: error });
      throw new InternalServerErrorException('Sucedio un error al crear al usuario');
    }

    try {
      await transporter.sendMail({
        from: 'Sky Bot',
        to: user.username,
        subject: 'Creacion de nuevo usuario Sky Bot',
        html: MAIL_CREATE_USER(user.username, generatePassword),
      });
      this.logger.log(
        `Correo de creacion del usuario ${createUserDto.username} enviado exitosamente`,
      );
    } catch (error) {
      this.logger.error({ message: ' Hubo un error al enviar el correo de creacion', info: error });
      throw new InternalServerErrorException('Hubo un error al enviar el correo de creacion');
    }

    this.logger.log({ message: `Usuario creado exitosamente`, user });
    return {
      message: MSG_OK,
      info: 'Usuario Creado Correctamente',
      user,
    };
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOneBy({ username: email });
      // .createQueryBuilder('user')
      // .where({
      //   username: email,
      // })
      // .getOne();
      if (user) {
        this.logger.log(`El correo del usuario ${email} se encuentra registrado`);
        return {
          message: 'El correo del usuario ya existe',
          user,
        };
      }
    } catch (error) {
      this.logger.error({
        message: `Sucedio un error al realizar la busqueda del usuario ${email}`,
        info: error,
      });
      throw new InternalServerErrorException('Sucedio un error al buscar al usuario');
    }
    return { message: MSG_OK };
  }

  async getUsers(pageOptionsDto: PageOptionsDto) {
    const userQueryBuilder = this.userRepository.createQueryBuilder('USER');

    if (pageOptionsDto.search) {
      userQueryBuilder.where(
        'USER.name LIKE :search OR USER.fatherLastName LIKE :search OR USER.motherLastName LIKE :search OR USER.username LIKE :search',
        {
          search: `%${pageOptionsDto.search}%`,
        },
      );
    }

    if (pageOptionsDto.optionalSearch) {
      userQueryBuilder.andWhere('USER.status =:optionalSearch', {
        optionalSearch: pageOptionsDto.optionalSearch,
      });
    }

    const users = await userQueryBuilder
      .select('USER.id', 'id')
      .addSelect('USER.username', 'username')
      .addSelect('USER.name', 'name')
      .addSelect('USER.fatherLastName', 'fatherLastName')
      .addSelect('USER.motherLastName', 'motherLastName')
      .addSelect('USER.createdAt', 'createdAt')
      .addSelect('USER.updateAt', 'updateAt')
      .addSelect('USER.status', 'status')
      .addSelect('USER.role', 'role')
      .addSelect('USER.dni', 'dni')
      .addSelect('USER.photo', 'photo')
      .addSelect('USER.phone', 'phone')
      .orderBy('USER.username', pageOptionsDto.order)
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.take)
      .getRawMany();

    const itemCount = await userQueryBuilder.getCount();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(users, pageMetaDto);
  }

  async update(updateUserDto: UpdateUserDto, user: User) {
    if (updateUserDto.role !== user.role && user.role !== 'admin') {
      this.logger.warn({ message: 'User not allowed to update role', info: user });
      throw new ForbiddenException('User not allowed to update role');
    }

    try {
      const userUpdate = this.userRepository.create({
        name: updateUserDto.name,
        motherLastName: updateUserDto.motherLastName,
        fatherLastName: updateUserDto.fatherLastName,
        role: updateUserDto.role,
        dni: updateUserDto.dni,
        status: updateUserDto.status,
        phone: updateUserDto.phone,
      });
      await this.userRepository.update(
        { username: updateUserDto.username.toLowerCase() },
        userUpdate,
      );
    } catch (error) {
      this.logger.error({
        message: `Sucedio un error al actualizar al usuario ${updateUserDto.username}`,
        error,
      });
      throw new InternalServerErrorException('Sucedio un error al actualizar al usuario');
    }

    try {
      const [{ user_id }] = await this.auth0Service.management.getUsersByEmail(
        updateUserDto.username,
      );

      await this.auth0Service.management.updateUser(
        {
          id: user_id,
        },
        {
          family_name: updateUserDto.fatherLastName + ' ' + updateUserDto.motherLastName,
          given_name: updateUserDto.name,
          connection: this.auth0Service.connection,
          blocked: IS_BLOCKED(updateUserDto.status),
          user_metadata: {
            status: updateUserDto.status,
            userRole: updateUserDto.role,
            dni: updateUserDto.dni,
          },
        },
      );
    } catch (error) {
      this.logger.error({ message: 'Error al actualizar usuario en Auth0', info: error });
      throw new InternalServerErrorException('Sucedio un error al actualizar el usuario en Auth0');
    }

    this.logger.log({ message: `Se actualizo exitosamente el usuario`, updateUserDto });
    return {
      message: MSG_OK,
      info: 'Usuario Actualizado Correctamente',
    };
  }

  async remove({ username }: DeleteUserDto) {
    this.logger.log(`Elimando usuario ${username}`);
    try {
      const [{ user_id }] = await this.auth0Service.management.getUsersByEmail(username);
      await this.auth0Service.management.deleteUser({ id: user_id });
      await this.userRepository.delete({ username });
    } catch (error) {
      this.logger.error({ message: `Sucedio un error al eliminar al usuario`, info: error });
      throw new InternalServerErrorException('Sucedio un error al eliminar al usuario');
    }

    this.logger.log({ message: 'Se elimino exitosamente al usuario ', username });
    return {
      message: MSG_OK,
      info: 'Usuario Eliminado Correctamente',
    };
  }

  async getUserById(userId: number) {
    this.logger.log(`Buscando usuario con id ${userId}`);
    try {
      return await this.userRepository.findOneOrFail({
        where: { id: userId },
      });
    } catch (error) {
      this.logger.error({
        message: `Sucedio un error al buscar el usuario con id ${userId}`,
        error,
      });
      throw new InternalServerErrorException('Sucedio un error al buscar el usuario');
    }
  }

  async savePhotoUser(file: Express.Multer.File, { username, id }: User) {
    this.logger.log(`Registrando el avatar del usuario ${username}`);
    try {
      const { Location } = await this.awsS3Service.uploadFile(
        file.buffer,
        fileNamer(file, username),
      );
      await this.userRepository.update({ id }, { photo: Location });
      return { message: MSG_OK, info: 'Se subio exitosamente la foto' };
    } catch (error) {
      this.logger.error({ message: 'Sucedio un error al subir foto del usuario', info: error });
      throw new InternalServerErrorException('Sucedio un error al subir su foto');
    }
  }
}
