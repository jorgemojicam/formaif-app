import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Asesor } from 'src/app/model/asesor';
import { FlujoService } from 'src/app/services/flujo.service';
import { TipoService } from 'src/app/services/tipo.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-gestion-zona',
  templateUrl: './gestion-zona.component.html',
  styleUrls: ['./gestion-zona.component.scss']
})
export class GestionZonaComponent implements OnInit {

  registroForm: FormGroup;
  secondFormGroup: FormGroup;
  tipos: any[]
  flujo:any

  niveles: any[] = [
    {
      Nombre: "Nivel 1",
      Orden: 1,
      Rol: 1,
      Editable: true
    }, {
      Nombre: "Nivel 2",
      Orden: 2,
      Rol: 1,
      Editable: true
    }, {
      Nombre: "Nivel 3",
      Orden: 3,
      Rol: 1,
      Editable: true
    }, {
      Nombre: "Nivel 4",
      Orden: 4,
      Rol: 1,
      Editable: true
    },
  ]

  formNiveles: FormGroup = this._formBuilder.group({
    niveles: this._formBuilder.array([])
  })

  dataUsuario: Asesor = this._srvStorage.getUser();

  constructor(
    private _formBuilder: FormBuilder,
    private _srvFLujo: FlujoService,
    private _srvTipo: TipoService,
    private _srvStorage: TokenStorageService
  ) { }

  async ngOnInit() {

    const that = this
    let arrayNiveles = that._formBuilder.array([])
    this.niveles.forEach(niv => {
      arrayNiveles.push(that._formBuilder.group({
        Nombre: [niv.Nombre],
        Estado: ['', Validators.required],
        isEditable: [niv.Editable]
      }))
    });
    this.formNiveles = this._formBuilder.group({
      niveles: arrayNiveles
    })

    this.registroForm = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
      nombre: [this.dataUsuario.Nombre],
      cargo: [this.dataUsuario.Rol.Nombre],
      oficina: [this.dataUsuario.Sucursales.Nombre],
      tipo: [],
      asesoresactual: [null],
      asesoresaprobados: [null]
    });
    /*
this.secondFormGroup = this._formBuilder.group({
  secondCtrl: ['', Validators.required]
});
*/
    let resFlujo = await this.getFlujo() as any
    this.flujo = resFlujo.data

    let resTipo = await this.getTipo() as any
    this.tipos = resTipo.data
  }

  nivel() {
    return this.formNiveles.get('niveles') as FormArray;
  }
  getFlujo() {
    return new Promise(resolve => {
      this._srvFLujo.getByActivo(true).subscribe((res) => {
        resolve({ data: res, error: null })
      }, (err) => {
        resolve({ data: null, error: err })
      })
    })
  }
  getTipo() {
    return new Promise(resolve => {
      this._srvTipo.get().subscribe((res) => {
        resolve({ data: res, error: null })
      }, (err) => {
        resolve({ data: null, error: err })
      })
    })
  }
  onRegistro(){
    
  }

}
