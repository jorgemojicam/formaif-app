import { Asesor } from "../asesor";
import { Sucursal } from "../sucursal";

export class SolicitudZona {

    Id: number;
    Tipo: {
        Id: number;
        Nombre: string;
        Iniciales: string;
    }
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