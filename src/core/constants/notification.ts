import dotenv from 'dotenv';
dotenv.config();

export const LOGO_APP = process.env.LOGO_APP;

export const LOGO_ICON = process.env.LOGO_ICON;

export const URL_WEB = process.env.URL_WEB;

export const NOTIFICATION_REMEMBER_ATTEDANCE = {
  notification: {
    title: 'Recuerde marcar asistencia',
    icon: LOGO_ICON,
    data: {
      url: URL_WEB,
    },
    body: 'Hagalo desde Sky Krono',
    vibrate: [1000, 1000, 1000],
    image: LOGO_APP,
    actions: [
      {
        action: 'Explorar',
        title: 'Visitar',
      },
    ],
  },
};

export const NOTIFICATION_NEW_TASK = {
  notification: {
    title: 'Se creo una nueva tarea para usted',
    icon: LOGO_ICON,
    data: {
      url: URL_WEB,
    },
    body: 'Revise sus calendario de tareas',
    vibrate: [1000, 1000, 1000],
    image: LOGO_APP,
    actions: [
      {
        action: 'Explorar',
        title: 'Visitar',
      },
    ],
  },
};

export const NOTIFICATION_UPDATE_TASK = {
  notification: {
    title: 'Se actualizo una tarea asignada a usted',
    icon: LOGO_ICON,
    data: {
      url: URL_WEB,
    },
    body: 'Revise sus calendario de tareas',
    vibrate: [1000, 1000, 1000],
    image: LOGO_APP,
    actions: [
      {
        action: 'Explorar',
        title: 'Visitar',
      },
    ],
  },
};

export const NOTIFICATION_DELETE_TASK = {
  notification: {
    title: 'Se eliminado una tarea asignada a usted',
    icon: LOGO_ICON,
    data: {
      url: URL_WEB,
    },
    body: 'Revise sus calendario de tareas',
    vibrate: [1000, 1000, 1000],
    image: LOGO_APP,
    actions: [
      {
        action: 'Explorar',
        title: 'Visitar',
      },
    ],
  },
};
