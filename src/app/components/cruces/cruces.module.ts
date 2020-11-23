import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrucesRoutingModule } from './cruces-routing.module';
import { CrucesComponent } from './cruces.component';
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from 'src/app/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { VentasHisComponent } from './ventas-his/ventas-his.component';
import { ProduccionComponent } from './produccion/produccion.component';


@NgModule({
  declarations: [CrucesComponent, VentasHisComponent, ProduccionComponent],
  imports: [
    CommonModule,
    CrucesRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule
  ]
})
export class CrucesModule { }
