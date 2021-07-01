import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Regional } from 'src/app/model/admin/regional';
import { Rol } from 'src/app/model/admin/rol';
import { RegionalService } from 'src/app/services/regional.service';
import { RolService } from 'src/app/services/rol.service';

@Component({
  selector: 'app-responsables-form',
  templateUrl: './responsables-form.component.html',
  styleUrls: ['./responsables-form.component.scss']
})
export class ResponsablesFormComponent implements OnInit {

  constructor(
    private _srvRol:RolService,
    private _srvRegional:RegionalService
  ){

  }
  @Input() datos: any
  aRol:Rol[]= new Array
  aRegional:Regional[] = new Array

  responsableForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    username: new FormControl(null, Validators.required),
    rol: new FormControl(null, Validators.required),
    regional: new FormControl(null, Validators.required)    
  })

  async ngOnInit() {
    this.aRol = await this.getRol() as Rol[]
    this.aRegional = await this.getRegional() as Regional[]
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
  getRegional(){
    return new Promise(resolve=>{
      this._srvRegional.get().subscribe((suc)=>{
        resolve(suc)
      },(err)=>{
        console.log(err)
        resolve([])
      })
    })
  }
}
