import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZonaRoutingModule } from './zona-routing.module';
import { SolicitudFormComponent } from './solicitud-form/solicitud-form.component';
import { MaterialModule } from 'src/app/material.module';
import { GestionZonaComponent } from './gestion-zona/gestion-zona.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapaComponent } from './mapa/mapa.component';
import { RegistroFormComponent } from './registro-form/registro-form.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [SolicitudFormComponent, GestionZonaComponent, MapaComponent, RegistroFormComponent],
  imports: [
    CommonModule,
    ZonaRoutingModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    FlexLayoutModule
    
  ]
})
export class ZonaModule { }
