import { Estado } from "./estado";
import { Nivel } from "./nivel";
import { SolicitudZona } from "./solicitudzona";

export class Seguimiento {
    Id:number;
    Solicitud:SolicitudZona;
    Estado:Estado;
    Nivel:Nivel;
}