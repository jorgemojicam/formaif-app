import { ActivosFamilia } from './activosfamilia';
import { ActivosNegocio } from './activosnegocio';
import { Creditos } from './creditos';
import { Inventario } from './inventario';
import { Inversiones } from './inversiones';
import { Pasivos } from './pasivos';

export class Balance {
    efectivo: string;
    clienteCobrar: string;
    observacionesCobrar: string;
    valorCobrar: string;
    incobrableCobrar: string;
    recuperacionCobrar: string;
    cobrarTotal: string;
    porcentajeCobrar: number;
    inventarioRow: Inventario[];
    inventarioTotal: number;
    activosFamRows: ActivosFamilia[];
    actfamTotal: number;
    actividadNegRows: ActivosNegocio[];
    actnegTotal: number;
    inversiones: Inversiones[];
    creditos: Creditos[];
    totalCreditos: string;
    pasivosRows: Pasivos[];
    tcuotaf: string;
    tcorrientef: string;
    tnocorrientef: string;
    tcuotan: string;
    tcorrienten: string;
    tnocorrienten: string;
}