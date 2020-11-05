import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostComponent } from './components/posts/post/post.component';
import { ContainerAppComponent } from "./components/pages/container-app/container-app.component";


const routes: Routes = [
<<<<<<< HEAD
  {
    path: '', component: ContainerAppComponent,
    children: [
      { path: 'home', loadChildren: () => import('./components/pages/home/home.module').then(m => m.HomeModule) },
      { path: 'posts/:id', component: PostComponent }
    ]
  },  
  { path: 'admin', loadChildren: () => import('./components/admin/admin/admin.module').then(m => m.AdminModule) },  

=======
{path: '',redirectTo:'cruces',pathMatch:'full'},
{ path: 'cruces', loadChildren: () => import('./components/cruces/ventas/ventas.module').then(m => m.VentasModule) }, 
{ path: 'home', loadChildren: () => import('./components/pages/home/home.module').then(m => m.HomeModule) }, 
{ path: 'posts/:id', component:PostComponent }
>>>>>>> 3d2c0f5960a1b66172eee25de1a21c409195cbeb
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
