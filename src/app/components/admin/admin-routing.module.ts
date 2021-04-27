import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CuestionarioComponent } from "./admin-cuestionario/cuestionario/cuestionario.component";


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'cuestionario',
        pathMatch: 'prefix',
        data: {
          routerName: 'produccion'
        }
      },
      {
        path: 'cuestionario',
        component: CuestionarioComponent,
        data: {
          routerName: 'cuestionario'
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
