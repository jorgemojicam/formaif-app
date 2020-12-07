import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalisisRoutingModule } from './analisis-routing.module';
import { AnalisisComponent } from './analisis.component';


@NgModule({
  declarations: [AnalisisComponent],
  imports: [
    CommonModule,
    AnalisisRoutingModule
  ]
})
export class AnalisisModule { }
