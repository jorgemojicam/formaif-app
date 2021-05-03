import { Respuestas } from "./respuestas";
import { Resultado } from "./resultado";

export class Pregunta {
    Id:number;
    Titulo:string;
    Peso:number;
    Multiple:boolean;
    Respuestas:Respuestas[];
    Resultado:Resultado;
    total:number;  
}