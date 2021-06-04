import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CuestionarioComponent } from "./admin-cuestionario/cuestionario/cuestionario.component";
import { ProduccionComponent } from './admin-produccion/produccion/produccion.component';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { RolComponent } from './admin-rol/rol/rol.component';

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
          routerName: 'cuestionario'
        }
      },
      {
        path: 'cuestionario',
        component: CuestionarioComponent,
        data: {
          routerName: 'cuestionario'
        }
      },
      {
        path: 'produccion',
        component: ProduccionComponent,
        data: {
          routerName: 'produccion'
        }
      },
      {
        path: 'rol',
        component: RolComponent,
        data: {
          routerName: 'rol'
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'home',
        redirectTo: 'lobby',
        data: {
          routerName: 'lobby'
        },
        canActivate: [AuthGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
