import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlujoService {

  constructor(
    private http: HttpClient
  ) { }

  get() {
    return this.http.get(`${environment.AUTH_API}Flujo`);
  }
  create(data) {
    return this.http.post(`${environment.AUTH_API}Flujo`,data);
  }
  update(data) {
    return this.http.put(`${environment.AUTH_API}Flujo`,data);
  }
  delete(data) {
    return this.http.delete(`${environment.AUTH_API}Flujo`,data);
  }
  getByActivo(activo) {
    return this.http.get(`${environment.AUTH_API}Flujo?activo=${activo}`);
  }
}
