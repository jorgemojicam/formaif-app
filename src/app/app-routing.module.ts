import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotfoundComponent } from './shared/notfound/notfound.component';
import { AuthGuard } from './helpers/auth.guard';
import { ProduccionComponent } from './components/admin/admin-produccion/produccion/produccion.component';
import { CuestionarioComponent } from './components/admin/admin-cuestionario/cuestionario/cuestionario.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'lobby',
    pathMatch: 'full',
  },
  {
    path: 'produccion',
    component: ProduccionComponent

  },
  {
    path: 'cuestion',
    component: CuestionarioComponent

  },
  {
    path: 'admin',
    loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard]
  },  
  {
    path: 'meba',
    loadChildren: () => import('./components/meba/meba.module').then(m => m.MebaModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '404',
    component: NotfoundComponent
  },
  { path: 'agil', loadChildren: () => import('./components/agil/agil.module').then(m => m.AgilModule) },
  {
    path: '**',
    redirectTo: '/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    //enableTracing: true,
    paramsInheritanceStrategy: 'always',
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
