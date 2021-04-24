import { Component, Injectable, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Cuestionario } from 'src/app/model/cuestionario';
import { Temas } from 'src/app/model/temas';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { PreguntasService } from 'src/app/services/preguntas.service';
import { RespuestasService } from 'src/app/services/respuestas.service';
import { TemasService } from 'src/app/services/temas.service';


@Component({
  selector: 'app-cuestionario',
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.scss']
})
export class CuestionarioComponent {

  listCuestionario: Cuestionario[]
  selectCuestionario: Cuestionario
  cuestionarioForm: FormGroup

  constructor(
    private _srvCuestionario: CuestionarioService,
    private _srvRespuesta: RespuestasService,
    private _srvPreguntas: PreguntasService,
    private _srvTemas: TemasService,
    private _formbuild: FormBuilder
  ) {
    this.cuestionarioForm = this._formbuild.group({
      temasForm: this._formbuild.array([])
    })
    this.initalize()
  }


  hasChild = (_: number, node: Temas) => !!node.Preguntas && node.Preguntas.length > 0;

  async initalize() {
    await this.getCuestionarios()
  }

  async loadCuestionario(e) {
    let temas = await this.getTemas(e.value) as Temas[]
    let temasArray: FormArray = this._formbuild.array([])
    temas.forEach(async tem => {
      let preguntas = await this.getPreguntas(tem.Id)

      temasArray.push(
        this._formbuild.group({
          Nombre: [tem.Nombre],
          preguntas: this.loadPreguntas(preguntas),
        })
      )
    });
    this.cuestionarioForm = this._formbuild.group({
      temasForm: temasArray
    })
  }
  cuestionario() {
    return this.cuestionarioForm.get('temasForm') as FormArray;
  }
  preguntas(num): FormArray {
    return this.cuestionario().at(num).get("preguntas") as FormArray
  }

  loadPreguntas(preguntas) {
    let preguntasArray: FormArray = this._formbuild.array([])
    preguntas.forEach(async pre => {
      let respuestas = await this.getRespuestas(pre.Id)
      preguntasArray.push(
        this._formbuild.group({
          Nombre: [pre.Nombre],
          Respuestas: this.loadRespuestas(respuestas),
        })
      )
    })
    return preguntasArray
  }


  loadRespuestas(respuestas) {
    let respuestasArray: FormArray = this._formbuild.array([])
    respuestas.forEach(async res => {
      respuestasArray.push(
        this._formbuild.group({
          Nombre: [res.Nombre],
        })
      )
    })
    return respuestasArray
  }

  async getCuestionarios() {
    new Promise((resolve, reject) => {
      this._srvCuestionario.get().subscribe(
        (a) => {
          resolve(a)
          this.listCuestionario = a as Cuestionario[]
          return a as Cuestionario
        },
        (err) => {
          reject([])
        }
      )
    });
  }

  getRespuestas(cuestionario) {
    return new Promise((resolve, reject) => {
      this._srvRespuesta.getById(cuestionario).subscribe(
        (a) => {
          resolve(a)
          return a
        },
        (err) => {
          reject([])
        }
      )
    });
  }

  getTemas(cuestionario) {
    return new Promise((resolve, reject) => {
      this._srvTemas.getById(cuestionario).subscribe(
        (a) => {
          resolve(a)
          return a
        },
        (err) => {
          reject([])
        }
      )
    });
  }

  getPreguntas(tema) {
    return new Promise((resolve, reject) => {
      this._srvPreguntas.getById(tema).subscribe(
        (a) => {
          resolve(a)
          return a
        },
        (err) => {
          reject([])
        }
      )
    });
  }


}
