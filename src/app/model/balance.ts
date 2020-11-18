export class Balance {
    Inventario: {
        tipo: number;
        cantidad: number;
        descripcion: string;
        valor: number;    
    }[];
    totalInventario:number;
    ActivosFamilia:{
        tipo:number;
        detalle:string;
        valor:number;
    }[];
    totalActivosFamilia:number;
}