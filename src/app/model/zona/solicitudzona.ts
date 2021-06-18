import { Asesor } from "../asesor";
import { Sucursal } from "../sucursal";
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
    Flujo: {
        Id: number;
    }

}