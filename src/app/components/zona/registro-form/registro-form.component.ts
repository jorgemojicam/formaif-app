import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
export interface PeriodicElement {
  CodigoDepartamento: string;
  NombreDepartamento: string;
  CodigoCiudadoMunicipio: string;
  NombreCiudadoMunicipio: string;
  CodigoBarrioVereda: string;
  NombredelBarrioVereda: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    CodigoDepartamento: "",
    NombreDepartamento: "",
    CodigoCiudadoMunicipio: "",
    NombreCiudadoMunicipio: "",
    CodigoBarrioVereda: "",
    NombredelBarrioVereda: ""
  }
];
@Component({
  selector: 'app-registro-form',
  templateUrl: './registro-form.component.html',
  styleUrls: ['./registro-form.component.scss']
})
export class RegistroFormComponent implements OnInit {

  displayedColumns: string[] = ['CodigoDepartamento', 'NombreDepartamento', 'CodigoCiudadoMunicipio', 'NombreCiudadoMunicipio', 'CodigoBarrioVereda', 'NombredelBarrioVereda'];
  dataSource = ELEMENT_DATA;

  @ViewChild(MatAccordion) accordion: MatAccordion;

  ngOnInit(): void {
  }

}
