import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { Adaptativa } from 'src/app/model/adaptativa';
import { Solicitud } from 'src/app/model/solicitud';
import { CapacidadAdaptativaService } from 'src/app/services/capacidad-adaptativa.service';
import { IdbSolicitudService } from '../../admin/idb-solicitud.service';

@Component({
  selector: 'app-adaptativa',
  templateUrl: './adaptativa.component.html',
  styleUrls: ['./adaptativa.component.scss']
})
export class AdaptativaComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  dataAdaptativa: any
  adaptativoForm: FormGroup
  aDimensiones: any[]
  sol: string
  dSolicitud: Solicitud = new Solicitud();
  dAdaptativa: Adaptativa[] = [];

  constructor(
    private serAdap: CapacidadAdaptativaService,
    private _formbuild: FormBuilder,
    public srvSol: IdbSolicitudService,
    private route: ActivatedRoute,
  ) {
    this.adaptativoForm = this._formbuild.group({
      adaptativa: this._formbuild.array([])
    })
    this.route.queryParamMap.subscribe((params) => {
      this.sol = params.get('solicitud')
    });

  }

  async ngOnInit() {

    await this.loadPreguntas()

    this.adaptativoForm.get('adaptativa').valueChanges.subscribe(values => {
      const adaptativa = <FormArray>this.adaptativoForm.controls['adaptativa'];
      adaptativa.controls.forEach(x => {

        let preguntas = <FormArray>x.get("preguntas")

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
       
        x.patchValue({
          total:acumulado
        }, { emitEvent: false })
      })

      this.dAdaptativa = this.adaptativoForm.value
      this.dSolicitud.Adaptativa = this.dAdaptativa
      //this.srvSol.saveSol(this.sol, this.dSolicitud)
    })

  }

  async loadPreguntas() {
    this.dataAdaptativa = await this.getPreguntas()
    let arrayForm = this._formbuild.array([])

    this.dataAdaptativa.Dimensiones.forEach(element => {

      arrayForm.push(
        this._formbuild.group({
          dimension: [element.dimension],
          preguntas: this.loadRespuestas(element.preguntas),
          total: [0]
        })
      )
    });

    this.adaptativoForm = this._formbuild.group({
      adaptativa: arrayForm
    })

  }


  loadRespuestas(respuestas): FormArray {
    let aRespuestas: FormArray = this._formbuild.array([])
    respuestas.forEach(pre => {
      aRespuestas.push(this._formbuild.group({
        descripcion: [pre.descripcion],
        peso: [pre.peso],
        respuestas: [pre.respuestas],
        multiple: [pre.multiple],
        resultado: ['']
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

  adaptativa() {
    return this.adaptativoForm.get('adaptativa') as FormArray;
  }
  preguntas(ti): FormArray {
    return this.adaptativa().at(ti).get("preguntas") as FormArray
  }

}
