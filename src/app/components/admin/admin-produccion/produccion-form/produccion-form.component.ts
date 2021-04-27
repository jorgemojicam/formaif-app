import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-produccion-form',
  templateUrl: './produccion-form.component.html',
  styleUrls: ['./produccion-form.component.scss']
})
export class ProduccionFormComponent implements OnInit {

  @Input() datos: any

  public produccionForm = new FormGroup({
    Nombre: new FormControl(''),
    NombreCientifico: new FormControl(''),
    Ph: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99)]),
    Precipitacion: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99)]),
    Temperatura: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99)]),
    Global: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99)]),
    TipoProduccion: new FormControl(''),
  });

  constructor( 
    public _dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {

    if (this.datos) {
      this.produccionForm.patchValue({
        Nombre: this.datos.Nombre,
        NombreCientifico: this.datos.NombreCientifico,
        Ph: this.datos.Ph,
        Precipitacion: this.datos.Precipitacion,
        Temperatura: this.datos.Temperatura,
        Global: this.datos.Global,
        TipoProduccion: this.datos.TipoProduccion
      }, { emitEvent: false })
    }
  }


  onSave() {

  }

}
