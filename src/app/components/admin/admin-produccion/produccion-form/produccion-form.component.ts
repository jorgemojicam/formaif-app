import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProduccionService } from 'src/app/services/MEBA/produccion.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import Utils from 'src/app/utils';

@Component({
  selector: 'app-produccion-form',
  templateUrl: './produccion-form.component.html',
  styleUrls: ['./produccion-form.component.scss']
})
export class ProduccionFormComponent implements OnInit {

  @Input() datos: any

  public produccionForm = new FormGroup({
    Id: new FormControl(''),
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
    private _srvProduccion: ProduccionService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ModalComponent>,
  ) {

  }

  ngOnInit(): void {
    if (this.datos) {
      console.log(this.datos.TipoProduccion)
      this.produccionForm = new FormGroup({
        Id: new FormControl(this.datos.Id),
        Nombre: new FormControl(this.datos.Nombre),
        NombreCientifico: new FormControl(this.datos.NombreCientifico),
        Ph: new FormControl(this.datos.Ph, [Validators.required, Validators.min(0), Validators.max(99)]),
        Precipitacion: new FormControl(this.datos.Precipitacion, [Validators.required, Validators.min(0), Validators.max(99)]),
        Temperatura: new FormControl(this.datos.Temperatura, [Validators.required, Validators.min(0), Validators.max(99)]),
        Global: new FormControl(this.datos.Global, [Validators.required, Validators.min(0), Validators.max(99)]),
        TipoProduccion: new FormControl(this.datos.TipoProduccion),
      });
    }

    this.produccionForm.valueChanges.subscribe(value => {
      let ph = Utils.formatNumber(value.Ph)
      let precipitacion = Utils.formatNumber(value.Precipitacion)
      let temperatura = Utils.formatNumber(value.Temperatura)
      let global = (ph + temperatura + precipitacion) / 3

      this.produccionForm.patchValue({
        Global: isFinite(global) ? global.toFixed() : 0
      }, { emitEvent: false })
    })

  }


  onSave() {

    if (this.produccionForm.value.Id) {

      this._srvProduccion.update(this.produccionForm.value).subscribe(
        (sus) => {
          if (sus) {
            this._snackBar.open('Se modifico correctamente', "Ok!", { duration: 3000, });
            this.dialogRef.close()
          }
        }, (err) => {
          console.log(err)
        })

    } else {

      this._srvProduccion.create(this.produccionForm.value).subscribe(
        (sus) => {
          if (sus) {
            this._snackBar.open('Se ingreso correctamente', "Ok!", { duration: 3000, });
            this.dialogRef.close()
            console.log(sus)
          }
        }, (err) => {
          console.log(err)
        })

    }

  }

}
