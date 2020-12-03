import { LoteAgro } from './loteAgro';
import { NombreActividades } from './nombreactividad';
import { TipoActividad } from './tipoactividad';

export class CrucesAgro {
    nombre:NombreActividades;
    periodoventas:string;
    tipo: TipoActividad;
    tipoproduccion:string;
    diasB: [];
    diasM: [];
    diasR: [];    
    totalB: number;
    totalM: number;
    totalR: number;
    valorB: number;
    valorM: number;
    valorR: number;
    lotesAgro:LoteAgro[];
}
