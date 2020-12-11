import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UbicacionRoutingModule } from './ubicacion-routing.module';
import { UbicacionComponent } from './ubicacion.component';


@NgModule({
  declarations: [UbicacionComponent],
  imports: [
    CommonModule,
    UbicacionRoutingModule
  ]
})
export class UbicacionModule { }
