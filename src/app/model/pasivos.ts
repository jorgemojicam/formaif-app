export class Pasivos {
    tipo: {
        id: number;
        name: string;
        template: string;
    };
    clase: number;
    negociovivienda: boolean;
    porcentajeneg: number;
    descuentolibranza: boolean;
    acreedor: string;
    monto: string;
    plazo: string;
    saldo: string;
    destino: string;
    cuota: string;
    valor: string;
    periodo: {
        id: number;
        name: string;
        period: number;
    };
    cuotadifiere: {
        id: number;
        name: string;
        period:number;
    }
    cuotacalcu: string;
    tasa: string;
    pago: string;
    calculoint: string;
    periodoint: string;
    fechaproxint: string;
    calculocap: string;
    periodocap: string;
    fechaproxcap: string;
    montoF: string;
    montoN: string;
    cuotaN: string;
    cuotaF: string;
    proyeccion: string;
    corrienteF: string;
    nocorrienteF: string;
    corrienteN: string;
    nocorrienteN: string;
    numcoutaneto: string;
    cuotasRow: [
        {
            valor: number;
            fecha: Date;
        }
    ]
}