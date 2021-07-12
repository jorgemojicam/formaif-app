import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from "../../material.module";
import { AgilRoutingModule } from './agil-routing.module';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AgilRoutingModule,
    MaterialModule,
    FlexLayoutModule    
  ]
})
export class AgilModule { }
