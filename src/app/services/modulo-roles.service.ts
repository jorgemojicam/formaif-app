import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModuloRolesService {

  constructor(
    private http: HttpClient
  ) { }

  create(data) {
    return this.http.post(`${environment.AUTH_API}Modulo_Rol`,data);
  }
  update(data) {
    return this.http.put(`${environment.AUTH_API}Modulo_Rol`,data);
  }
  delete(data) {
    return this.http.delete(`${environment.AUTH_API}Modulo_Rol`,data);
  }
  getByRol(rol) {
    return this.http.get(`${environment.AUTH_API}Modulo_Rol/GetByRol?idRol=${rol}`);
  }
}
