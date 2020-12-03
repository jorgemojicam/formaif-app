import { Balance } from './balance';
import { Cruces } from './cruces';
import { CrucesAgro } from './crucesagro';
import { Gastos } from './gastos';

export class Solicitud {
    solicitud: number;
    cedula: number;
    asesor: number;
    fechacreacion: Date;
    Balance: Balance;
    Cruces: Cruces[];
    CrucesAgro: CrucesAgro[];
    Gastos: Gastos;
}
