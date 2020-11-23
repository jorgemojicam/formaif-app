import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrucesAgroRoutingModule } from './cruces-agro-routing.module';
import { CrucesAgroComponent } from './cruces-agro.component';


@NgModule({
  declarations: [CrucesAgroComponent],
  imports: [
    CommonModule,
    CrucesAgroRoutingModule
  ]
})
export class CrucesAgroModule { }
