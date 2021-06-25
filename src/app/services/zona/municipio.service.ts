import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {

  constructor(
    private http: HttpClient
  ) { }


  get(departamento) {
    return this.http.get(`${environment.AUTH_API}Municipio/GetByDep?departamento=${departamento}`);
  }
}
