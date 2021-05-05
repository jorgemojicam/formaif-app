import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrucesComponent } from './cruces.component';

const routes: Routes = [{ path: '', component: CrucesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrucesRoutingModule { }
