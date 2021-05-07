import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  constructor(
    private http: HttpClient
  ) { }

  getByNum(solicitud:number){
    return this.http.get(`${environment.AUTH_API}Solicitud/GetByNum?Numero=${solicitud}`)
  }
}
