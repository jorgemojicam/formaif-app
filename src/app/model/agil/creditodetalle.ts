export class CreditoDetalle{
    numcuota:number;
    frecuencia:{
        id:number;
        name:string;
    };
    proyeccion:number;
    total:number;
    cuotas:{
        valor:number;
        fecha:Date;
    }[]
}