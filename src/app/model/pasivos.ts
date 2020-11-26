export class Pasivos {
    tipo: number;
    cantidad: number;
    descripcion: string;
    valor: number;
    cuotas: [
        {
            valor: number;
            fecha: Date;
        }
    ]
}