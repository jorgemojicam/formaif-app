import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DepartamentoService } from 'src/app/services/zona/departamento.service';

@Component({
  selector: 'app-adjuntos-form',
  templateUrl: './adjuntos-form.component.html',
  styleUrls: ['./adjuntos-form.component.scss']
})
export class AdjuntosFormComponent implements OnInit {

  @Input() datos: any
  aDepartamento: any[]
  loading: boolean = false

  constructor(
    private _srvDepartamento: DepartamentoService
  ) { }


  adjuntosForm: FormGroup = new FormGroup({
    tipo: new FormControl(),
    estrato: new FormControl(),
    departamento: new FormControl(),
    municipio: new FormControl(),
    barrio: new FormControl(),
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

  selectedDepto(e) {
    console.log(e)
  }

  onSave() {
    console.log("--->")
  }

}
