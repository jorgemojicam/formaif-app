import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModuloRolesService } from 'src/app/services/modulo-roles.service';
import { ModuloService } from 'src/app/services/modulo.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-modulos-form',
  templateUrl: './modulos-form.component.html',
  styleUrls: ['./modulos-form.component.scss']
})
export class ModulosFormComponent implements OnInit {

  @Input() datos
  aModulos: any[] = []
  selectdModulos
  loading

  constructor(
    private _srv: ModuloService,
    private _srvModRol: ModuloRolesService,
    private dialogRef: MatDialogRef<ModalComponent>,
    private _snackBar: MatSnackBar,
  ) { }

  async ngOnInit() {
    this.aModulos = await this.get() as any[]
  }

  get() {
    return new Promise(resolve => {
      this._srv.get().subscribe((sus) => {
        resolve(sus)
      }, (err) => {
        resolve([])
      })
    })
  }

  create(data) {
    return new Promise(resolve => {
      this._srvModRol.create(data).subscribe((sus) => {
        resolve(sus)
      }, (err) => {
        resolve(null)
      })
    })

  }
  async onSave(){

    let modulo = this.selectdModulos.Id
    let rol = this.datos.Rol
    let data = {
      Modulo:{
        Id: modulo
      },
      Rol:{
        Id: rol
      }
    }
    console.log("envio data ->",data)
    let res = await this.create(data)
    console.log("res  ->",res)

    if (res) {
      this._snackBar.open('Se actualizo correctamente', "Ok!", { duration: 4000, });
    } else {
      this._snackBar.open('Se presento un error insertando', "Ok!", { duration: 4000, });
    }

    this.dialogRef.close(res)
    
  }


}
