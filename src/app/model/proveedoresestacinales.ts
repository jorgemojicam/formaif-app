export class ProveedoresEstacionales{
    nombre:string;
    numcuotas:number;
    total:number;
    cuotas:[
        {
            mes:Date;
            valor:number;
        }
    ]
}