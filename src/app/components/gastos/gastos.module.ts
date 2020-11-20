import { NgModule } from '@angular/core';
import { CommonModule,CurrencyPipe } from '@angular/common';


import { GastosRoutingModule } from './gastos-routing.module';
import { GastosComponent } from './gastos.component';
import { RemuneracionComponent } from './remuneracion/remuneracion.component';
import { GastosNegocioComponent } from './gastos-negocio/gastos-negocio.component';
import { GastosFamiliaComponent } from './gastos-familia/gastos-familia.component';
import { OtrosIngresosFamComponent } from './otros-ingresos-fam/otros-ingresos-fam.component';
import { MaterialModule } from 'src/app/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [GastosComponent,
    RemuneracionComponent,
    GastosNegocioComponent,
    GastosFamiliaComponent,
    OtrosIngresosFamComponent
  ],
  imports: [
    CommonModule,
    GastosRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  providers:[
    CurrencyPipe
  ]

})
export class GastosModule { }
