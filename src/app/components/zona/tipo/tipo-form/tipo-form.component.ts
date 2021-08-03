import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Flujo } from 'src/app/model/zona/flujo';
import { FlujoService } from 'src/app/services/zona/flujo.service';
import { TipoService } from 'src/app/services/zona/tipo.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-tipo-form',
  templateUrl: './tipo-form.component.html',
  styleUrls: ['./tipo-form.component.scss']
})
export class TipoFormComponent implements OnChanges {

  constructor(
    private _srvFlujo: FlujoService,
    private _srvTipos: TipoService,
    private dialogRef: MatDialogRef<ModalComponent>,
  ) { }

  @Input() datos: any
  aFlujo: Flujo[] = new Array

  tiposForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    flujo: new FormControl(null, Validators.required),
    iniciales: new FormControl(null, Validators.required)

  })

  async ngOnChanges() {
    this.aFlujo = await this.getFlujo() as Flujo[]
    console.log(this.datos)
    if (this.datos) {
      this.tiposForm.patchValue({
        id: this.datos.Id,
        nombre: this.datos.Nombre,
        flujo: this.datos.Flujo,
        iniciales: this.datos.Iniciales
      }, { emitEvent: false })
    }

  }
  async onSave() {

    let data = {
      Id: null,
      Flujo: {
        Id: this.tiposForm.value.flujo.Id
      },
      Iniciales: this.tiposForm.value.iniciales,
      Nombre: this.tiposForm.value.nombre
    }

    if (this.datos) {
      data.Id = this.datos.Id
      let res = await this.update(data)
      if (res) {
        this.dialogRef.close(res)
      }
    } else {
      let res = await this.create(data) as any
      console.log(res)
      if (res && res.Id) {
        console.log(res)
        this.dialogRef.close(res)
      }
    }

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
      this._srvTipos.create(data).subscribe(
        (sus) => {
          if (sus) {
            resolve(sus)
          }
        }, (err) => {
          console.log(err)
          resolve(null)
        })
    })
  }
  update(data) {
    return new Promise(resolve => {
      this._srvTipos.update(data).subscribe((sus) => {
        resolve(sus)
      }, (err) => {
        console.log(err)
        resolve(null)
      })
    })
  }

}
