import { Egresos } from './egresos';

export class LoteAgro {
    nombre: string;
    areacult: string;
    aplicadiastancia: string;
    aplicaplantasinformacli: string;
    dplantas: number;
    dsurcos: number;
    diastancia: string;
    planatasinformacli: string;
    numplantas: string;
    unidadventa: string;
    fechafinal:Date;
    edadcult: string;
    periodoedad: string;
    rendiemientolote: string;
    unidadestotales: string;
    perdida: string;   
    totalIngreso: string;
    proxcocecha:string;
    cantmesescocecha:string;
    cantmesesnoproduccion:string;
    rendimientoCos: string;
    unidadesCos: string;
    perdidaCos: string;
    procentageCos: string;
    totalCos: string;
    rendimientoTra: string;
    unidadesTra: number;
    perdidaTra: number;
    procentageTra: number;
    totalTra: number;
    rendimientoPepeo: number;
    unidadesPepeo: number;
    perdidaPepeo: number;
    procentagePepeo: number;
    totalPepeo: number;
    totalUnidades: number;
    totalLoteAunual: number;
    egresosAdecuacion: Egresos[];
    totalEgresosAdecuacion: number;
    egresosSiembra: Egresos[];
    totalEgresosSiembre: number;
    egresosMante: Egresos[];
    totalEgresosMante: number;
    egresosCocecha: Egresos[];
    totalEgresosCosecha: number;
    totalEgresos:number;
}