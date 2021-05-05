import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Asesor } from 'src/app/model/asesor';
import { Pregunta } from 'src/app/model/pregunta';
import { Respuestas } from 'src/app/model/respuestas';
import { Temas } from 'src/app/model/temas';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { IdbService } from 'src/app/services/idb.service';
import { OficinaService } from 'src/app/services/oficina.service';
import { ProduccionService } from 'src/app/services/produccion.service';
import { RespuestasService } from 'src/app/services/respuestas.service';
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
    private _srvRespuesta: RespuestasService,
    private _srvProduccion: ProduccionService,
    private _srvIdb: IdbService,
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
          this.route.navigate(['lobby']);       
          this.isLogged = false
          this.getRespuestas()
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
          this._snackBar.open(errMsg, "Ok!", {duration: 3000,});
          this.isLogged = false
        }
      )
    } else {
      this.authServ.login(user).subscribe(
        res => {         
          this.tokenStorage.saveToken(res);
          //this.ofiServ.getOficina('MAIRA.LAJUD').subscribe(
          this.ofiServ.getOficina(user.Username).subscribe(
            (ofi) => {
              if (ofi) {
                this.tokenStorage.saveUser(ofi);
                this.isLogged = false
                this.getRespuestas()
              }
            },
            (err) => {
              this.isLogged = false
              this._snackBar.open("No se encontro oficina asignada, comuniquese con el area de Riesgos [codigo " + err.status + "]", "Ok!", {
                duration: 10000,
              });
            }
          )
          this.route.navigate(['lobby']);
          this.isLogged = false          
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
          this._snackBar.open(errMsg, "Ok!", {duration: 3000,});
          this.isLogged = false
        }
      )
    }
  }

  getRespuestas() {
    this._srvRespuesta.getByCuestionario(1).subscribe(
      (a) => {
        let dim = this.loadCuestionario(a)
        //this._srvIdb.delete('dimenciones')
        this._srvIdb.save('dimenciones', dim)
      },
      (err) => {

      }
    )

    this._srvRespuesta.getByCuestionario(2).subscribe(
      (a) => {
        let med = this.loadCuestionario(a)
        //this._srvIdb.delete('medidas')
        this._srvIdb.save('medidas', med)
      },
      (err) => {

      }
    )

    this._srvProduccion.get().subscribe(
      (a) => {
        //this._srvIdb.delete('produccion')
        this._srvIdb.save('produccion', a)
      }, (err) => {

      }
    )

  }

  loadCuestionario(respuestas) {

    let cuestion: Temas[] = new Array()

    respuestas.forEach(function (a) {
      let objtema = new Temas()
      objtema.Nombre = a.Preguntas.Temas.Nombre
      objtema.Id = a.Preguntas.Temas.Id
      objtema.Peso = a.Preguntas.Temas.Peso
      objtema.Preguntas = new Array()

      let objPregunta = new Pregunta()
      objPregunta.Titulo = a.Preguntas.Titulo
      objPregunta.Id = a.Preguntas.Id
      objPregunta.Peso = a.Preguntas.Peso
      objPregunta.Total = a.Preguntas.Total
      objPregunta.Multiple = a.Preguntas.Multiple
      objPregunta.Respuestas = new Array()

      let objRespuesta = new Respuestas()
      objRespuesta.Texto = a.Texto
      objRespuesta.Punaje = a.Puntaje
      objRespuesta.Id = a.Id

      if (cuestion.some(e => e.Id === a.Preguntas.Temas.Id)) {
        let ipr = cuestion.findIndex(c => c.Id === a.Preguntas.Temas.Id)

        if (cuestion[ipr].Preguntas.some(e => e.Id === a.Preguntas.Id)) {
          let ire = cuestion[ipr].Preguntas.findIndex(c => c.Id === a.Preguntas.Id)
          cuestion[ipr].Preguntas[ire].Respuestas.push(objRespuesta)
        } else {
          if (objRespuesta.Id > 0) {
            objPregunta.Respuestas.push(objRespuesta)
          }
          cuestion[ipr].Preguntas.push(objPregunta)
        }
      } else {
        if (objPregunta.Id > 0) {
          if (objRespuesta.Id > 0) {
            objPregunta.Respuestas.push(objRespuesta)
          }
          objtema.Preguntas.push(objPregunta)
        }
        cuestion.push(objtema)
      }

    });
    return cuestion
  }
}
