import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Respuestas } from '../model/respuestas';

@Injectable({
  providedIn: 'root'
})
export class RespuestasService {

  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<any> {
    return this.http.get(environment.AUTH_API + 'Respuestas');
  }
  getById(id){
    return this.http.get(`${environment.AUTH_API}Respuestas/?id=${id}`);
  }
  getByCuestionario(id){
    return this.http.get(`${environment.AUTH_API}Respuestas/GetByCuestionario?cuestionario=${id}`)
  }
  create(produccion:Respuestas){    
    return this.http.post(`${environment.AUTH_API}Respuestas`,produccion)
  }
  update(produccion:Respuestas){
    return this.http.put(`${environment.AUTH_API}Respuestas`,produccion)
  }
  delete(produccion:Respuestas){
    return this.http.delete(`${environment.AUTH_API}Respuestas`)
  }
}
