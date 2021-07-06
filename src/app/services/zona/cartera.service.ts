import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarteraService {

  constructor(
    private http: HttpClient
  ) { }

  getByOficina(oficina) {
    return this.http.get(`${environment.AUTH_API}Cartera?oficina=${oficina}`);
  }
}
