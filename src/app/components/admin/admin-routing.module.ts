import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
        loadChildren: () =>
          import('../analisis/analisis.module').then(m => m.AnalisisModule)
      }    
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
