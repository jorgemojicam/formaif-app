import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotfoundComponent } from './shared/notfound/notfound.component';
import { AuthGuard } from './helpers/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'lobby',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'lobby',
    redirectTo: 'lobby',
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    redirectTo: 'lobby',
    canActivate: [AuthGuard]
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
  {
    path: 'agil',
    loadChildren: () => import('./components/agil/agil.module').then(m => m.AgilModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'zona', loadChildren: () => import('./components/zona/zona.module').then(m => m.ZonaModule),
    canActivate: [AuthGuard]
  },
  { path: 'lobby', loadChildren: () => import('./components/lobby/lobby.module').then(m => m.LobbyModule) },

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
