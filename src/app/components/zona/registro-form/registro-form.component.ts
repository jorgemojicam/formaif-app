import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
export interface PeriodicElement {
  asesor:string,
  CodigoDepartamento: string;
  NombreDepartamento: string;
  CodigoCiudadoMunicipio: string;
  NombreCiudadoMunicipio: string;
  CodigoBarrioVereda: string;
  NombredelBarrioVereda: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    asesor: "Jorge Enrique Mojica",
    CodigoDepartamento: "03",
    NombreDepartamento: "Santander",
    CodigoCiudadoMunicipio: "75",
    NombreCiudadoMunicipio: "Floridablanca",
    CodigoBarrioVereda: "21",
    NombredelBarrioVereda: "La Cumbre"
  },{
    asesor: "Jorge Enrique Mojica",
    CodigoDepartamento: "03",
    NombreDepartamento: "Santander",
    CodigoCiudadoMunicipio: "75",
    NombreCiudadoMunicipio: "Floridablanca",
    CodigoBarrioVereda: "21",
    NombredelBarrioVereda: "La Cumbre"
  },{
    asesor: "Jorge Enrique Mojica",
    CodigoDepartamento: "03",
    NombreDepartamento: "Santander",
    CodigoCiudadoMunicipio: "75",
    NombreCiudadoMunicipio: "Floridablanca",
    CodigoBarrioVereda: "21",
    NombredelBarrioVereda: "La Cumbre"
  },{
    asesor: "Jorge Enrique Mojica",
    CodigoDepartamento: "03",
    NombreDepartamento: "Santander",
    CodigoCiudadoMunicipio: "75",
    NombreCiudadoMunicipio: "Floridablanca",
    CodigoBarrioVereda: "21",
    NombredelBarrioVereda: "La Cumbre"
  },{
    asesor: "Jorge Enrique Mojica",
    CodigoDepartamento: "03",
    NombreDepartamento: "Santander",
    CodigoCiudadoMunicipio: "75",
    NombreCiudadoMunicipio: "Floridablanca",
    CodigoBarrioVereda: "21",
    NombredelBarrioVereda: "La Cumbre"
  },{
    asesor: "Jorge Enrique Mojica",
    CodigoDepartamento: "03",
    NombreDepartamento: "Santander",
    CodigoCiudadoMunicipio: "75",
    NombreCiudadoMunicipio: "Floridablanca",
    CodigoBarrioVereda: "21",
    NombredelBarrioVereda: "La Cumbre"
  },{
    asesor: "Jorge Enrique Mojica",
    CodigoDepartamento: "03",
    NombreDepartamento: "Santander",
    CodigoCiudadoMunicipio: "75",
    NombreCiudadoMunicipio: "Floridablanca",
    CodigoBarrioVereda: "21",
    NombredelBarrioVereda: "La Cumbre"
  },{
    asesor: "Jorge Enrique Mojica",
    CodigoDepartamento: "03",
    NombreDepartamento: "Santander",
    CodigoCiudadoMunicipio: "75",
    NombreCiudadoMunicipio: "Floridablanca",
    CodigoBarrioVereda: "21",
    NombredelBarrioVereda: "La Cumbre"
  },{
    asesor: "Jorge Enrique Mojica",
    CodigoDepartamento: "03",
    NombreDepartamento: "Santander",
    CodigoCiudadoMunicipio: "75",
    NombreCiudadoMunicipio: "Floridablanca",
    CodigoBarrioVereda: "21",
    NombredelBarrioVereda: "La Cumbre"
  },{
    asesor: "Jorge Enrique Mojica",
    CodigoDepartamento: "03",
    NombreDepartamento: "Santander",
    CodigoCiudadoMunicipio: "75",
    NombreCiudadoMunicipio: "Floridablanca",
    CodigoBarrioVereda: "21",
    NombredelBarrioVereda: "La Cumbre"
  },{
    asesor: "Jorge Enrique Mojica",
    CodigoDepartamento: "03",
    NombreDepartamento: "Santander",
    CodigoCiudadoMunicipio: "75",
    NombreCiudadoMunicipio: "Floridablanca",
    CodigoBarrioVereda: "21",
    NombredelBarrioVereda: "La Cumbre"
  },{
    asesor: "Jorge Enrique Mojica",
    CodigoDepartamento: "03",
    NombreDepartamento: "Santander",
    CodigoCiudadoMunicipio: "75",
    NombreCiudadoMunicipio: "Floridablanca",
    CodigoBarrioVereda: "21",
    NombredelBarrioVereda: "La Cumbre"
  },{
    asesor: "Jorge Enrique Mojica",
    CodigoDepartamento: "03",
    NombreDepartamento: "Santander",
    CodigoCiudadoMunicipio: "75",
    NombreCiudadoMunicipio: "Floridablanca",
    CodigoBarrioVereda: "21",
    NombredelBarrioVereda: "La Cumbre"
  },
];
@Component({
  selector: 'app-registro-form',
  templateUrl: './registro-form.component.html',
  styleUrls: ['./registro-form.component.scss']
})
export class RegistroFormComponent implements OnInit {

  displayedColumns: string[] = ['asesor','CodigoDepartamento', 'NombreDepartamento', 'CodigoCiudadoMunicipio', 'NombreCiudadoMunicipio', 'CodigoBarrioVereda', 'NombredelBarrioVereda'];
  dataSource = ELEMENT_DATA;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  ngOnInit(): void {
  }

}
