import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Rol } from 'src/app/model/admin/rol';
import { Flujo } from 'src/app/model/zona/flujo';
import { RolService } from 'src/app/services/rol.service';
import { FlujoService } from 'src/app/services/zona/flujo.service';
import { NivelService } from 'src/app/services/zona/nivel.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-nivel-form',
  templateUrl: './nivel-form.component.html',
  styleUrls: ['./nivel-form.component.scss']
})
export class NivelFormComponent implements OnInit {

  constructor(
    private _srvRol: RolService,
    private _srvFlujo: FlujoService,
    private _srvNivel: NivelService,
    private dialogRef: MatDialogRef<ModalComponent>,
    private _snackBar: MatSnackBar,
  ) { }

  @Input() datos: any
  aRol: Rol[] = new Array
  aFlujo: Flujo[] = new Array

  nivelForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    flujo: new FormControl(null, Validators.required),
    orden: new FormControl('', Validators.required),
    rol: new FormControl(null, Validators.required),
    diasans: new FormControl(null, Validators.required),
    diasnotificacion: new FormControl(null, Validators.required),
  })

  async ngOnInit() {

    this.aRol = await this.getRol() as Rol[]
    this.aFlujo = await this.getFlujo() as Flujo[]
    this.nivelForm.patchValue({
      flujo: this.datos.Flujo,
      orden: this.datos.Orden
    }, { emitEvent: false })
    if (this.datos) {
      this.nivelForm.patchValue({
        nombre: this.datos.Nombre,
        rol: this.datos.Rol,
        diasans: this.datos.DiasNotificacion,
        diasnotificacion: this.datos.DiasNotificacion,
      }, { emitEvent: false })
    }
  }

  async onSave() {

    let data = {
      Id: null,
      Flujo: {
        Id: this.nivelForm.value.flujo.Id
      },
      Nombre: this.nivelForm.value.nombre,
      Orden: this.nivelForm.value.orden,
      Rol: {
        Id: this.nivelForm.value.rol.Id
      },
      DiasNotificacion: parseInt(this.nivelForm.value.diasnotificacion),
      DiasANS: parseInt(this.nivelForm.value.diasans)
    }

    if (this.datos.Id) {
      data.Id = this.datos.Id
      console.log(data)
      let res = await this.update(data)
      if (res) {
        this._snackBar.open('Se modifico correctamente', "Ok!", { duration: 4000, });
        this.dialogRef.close(true)
      }else{
        this._snackBar.open('Se presento un error', "Ok!", { duration: 4000, });
      }
      console.log("update->", res)
    } else {
      let res = await this.create(data)
      console.log("create->", res)
    }

  }

  getRol() {
    return new Promise(resolve => {
      this._srvRol.get().subscribe((suc) => {
        resolve(suc)
      }, (err) => {
        console.log(err)
        resolve([])
      })
    })
  }
  getFlujo() {
    return new Promise(resolve => {
      this._srvFlujo.get().subscribe((suc) => {
        resolve(suc)
      }, (err) => {
        console.log(err)
        resolve([])
      })
    })
  }

  compareFunction(o1: any, o2: any) {
    return o1 && o2 ? o1.Id === o2.Id : o1 === o2;
  }

  create(data) {
    return new Promise(resolve => {
      this._srvNivel.create(data).subscribe(
        (sus) => {
          resolve(sus)
        }, (err) => {
          console.log(err)
          resolve(null)
        })
    })
  }
  update(data) {
    return new Promise(resolve => {
      this._srvNivel.update(data).subscribe((sus) => {
        resolve(sus)
      }, (err) => {
        console.log(err)
        resolve(false)
      })
    })
  }

}
