import { Produccion } from './produccion';

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
    produccion:Produccion[];
}
