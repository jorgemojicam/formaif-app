import { Asesor } from "../admin/asesor";
import { Barrio } from "../admin/barrio";
import { Departamento } from "../admin/departamento";
import { Municipio } from "../admin/municipio";

export class Cartera {
    Id: number;
    Estrato: number;
    Barrio: Barrio;
    Municipio: Municipio;
    Departamento: Departamento;
    Asesor: Asesor
    Localizacion: string;
    ValorCartera: number;
    NuevoClietes: number;
    FechaCargue: Date;
}