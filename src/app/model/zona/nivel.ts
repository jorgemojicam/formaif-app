import { Rol } from "../rol";
import { Flujo } from "./flujo";

export class Nivel {

    Id: number;
    Nombre:string;
    Rol:Rol;
    Orden:number;
    Flujo:Flujo    
    Editable:boolean;
}