import { Balance } from './balance';
import { Cruces } from './cruces';
import { Gastos } from './gastos';

export class Solicitud {
    solicitud: number;
    cedula: number;
    asesor: number;
    fechacreacion: Date;
    Balance: Balance;
    Cruces: Cruces[];
    Gastos: Gastos;
}
