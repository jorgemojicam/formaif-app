import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { VerificacionService } from 'src/app/services/verificacion.service';
import Utils from '../../../utils';

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.scss']
})
export class VerificacionComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  verificacionForm: FormGroup
  dataVerificacion: any

  constructor(
    private serVer: VerificacionService,
    private _formbuild: FormBuilder,
  ) {
    this.verificacionForm = this._formbuild.group({
      verificacion: this._formbuild.array([])
    })
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
    await this.loadPreguntas()

    this.verificacionForm.get('verificacion').valueChanges.subscribe(values => {
      const verifica = <FormArray>this.verificacionForm.controls['verificacion'];

      verifica.controls.forEach(x => {
        let preguntas = <FormArray>x.get("preguntas")
        let acumulado =  0
        preguntas.controls.forEach(pre => {
          let resultado = pre.get("resultado").value
          let multiple = pre.get("multiple").value
          
          if(multiple){           
            for (let re = 0; re < resultado.length; re++) {
              const resul = resultado[re];
              acumulado += Utils.formatNumber(resul.puntaje)              
            }           
          }else{
            acumulado +=Utils.formatNumber(resultado.puntaje)
          }
         
        });
        
        console.log("acumulado ",acumulado)
      })
    })
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

      arrayForm.push(
        this._formbuild.group({
          name: [element.name],
          aplicapregunta: [false],
          preguntas: this.loadRespuestas(element.preguntas)
        })
      )
    });

    this.verificacionForm = this._formbuild.group({
      verificacion: arrayForm
    })
  }
  loadRespuestas(respuestas): FormArray {

    let aRespuestas: FormArray = this._formbuild.array([])

    respuestas.forEach(pre => {
      aRespuestas.push(this._formbuild.group({
        titulo: [pre.titulo],
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

  verificacion() {
    return this.verificacionForm.get('verificacion') as FormArray;
  }
  preguntas(ti): FormArray {
    return this.verificacion().at(ti).get("preguntas") as FormArray
  }

}
