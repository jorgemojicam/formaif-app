import { ActivosFamilia } from './activosfamilia';
import { ActivosNegocio } from './activosnegocio';
import { Inventario } from './inventario';
import { Pasivos } from './pasivos';

export class Balance {
    Inventario: Inventario[];
    totalInventario:number;
    ActivosFamilia:ActivosFamilia[];
    totalActivosFamilia:number;
    ActivosNegocio:ActivosNegocio[];
    totalActivosNegocio:number;
    Pasivos:Pasivos[];
    
}