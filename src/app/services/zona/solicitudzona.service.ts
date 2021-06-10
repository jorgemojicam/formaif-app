import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudzonaService {
  constructor(
    private http: HttpClient
  ) { }

  get(){
    return this.http.get(`${environment.AUTH_API}SolicitudZona`)
  }
  getById(id){
    return this.http.get(`${environment.AUTH_API}SolicitudZona/GetBySol?id=${id}`)
  }
  create(data){
    return this.http.post(`${environment.AUTH_API}SolicitudZona`,data)
  }
  update(data){
    return this.http.put(`${environment.AUTH_API}SolicitudZona`,data)
  }
}
