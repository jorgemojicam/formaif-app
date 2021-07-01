export class Egresos {
    descripcion: string;
    detalle: string;
    cantidad: number;
    valorunitario: number;
    total: number;
    mes: { id: number; name: string }[];
}