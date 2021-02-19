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


  get(sol) {
    return this.http.post(environment.AUTH_API + 'Carpetadig/GetSol', {
      NumSolicitud: sol
    }, httpOptions);
  }

  insert(solicitud:Solicitud,fileBase64:string) {

    return this.http.post(environment.AUTH_API + 'Carpetadig/InsertFile', {
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
