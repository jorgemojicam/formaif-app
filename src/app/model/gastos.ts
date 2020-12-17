import { Estacionales } from './estacionales';
import { OtrosIngresos } from './otrosingresosfamilia';
import { Remuneracion } from './remuneracion';

export class Gastos {
    remuneracionRow: Remuneracion[];   
    totalRemuneracion: number;
    arriendoF: number;
    alimentacionF: number;
    educacionF: number;
    vestuarioF: number;
    saludF: number;
    transporteF: number;
    serviciosF: number;
    entretenimientoF: number;
    otrosF: number;
    totalF: number;
    alquilerN: number;
    serviciosN: number;
    transporteN: number;
    fletesN: number;
    impuestosN: number;
    mantenimientoN: number;
    imprevistosN: number;
    otrosN: number;
    totalN: number;
    otrosIngresosRow: OtrosIngresos[];
    totalOtros: number;
    estacionalesN: Estacionales[];
    totalEstacionalesN: number;
    estacionalesF: Estacionales[];
    totalEstacionalesF: number;
}