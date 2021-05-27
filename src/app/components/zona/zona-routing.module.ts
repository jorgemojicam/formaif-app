import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionZonaComponent } from './gestion-zona/gestion-zona.component';
import { HomeZonaComponent } from './home-zona/home-zona.component';
import { MapaComponent } from './mapa/mapa.component';
import { SolicitudFormComponent } from './solicitud-form/solicitud-form.component';

import { ZonaComponent } from './zona.component';

const routes: Routes = [
  {
    path: '',
    component: ZonaComponent,
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
        component: HomeZonaComponent,
        data: {
          routerName: 'home'
        }
      },
      {
        path: 'solicitud',
        component: SolicitudFormComponent,
        data: {
          routerName: 'solicitud'
        }
      },
      {
        path: 'gestion',
        component: GestionZonaComponent,
        data: {
          routerName: 'gestion'
        }
      },
      {
        path: 'mapa',
        component: MapaComponent,
        data: {
          routerName: 'mapa'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZonaRoutingModule { }
