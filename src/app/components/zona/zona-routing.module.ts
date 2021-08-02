import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionZonaComponent } from './solicitud/gestion-zona/gestion-zona.component';
import { GoogleMapComponent } from './solicitud/google-map/google-map.component';
import { NivelListComponent } from './nivel/nivel-list/nivel-list.component';
import { ZonaComponent } from './zona.component';
import { SolitudesComponent } from './solicitud/solitudes/solitudes.component';
import { ResponsablesComponent } from './responsable/responsables/responsables.component';
import { FlujoListComponent } from './flujo/flujo-list/flujo-list.component';
import { TiposComponent } from './tipo/tipos/tipos.component';

const routes: Routes = [
  {
    path: '',
    component: ZonaComponent,
    children: [
      {
        path: '',
        redirectTo: 'solicitudes',
        pathMatch: 'prefix',
        data: {
          routerName: 'solicitudes'
        }
      },
      {
        path: 'solicitudes',
        component: SolitudesComponent,
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
        path: 'nivel',
        component: NivelListComponent,
        data: {
          routerName: 'nivel'
        }
      },
      {
        path: 'mapa',
        component: GoogleMapComponent,
        data: {
          routerName: 'mapa'
        }
      },
      {
        path: 'responsables',
        component: ResponsablesComponent,
        data: {
          routerName: 'responsables'
        }
      },
      {
        path: 'flujo',
        component: FlujoListComponent,
        data: {
          routerName: 'flujo'
        }
      },
      {
        path: 'tipo',
        component: TiposComponent,
        data: {
          routerName: 'tipo'
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
