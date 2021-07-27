import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Rol } from 'src/app/model/admin/rol';
import { Flujo } from 'src/app/model/zona/flujo';
import { RolService } from 'src/app/services/rol.service';
import { FlujoService } from 'src/app/services/zona/flujo.service';
import { NivelService } from 'src/app/services/zona/nivel.service';

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
  ) { }

  @Input() datos: any
  aRol: Rol[] = new Array
  aFlujo: Flujo[] = new Array

  nivelForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    flujo: new FormControl(null, Validators.required),
    orden: new FormControl('', Validators.required),
    rol: new FormControl(null, Validators.required)
  })

  async ngOnInit() {
    this.aRol = await this.getRol() as Rol[]
    this.aFlujo = await this.getFlujo() as Flujo[]
    this.nivelForm.patchValue({
      flujo: this.datos.Flujo,
      orden: this.datos.Orden
    }, { emitEvent: false })
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
      }
    }

    console.log(data)

    if (this.datos.Id) {
      data.Id = this.datos.Id
      let res = await this.update(data)
    } else {
      let res = await this.create(data)

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
      this._srvNivel.create(data).subscribe((sus) => {
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
        resolve(null)
      })
    })
  }

}
