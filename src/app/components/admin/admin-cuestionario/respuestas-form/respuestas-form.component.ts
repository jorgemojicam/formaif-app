import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RespuestasService } from 'src/app/services/respuestas.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

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
  loading: boolean = false

  constructor(
    private _srvRespuestas: RespuestasService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ModalComponent>,
  ) { }

  ngOnInit(): void {
    if (this.datos) {
      this.respuestasForm.patchValue({
        Id: this.datos.id,
        Texto: this.datos.name,
        Puntaje: this.datos.peso,
        Multiple: this.datos.multiple,
        Preguntas: this.datos.father
      }, { emitEvent: false })
    }
  }

  onSave() {
    let respuestas = {
      Id: this.respuestasForm.value.Id,
      Texto: this.respuestasForm.value.Texto,
      Puntaje: this.respuestasForm.value.Puntaje,
      Multiple: this.respuestasForm.value.Multiple,
      Preguntas: {
        Id: this.respuestasForm.value.Preguntas
      }
    }
    this.loading = true
    if (this.respuestasForm.value.Id > 0) {
      this._srvRespuestas.update(respuestas).subscribe(
        (suss) => {

          if (suss) {      
            this._snackBar.open('Se inserto correctamente', "Ok!", { duration: 3000, });           
          } else {
            this._snackBar.open('!Error! no se inserto', "Ok!", { duration: 3000, });
          }
          this.loading = false

        }, (err) => {
          this._snackBar.open('!Error! no se inserto', "Ok!", { duration: 3000, });
          this.loading = false
        }
      )
    } else {
      this._srvRespuestas.create(respuestas).subscribe(
        (suss) => {
     
          if (suss) {     
            this._snackBar.open('Se inserto correctamente', "Ok!", { duration: 3000, });  
            this.dialogRef.close(respuestas)
          } else {
            this._snackBar.open('!Error! no se inserto', "Ok!", { duration: 3000, });
          }
          this.loading = false
        }, (err) => {
          console.log(err)
          this.loading = false
        }
      )
    }
  }

}
