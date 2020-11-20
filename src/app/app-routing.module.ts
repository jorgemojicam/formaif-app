import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostComponent } from './components/posts/post/post.component';
import { ContainerAppComponent } from "./components/pages/container-app/container-app.component";


const routes: Routes = [
  {
    path: '', component: ContainerAppComponent,
    children: [
      { path: 'home', loadChildren: () => import('./components/pages/home/home.module').then(m => m.HomeModule) },
      { path: 'posts/:id', component: PostComponent }
    ]
  },
  { path: 'admin', loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule) },
  { path: 'balance', loadChildren: () => import('./components/balance/balance.module').then(m => m.BalanceModule) },
  { path: 'gastos', loadChildren: () => import('./components/gastos/gastos.module').then(m => m.GastosModule) },
  { path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
