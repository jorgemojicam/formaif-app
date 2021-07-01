import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { Asesor } from 'src/app/model/admin/asesor';
import { SolicitudZona } from 'src/app/model/zona/solicitudzona';
import { FlujoService } from 'src/app/services/zona/flujo.service';
import { NivelService } from 'src/app/services/zona/nivel.service';
import { SolicitudzonaService } from 'src/app/services/zona/solicitudzona.service';
import { HistorialService } from 'src/app/services/zona/historial.service';
import { TipoService } from 'src/app/services/zona/tipo.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { SeguimientoService } from 'src/app/services/zona/seguimiento.service';
import { Seguimiento } from 'src/app/model/zona/seguimiento';
import { Tipo } from 'src/app/model/zona/tipo';

@Component({
  selector: 'app-gestion-zona',
  templateUrl: './gestion-zona.component.html',
  styleUrls: ['./gestion-zona.component.scss']
})
export class GestionZonaComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;

  flujo: any
  id: any
  identificador: string = null

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

  tipos: Tipo[] = null
  dataUsuario: Asesor = this._srvStorage.getUser();
  dataSolicitud: SolicitudZona = new SolicitudZona
  dataSeguimiento: Seguimiento[]

  constructor(
    private _formBuilder: FormBuilder,
    private _srvFLujo: FlujoService,
    private _srvTipo: TipoService,
    private _srvSol: SolicitudzonaService,
    private _srvStorage: TokenStorageService,
    private _srvNivel: NivelService,
    private _srvSeguimiento: SeguimientoService,
    private _srvHistorial: HistorialService,
    private _actiro: ActivatedRoute
  ) {
    this._actiro.queryParamMap.subscribe((params) => {
      this.id = params.get('id')
    });
  }
  async ngOnInit() {
    const that = this

    this.tipos = await this.getTipo() as Tipo[]

  
    
    if (this.id) {
      let stepselect = 0
      let arrayNiveles = this._formBuilder.array([])
      this.formNiveles = this._formBuilder.group({
        niveles: arrayNiveles
      })

      this.dataSolicitud = await this.getSolicitud(this.id) as SolicitudZona
      this.dataSeguimiento = await this.getSeguimientoBySol(this.id) as Seguimiento[]
    
      if (this.dataSeguimiento) {
        for (let i = 0; i < this.dataSeguimiento.length; i++) {
          const seg = this.dataSeguimiento[i]

          let edit = false
          if (seg.Nivel.Rol.Id == this.dataUsuario.Rol.Id) {
            edit = true
            stepselect = i
          }
          let dataHistorial = await this.getHistorial(seg.Id)

          arrayNiveles.push(that._formBuilder.group({
            Nombre: [seg.Nivel.Nombre],
            Estado: ['', Validators.required],
            Observacion: ['', Validators.required],
            Historial: [dataHistorial],
            isEditable: [edit]
          }))
        }
      }
      this.formNiveles = this._formBuilder.group({
        niveles: arrayNiveles
      })

      this.identificador = this.dataSolicitud.Tipo.Iniciales + "-" + this.dataSolicitud.Id.toString().padStart(4, '0');
      this.registroForm = this._formBuilder.group({
        nombre: [this.dataSolicitud.Usuario.Nombre],
        cargo: [this.dataSolicitud.Usuario.Grupo],
        oficina: [this.dataSolicitud.Sucursal.Nombre],
        tipo: [this.dataSolicitud.Tipo, Validators.required],
        asesoresactual: [this.dataSolicitud.NumeroActual],
        asesoresaprobados: [this.dataSolicitud.NumeroAprobado]
      });
      this.stepper.selectedIndex = stepselect;
    } else {

      let arrayNiveles = that._formBuilder.array([])
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
  onRegistro() {

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
        console.log("data nivel->", data)
        let resSeg = await this.createSeguimiento(data)
        console.log("resSeg->", resSeg)
      });

      this.dataSolicitud.Estado.Id = estado

    }
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
  getHistorial(id) {
    return new Promise(resolve => {
      this._srvHistorial.getBySeg(id).subscribe(res => {
        resolve(res)
      }, (err) => {
        console.log(err)
        resolve(null)
      })
    })
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
      this._srvSeguimiento.create(data).subscribe((res) => {
        resolve({ data: res, error: null })
      }, (err) => {
        resolve({ data: null, error: err })
      })
    })
  }
  getSeguimientoBySol(idSol) {
    return new Promise(resolve => {
      this._srvSeguimiento.getBySol(idSol).subscribe((res) => {
        resolve(res)
      }, (err) => {
        resolve(null)
      })
    })
  }
  compareFunction(o1: Tipo, o2: Tipo) {
    return o1 && o2 ? o1.Id === o2.Id : o1 === o2;
  }

}
