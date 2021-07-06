import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LimiteService {

  constructor(
    private http: HttpClient
  ) { }

  getBySolicitud(idSolicitud) {
    return this.http.get(`${environment.AUTH_API}Limite?idSolicitud=${idSolicitud}`);
  }
  create(data) {
    return this.http.post(`${environment.AUTH_API}Limite`, data);
  }
  update(data) {
    return this.http.put(`${environment.AUTH_API}Limite`, data);
  }
}
