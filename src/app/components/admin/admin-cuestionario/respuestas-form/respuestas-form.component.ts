import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RespuestasService } from 'src/app/services/respuestas.service';

@Component({
  selector: 'app-respuestas-form',
  templateUrl: './respuestas-form.component.html',
  styleUrls: ['./respuestas-form.component.scss']
})
export class RespuestasFormComponent implements OnInit {

  @Input() datos: any

  public respuestasForm = new FormGroup({
    Id: new FormControl(0),
    Texto: new FormControl(''),
    Puntaje: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99)]),
    Preguntas: new FormControl('')
  });
  loading:boolean = false
  
  constructor(
    private _srvRespuestas: RespuestasService
  ) { }

  ngOnInit(): void {
    if (this.datos) {
      this.respuestasForm.patchValue({
        Id: this.datos.id,
        Texto: this.datos.name,
        Puntaje: this.datos.peso,
        Preguntas: this.datos.father
      }, { emitEvent: false })
    }
  }

  onSave() {
    let respuestas = {
      Id: this.respuestasForm.value.Id,
      Texto: this.respuestasForm.value.Texto,
      Puntaje: this.respuestasForm.value.Puntaje,     
      Preguntas: {
        Id: this.respuestasForm.value.Preguntas
      }
    }
    this.loading = true
    if (this.respuestasForm.value.Id > 0) {
      this._srvRespuestas.update(respuestas).subscribe(
        (suss) => {
          console.log(suss)
          this.loading = false
        }, (err) => {
          console.log(err)
          this.loading = false
        }
      )
    } else {
      this._srvRespuestas.create(respuestas).subscribe(
        (suss) => {
          console.log(suss)
          this.loading = false
        }, (err) => {
          console.log(err)
          this.loading = false
        }
      )
    }
  }

}
