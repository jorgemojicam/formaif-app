import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { IdbSolicitudService } from '../admin/idb-solicitud.service';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.scss']
})

export class UbicacionComponent implements OnInit {

  ubicacionForm: FormGroup = this.fb.group({   
    tiempo: [''],
    puntopartida: [''],
    descripcionppartida: [''],
    fotoppartida: '',
    puntollegada: '',
    descripcionpllegada: '',
    fotopllegada: '',
  })

  constructor(
    private fb: FormBuilder, 
    public srvSol: IdbSolicitudService,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

}
