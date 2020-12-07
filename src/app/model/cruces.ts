import { Produccion } from './produccion';
import { VentasHis } from './ventas-historicas';

export class Cruces {
    nombre:string;
    periodoventas:string;
    tipo: number;
    diasB: [];
    diasM: [];
    diasR: [];    
    totalB: number;
    totalM: number;
    totalR: number;
    valorB: number;
    valorM: number;
    valorR: number;
    ventasHis:VentasHis[]
    produccion:Produccion[];
}
