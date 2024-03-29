import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {  MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Respuestas } from 'src/app/model/meba/respuestas';
import { Resultado } from 'src/app/model/meba/resultado';
import { RespuestasService } from 'src/app/services/MEBA/respuestas.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-respuestas-form',
  templateUrl: './respuestas-form.component.html',
  styleUrls: ['./respuestas-form.component.scss']
})
export class RespuestasFormComponent implements OnInit {

  @Input() datos: any

  public respuestasForm = new FormGroup({
    Id: new FormControl(0),
    Texto: new FormControl(''),
    Puntaje: new FormControl('', [Validators.required, Validators.min(-99), Validators.max(100)]),
    Preguntas: new FormControl('')
  });
  loading: boolean = false

  constructor(
    private _srvRespuestas: RespuestasService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ModalComponent>,
  ) { }

  ngOnInit(): void {
    if (this.datos) {
      this.respuestasForm.patchValue({
        Id: this.datos.id,
        Texto: this.datos.name,
        Puntaje: this.datos.peso,
        Multiple: this.datos.multiple,
        Preguntas: this.datos.father
      }, { emitEvent: false })
    }
  }

  onSave() {
    let respuestas = {
      Id: this.respuestasForm.value.Id,
      Texto: this.respuestasForm.value.Texto,
      Puntaje: this.respuestasForm.value.Puntaje,
      Multiple: this.respuestasForm.value.Multiple,
      Preguntas: {
        Id: this.respuestasForm.value.Preguntas
      }
    }
    this.loading = true
    if (this.respuestasForm.value.Id > 0) {
      this._srvRespuestas.update(respuestas).subscribe(
        (suss) => {
          let res = suss as Resultado
          if (res.Id) {
            this._snackBar.open('Se modifico Correctamente', "Ok!", { duration: 3000, });
            this.dialogRef.close({
              data: res,
              type: 'update'
            })
          } else {
            this._snackBar.open('!Error! no se inserto', "Ok!", { duration: 3000, });
          }
          this.loading = false

        }, (err) => {
          this._snackBar.open('!Error! no se inserto', "Ok!", { duration: 3000, });
          this.loading = false
        }
      )
    } else {
      this._srvRespuestas.create(respuestas).subscribe(
        (suss) => {
          if (suss) {
            let res = suss as Respuestas
            if (res.Id > 0) {
              this._snackBar.open('Se inserto Correctamente', "Ok!", { duration: 3000, });
              this.dialogRef.close({
                data: res,
                type: 'create'
              })
            } else {
              this._snackBar.open('!Error! no se inserto', "Ok!", { duration: 3000, });
            }
          }
          this.loading = false
        }, (err) => {

          this.loading = false
        }
      )
    }
  }

}
