import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrucesRoutingModule } from './cruces-routing.module';
import { CrucesComponent } from './cruces.component';
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from 'src/app/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { RuralComponent } from './rural/rural.component';
import { UrbanoComponent } from './urbano/urbano.component';


@NgModule({
  declarations: [
    CrucesComponent,
    RuralComponent,
    UrbanoComponent
  ],
  imports: [
    CommonModule,
    CrucesRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule
  ]
})
export class CrucesModule { }
