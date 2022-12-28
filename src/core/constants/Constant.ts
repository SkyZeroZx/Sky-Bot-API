import * as dotenv from 'dotenv';
dotenv.config();

export const JWT_TOKEN = 'JWT_TOKEN';
export const DATABASE_HOST = 'DATABASE_HOST';
export const DATABASE_PORT = 'DATABASE_PORT';
export const DATABASE_USERNAME = 'DATABASE_USERNAME';
export const DATABASE_PASSWORD = 'DATABASE_PASSWORD';
export const DATABASE_NAME = 'DATABASE_NAME';
export const ENABLED_MYSQL_CACHE = 'ENABLED_MYSQL_CACHE';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class Constants {
  static readonly MSG_OK = 'OK';
  static readonly STATUS_USER = {
    CREATE: 'CREATE',
    ENABLED: 'ENABLED',
    RESET: 'RESET',
    BLOCKED: 'BLOCKED',
  };

  static IS_BLOCKED(status: string): boolean {
    return status === this.STATUS_USER.BLOCKED;
  }

  static readonly LOGO_APP = process.env.LOGO_APP;

  static readonly LOGO_ICON = process.env.LOGO_ICON;

  static readonly URL_WEB = process.env.URL_WEB;

  // TODO : ADD LINK OF WEB FRONTEND FOR LOGIN
  static MAIL_CREATE_USER(username: string, password: string) {
    return `<img src=${Constants.LOGO_APP}></img>
      <p>Estimado usuario se creado el nuevo usuario, en la app SkyKrono : ${username}
      \nSu contraseña es: <b> ${password}</b>
      \nPara más detalle comunicarse con el area respectiva</p>`;
  }

  static MAIL_RESET_USER(username: string, ticket: string) {
    return `<img src=${Constants.LOGO_APP}></img>
    <p>Estimado usuario se ha reseteado la contraseña de su usuario ${username}</p>
    <p>\nEl enlace para cambiar de contraseña es el siguiente: 
    <p><b> ${ticket} </b></p> 
    \nPara más detalle comunicarse con el area respectiva</p>`;
  }

  static readonly NOTIFICATION_REMEMBER_ATTEDANCE = {
    notification: {
      title: 'Recuerde marcar asistencia',
      icon: Constants.LOGO_ICON,
      data: {
        url: Constants.URL_WEB,
      },
      body: 'Hagalo desde Sky Krono',
      vibrate: [1000, 1000, 1000],
      image: Constants.LOGO_APP,
      actions: [
        {
          action: 'Explorar',
          title: 'Visitar',
        },
      ],
    },
  };

  static readonly NOTIFICATION_NEW_TASK = {
    notification: {
      title: 'Se creo una nueva tarea para usted',
      icon: Constants.LOGO_ICON,
      data: {
        url: Constants.URL_WEB,
      },
      body: 'Revise sus calendario de tareas',
      vibrate: [1000, 1000, 1000],
      image: Constants.LOGO_APP,
      actions: [
        {
          action: 'Explorar',
          title: 'Visitar',
        },
      ],
    },
  };

  static readonly NOTIFICATION_UPDATE_TASK = {
    notification: {
      title: 'Se actualizo una tarea asignada a usted',
      icon: Constants.LOGO_ICON,
      data: {
        url: Constants.URL_WEB,
      },
      body: 'Revise sus calendario de tareas',
      vibrate: [1000, 1000, 1000],
      image: Constants.LOGO_APP,
      actions: [
        {
          action: 'Explorar',
          title: 'Visitar',
        },
      ],
    },
  };

  static readonly NOTIFICATION_DELETE_TASK = {
    notification: {
      title: 'Se eliminado una tarea asignada a usted',
      icon: Constants.LOGO_ICON,
      data: {
        url: Constants.URL_WEB,
      },
      body: 'Revise sus calendario de tareas',
      vibrate: [1000, 1000, 1000],
      image: Constants.LOGO_APP,
      actions: [
        {
          action: 'Explorar',
          title: 'Visitar',
        },
      ],
    },
  };
}
