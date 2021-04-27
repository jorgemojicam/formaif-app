import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pregunta } from '../model/pregunta';

@Injectable({
  providedIn: 'root'
})
export class PreguntasService {

  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<any> {
    return this.http.get(environment.AUTH_API + 'Preguntas');
  }
  getById(id){
    return this.http.get(`${environment.AUTH_API}Preguntas?id=${id}`);
  }
  create(produccion:any){    
    return this.http.post(`${environment.AUTH_API}Preguntas`,produccion)
  }
  update(produccion:any){
    return this.http.put(`${environment.AUTH_API}Preguntas`,produccion)
  }
  delete(produccion:any){
    return this.http.delete(`${environment.AUTH_API}Preguntas`)
  }
}
