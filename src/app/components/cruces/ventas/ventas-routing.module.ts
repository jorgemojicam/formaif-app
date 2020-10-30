import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VentasComponent } from './ventas.component';

const routes: Routes = [
  { path: 'cruces', component: VentasComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
