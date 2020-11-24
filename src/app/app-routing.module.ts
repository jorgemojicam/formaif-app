import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostComponent } from './components/posts/post/post.component';
import { ContainerAppComponent } from "./components/pages/container-app/container-app.component";
import { HomeComponent } from './components/admin/home/home.component';


const routes: Routes = [
  {
    path: '', component: ContainerAppComponent,
    children: [
      { path: 'home', component:HomeComponent },
      { path: 'posts/:id', component: PostComponent }
    ]
  },
  { path: 'admin', loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule) },
  { path: 'balance', loadChildren: () => import('./components/balance/balance.module').then(m => m.BalanceModule) },
  { path: 'gastos', loadChildren: () => import('./components/gastos/gastos.module').then(m => m.GastosModule) },
  { path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },
  { path: 'cruces', loadChildren: () => import('./components/cruces/cruces.module').then(m => m.CrucesModule) },
  { path: 'cruces-agro', loadChildren: () => import('./components/cruces-agro/cruces-agro.module').then(m => m.CrucesAgroModule) },  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
