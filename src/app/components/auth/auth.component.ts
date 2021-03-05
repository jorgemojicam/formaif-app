import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Asesor } from 'src/app/model/asesor';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { OficinaService } from 'src/app/services/oficina.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  isLogged: Boolean = false
  loginForm = new FormGroup({
    Username: new FormControl('', [Validators.pattern('^[A-Za-z0-9-.-/]+$')]),
    Passw: new FormControl('', Validators.required)
  });
  currentApplicationVersion = environment.appVersion;

  hidenPass: boolean = false

  constructor(
    private authServ: AuthService,
    private route: Router,
    private tokenStorage: TokenStorageService,
    private _snackBar: MatSnackBar,
    private ofiServ: OficinaService
  ) { }

  ngOnInit(): void {

  }

  showPass(ev) {
    this.hidenPass = ev.checked
  }
  onLogin(user: User) {
    this.isLogged = true
    let userdom = user.Username.split('/')
    let dom = userdom[0];
    let use = userdom[1];

    if (dom.toLocaleLowerCase() == "soporte") {
      user.Username = use
      this.authServ.login(user).subscribe(
        
        (res) => {
          
          let perfil: Asesor = {
            Nombre: use,
            Iniciales: "N/A",
            Grupo: "SOPORTE",
            Clave: use,
            Sucursales: {
              Codigo: "969",
              Direccion: "",
              Nombre: "SEDE ADMINISTRATIVA",
              Regionales: "0"
            },
            Director: {
              Nombre: "Transformacion Digital",
              Iniciales: "TD",
              Clave: "transformaciondigital",
              Sucursales: {
                Codigo: "969",
                Direccion: "",
                Nombre: "SEDE ADMINISTRATIVA",
                Regionales: "0"
              },
              Director: null,
              Grupo: "TRADIG"
            }
          }
          this.tokenStorage.saveToken(res);
          this.tokenStorage.saveUser(perfil);
          this.route.navigate(['home']);
          this.isLogged = false
        },
        (err) => {
         
          let errMsg = ""
          if (err.status == 401) {
            errMsg = "Usuario o contraseña incorrecta "
          } else if (err.status == 0) {
            errMsg = "¡Error al ingresar! verifique la conexión a intenet."
          } else {
            errMsg = "Se presento error con la conexion con el servidor. " + err.message
          }
          this._snackBar.open(errMsg, "Ok!", {
            duration: 3000,
          });
          this.isLogged = false
        }
      )
    } else {
      this.authServ.login(user).subscribe(
        res => {         
          this.tokenStorage.saveToken(res);
          this.ofiServ.getOficina(user.Username).subscribe(
            (ofi) => {
              if (ofi) {
                this.tokenStorage.saveUser(ofi);
                this.isLogged = false
              }
            },
            (err) => {
              this.isLogged = false
              this._snackBar.open("No se encontro oficina asignada, comuniquese con el area de Riesgos [codigo " + err.status + "]", "Ok!", {
                duration: 10000,
              });
            }
          )
          this.route.navigate(['home']);
          
        },
        err => {
          let errMsg = ""
          if (err.status == 401) {
            errMsg = "Usuario o contraseña incorrecta !"
          } else if (err.status == 0) {
            errMsg = "¡Error al ingresar! verifique la conexión a intenet."
          } else {
            errMsg = "Se presento error en la conexion con el servidor. " + err.message
          }
          this._snackBar.open(errMsg, "Ok!", {
            duration: 3000,
          });
          this.isLogged = false
        }
      )
    }
  }
}
