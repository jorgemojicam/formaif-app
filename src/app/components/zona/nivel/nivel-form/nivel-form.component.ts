import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Rol } from 'src/app/model/admin/rol';
import { Flujo } from 'src/app/model/zona/flujo';
import { RolService } from 'src/app/services/rol.service';
import { FlujoService } from 'src/app/services/zona/flujo.service';

@Component({
  selector: 'app-nivel-form',
  templateUrl: './nivel-form.component.html',
  styleUrls: ['./nivel-form.component.scss']
})
export class NivelFormComponent implements OnInit {

  constructor(
    private _srvRol: RolService,
    private _srvFlujo:FlujoService
  ) { }
  
  @Input() datos: any
  aRol:Rol[]= new Array
  aFlujo:Flujo[] = new Array

  nivelForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    flujo: new FormControl(null, Validators.required),
    orden: new FormControl(null, Validators.required),
    rol: new FormControl(null, Validators.required)
  })

  async ngOnInit() {
    this.aRol = await this.getRol() as Rol[]
    this.aFlujo = await this.getFlujo() as Flujo[]
  }

  async onSave(){

  }

  getRol() {
    return new Promise(resolve => {
      this._srvRol.get().subscribe((suc) => {
        resolve(suc)
      }, (err) => {
        console.log(err)
        resolve([])
      })
    })
  }
  getFlujo(){
    return new Promise(resolve=>{
      this._srvFlujo.get().subscribe((suc)=>{
        resolve(suc)
      },(err)=>{
        console.log(err)
        resolve([])
      })
    })
  }

}
