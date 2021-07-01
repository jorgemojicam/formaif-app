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
export class AnalisisService {

  constructor(
    private http: HttpClient
  ) { }

  insert(solicitud:Solicitud) {
    return this.http.post(environment.AUTH_API + 'Analisis', {      
      Solicitud: solicitud.solicitud,
      Identificacion: solicitud.cedula,
      Oficina: solicitud.oficina,
      Fecha_Inicio: solicitud.fechacreacion,
      Fecha_Fin: new Date(),
      Usuario: solicitud.usuario
    }, httpOptions);
  }

}
