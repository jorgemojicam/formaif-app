import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DepartamentoService } from 'src/app/services/zona/departamento.service';
import { MunicipioService } from 'src/app/services/zona/municipio.service';

@Component({
  selector: 'app-adjuntos-form',
  templateUrl: './adjuntos-form.component.html',
  styleUrls: ['./adjuntos-form.component.scss']
})
export class AdjuntosFormComponent implements OnInit {

  @Input() datos: any
  aDepartamento: any[]
  aMunicipio: any[]
  aTipo: any[] = [
    { id: "1", nombre: "Cambio de Nombre" },
    { id: "2", nombre: "Barrio Nuevo" },
  ]
  loading: boolean = false

  constructor(
    private _srvDepartamento: DepartamentoService,
    private _srvMunicipio: MunicipioService
  ) { }


  adjuntosForm: FormGroup = new FormGroup({
    tipo: new FormControl(),
    estrato: new FormControl(),
    departamento: new FormControl(),
    municipio: new FormControl(),
    barrio: new FormControl(),
    barrionuevo:new FormControl(),
    pot: new FormControl(),
    eot: new FormControl(),
    opz: new FormControl(),
    recibo: new FormControl(),
  })

  async ngOnInit() {

    this.aDepartamento = await this.getDepartamento() as any[]
  }

  getDepartamento() {
    return new Promise(resolve => {
      this._srvDepartamento.get().subscribe(
        (suc) => {
          resolve(suc)
        }, (err) => {
          console.log(err)
          resolve([])
        })
    })
  }

  getMunicipio(depto) {
    return new Promise(resolve => {
      this._srvMunicipio.get(depto).subscribe(
        (suc) => {
          resolve(suc)
        }, (err) => {
          console.log(err)
          resolve([])
        })
    })
  }

  async selectedDepto(e) {
    console.log(e)
    if (e.value) {
      this.aMunicipio = await this.getMunicipio(e.value.Id) as any[]
    }
  }
  async selectedMun(e) {
    console.log(e.value)
  }

  onSave() {
    console.log("--->")
  }

}
