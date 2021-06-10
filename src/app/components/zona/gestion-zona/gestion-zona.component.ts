import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { Asesor } from 'src/app/model/asesor';
import { SolicitudZona } from 'src/app/model/zona/solicitudzona';
import { FlujoService } from 'src/app/services/zona/flujo.service';
import { NivelService } from 'src/app/services/zona/nivel.service';
import { SolicitudzonaService } from 'src/app/services/zona/solicitudzona.service';
import { TipoService } from 'src/app/services/tipo.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { SeguimientoService } from 'src/app/services/zona/seguimiento.service';

@Component({
  selector: 'app-gestion-zona',
  templateUrl: './gestion-zona.component.html',
  styleUrls: ['./gestion-zona.component.scss']
})
export class GestionZonaComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('stepper') stepper: MatStepper;

  tipos: any[]
  flujo: any
  id: any
  identificador: string = null

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

  registroForm: FormGroup = this._formBuilder.group({
    nombre: [null],
    cargo: [null],
    oficina: [null],
    tipo: [null],
    asesoresactual: [null],
    asesoresaprobados: [null]
  });

  dataUsuario: Asesor = this._srvStorage.getUser();
  dataSolicitud: SolicitudZona = new SolicitudZona

  constructor(
    private _formBuilder: FormBuilder,
    private _srvFLujo: FlujoService,
    private _srvTipo: TipoService,
    private _srvSol: SolicitudzonaService,
    private _srvStorage: TokenStorageService,
    private _srvNivel: NivelService,
    private _srvSeguimiento: SeguimientoService,
    private _actiro: ActivatedRoute
  ) {
  }

  async ngOnInit() {
    const that = this

    this.tipos = await this.getTipo() as any

    this._actiro.queryParamMap.subscribe((params) => {
      this.id = params.get('id')
    });

    if (this.id) {

      let arrayNiveles = this._formBuilder.array([])
      this.formNiveles = this._formBuilder.group({
        niveles: arrayNiveles
      })

      this.dataSolicitud = await this.getSolicitud(this.id) as SolicitudZona

      this.identificador = this.dataSolicitud.Tipo.Iniciales + "-" + this.dataSolicitud.Id.toString().padStart(4, '0');
      this.registroForm = this._formBuilder.group({
        nombre: [this.dataSolicitud.Usuario.Nombre],
        cargo: [this.dataSolicitud.Usuario.Grupo],
        oficina: [this.dataSolicitud.Sucursal.Nombre],
        tipo: [this.dataSolicitud.Tipo, Validators.required],
        asesoresactual: [this.dataSolicitud.NumeroActual],
        asesoresaprobados: [this.dataSolicitud.NumeroAprobado]
      });

    } else {

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
      this.stepper.selectedIndex = 0;
    }

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
  getNivel(idFlujo) {
    return new Promise(resolve => {
      this._srvNivel.getByFlujo(idFlujo).subscribe(
        (res) => {
          resolve(res)
        }, (err) => {
          console.log(err)
          resolve(null)
        })
    })
  }
  getTipo() {
    return new Promise(resolve => {
      this._srvTipo.get().subscribe((res) => {
        resolve(res)
      }, (err) => {
        console.log(err)
        resolve(null)
      })
    })
  }
  getSolicitud(id) {
    return new Promise(resolve => {
      this._srvSol.getById(id).subscribe(res => {
        resolve(res)
      }, (err) => {
        console.log(err)
        resolve(null)
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

  async onGestion(estado) {
    if (estado == 3) {

      let nivel = await this.getNivel(this.dataSolicitud.Flujo.Id) as any
      
      nivel.forEach(async element => {     
        let data = {
          Solicitud: {
            Id: this.dataSolicitud.Id
          },
          Estado: {
            Id: 0
          },
          Nivel: {
            Id: element.Id
          }
        }
        console.log("data nivel->",data)
        let resSeg = await this.createSeguimiento(data)
        console.log("resSeg->",resSeg)
      });

      this.dataSolicitud.Estado.Id = estado
      
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
  update(data) {
    return new Promise(resolve => {
      this._srvSol.update(data).subscribe((res) => {
        let sol = res as SolicitudZona
        if (sol.Id > 0) {
          resolve({ data: res, error: null })
        } else {
          resolve({ data: null, error: 'Se presento un error' })
        }
      }, (err) => {
        resolve({ data: null, error: err })
      })
    })
  }
  createSeguimiento(data) {
    return new Promise(resolve => {
      this._srvSeguimiento.update(data).subscribe((res) => {
        resolve({ data: res, error: null })
      }, (err) => {
        resolve({ data: null, error: err })
      })
    })
  }


}
