import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoService {

  constructor(
    private http: HttpClient
  ) { }

  get() {
    return this.http.get(`${environment.AUTH_API}Tipo`);
  }
  create(data) {
    return this.http.post(`${environment.AUTH_API}Tipo`, data);
  }
  update(data) {
    return this.http.put(`${environment.AUTH_API}Tipo`, data);
  }
  delete(id) {
    return this.http.delete(`${environment.AUTH_API}Tipo`,id);
  }
}
