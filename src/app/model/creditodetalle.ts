export class CreditoDetalle{
    numcuota:number;
    frecuencia:{
        id:number;
        name:string;
    };
    total:number;
    cuotas:{
        valor:number;
        fecha:Date;
    }[]
}