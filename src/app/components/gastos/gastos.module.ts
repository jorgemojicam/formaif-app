import { NgModule } from '@angular/core';
import { CommonModule,CurrencyPipe } from '@angular/common';


import { GastosRoutingModule } from './gastos-routing.module';
import { GastosComponent } from './gastos.component';
import { MaterialModule } from 'src/app/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [GastosComponent
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
