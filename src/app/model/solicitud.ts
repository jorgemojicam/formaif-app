import { Adaptativa } from './adaptativa';
import { Balance } from './balance';
import { Cruces } from './cruces';
import { CrucesAgro } from './crucesagro';
import { Gastos } from './gastos';
import { Propuesta } from './propuesta';
import { Sensibilidad } from './sensibilidad';
import { Ubicacion } from './ubicacion';
import { Verificacion } from './verificacion';

export class Solicitud {
    solicitud: number;
    cedula: number;
    asesor: number;
    oficina:string;
    usuario:string;
    fechacreacion: Date;
    Balance: Balance;
    Cruces: Cruces[];
    CrucesAgro: CrucesAgro[];
    Gastos: Gastos;
    Ubicacion:Ubicacion;
    Propuesta:Propuesta;
    Flujo:any[];
    dimensiones:Adaptativa[];
    verificacion:Verificacion[];
    totalAdaptativa:any;
    Sensibilidad:Sensibilidad[]

}
