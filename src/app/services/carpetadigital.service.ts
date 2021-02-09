import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Solicitud } from '../model/solicitud';

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

  loginCD() {
    return this.http.post(environment.API_CP + 'login/authenticate', {
      UserName: "admin",
      Password: "123456",
    }, httpOptions);
  }

  get(sol) {
    return this.http.post(environment.API_CP + 'ConsCarpetaSolicitud', {
      NumSolicitud: sol
    }, httpOptions);
  }

  insert(solicitud:Solicitud,fileBase64:string) {

    return this.http.post(environment.API_CP + 'ActualizaCarpeta', {
      NumDocCli: solicitud.cedula,
      NumSolicitud: solicitud.solicitud,
      Usuario: "imglatam@fundaciondelamujer.com",
      lstMetadata: [],
      lstSoporte: [
        {
          TipoDocumento: "COL-FO-001 Análisis de crédito (PDF Generado Asesor Agil)",
          NombreArchivo: "Analisis de credito.pdf",
          UrlArchivo: "",
          FileBase64: fileBase64
        }
      ]
    }, httpOptions);

  }

}
