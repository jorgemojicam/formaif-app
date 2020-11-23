import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrucesAgroComponent } from './cruces-agro.component';

const routes: Routes = [{ path: '', component: CrucesAgroComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrucesAgroRoutingModule { }
