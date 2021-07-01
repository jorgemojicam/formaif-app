export class Compras {
    descripcion: string;
    cantidad: number;
    valor: number;
    frecuencia: {
      id: number,
      name: string,
      dias: number,
      cant: number
    };
    total: number;
  }