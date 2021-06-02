import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LobbyComponent } from '../lobby/lobby.component';
import { GestionZonaComponent } from './gestion-zona/gestion-zona.component';
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
        redirectTo: 'solicitud',
        pathMatch: 'prefix',
        data: {
          routerName: 'solicitud'
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
      },      
      {
        path: 'home',
        component: LobbyComponent,
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
