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
import { ModalInfomapComponent } from './modal-infomap/modal-infomap.component';
import { AdjuntosComponent } from './adjunto/adjuntos/adjuntos.component';

@NgModule({
  declarations: [
    SolicitudFormComponent,
    GestionZonaComponent, 
    MapaComponent,
    RegistroFormComponent, 
    AdjuntosComponent,
    ModalInfomapComponent
  ],
  imports: [
    CommonModule,
    ZonaRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  entryComponents: [
    ModalInfomapComponent
  ],
})
export class ZonaModule { }
