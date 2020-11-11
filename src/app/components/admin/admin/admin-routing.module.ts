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
          import('../../balance/balance/balance.module').then(m => m.BalanceModule)
      },
      {
        path: 'gastos',
        loadChildren: () =>
          import('../../gastos/gastos/gastos.module').then(m => m.GastosModule)
      },
      {
        path: 'ventas',
        loadChildren: () =>
          import('../../cruces/ventas/ventas.module').then(m => m.VentasModule)
      },
      {
        path: 'profile', loadChildren: () =>
          import('../../../components/admin/profile/profile.module').then(m => m.ProfileModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
