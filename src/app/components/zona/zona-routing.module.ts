import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
      }          
    ]
  },   
  {
    path: 'home',
    loadChildren: () => import('../lobby/lobby.module').then(m => m.LobbyModule),
    data: {
      routerName: 'lobby'
    }
  }   
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZonaRoutingModule { }
