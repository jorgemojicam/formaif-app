export class Pasivos {
    tipo: {
        id: number;
        name: string;
        template: string;
    };
    clase: {
        id: number,
        name: string;
    };
    negociovivienda: string;
    acreedor: string;
    monto: string;
    plazo: string;
    saldo: string;
    destino: string;
    cuota: string;
    valor: string;
    periodo: string;
    cuotacalcu: string;
    tasa: string;
    pago: string;
    calculoint: string;
    periodoint: string;
    fechaproxint: string;
    calculocap: string;
    periodocap: string;
    fechaproxcap: string;
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