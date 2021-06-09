import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Asesor } from 'src/app/model/asesor';
import { SolicitudZona } from 'src/app/model/zona/solicitudzona';
import { FlujoService } from 'src/app/services/flujo.service';
import { SolicitudzonaService } from 'src/app/services/solicitudzona.service';
import { TipoService } from 'src/app/services/tipo.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-gestion-zona',
  templateUrl: './gestion-zona.component.html',
  styleUrls: ['./gestion-zona.component.scss']
})
export class GestionZonaComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('stepper') stepper: MatStepper;
  registroForm: FormGroup;
  secondFormGroup: FormGroup;
  tipos: any[]
  flujo: any
  id:any

  niveles: any[] = [
    {
      Nombre: "Nivel 1",
      Orden: 1,
      Rol: 1,
      Editable: true,
      Here: false
    }, {
      Nombre: "Nivel 2",
      Orden: 2,
      Rol: 1,
      Editable: true,
      Here: true
    }, {
      Nombre: "Nivel 3",
      Orden: 3,
      Rol: 1,
      Editable: true,
      Here: false
    }, {
      Nombre: "Nivel 4",
      Orden: 4,
      Rol: 1,
      Editable: true,
      Here: false
    },
  ]

  formNiveles: FormGroup = this._formBuilder.group({
    niveles: this._formBuilder.array([])
  })

  dataUsuario: Asesor = this._srvStorage.getUser();
  dataSolicitud: any

  constructor(
    private _formBuilder: FormBuilder,
    private _srvFLujo: FlujoService,
    private _srvTipo: TipoService,
    private _srvSol: SolicitudzonaService,
    private _srvStorage: TokenStorageService,
    private _router: Router,
    private _actiro: ActivatedRoute
  ) {
  }

  async ngOnInit() {    
    const that = this 
    
    this._actiro.queryParamMap.subscribe((params) => {
      this.id = params.get('id')
    });

    if(this.id ){
      console.log(this.id)
      this.stepper.selectedIndex = 1;
    }

    let arrayNiveles = that._formBuilder.array([])
    this.niveles.forEach(niv => {
      arrayNiveles.push(that._formBuilder.group({
        Nombre: [niv.Nombre],
        Estado: ['', Validators.required],
        isEditable: [niv.Editable],
        isHere: [niv.Here]
      }))
    });
    this.formNiveles = this._formBuilder.group({
      niveles: arrayNiveles
    })

    this.registroForm = this._formBuilder.group({
      nombre: [this.dataUsuario.Nombre],
      cargo: [this.dataUsuario.Rol.Nombre],
      oficina: [this.dataUsuario.Sucursales.Nombre],
      tipo: ['', Validators.required],
      asesoresactual: [null],
      asesoresaprobados: [null]
    });
    let resFlujo = await this.getFlujo() as any
    this.flujo = resFlujo.data

    let resTipo = await this.getTipo() as any
    this.tipos = resTipo.data
    this.stepper.selectedIndex = 0;
    
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
  onRegistro() {
    console.log(this.registroForm.valid)
    if (this.registroForm.valid) {

      let data = {
        Tipo: {
          Id: this.registroForm.value.tipo.Id
        },
        Sucursal: {
          Codigo: this.dataUsuario.Sucursales.Codigo
        },
        Estado: {
          Id: 1
        },
        NumeroActual: this.registroForm.value.asesoresactual,
        NumeroAprobado: this.registroForm.value.asesoresaprobados,
        Fecha: new Date(),
        Usuario: {
          Clave: this.dataUsuario.Clave
        },
        Flujo: {
          Id: this.flujo.Id
        }
      }
      console.log(data)
      console.log(this.registroForm)
    }
  }

  create(data) {
    return new Promise(resolve => {
      this._srvSol.create(data).subscribe((res) => {
        let sol = res as SolicitudZona
        if (sol.Id > 0) {
          resolve({ data: res, error: null })
        } else {
          resolve({ data: null, error: 'Se presento un error' })
        }
      }, (err) => {

      })
    })
  }


}
