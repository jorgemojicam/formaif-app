import { Egresos } from "./egresos";

export class LotePecuario {
    cantidadxanimal: number;
    cantproducida: number;
    egresos: Egresos[];
    frecuencia: {
        id: number;
        name: string;
        dias: number;
        cant: number;
    };
    ingresomes: string;
    mesingreso: number;
    numanimales: number;
    perdida: number;    
    prodderivado: string;
    totalEgresos: string;
    produccion: string;
    noproduccion: string;
    unitotalesventa: string;

}