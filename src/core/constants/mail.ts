import { URL_WEB, LOGO_APP } from './notification';

export function MAIL_CREATE_USER(username: string, password: string) {
  return `<img src=${LOGO_APP}></img>
        <p>Estimado usuario se creado el nuevo usuario, en la app SkyKrono : ${username}
        \nSu contraseña es: <b> ${password}</b>
        \nPara más detalle comunicarse con el area respectiva</p> 
        <br />Puede logearse en el portal web : ${URL_WEB}`;
}

export function MAIL_RESET_USER(username: string, ticket: string) {
  return `<img src=${LOGO_APP}></img>
      <p>Estimado usuario se ha reseteado la contraseña de su usuario ${username}</p>
      <p>\nEl enlace para cambiar de contraseña es el siguiente: 
      <p><b> ${ticket} </b></p> 
      \nPara más detalle comunicarse con el area respectiva</p>
      <br />Puede logearse en el portal web : ${URL_WEB}`;
}
