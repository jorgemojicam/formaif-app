import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeMebaComponent } from './home-meba/home-meba.component';

import { MebaComponent } from './meba.component';
import { SensibilidadComponent } from './sensibilidad/sensibilidad.component';

const routes: Routes = [
  {
    path: '',
    component: MebaComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'prefix',
        data: {
          routerName: 'home'
        }
      },
      {
        path: 'home',
        component: HomeMebaComponent,
        data: {
          routerName: 'home'
        }
      },
      {
        path: 'sensibilidad',
        component: SensibilidadComponent,
        data: {
          routerName: 'sensibilidad'
        }
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MebaRoutingModule { }
