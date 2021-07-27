import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from "../../material.module";
import { AdminRoutingModule } from './admin-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ModulosComponent } from './modulo/modulos/modulos.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ModulosComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule

  ]
})
export class AdminModule { }
