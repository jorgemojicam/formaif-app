import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VentasComponent } from './ventas.component';

const routes: Routes = [
<<<<<<< HEAD
  { path: '', component: VentasComponent }
  
=======
  { path: '', component: VentasComponent },  
>>>>>>> 3d2c0f5960a1b66172eee25de1a21c409195cbeb
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
