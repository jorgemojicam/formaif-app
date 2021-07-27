import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CuestionarioComponent } from "./admin-cuestionario/cuestionario/cuestionario.component";
import { ProduccionComponent } from './admin-produccion/produccion/produccion.component';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { RolComponent } from './admin-rol/rol/rol.component';
import { LobbyComponent } from '../lobby/lobby.component';
import { ModulosComponent } from './modulo/modulos/modulos.component';

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
        path: 'modulo',
        component: ModulosComponent,
        data: {
          routerName: 'modulo'
        },
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: 'home',
    component: LobbyComponent,
    data: {
      routerName: 'home'
    },
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
