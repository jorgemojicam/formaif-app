import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    solicitud: new FormControl('', Validators.required),
    cedula: new FormControl('', Validators.required),
    asesor: new FormControl("1", Validators.required)
  });

  private newSolicitud: Solicitud = new Solicitud();
  solis=[];
  constructor(
    public srvSol: IdbSolicitudService,
    private _snackBar: MatSnackBar,
    private route:Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

  }

  onSave(data: any) {

    const numsol = data.solicitud.toString()
    this.newSolicitud = Object.assign(this.newSolicitud, data);
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
            this._snackBar.open("Se inicio la solicitud "+numsol, "Ok!", {
              duration: 3000,
            });
            this.route.navigate(['admin'])
          })
        }
      });

  }

}
