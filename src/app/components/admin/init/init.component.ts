import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Solicitud } from 'src/app/model/solicitud';
import { IdbSolicitudService } from '../idb-solicitud.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss']
})
export class InitComponent implements OnInit {

  public initForm = new FormGroup({
    solicitud: new FormControl('', [Validators.required,
      Validators.min(999999999),
      Validators.max(9999999999)]),
    cedula: new FormControl('', [Validators.required,
    Validators.min(99999),
    Validators.max(9999999999)]),
    asesor: new FormControl("1", Validators.required)
  });

  private newSolicitud: Solicitud = new Solicitud();
  solis = [];
  constructor(
    public srvSol: IdbSolicitudService,
    private _snackBar: MatSnackBar,
    private route: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

  }

  onSave() {

    if (this.initForm.valid) {

      const numsol = this.initForm.value.solicitud.toString()
      this.newSolicitud = Object.assign(this.newSolicitud, this.initForm.value);
      let hoy: Date = new Date();
      this.newSolicitud.fechacreacion = hoy

      this.srvSol.getSol(numsol)
        .subscribe((sol) => {
          if (sol) {
            this._snackBar.open("La solicitud ya se encuentra almacenada", "Ok!", {
              duration: 3000,
            });
          } else {
            this.srvSol.get().subscribe((sols) => {
              if (sols) {
                this.solis = sols
              }
              this.solis.push(this.newSolicitud)
              this.srvSol.save(this.solis)
              this.srvSol.saveSol(numsol, this.newSolicitud)
              this.dialog.closeAll()
              this._snackBar.open("Se inicio la solicitud " + numsol, "Ok!", {
                duration: 3000,
              });
              this.route.navigate(['admin'], { queryParams: { solicitud: numsol } })
            })
          }
        });
    }

  }

}
