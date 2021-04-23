import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoProduccion } from '../model/tipoproduccion';

@Injectable({
  providedIn: 'root'
})
export class ProduccionService {

  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<any> {
    return this.http.get(environment.AUTH_API + 'Produccion');
  }
  getById(id){
    return this.http.get(`${environment.AUTH_API}Produccion/?id=${id}`);
  }
  create(produccion:TipoProduccion){    
    return this.http.post(`${environment.AUTH_API}Produccion`,produccion)
  }
  update(produccion:TipoProduccion){
    return this.http.put(`${environment.AUTH_API}Produccion`,produccion)
  }
  delete(produccion:TipoProduccion){
    return this.http.delete(`${environment.AUTH_API}Produccion`)
  }

}
