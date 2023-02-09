import { LOGO_APP } from "./notification";

 
// TODO : ADD LINK OF WEB FRONTEND FOR LOGIN
export function MAIL_CREATE_USER(username: string, password: string) {
  return `<img src=${LOGO_APP}></img>
        <p>Estimado usuario se creado el nuevo usuario, en la app SkyKrono : ${username}
        \nSu contraseña es: <b> ${password}</b>
        \nPara más detalle comunicarse con el area respectiva</p>`;
}

export function MAIL_RESET_USER(username: string, ticket: string) {
  return `<img src=${LOGO_APP}></img>
      <p>Estimado usuario se ha reseteado la contraseña de su usuario ${username}</p>
      <p>\nEl enlace para cambiar de contraseña es el siguiente: 
      <p><b> ${ticket} </b></p> 
      \nPara más detalle comunicarse con el area respectiva</p>`;
}
