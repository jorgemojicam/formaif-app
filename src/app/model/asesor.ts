import { Sucursal } from "./sucursal";

export class Asesor {
  Nombre: string;
  Iniciales: string;
  Grupo: string;
  Clave: string;
  Correo:string;
  Sucursales: Sucursal;
  Director: Asesor;
  Rol: {
    Id: string
    Nombre: string
    Permiso: {
      Id: number
      Nombre: string
    }
  }

}