import { Respuestas } from "./respuestas";
import { Temas } from "./temas";

export class Pregunta {
    Id:number;
    Titulo:string;
    Peso:number;
    Multiple:boolean;
    Respuestas:Respuestas[];
    total:number;
    resultado: {
        texto: string;
        puntaje: number
    };
}