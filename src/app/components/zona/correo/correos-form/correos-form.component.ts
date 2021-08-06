import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CorreosService } from 'src/app/services/zona/correos.service';
import { EstadosService } from 'src/app/services/zona/estados.service';
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
    private _srvEstados: EstadosService,
    private dialogRef: MatDialogRef<ModalComponent>,
    private _snackBar: MatSnackBar,
  ) { }

  aEstado = []

  correoForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl('', [Validators.required]),
    asunto: new FormControl('', [Validators.required]),
    cuerpo: new FormControl('', [Validators.required]),
    img: new FormControl('', [Validators.required]),
    estado: new FormControl('', [Validators.required]),
  })

  async ngOnInit() {

    this.aEstado = await this.getEstados() as []

    if (this.datos) {

      this.correoForm.patchValue({
        id: this.datos.Id,
        nombre: this.datos.Nombre,
        asunto: this.datos.Asunto,
        cuerpo: this.datos.Cuerpo,
        img: this.datos.Img,
        estado: this.datos.Estado,
      }, { emitEvent: false })
    }
  }

  async onSave() {

    if (this.correoForm.valid) {
      let correos = this.correoForm.value

      let data = {
        Id: null,
        Nombre: correos.nombre,
        Asunto: correos.asunto,
        Cuerpo: correos.cuerpo,
        Img: correos.img,
        Estado: {
          Id: correos.estado.Id
        }
      }
      if (this.datos) {
        data.Id = correos.id
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
  getEstados() {
    return new Promise(resolve => {
      this._srvEstados.get().subscribe(
        (suss) => {
          resolve(suss)
        }, (err) => {
          this._snackBar.open('Error enviando peticion ' + err, "Ok!", { duration: 4000, });
          resolve(null)
        })
    })
  }

  compareFunction(o1: any, o2: any) {
    return o1 && o2 ? o1.Id === o2.Id : o1 === o2;
  }

}
