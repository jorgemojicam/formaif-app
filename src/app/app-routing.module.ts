import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostComponent } from './components/posts/post/post.component';


const routes: Routes = [
{path: '',redirectTo:'/cruces',pathMatch:'full'},
{ path: 'home', loadChildren: () => import('./components/pages/home/home.module').then(m => m.HomeModule) }, 
{ path: 'posts/:id', component:PostComponent },
{ path: 'cruces', loadChildren: () => import('./components/cruces/ventas/ventas.module').then(m => m.VentasModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
