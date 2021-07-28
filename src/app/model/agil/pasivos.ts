export class Pasivos {
    tipo: {
        id: number;
        name: string;
        template: string;
    };
    fechaprox: Date;
    clase: number;
    negociovivienda: boolean;
    valorcomercial:number;
    porcentajeneg: number;
    descuentolibranza: boolean;
    acreedor: string;
    monto: string;
    plazo: number;
    saldo: string;
    destino: string;
    cuota: number;
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
    pago: number;
    calculoint: string;
    periodoint: {
        id: number;
        name: string;
        period: number;
    };
    fechaproxint: Date;
    calculocap: string;
    periodocap: {
        id: number;
        name: string;
        period: number;
    };
    fechaproxcap: Date;
    cuotahipoteca:number
    cuotafam: number
    coutaneg: number
    saldoF: string
    saldoN: string
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
            cuota: number;
            fecha: Date;
        }
    ]
}