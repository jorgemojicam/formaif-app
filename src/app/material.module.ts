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
import { MatChipsModule } from "@angular/material/chips";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from "@angular/material/tabs";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSliderModule} from '@angular/material/slider';

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
  MatListModule,
  MatChipsModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatRadioModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTabsModule,
  MatExpansionModule,
  MatTableModule,
  MatPaginatorModule,
  MatDialogModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatAutocompleteModule,
  MatSliderModule
];

@NgModule({
  declarations: [],
  imports: [CommonModule, myCompm],
  exports: [myCompm]
})
export class MaterialModule { }