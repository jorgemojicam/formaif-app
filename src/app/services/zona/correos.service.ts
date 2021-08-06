import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CorreosService {

  constructor(
    private http:HttpClient
  ) { }

  get() {
    return this.http.get(`${environment.AUTH_API}Correos`);
  }
  create(data) {
    return this.http.post(`${environment.AUTH_API}Correos`,data);
  }
  update(data) {
    return this.http.put(`${environment.AUTH_API}Correos`,data);
  }
  delete(data) {
    return this.http.delete(`${environment.AUTH_API}Correos`,data);
  }
  getByEstado(activo) {
    return this.http.get(`${environment.AUTH_API}Correos?activo=${activo}`);
  }
}
