import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pregunta } from 'src/app/model/pregunta';
import { PreguntasService } from 'src/app/services/preguntas.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-preguntas-form',
  templateUrl: './preguntas-form.component.html',
  styleUrls: ['./preguntas-form.component.scss']
})
export class PreguntasFormComponent implements OnInit {

  @Input() datos: any

  public preguntasForm = new FormGroup({
    Id: new FormControl(0),
    Titulo: new FormControl(''),
    Multiple: new FormControl(false),
    Total: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
    Peso: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
    Temas: new FormControl('')
  });
  loading: boolean = false

  constructor(
    private _srvPreguntas: PreguntasService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ModalComponent>,
  ) { }

  ngOnInit(): void {
    if (this.datos) {
      this.preguntasForm.patchValue({
        Id: this.datos.id,
        Titulo: this.datos.name,
        Peso: this.datos.peso,
        Total: this.datos.total,
        Multiple: this.datos.multiple,
        Temas: this.datos.father
      }, { emitEvent: false })
    }
  }

  onSave() {
    let preguntas = {
      Id: this.preguntasForm.value.Id,
      Titulo: this.preguntasForm.value.Titulo,
      Peso: this.preguntasForm.value.Peso,
      Total: this.preguntasForm.value.Total,
      Multiple: this.preguntasForm.value.Multiple,
      Temas: {
        Id: this.preguntasForm.value.Temas
      }
    }

    this.loading = true
    if (this.preguntasForm.value.Id > 0) {
      this._srvPreguntas.update(preguntas).subscribe(
        (suss) => {
         
          this._snackBar.open('Se modifico correctamente', "Ok!", { duration: 3000, });
          this.dialogRef.close(preguntas)
          this.loading = false
        }, (err) => {
          console.log(err)
          this._snackBar.open('!Error¡ se presento error', "Ok!", { duration: 3000, });
          this.loading = false
        }
      )
    } else {
      this._srvPreguntas.create(preguntas).subscribe(
        (suss) => {
          if (suss) {
            console.log(suss)
            let res = suss as Pregunta
            if (res.Id > 0) {
              this._snackBar.open('Se inserto correctamente', "Ok!", { duration: 3000, });
              this.dialogRef.close(suss)
            }else{
              this._snackBar.open('!Error¡ se presento error insertando', "Ok!", { duration: 3000, });
            }
          }
          this.loading = false

        }, (err) => {
          this.loading = false
        }
      )
    }
  }

}
