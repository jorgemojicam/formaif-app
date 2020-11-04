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
  { path: 'admin', loadChildren: () => import('./components/admin/admin/admin.module').then(m => m.AdminModule) },  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
