import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from "@angular/common";

import { BalanceRoutingModule } from './balance-routing.module';
import { BalanceComponent } from './balance.component';
import { InventarioComponent } from './inventario/inventario.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PasivosComponent } from './pasivos/pasivos.component';

@NgModule({
  declarations: [
    BalanceComponent,
    InventarioComponent,
    PasivosComponent
  ],
  imports: [
    CommonModule,
    BalanceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [CurrencyPipe]
})
export class BalanceModule { }
