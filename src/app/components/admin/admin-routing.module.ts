import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { RolComponent } from './admin-rol/rol/rol.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'rol',
        pathMatch: 'prefix',
        data: {
          routerName: 'rol'
        }
      },
      {
        path: 'rol',
        component: RolComponent,
        data: {
          routerName: 'rol'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
