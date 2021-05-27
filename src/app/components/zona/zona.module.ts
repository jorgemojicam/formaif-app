import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZonaRoutingModule } from './zona-routing.module';
import { SolicitudFormComponent } from './solicitud-form/solicitud-form.component';
import { HomeZonaComponent } from './home-zona/home-zona.component';
import { MaterialModule } from 'src/app/material.module';
import { GestionZonaComponent } from './gestion-zona/gestion-zona.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapaComponent } from './mapa/mapa.component';

@NgModule({
  declarations: [SolicitudFormComponent, HomeZonaComponent, GestionZonaComponent, MapaComponent],
  imports: [
    CommonModule,
    ZonaRoutingModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule
    
  ]
})
export class ZonaModule { }
