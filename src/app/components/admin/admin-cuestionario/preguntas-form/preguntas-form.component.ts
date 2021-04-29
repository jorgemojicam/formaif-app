import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    Peso: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99)]),
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
        Temas: this.datos.father
      }, { emitEvent: false })
    }
  }

  onSave() {
    let preguntas = {
      Id: this.preguntasForm.value.Id,
      Titulo: this.preguntasForm.value.Titulo,
      Peso: this.preguntasForm.value.Peso,
      Temas: {
        Id: this.preguntasForm.value.Temas
      }
    }

    this.loading = true
    if (this.preguntasForm.value.Id > 0) {
      this._srvPreguntas.update(preguntas).subscribe(
        (suss) => {
          console.log(suss)
          this.loading = false
        }, (err) => {
          console.log(err)
          this.loading = false
        }
      )
    } else {
      this._srvPreguntas.create(preguntas).subscribe(
        (suss) => {
          if (suss) {
            this._snackBar.open('Se inserto correctamente', "Ok!", { duration: 3000, });
            this.dialogRef.close(this.datos)
          }
          this.loading = false

        }, (err) => {
          this.loading = false
        }
      )
    }
  }

}
