import { Compras } from './compras';
import { CostoVenta } from './costoventa';
import { MateriaPrima } from './materiaprima';
import { Produccion } from './produccion';
import { VentasHis } from './ventas-historicas';

export class Cruces {
    nombre: string;
    periodoventas: string;
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
    promedio: number;
    totalDias: number;
    totalVentas:string;
    totalPromedio: number;
    totalCruce1:string;
    ventasHis: VentasHis[];
    promtotalvenHis:number;  
    totalVentasHis:number;
    periodohistoricas: {
        id: number,
        name: string,
        dias: number,
        cant: number
    }
    produccion: Produccion[];
    totalProduccion:number;
    totalCruce2:string;
    materiaprima:MateriaPrima[];
    compras:Compras[];
    totalCompras:number;
    costoventa:CostoVenta[];
    margen:number;
    costo:number;
}
