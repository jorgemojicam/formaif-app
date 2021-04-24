import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Cuestionario } from 'src/app/model/cuestionario';
import { Pregunta } from 'src/app/model/pregunta';
import { Respuestas } from 'src/app/model/respuestas';
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
  arbolCuestionario: Temas[] = new Array()

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


  async initalize() {
    await this.getCuestionarios()
  }

  async loadCuestionario(e) {
    let temas = await this.getTemas(e.value) as Temas[]
    let temasArray: FormArray = this._formbuild.array([])
    temas.forEach(async tem => {
      let preguntas = await this.getPreguntas(tem.Id)

      let objTemas: Temas = new Temas()
      objTemas.Nombre = tem.Nombre
      objTemas.Preguntas = this.loadObjPreguntas(preguntas)
      this.arbolCuestionario.push(objTemas)

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
    console.log(this.arbolCuestionario)
  }

  loadObjPreguntas(preguntas) {
    let preguntasArray: Pregunta[] = new Array()
    preguntas.forEach(async pre => {
      let respuestas = await this.getRespuestas(pre.Id)

      let objPreguntas = new Pregunta()
      objPreguntas.Titulo = pre.Titulo
      if (respuestas) {
        objPreguntas.Respuestas = this.loadObjRespuestas(respuestas)
      }
      preguntasArray.push(objPreguntas)
    })
    return preguntasArray
  }
  loadObjRespuestas(respuestas) {
    let respuestasArray: Respuestas[] = new Array()
    respuestas.forEach(async res => {
      let objRespuestas = new Respuestas
      objRespuestas.Texto = res.Texto
      respuestasArray.push(objRespuestas)
    })
    return respuestasArray
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
