export class Propuesta {
    montorecomendado: string;
    plazo: number;
    destino: string;
    detalle: string;
    valor: string;
    detallecapital: string;
    valorcapital: number;
    tipocuota: number;
    formapgo: {
        id: number;
        name: string;
        period: number;
    };
    valorcouta: string;
    numerocuotas: string;
    irregular: {
        fechacuota: Date;
        valorcuota: string;
    }[];
}