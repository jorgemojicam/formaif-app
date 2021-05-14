import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PermisoService } from 'src/app/services/permiso.service';
import { RolService } from 'src/app/services/rol.service';

@Component({
  selector: 'app-rol-form',
  templateUrl: './rol-form.component.html',
  styleUrls: ['./rol-form.component.scss']
})
export class RolFormComponent implements OnInit {

  constructor(
    private _srvRol: RolService,
    private _srvPermiso: PermisoService
  ) { }

  @Input() datos: any
  permisosList: any[]


  public rolForm = new FormGroup({
    Id: new FormControl(''),
    Nombre: new FormControl(''),
    Permiso: new FormControl(''),
  });

  async ngOnInit() {
    this.permisosList = await this.getPermisos() as any
  }

  onSave() {

  }

  getPermisos() {
    return new Promise(resolve => {
      this._srvPermiso.get().subscribe((suss) => {
        resolve(suss)
      }, (err) => {
        resolve(null)
      })
    })
  }

}
