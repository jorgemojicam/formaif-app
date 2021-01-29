import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_CP = 'https://infopfdlmpru.azurewebsites.net/wApiFDLM/api/'

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
    return this.http.post(API_CP + 'login/authenticate', {
      UserName: "admin",
      Password: "123456",
    }, httpOptions);
  }

  get(sol) {
    return this.http.post(API_CP + 'ConsCarpetaSolicitud', {
      NumSolicitud: sol
    }, httpOptions);
  }

  insert(numdocumento:string,numsolicitud:string,fileBase64:string) {

    return this.http.post(API_CP + 'ActualizaCarpeta', {
      NumDocCli: numdocumento,
      NombreCli: "Jorge E. Mojica",
      NumSolicitud: numsolicitud,
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
