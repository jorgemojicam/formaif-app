import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZonaRoutingModule } from './zona-routing.module';
import { MaterialModule } from 'src/app/material.module';
import { GestionZonaComponent } from './solicitud/gestion-zona/gestion-zona.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapaComponent } from './solicitud/mapa/mapa.component';
import { RegistroFormComponent } from './solicitud/registro-form/registro-form.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ModalInfomapComponent } from './solicitud/modal-infomap/modal-infomap.component';
import { AdjuntosComponent } from './solicitud/adjunto/adjuntos/adjuntos.component';
import { GestionLimiteComponent } from './solicitud/limite/gestion-limite/gestion-limite.component';
import { LimiteOficinaComponent } from './solicitud/limite/limite-oficina/limite-oficina.component';
import { LimiteMunicipioComponent } from './solicitud/limite/limite-municipio/limite-municipio.component';
import { SolitudesComponent } from './solicitud/solitudes/solitudes.component';
import { ResponsablesComponent } from './responsable/responsables/responsables.component';

import { CarteraInicialComponent } from './solicitud/cartera/cartera-inicial/cartera-inicial.component';
import { TiposComponent } from './tipo/tipos/tipos.component';
@NgModule({
  declarations: [
    GestionZonaComponent, 
    MapaComponent,
    RegistroFormComponent, 
    AdjuntosComponent,
    ModalInfomapComponent,
    GestionLimiteComponent,
    LimiteOficinaComponent,
    LimiteMunicipioComponent,
    SolitudesComponent,
    ResponsablesComponent,
    CarteraInicialComponent,
    TiposComponent,
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
