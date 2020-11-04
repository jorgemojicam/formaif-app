import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from "@angular/material/button";
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from "@angular/material/divider";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";

const myCompm = [
  MatCardModule,
  MatToolbarModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatStepperModule,
  MatDividerModule,
  MatSidenavModule,
  MatListModule
];

@NgModule({
  declarations: [],
  imports: [CommonModule, myCompm],
  exports: [myCompm]
})
export class MaterialModule { }