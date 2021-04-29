import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { Adaptativa } from 'src/app/model/adaptativa';
import { Solicitud } from 'src/app/model/solicitud';
import { IdbService } from 'src/app/services/idb.service';
import Utils from 'src/app/utils';
import { IdbSolicitudService } from '../../../services/idb-solicitud.service';

@Component({
  selector: 'app-adaptativa',
  templateUrl: './adaptativa.component.html',
  styleUrls: ['./adaptativa.component.scss']
})
export class AdaptativaComponent implements OnInit {

  //Data
  @ViewChild(MatAccordion) accordion: MatAccordion;
  dataAdaptativa: any
  adaptativoForm: FormGroup
  aDimensiones: any[]
  sol: string
  dSolicitud: Solicitud = new Solicitud();
  dAdaptativa: Adaptativa[] = [];
  expandAll = false

  constructor(
    private _srvIdb: IdbService,
    private _formbuild: FormBuilder,
    public srvSol: IdbSolicitudService,
    private route: ActivatedRoute,
  ) {
    this.adaptativoForm = this._formbuild.group({
      totalAdaptativa: 0,
      dimensiones: this._formbuild.array([])
    })
    this.route.queryParamMap.subscribe((params) => {
      this.sol = params.get('solicitud')
    });
  }


  //Methods
  async ngOnInit() {

    //Consulta local storage
    this.dSolicitud = await this.getSolicitud() as Solicitud

    //Consulta BD
    this.dataAdaptativa = await this.getPreguntas()

    //Si tiene respuestas en el local storage carguelas
    if (this.dSolicitud.dimensiones) {
      //Construye el array de preguntas 
      await this.loadPreguntas(this.dSolicitud.dimensiones, this.dSolicitud.totalAdaptativa)
    } else {
      await this.loadPreguntas(this.dataAdaptativa, 0)
    }

    this.adaptativoForm.get('dimensiones').valueChanges.subscribe(values => {
      const adaptativa = <FormArray>this.adaptativoForm.controls['dimensiones'];
      let totaladapta = 0
      adaptativa.controls.forEach(x => {

        let preguntas = <FormArray>x.get("Preguntas")
        let pesodim = Utils.formatNumber(x.get("Peso").value)

        let acumulado = 0
        preguntas.controls.forEach(pre => {
          let resultado = pre.get("Resultado").value
          let peso = pre.get("Peso").value
          if (resultado) {
            let puntaje = resultado.Puntaje
            let porcentaje = (peso / 100) * puntaje
            acumulado += porcentaje
          }
        })
        let valortotal = (pesodim / 100) * acumulado
        totaladapta += valortotal
        x.patchValue({
          total: isFinite(acumulado) ? acumulado.toFixed(2) : 0
        }, { emitEvent: false })
      })
 
      this.adaptativoForm.patchValue({
        totalAdaptativa: isFinite(totaladapta) ? totaladapta.toFixed(3) : 0
      }, { emitEvent: false });

      this.dAdaptativa = this.adaptativoForm.value.dimensiones
      this.dSolicitud.dimensiones = this.dAdaptativa
      this.dSolicitud.totalAdaptativa = isFinite(totaladapta) ? totaladapta.toFixed(3) : 0
      this.srvSol.saveSol(this.sol, this.dSolicitud)
    })
  }

  async loadPreguntas(aPreguntas: any[], totalAdap) {
    let arrayForm = this._formbuild.array([])
    aPreguntas.forEach(element => {
      arrayForm.push(
        this._formbuild.group({
          Nombre: [element.Nombre],
          Peso: [element.Peso],
          Preguntas: this.loadRespuestas(element.Preguntas),
          total: [element.total]
        })
      )
    });

    this.adaptativoForm = this._formbuild.group({
      totalAdaptativa: totalAdap,
      dimensiones: arrayForm
    })

  }

  /**
   * Autor: Jorge Enrique Mojica Martinez
   * Fecha: 2021-03-14
   * Nombre: loadRespuestas
   * Descripcion : funcion para construir el array del formulario en el cual se cargan los elementos con
   * los datos si existen las respuestas con resultado
   * 
   * @param {Array} respuestas el arreglo de preguntas que se van a contruir     
   * 
   * @returns {FormArray} aRespuestas el array del formulario que se itera en la vista
   */
  loadRespuestas(respuestas): FormArray {
    let aRespuestas: FormArray = this._formbuild.array([])

    respuestas.forEach(pre => {

      aRespuestas.push(this._formbuild.group({
        Titulo: [pre.Titulo],
        Peso: [pre.Peso],
        Respuestas: [pre.Respuestas],
        Multiple: [pre.Multiple],
        Resultado: [pre.Resultado]
      }))
    });
    return aRespuestas
  }

  /**
   * Autor: Jorge Enrique Mojica Martinez
   * Fecha: 2021-03-08
   * Nombre: getPreguntas
   * Descripcion : funcion para retornar las preguntas mediante el servicio que cosnulta el archivo assets/capacidad-adaptativa.json
   * en el cual estan definidas las preguntas
   */
  getPreguntas() {
    return new Promise((resolve, reject) => {
      this._srvIdb.get('dimenciones').subscribe(
        (data) => {
          console.log(data)
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

  adaptativa() {
    return this.adaptativoForm.get('dimensiones') as FormArray;
  }
  preguntas(ti): FormArray {
    return this.adaptativa().at(ti).get("Preguntas") as FormArray
  }

  expand() {
    if (!this.expandAll) {
      this.expandAll = true
      this.accordion.openAll()
    } else {
      this.expandAll = false
      this.accordion.closeAll()
    }
  }

}
