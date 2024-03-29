import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from "../../material.module";
import { AgilRoutingModule } from './agil-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
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
