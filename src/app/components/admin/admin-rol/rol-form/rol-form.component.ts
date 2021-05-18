import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PermisoService } from 'src/app/services/permiso.service';
import { RolService } from 'src/app/services/rol.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-rol-form',
  templateUrl: './rol-form.component.html',
  styleUrls: ['./rol-form.component.scss']
})
export class RolFormComponent implements OnInit {

  constructor(
    private _srvRol: RolService,
    private _srvPermiso: PermisoService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ModalComponent>,
  ) { }

  @Input() datos: any
  permisosList: any[]
  loading:boolean = false


  public rolForm = new FormGroup({
    Id: new FormControl(0),
    Nombre: new FormControl('',[Validators.required]),
    Permiso: new FormControl('',[Validators.required]),
  });

  async ngOnInit() {
    
    this.permisosList = await this.getPermisos() as any

    if (this.datos) {
      this.rolForm = new FormGroup({
        Id: new FormControl(this.datos.Id),
        Nombre: new FormControl(this.datos.Nombre,[Validators.required]),
        Permiso: new FormControl([this.datos.Permiso],[Validators.required]),
      });     
    }
  }

  onSave() {
   
    this.loading = true
    if(this.rolForm.value.Id > 0){

      this._srvRol.update(this.rolForm.value).subscribe((res)=>{
        this.dialogRef.close(res)
        this._snackBar.open('Se modifico correctamente', "Ok!", { duration: 3000, });
        this.loading = false
      },(err)=>{
        this._snackBar.open('Error modificando registro', "Ok!", { duration: 3000, });
        this.loading = false
      })
    }else{
      this._srvRol.create(this.rolForm.value).subscribe((res)=>{
        this.dialogRef.close(res)
        this._snackBar.open('Se inserto correctamente', "Ok!", { duration: 3000, });
        this.loading = false
      },(err)=>{
        this._snackBar.open('Error insetando registro', "Ok!", { duration: 3000, });
        this.loading = false
      })

    }
    
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
