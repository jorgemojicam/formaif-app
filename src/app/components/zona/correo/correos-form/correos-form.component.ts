import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CorreosService } from 'src/app/services/zona/correos.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-correos-form',
  templateUrl: './correos-form.component.html',
  styleUrls: ['./correos-form.component.scss']
})
export class CorreosFormComponent implements OnInit {

  @Input() datos: any
  constructor(
    private _srvCorreos: CorreosService,
    private dialogRef: MatDialogRef<ModalComponent>,
    private _snackBar: MatSnackBar,
  ) { }

  correoForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl('', [Validators.required, Validators.minLength(4)]),
    asunto: new FormControl('', [Validators.required])
  })

  async ngOnInit() {
    if (this.datos) {
      console.log(this.datos)
      this.correoForm.patchValue({
        id: this.datos.Id,
        nombre: this.datos.Nombre,
        asunto: this.datos.Asunto
      }, { emitEvent: false })
    }
  }

  async onSave() {

    if (this.correoForm.valid) {
      let flujo = this.correoForm.value
      let data = {
        id: null,
        nombre: flujo.nombre
      }
      if (flujo.id) {
        data.id = flujo.id
        let res = await this.update(data) as any
        if (res) {
          this._snackBar.open('Se actualizo correctamente', "Ok!", { duration: 4000, });
        } else {
          this._snackBar.open('Se presento un error insertando', "Ok!", { duration: 4000, });
        }
        this.dialogRef.close(res)
      } else {
        let res = await this.create(data) as any
        console.log(res)
        if (res.Id > 0) {
          this._snackBar.open('Se inserto correctamente', "Ok!", { duration: 4000, });
          this.dialogRef.close(true)
        } else {
          this._snackBar.open('Se presento un error insertando', "Ok!", { duration: 4000, });
          this.dialogRef.close(false)
        }
      }
    }
  }

  create(data) {
    return new Promise(resolve => {
      this._srvCorreos.create(data).subscribe(
        (suss) => {
          resolve(suss)
        }, (err) => {
          this._snackBar.open('Error enviando peticion ' + err, "Ok!", { duration: 4000, });
          resolve(null)
        })
    })
  }

  update(data) {
    return new Promise(resolve => {
      this._srvCorreos.update(data).subscribe(
        (suss) => {
          resolve(suss)
        }, (err) => {
          this._snackBar.open('Error enviando peticion ' + err, "Ok!", { duration: 4000, });
          resolve(null)
        })
    })
  }

}
