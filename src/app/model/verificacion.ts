import { Pregunta } from "./pregunta"

export class Verificacion {
    Id:number;
    Nombre: string;
    aplicapregunta: boolean
    Preguntas: Pregunta[]
    total: number  
    totalAcumulado:number
}