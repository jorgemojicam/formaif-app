import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CapacidadAdaptativaService } from 'src/app/services/capacidad-adaptativa.service';

@Component({
  selector: 'app-adaptativa',
  templateUrl: './adaptativa.component.html',
  styleUrls: ['./adaptativa.component.scss']
})
export class AdaptativaComponent implements OnInit {

  dataAdaptativa: any
  adaptativoForm: FormGroup
  aRespuestas = new Array()

  constructor(
    private serAdap: CapacidadAdaptativaService,
    private _formbuild: FormBuilder
  ) {
    this.adaptativoForm = this._formbuild.group({
      preguntas: this._formbuild.array([])
    })

  }

  ngOnInit() {

    this.loadPreguntas()

  }

  async loadPreguntas() {
    this.dataAdaptativa = await this.getPreguntas()
    let arrayForm = new Array()

    this.dataAdaptativa.PreguntasAdaptativa.forEach(element => {

      this.aRespuestas.push(element.respuestas)

      arrayForm.push(
        this._formbuild.group({
          texto: [element.pregunta],
          respuesta: ['']
        })
      )
    });
    this.adaptativoForm = this._formbuild.group({
      preguntas: this._formbuild.array(arrayForm)
    })

  }

  getPreguntas() {
    return new Promise((resolve, reject) => {
      this.serAdap.getCapacidadAdap().subscribe(
        (data) => {
          resolve(data)
        })
    })
  }

}
