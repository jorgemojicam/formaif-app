import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Temas } from 'src/app/model/temas';
import { TemasService } from 'src/app/services/temas.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-temas-form',
  templateUrl: './temas-form.component.html',
  styleUrls: ['./temas-form.component.scss']
})
export class TemasFormComponent implements OnInit {

  @Input() datos: any

  public temasForm = new FormGroup({
    Id: new FormControl(0),
    Nombre: new FormControl(''),
    Peso: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
    Cuestionario: new FormControl('')
  });

  loading: boolean = false

  constructor(
    private _srvTemas: TemasService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ModalComponent>,
  ) { }

  ngOnInit(): void {

    if (this.datos) {

      this.temasForm.patchValue({
        Id: this.datos.id,
        Nombre: this.datos.name,
        Peso: this.datos.peso,
        Cuestionario: this.datos.father
      }, { emitEvent: false })
    }
  }


  onSave() {

    let tema = {
      Id: this.temasForm.value.Id,
      Nombre: this.temasForm.value.Nombre,
      Peso: this.temasForm.value.Peso,
      Cuestionario: {
        Id: this.temasForm.value.Cuestionario
      }
    }

    this.loading = true
    if (this.temasForm.value.Id > 0) {

      this._srvTemas.update(tema).subscribe(
        (suss) => {
          let tem = suss as Temas
          if (tem.Id >0) {
            
            this._snackBar.open('Se modifico correctamente', "Ok!", { duration: 3000, });
            this.dialogRef.close({
              data: tem,
              type: 'edit'
            })
            this.loading = false
          }
        }, (err) => {
          console.log(err)
          this._snackBar.open('Se presento un error', "Ok!", { duration: 3000, });
          this.loading = false
        }

      )
    } else {

    }
  }

}
