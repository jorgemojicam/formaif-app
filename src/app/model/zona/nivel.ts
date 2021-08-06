import { Rol } from "../admin/rol";
import { Flujo } from "./flujo";

export class Nivel {

    Id: number;
    Nombre:string;
    Rol:Rol;
    Orden:number;
    Flujo:Flujo    
    Editable:boolean;
    DiasNotificacion:number;
    DiasANS:number;
}