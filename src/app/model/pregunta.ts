import { Respuestas } from "./respuestas";
import { Temas } from "./temas";

export class Pregunta {
    Id:number;
    Titulo:string;
    Peso:number;
    Multiple:boolean;
    Respuestas:Respuestas[];
    resultado: {
        texto: string;
        puntaje: number
    };
}