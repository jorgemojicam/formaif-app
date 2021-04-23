import { Temas } from "./temas";

export class Pregunta {
    Id:number;
    Titulo:string;
    Peso:number;
    Multiple:boolean;
    Temas:Temas;
    resultado: {
        texto: string;
        puntaje: number
    };
}