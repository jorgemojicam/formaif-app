import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MebaRoutingModule } from './meba-routing.module';
import { SensibilidadComponent } from './sensibilidad/sensibilidad.component';
import { MaterialModule } from "./../../material.module";
import { HomeMebaComponent } from './home-meba/home-meba.component';


@NgModule({
  declarations: [SensibilidadComponent, HomeMebaComponent],
  imports: [
    CommonModule,
    MebaRoutingModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class MebaModule { }
