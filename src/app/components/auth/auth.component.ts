import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  isLogged:Boolean = false
  loginForm = new FormGroup({
    Username: new FormControl('',  [Validators.pattern('^[A-Za-z0-9]+$')]),
    Passw: new FormControl('', Validators.required)
  });

  hidenPass: boolean = false

  constructor(
    private authServ: AuthService,
    private route: Router,
    private tokenStorage: TokenStorageService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  showPass(ev) {
    this.hidenPass=ev.checked
  }
  onLogin(form: User) {
    this.isLogged = true
    this.authServ.login(form)
      .subscribe(
        res => {
          console.log(res)
          this.tokenStorage.saveToken(res);
          this.tokenStorage.saveUser(form.Username);
          this.route.navigate(['home']);
          this.isLogged = false
        },
        err => {          
          let errMsg = ""
          console.log(err.status)
          if(err.status ==401){
            errMsg="Usuario o contraseña incorrecta"
          }else if(err.status ==0){
            errMsg ="¡Error al ingresar! verifique la conexión a intenet."
          }else{
            errMsg ="Se presento error con la conexion con el servidor."
          }
          this._snackBar.open(errMsg, "Ok!", {
            duration: 3000,
          });
          this.isLogged = false
        }
      )
  }
}
