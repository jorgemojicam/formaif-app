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
  getByActivo(activo) {
    return this.http.get(`${environment.AUTH_API}Flujo?activo=${activo}`);
  }
}
