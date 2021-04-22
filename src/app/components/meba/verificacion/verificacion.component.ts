import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { Solicitud } from 'src/app/model/solicitud';
import { Verificacion } from 'src/app/model/verificacion';
import { VerificacionService } from 'src/app/services/verificacion.service';
import Utils from '../../../utils';
import { IdbSolicitudService } from '../../admin/idb-solicitud.service';

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.scss']
})
export class VerificacionComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  verificacionForm: FormGroup
  dataVerificacion: any
  sol: string
  dSolicitud: Solicitud = new Solicitud();
  dVerificacion: Verificacion[] = [];

  constructor(
    private serVer: VerificacionService,
    private _formbuild: FormBuilder,
    public srvSol: IdbSolicitudService,
    private route: ActivatedRoute,
  ) {
    this.verificacionForm = this._formbuild.group({
      verificacion: this._formbuild.array([]),
      totalVerificacion: 0
    })

    this.route.queryParamMap.subscribe((params) => {
      this.sol = params.get('solicitud')
    });
  }


  /**
   * Autor: Jorge Enrique Mojica Martinez
   * Fecha: 2021-03-08
   * Nombre: loadPreguntas
   * Descripcion : Método de devolución de llamada que se invoca inmediatamente después de 
   * que el detector de cambios predeterminado haya verificado las propiedades vinculadas a 
   * datos de la directiva por primera vez y antes de que se haya verificado cualquiera de los 
   * elementos secundarios de la vista o el contenido. Se invoca solo una vez cuando se crea una 
   * instancia de la directiva
  */
  async ngOnInit() {

    //Consulta local storage
    this.dSolicitud = await this.getSolicitud() as Solicitud

    //Consulta BD
    this.dataVerificacion = await this.getPreguntas()

    //Si tiene respuestas en el local storage carguelas
    if (this.dSolicitud.verificacion) {
      //Construye el array de preguntas 
      await this.loadPreguntas(this.dSolicitud.verificacion, 0)
    } else {
      await this.loadPreguntas(this.dataVerificacion.Medidas, 0)
    }

    this.verificacionForm.get('verificacion').valueChanges.subscribe(values => {
      const verifica = <FormArray>this.verificacionForm.controls['verificacion'];

      verifica.controls.forEach(x => {
        let preguntas = <FormArray>x.get("preguntas")
        let acumulado = 0

        preguntas.controls.forEach(pre => {

          let resultado = pre.get("resultado").value
          let multiple = pre.get("multiple").value
          let total = pre.get("total").value
          let peso = pre.get("peso").value / 100
          if (resultado) {
            if (multiple) {
              let check1 = 0
              let check2 = 0

              for (let re = 0; re < resultado.length; re++) {
                const resul = resultado[re];
                let puntaje = Utils.formatNumber(resul.puntaje)
                if (puntaje == 1) {
                  check1 += 1
                } else if (puntaje == 2) {
                  check2 += 1
                }
              }

              let result = 0
              if (check1 == total) {
                result += 3
              }
              if (check2 == 1) {
                result += 1
              } else if (check2 >= 2) {
                result += 2
              }
              acumulado += peso * result
            } else {
              acumulado += peso * Utils.formatNumber(resultado.puntaje)
            }
          }

        });

        x.patchValue({
          total: acumulado.toFixed(2)
        }, { emitEvent: false })
      })

      this.dVerificacion = this.verificacionForm.value.verificacion
      this.dSolicitud.verificacion = this.dVerificacion
      //this.dSolicitud.totalAdaptativa = totaladapta.toFixed(3)
      this.srvSol.saveSol(this.sol, this.dSolicitud)

    })
  }

  /**
   * Autor: Jorge Enrique Mojica Martinez
   * Fecha: 2021-03-08
   * Nombre: loadPreguntas
   * Descripcion 
   */
  async loadPreguntas(aPreguntas: any[], total) {

    let arrayForm = this._formbuild.array([])

    aPreguntas.forEach(element => {

      arrayForm.push(
        this._formbuild.group({
          name: [element.name],
          aplicapregunta: [element.aplicapregunta],
          preguntas: this.loadRespuestas(element.preguntas),
          total: [element.total]

        })
      )
    });

    this.verificacionForm = this._formbuild.group({
      verificacion: arrayForm
    })
  }

  /**
  * Autor: Jorge Enrique Mojica Martinez
  * Fecha: 2021-03-08
  * Nombre: loadRespuestas
  * Descripcion 
  */
  loadRespuestas(respuestas): FormArray {

    let aRespuestas: FormArray = this._formbuild.array([])

    respuestas.forEach(pre => {
      aRespuestas.push(this._formbuild.group({
        titulo: [pre.titulo],
        respuestas: [pre.respuestas],
        peso: [pre.peso],
        total: [pre.total],
        multiple: [pre.multiple],
        resultado: [pre.resultado]
      }))
    });
    return aRespuestas
  }

  /**
   * Autor: Jorge Enrique Mojica Martinez
   * Fecha: 2021-03-08
   * Nombre: getPreguntas
   * Descripcion : funcion para retornar las preguntas mediante el servicio que cosnulta el archivo assets/verificacion.json
   * en el cual estan definidas las preguntas
   */
  getPreguntas() {
    return new Promise((resolve, reject) => {
      this.serVer.Get().subscribe(
        (data) => {
          resolve(data)
        })
    })
  }

  /**
   * Autor: Jorge Enrique Mojica Martinez
   * Fecha: 2021-03-26
   * Nombre: getSolicitud
   * Descripcion : funcion para consulta por medio del serivicio IdSolicitud los datos de la soliciud almacenados en local storage
   */
  getSolicitud() {
    return new Promise((resolve, reject) => {
      this.srvSol.getSol(this.sol).subscribe(
        (d) => {
          resolve(d)
        })
    })
  }

  verificacion() {
    return this.verificacionForm.get('verificacion') as FormArray;
  }
  preguntas(ti): FormArray {
    return this.verificacion().at(ti).get("preguntas") as FormArray
  }

  clear(event, pre) {

    if (!event.checked) {
      let preguntas = this.verificacion().at(pre).get("preguntas") as FormArray
      preguntas.controls.forEach(element => {
        element.patchValue({
          resultado: ""
        }, { emitEvent: false })
      });
    }
  }

}
