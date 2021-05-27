import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-solicitud-form',
  templateUrl: './solicitud-form.component.html',
  styleUrls: ['./solicitud-form.component.scss']
})
export class SolicitudFormComponent implements OnInit {

  constructor() { }

  formSolicitud: FormGroup = new FormGroup({
    tiposolicitud: new FormControl(''),
    asesoresActual: new FormControl(null),
    asesoresAprobados: new FormControl(null),
  })

  ngOnInit(): void {
  }

}
