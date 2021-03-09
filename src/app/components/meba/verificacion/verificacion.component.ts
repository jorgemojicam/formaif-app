import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { VerificacionService } from 'src/app/services/verificacion.service';

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.scss']
})
export class VerificacionComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  verificacionForm: FormGroup
  dataVerificacion: any
  aPreguntas: any[] = new Array()

  constructor(
    private serVer: VerificacionService,
    private _formbuild: FormBuilder,
  ) {
    this.verificacionForm = this._formbuild.group({
      verificacion: this._formbuild.array([])
    })
  }



  ngOnInit(): void {
    this.loadPreguntas()
  }

  /**
   * Autor: Jorge Enrique Mojica Martinez
   * Fecha: 2021-03-08
   * Nombre: loadPreguntas
   * Descripcion 
   */
  async loadPreguntas() {
    this.dataVerificacion = await this.getPreguntas()
    let arrayForm = this._formbuild.array([])

    this.dataVerificacion.Medidas.forEach(element => {
      console.log(element.preguntas)
      arrayForm.push(
        this._formbuild.group({
          name: [element.name],
          preguntas:this.loadRespuestas(element.preguntas)
        })
      )
    });

    this.verificacionForm = this._formbuild.group({
      verificacion: arrayForm
    })

  }
  verificacion() {
    return this.verificacionForm.get('verificacion') as FormArray;
  }
  preguntas(ti): FormArray {
    return this.verificacion().at(ti).get("preguntas") as FormArray
  }
  loadRespuestas(respuestas): FormArray {

    let aRespuestas: FormArray = this._formbuild.array([])

    respuestas.forEach(pre => {
      aRespuestas.push(this._formbuild.group({
        titulo: [pre.titulo],
        respuestas: [pre.respuestas],
        respuesta: ['']
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

}
