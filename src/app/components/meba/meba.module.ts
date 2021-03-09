import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MebaRoutingModule } from './meba-routing.module';
import { SensibilidadComponent } from './sensibilidad/sensibilidad.component';
import { MaterialModule } from "./../../material.module";
import { HomeMebaComponent } from './home-meba/home-meba.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AdaptativaComponent } from './adaptativa/adaptativa.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { VerificacionComponent } from './verificacion/verificacion.component';

export function chartModule(): any {
  return import('echarts');
}


@NgModule({
  declarations: [SensibilidadComponent, HomeMebaComponent, AdaptativaComponent, VerificacionComponent],
  imports: [
    CommonModule,
    MebaRoutingModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxEchartsModule.forRoot({
      echarts: chartModule,
    }),
  ] 
})
export class MebaModule { }
