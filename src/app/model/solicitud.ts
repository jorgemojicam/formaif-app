import { Balance } from './balance';

export class Solicitud {
    solicitud: number;
    cedula: number;
    asesor: number;
    fechacreacion: Date;
    Balance: Balance;    
    Cruces: {}[];
    Gastos: {};    
}
