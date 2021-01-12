import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalisisComponent } from '../analisis/analisis.component';
import { AnalisisagroComponent } from '../analisisagro/analisisagro.component';
import { FlujocajaComponent } from '../flujocaja/flujocaja.component';
import { PropuestaComponent } from '../propuesta/propuesta.component';
import { UbicacionComponent } from '../ubicacion/ubicacion.component';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../balance/balance.module').then(m => m.BalanceModule)
      },
      {
        path: 'ubicacion',
        component: UbicacionComponent,
      },
      {
        path: 'balance',
        loadChildren: () =>
          import('../balance/balance.module').then(m => m.BalanceModule)
      },
      {
        path: 'gastos',
        loadChildren: () =>
          import('../gastos/gastos.module').then(m => m.GastosModule)
      },
      {
        path: 'ventas',
        loadChildren: () =>
          import('../cruces/cruces.module').then(m => m.CrucesModule)
      },
      {
        path: 'analisis',
       component:AnalisisComponent
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
