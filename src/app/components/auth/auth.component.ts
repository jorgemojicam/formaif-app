import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Pregunta } from 'src/app/model/pregunta';
import { Respuestas } from 'src/app/model/respuestas';
import { Temas } from 'src/app/model/temas';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { IdbService } from 'src/app/services/idb.service';
import { ProduccionService } from 'src/app/services/MEBA/produccion.service';
import { RespuestasService } from 'src/app/services/MEBA/respuestas.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  loading: Boolean = false
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
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

  }

  showPass(ev) {
    this.hidenPass = ev.checked
  }

  async onLogin(user: User) {

    this.loading = true
    let res = await this.login(user) as any

    let resuser = res.data
    if (!res.error && resuser.token) {

      this.tokenStorage.saveToken(resuser.token);
      this.tokenStorage.saveUser(resuser.usario);

      let resDimension = await this.getDimenciones()
      let dim = this.loadCuestionario(resDimension)
      await this.saveDimension(dim)

      let resMedidas = await this.getMedidas()
      let med = this.loadCuestionario(resMedidas)
      await this.saveMedidas(med)

      let prod = await this.getProduccion()
      await this.saveProduccion(prod)

      this.route.navigate(['lobby']);
      this.loading = false

    } else {

      let errMsg = ""
      if (resuser.status == 401) {
        errMsg = "Usuario o contraseña incorrecta "
      } else if (resuser.status == 0) {
        errMsg = "¡Error al ingresar! verifique la conexión a intenet."
      } else {
        errMsg = "Se presento error con la conexion con el servidor. " + resuser.message
      }
      this._snackBar.open(errMsg, "Ok!", { duration: 3000, });
      this.loading = false
    }
  }

  login(user) {
    return new Promise(resolve => {
      this.authServ.login(user).subscribe(
        (res) => {
          resolve({ error: false, data: res })
        }, (err) => {
          resolve({ error: true, data: err })
          console.error(err)
        })
    })
  }

  getDimenciones() {
    return new Promise(resolve => {
      this._srvRespuesta.getByCuestionario(1).subscribe(
        (a) => {
          resolve(a)
        }, (err) => {
          console.log(err)
          resolve([])
        })
    })
  }
  getMedidas() {
    return new Promise(resolve => {
      this._srvRespuesta.getByCuestionario(2).subscribe(
        (a) => {
          resolve(a)
        }, (err) => {
          console.log(err)
          resolve([])
        })
    })
  }
  getProduccion() {
    return new Promise(resolve => {
      this._srvProduccion.get().subscribe(
        (a) => {
          resolve(a)
        }, (err) => {
          console.log(err)
          resolve([])
        }
      )
    })
  }

  saveDimension(dim) {
    return new Promise(resolve => {
      this._srvIdb.save('dimenciones', dim).subscribe((res) => {
        console.log(res)
        resolve(res)
      })
    })
  }

  saveProduccion(prod) {
    return new Promise(resolve => {
      this._srvIdb.save('produccion', prod).subscribe((res) => {
        console.log(res)
        resolve(res)
      })
    })
  }

  saveMedidas(med) {
    return new Promise(resolve => {
      this._srvIdb.save('medidas', med).subscribe((res) => {
        console.log(res)
        resolve(res)
      })
    })
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