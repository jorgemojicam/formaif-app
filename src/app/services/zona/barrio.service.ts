import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BarrioService {

  constructor(
    private http: HttpClient
  ) { }

  GetByMunDep(mun, dep) {
    return this.http.get(`${environment.AUTH_API}Barrio/GetByMunDep?municipio=${mun}&departamento=${dep}`);
  }
}
