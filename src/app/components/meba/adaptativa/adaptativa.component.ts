import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { Adaptativa } from 'src/app/model/adaptativa';
import { Solicitud } from 'src/app/model/solicitud';
import { CapacidadAdaptativaService } from 'src/app/services/capacidad-adaptativa.service';
import Utils from 'src/app/utils';
import { IdbSolicitudService } from '../../admin/idb-solicitud.service';

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
    private serAdap: CapacidadAdaptativaService,
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
      await this.loadPreguntas(this.dataAdaptativa.dimensiones, 0)
    }

    this.adaptativoForm.get('dimensiones').valueChanges.subscribe(values => {
      const adaptativa = <FormArray>this.adaptativoForm.controls['dimensiones'];
      let totaladapta = 0
      adaptativa.controls.forEach(x => {

        let preguntas = <FormArray>x.get("preguntas")
        let pesodim = Utils.formatNumber(x.get("peso").value)

        let acumulado = 0
        preguntas.controls.forEach(pre => {
          let resultado = pre.get("resultado").value
          let peso = pre.get("peso").value
          if (resultado) {
            let puntaje = resultado.puntaje
            let porcentaje = (peso / 100) * puntaje
            acumulado += porcentaje
          }
        })
        let valortotal = (pesodim / 100) * acumulado
        totaladapta += valortotal
        x.patchValue({
          total: acumulado.toFixed(2)
        }, { emitEvent: false })
      })

      this.adaptativoForm.patchValue({
        totalAdaptativa: totaladapta.toFixed(3)
      }, { emitEvent: false });

      this.dAdaptativa = this.adaptativoForm.value.dimensiones
      this.dSolicitud.dimensiones = this.dAdaptativa
      this.dSolicitud.totalAdaptativa = totaladapta.toFixed(3)
      this.srvSol.saveSol(this.sol, this.dSolicitud)
    })


  }

  async loadPreguntas(aPreguntas: any[], totalAdap) {

    let arrayForm = this._formbuild.array([])

    aPreguntas.forEach(element => {

      arrayForm.push(
        this._formbuild.group({
          dimension: [element.dimension],
          peso: [element.peso],
          preguntas: this.loadRespuestas(element.preguntas),
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
        descripcion: [pre.descripcion],
        peso: [pre.peso],
        respuestas: [pre.respuestas],
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
   * Descripcion : funcion para retornar las preguntas mediante el servicio que cosnulta el archivo assets/capacidad-adaptativa.json
   * en el cual estan definidas las preguntas
   */
  getPreguntas() {
    return new Promise((resolve, reject) => {
      this.serAdap.getCapacidadAdap().subscribe(
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


  adaptativa() {
    return this.adaptativoForm.get('dimensiones') as FormArray;
  }
  preguntas(ti): FormArray {
    return this.adaptativa().at(ti).get("preguntas") as FormArray
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
