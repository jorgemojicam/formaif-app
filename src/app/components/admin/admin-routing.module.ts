import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
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
          import('../cruces/ventas/ventas.module').then(m => m.VentasModule)
      }      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
