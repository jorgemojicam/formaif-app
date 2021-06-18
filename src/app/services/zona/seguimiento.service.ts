import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoService {

  constructor(
    private http: HttpClient
  ) { }

  get() {
    return this.http.get(`${environment.AUTH_API}SeguimientoZona`);
  } 
  getBySol(solicitud) {
    return this.http.get(`${environment.AUTH_API}SeguimientoZona/GetBySol?sol=${solicitud}`);
  }
  create(data){
    return this.http.post(`${environment.AUTH_API}SeguimientoZona`,data);
  }
  update(data){
    return this.http.put(`${environment.AUTH_API}SeguimientoZona`,data);
  }
}
