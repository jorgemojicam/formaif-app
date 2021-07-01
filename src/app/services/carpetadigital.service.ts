import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Solicitud } from '../model/agil/solicitud';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class CarpetadigitalService {


  constructor(
    private http: HttpClient
  ) { }


  get(sol) {
    return this.http.post(environment.AUTH_API + 'Carpetadig/GetSol', {
      NumSolicitud: sol
    }, httpOptions);
  }

  insert(solicitud: Solicitud, fileBase64: string, tipo) {

    let tipoDoc = ''
    let nameFile = ''
    switch (tipo) {
      case 1:
        tipoDoc = environment.analisi
        nameFile = 'Analisis de credito.pdf'
        break;
      case 2:
        tipoDoc = environment.agro
        nameFile = 'Analisis de credito Agropecuario.pdf'
        break;
      case 3:
        tipoDoc = environment.flujo
        nameFile = 'Flujo de caja.pdf'
        break;
      case 4:
        tipoDoc = environment.meba
        nameFile = 'MEBA.pdf'
        break;
    }

    let data = {
      NumDocCli: solicitud.cedula,
      NumSolicitud: solicitud.solicitud,
      Usuario: "imglatam@fundaciondelamujer.com",
      lstMetadata: [],
      lstSoporte: [
        {
          TipoDocumento: tipoDoc,
          NombreArchivo: nameFile,
          UrlArchivo: "",
          FileBase64: fileBase64
        }
      ]
    }
    console.log('lo que se envia ->', data)
    return this.http.post(environment.AUTH_API + 'Carpetadig/InsertFile', data, httpOptions);

  }

}

