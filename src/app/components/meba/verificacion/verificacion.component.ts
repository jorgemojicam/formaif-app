import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { Solicitud } from 'src/app/model/agil/solicitud';
import { Verificacion } from 'src/app/model/meba/verificacion';
import Utils from '../../../utils';
import { IdbSolicitudService } from '../../../services/idb-solicitud.service';
import { IdbService } from 'src/app/services/idb.service';

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.scss']
})
export class VerificacionComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  verificacionForm: FormGroup
  dataVerificacion: any
  ced: string
  dSolicitud: Solicitud = new Solicitud();
  dVerificacion: Verificacion[] = [];

  constructor(
    private _srvIdb: IdbService,
    private _formbuild: FormBuilder,
    public srvSol: IdbSolicitudService,
    private route: ActivatedRoute,
  ) {
    this.verificacionForm = this._formbuild.group({
      verificacion: this._formbuild.array([]),
      totalVerificacion: 0
    })

    this.route.queryParamMap.subscribe((params) => {
      this.ced = params.get('cedula')
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
      await this.loadPreguntas(this.dSolicitud.verificacion)
    } else {
      await this.loadPreguntas(this.dataVerificacion)
    }

    this.verificacionForm.get('verificacion').valueChanges.subscribe(values => {
      const verifica = <FormArray>this.verificacionForm.controls['verificacion'];

      verifica.controls.forEach(x => {
        let preguntas = <FormArray>x.get("Preguntas")
        let acumulado = 0

        preguntas.controls.forEach(pre => {

          let resultado = pre.get("Resultado").value
          let multiple = pre.get("Multiple").value
          let total = pre.get("Total").value
          let peso = pre.get("Peso").value / 100

          if (resultado) {

            if (multiple) {

              if (resultado.length > 0) {
                
                let check1 = 0
                let check2 = 0

                for (let re = 0; re < resultado.length; re++) {
                  const resul = resultado[re];

                  let puntaje = Utils.formatNumber(resul.Punaje)
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
              }
            } else {
              acumulado += peso * Utils.formatNumber(resultado.Punaje)
            }
          }

        });

        x.patchValue({
          totalAcumulado: acumulado.toFixed(2)
        }, { emitEvent: false })
      })

      this.dVerificacion = this.verificacionForm.value.verificacion
      this.dSolicitud.verificacion = this.dVerificacion
      this.srvSol.saveSol(this.ced, this.dSolicitud)

    })
  }

  /**
   * Autor: Jorge Enrique Mojica Martinez
   * Fecha: 2021-03-08
   * Nombre: loadPreguntas
   * Descripcion se construye el Tema los encabezados
   */
  async loadPreguntas(aPreguntas: any[]) {

    let arrayForm = this._formbuild.array([])

    aPreguntas.forEach(element => {

      arrayForm.push(
        this._formbuild.group({
          Id: [element.Id],
          Nombre: [element.Nombre],
          aplicapregunta: [element.aplicapregunta],
          Preguntas: this.loadRespuestas(element.Preguntas),
          Total: [element.Total],
          totalAcumulado: [element.totalAcumulado]
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
      let res = []
      if (pre.Resultado) {
        if (pre.Multiple) {

          pre.Resultado.forEach(resultado => {
            let arRes = pre.Respuestas.find(a => a.Id == resultado.Id)
            res.push(arRes)
          });
        } else {
          res = pre.Respuestas.find(a => a.Id == pre.Resultado.Id)
        }
      }
      aRespuestas.push(this._formbuild.group({
        Titulo: [pre.Titulo],
        Respuestas: [pre.Respuestas],
        Peso: [pre.Peso],
        Total: [pre.Total],
        Multiple: [pre.Multiple],
        Resultado: [res]
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
      this._srvIdb.get('medidas').subscribe(
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
      this.srvSol.getSol(this.ced).subscribe(
        (d) => {
          resolve(JSON.parse(d))
        })
    })
  }

  verificacion() {
    return this.verificacionForm.get('verificacion') as FormArray;
  }
  preguntas(ti): FormArray {
    return this.verificacion().at(ti).get("Preguntas") as FormArray
  }
  clear(event, pre) {

    let verificacion = this.verificacion()

    verificacion.controls.forEach(element => {
      element.patchValue({
        totalAcumulado: 0,
      }, { emitEvent: false })
    }, { emitEvent: false })

    if (!event.checked) {
      let preguntas = this.verificacion().at(pre).get("Preguntas") as FormArray
      preguntas.controls.forEach(element => {
        element.patchValue({
          resultado: "",
        }, { emitEvent: false })
      });
    }
  }

}
