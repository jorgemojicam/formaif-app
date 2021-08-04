import { Asesor } from "../admin/asesor";
import { Sucursal } from "../admin/sucursal";
import { Tipo } from "./tipo";

export class SolicitudZona {

    Id: number;
    Tipo: Tipo;
    Sucursal: Sucursal
    NumeroActual: number;
    NumeroAprobado: number;
    Fecha: Date;
    Usuario: Asesor;
    Estado: {
        Id: number;
        Nombre: string;
    };    

}