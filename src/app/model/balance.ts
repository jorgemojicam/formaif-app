import { ActivosFamilia } from './activosfamilia';
import { ActivosNegocio } from './activosnegocio';
import { Inventario } from './inventario';
import { Pasivos } from './pasivos';

export class Balance {
    efectivo: string;
    clienteCobrar: string;
    observacionesCobrar: string;
    valorCobrar: string;
    incobrableCobrar: string;
    recuperacionCobrar: string;
    cobrarTotal: string;
    inventarioRow: Inventario[];
    inventarioTotal: number;
    ActivosFamilia: ActivosFamilia[];
    totalActivosFamilia: number;
    ActivosNegocio: ActivosNegocio[];
    totalActivosNegocio: number;
    Pasivos: Pasivos[];
}