import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AdjuntosService } from 'src/app/services/zona/adjuntos.service';
import { BarrioService } from 'src/app/services/zona/barrio.service';
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
  aBarrio: any[] = new Array
  labelPot = 'POT'
  labelEot = 'EOT'

  aTipo: any[] = [
    { id: "1", nombre: "Cambio de Nombre" },
    { id: "2", nombre: "Barrio Nuevo" },
  ]
  loading: boolean = false
  filteredOptions: Observable<string[]>;

  constructor(
    private _srvDepartamento: DepartamentoService,
    private _srvMunicipio: MunicipioService,
    private _srvBarrio: BarrioService,
    private _srvAdjuntos: AdjuntosService
  ) { }

  adjuntosForm: FormGroup = new FormGroup({
    tipo: new FormControl('', Validators.required),
    estrato: new FormControl('', Validators.required),
    departamento: new FormControl('', Validators.required),
    municipio: new FormControl('', Validators.required),
    barrio: new FormControl(),
    barrionuevo: new FormControl(),
    pot: new FormControl(),
    eot: new FormControl(),
    opz: new FormControl(),
    recibo: new FormControl(),
  })

  async ngOnInit() {
    console.log('datos ', this.datos)
    this.aDepartamento = await this.getDepartamento() as any[]
    this.filteredOptions = this.adjuntosForm.controls.barrio.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.Nombre),
      map(name => name ? this._filter(name) : this.aBarrio.slice())
    );
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

  getBarrio(mun, dep) {
    return new Promise(resolve => {
      this._srvBarrio.GetByMunDep(mun, dep).subscribe(
        (suc) => {
          resolve(suc)
        }, (err) => {
          console.log(err)
          resolve([])
        })
    })
  }

  async selectedDepto(e) {

    if (e.value) {
      this.aMunicipio = await this.getMunicipio(e.value.Id) as any[]
      this.aBarrio = new Array
      this.adjuntosForm.patchValue({
        barrio: ''
      }, { emitEvent: false })
    }
  }
  async selectedMun(e) {

    if (e.value) {
      let dep = this.adjuntosForm.value.departamento
      this.aBarrio = await this.getBarrio(e.value.Id, dep.Id) as any[]
      this.adjuntosForm.patchValue({
        barrio: ''
      }, { emitEvent: false })
    }
  }

  async onSave() {

    if (this.adjuntosForm.valid) {
      let idBarrio = 0
      if (this.adjuntosForm.value.barrio) {
        idBarrio = this.adjuntosForm.value.barrio.Id
      }
      let data = {
        Estrato: this.adjuntosForm.value.estrato,
        Barrio: {
          Id: idBarrio
        },
        Municipio: {
          Id: this.adjuntosForm.value.municipio.Id
        },
        Departamento: {
          Id: this.adjuntosForm.value.departamento.Id
        },
        POT: "pot2",
        EOT: "eot2",
        OPZ: "OPZ2",
        Recibo: "recibo2",
        BarrioNuevo: "Barrio la brecum",
        Solicitud: {
          Id: this.datos.IdSolicitud
        },
        TipoAdjunto: this.adjuntosForm.value.tipo.id
      }

      console.log('data', data)
      let res = await this.onCreate(data)
      console.log('res', res)

    }
  }

  onCreate(data) {
    return new Promise(resolve => {
      this._srvAdjuntos.create(data).subscribe(
        (suss) => {
          resolve(suss)
        }, (err) => {
          resolve(null)
        }
      )
    })
  }

  displayFn(barrio: any): string {
    return barrio && barrio.Nombre ? barrio.Nombre : '';
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.aBarrio.filter(option => option.Nombre.toLowerCase().includes(filterValue));
  }

}
