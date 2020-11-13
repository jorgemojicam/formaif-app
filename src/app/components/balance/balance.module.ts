import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BalanceRoutingModule } from './balance-routing.module';
import { BalanceComponent } from './balance.component';
import { InventarioComponent } from './inventario/inventario.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ActivosNegocioComponent } from './activos-negocio/activos-negocio.component';

@NgModule({
  declarations: [BalanceComponent,InventarioComponent, ActivosNegocioComponent],
  imports: [
    CommonModule,
    BalanceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule
  ]
})
export class BalanceModule { }
