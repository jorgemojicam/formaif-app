import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalisisComponent } from '../analisis/analisis.component';
import { AnalisisagroComponent } from '../analisisagro/analisisagro.component';
import { FlujocajaComponent } from '../flujocaja/flujocaja.component';
import { PropuestaComponent } from '../propuesta/propuesta.component';
import { ResultadoComponent } from '../resultado/resultado.component';
import { UbicacionComponent } from '../ubicacion/ubicacion.component';
import { AdminComponent } from './admin.component';
import { HomeComponent } from './home/home.component';
import { LobbyComponent } from './lobby/lobby.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,    
    children: [
      {
        path: '',
        component: LobbyComponent,
        data:{
          routerName:'lobby'
        }
      },
      {
        path: 'ubicacion',
        component: UbicacionComponent,
      },
      {
        path: 'balance',
        data:{
          routerName:'balance'
        },
        loadChildren: () =>
          import('../balance/balance.module').then(m => m.BalanceModule)
      },
      {
        path: 'gastos',
        loadChildren: () =>
          import('../gastos/gastos.module').then(m => m.GastosModule),
          data:{
            routerName:'gastos'
          }
      },
      {
        path: 'ventas',
        loadChildren: () =>
          import('../cruces/cruces.module').then(m => m.CrucesModule),
          
      },
      {
        path: 'analisis',
        component: AnalisisComponent
      },
      {
        path: 'propuesta',
        component: PropuestaComponent,
      },
      {
        path: 'flujocaja',
        component: FlujocajaComponent,
      },
      {
        path: 'analisisagro',
        component: AnalisisagroComponent,
      },
      {
        path: 'resultado',
        component: ResultadoComponent,
        
      },
      {
        path: 'lobby',
        component: LobbyComponent,
        data:{
          routerName:'lobby'
        }
      },
      {
        path: 'home',
        component: HomeComponent,
        data:{
          routerName:'home'
        }
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
