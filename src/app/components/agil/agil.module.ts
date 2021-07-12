import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from "../../material.module";
import { AgilRoutingModule } from './agil-routing.module';
import { ActivosComponent } from './activos/activos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ActivosComponent],
  imports: [
    CommonModule,
    AgilRoutingModule,
    MaterialModule,
    FlexLayoutModule   ,
    ReactiveFormsModule,
    FormsModule, 
  ]
})
export class AgilModule { }
