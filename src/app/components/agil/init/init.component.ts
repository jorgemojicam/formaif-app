import { Component, Input, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Asesor } from 'src/app/model/asesor';
import { Solicitud } from 'src/app/model/solicitud';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { IdbSolicitudService } from '../../../services/idb-solicitud.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss']
})
export class InitComponent implements OnInit {

  @Input() datos
  

  initForm = new FormGroup({
    solicitud: new FormControl('', [Validators.min(999999999), Validators.max(9999999999)]),
    cedula: new FormControl('', [Validators.required, Validators.min(99999), Validators.max(9999999999)]),
    asesor: new FormControl("1", Validators.required)
  });

  private newSolicitud: Solicitud = new Solicitud();
  solis = [];
  constructor(
    public srvSol: IdbSolicitudService,
    private _snackBar: MatSnackBar,
    private route: Router,
    public dialog: MatDialog,
    private tokenStorage: TokenStorageService,
  ) { }

  ngOnInit(): void {

    if (this.datos) {
      
      this.initForm = new FormGroup({
        solicitud: new FormControl(this.datos.solicitud, [Validators.min(999999999), Validators.max(9999999999)]),
        cedula: new FormControl(this.datos.cedula, [Validators.required, Validators.min(99999), Validators.max(9999999999)]),
        asesor: new FormControl(this.datos.asesor, Validators.required)
      });

    } else {

      this.initForm = new FormGroup({
        solicitud: new FormControl('', [Validators.min(999999999), Validators.max(9999999999)]),
        cedula: new FormControl('', [Validators.required, Validators.min(99999), Validators.max(9999999999)]),
        asesor: new FormControl("1", Validators.required)
      });

    }

  }

  async onSave() {

    if (this.initForm.valid) {

      const cedula = this.initForm.value.cedula.toString()
      this.newSolicitud = Object.assign(this.newSolicitud, this.initForm.value);
      let hoy: Date = new Date();
      let asesores: Asesor = this.tokenStorage.getUser()
      this.newSolicitud.fechacreacion = hoy
      this.newSolicitud.usuario = asesores.Clave
      this.newSolicitud.oficina = asesores.Sucursales.Codigo

      this.srvSol.getSol(cedula)
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
              this.srvSol.saveSol(cedula, this.newSolicitud)
              this.dialog.closeAll()
              this._snackBar.open("Se inicio la solicitud, para el cliente con cedula" + cedula, "Ok!", {
                duration: 9000,
              });
              this.route.navigate(['admin'], { queryParams: { cedula: cedula } })
            })
          }
        });
    }

  }

  onEdit() {

    if (this.initForm.valid) {
      const cedula = this.initForm.value.cedula.toString()
      const numSolicitud = this.initForm.value.solicitud

      this.srvSol.getSol(cedula).subscribe((sol) => {
        if (sol) {          
          let solicitud = sol as Solicitud
          solicitud.solicitud = numSolicitud          
          this.srvSol.saveSol(cedula, solicitud)

          this.srvSol.get().subscribe((allsol)=>{

            let aSolicitudOld =allsol.filter(a => a.cedula != cedula)
            let aSolicitud = allsol.find(a => a.cedula == cedula) as Solicitud
            aSolicitud.solicitud = numSolicitud
            aSolicitudOld.push(aSolicitud)            
            this.srvSol.save(aSolicitudOld)
          })
        }

        this.dialog.closeAll()
      })
    }

  }

}
