import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotfoundComponent } from './components/admin/notfound/notfound.component';
import { HomeComponent } from './components/admin/home/home.component';
import { AuthGuard } from './helpers/auth.guard';


const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'home', component: HomeComponent }
    ], canActivate: [AuthGuard]
  },
  { path: 'admin', loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },
  { path: '404', component: NotfoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
