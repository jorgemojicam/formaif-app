import { Egresos } from "./egresos";

export class LotePecuario {
    cantidadxanimal: number;
    cantproducida: number;
    egresos: Egresos[];
    frecuencia: {
        cant: number;
        dias: number;
        id: number;
        name: string;
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