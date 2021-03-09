import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificacionService {

  constructor(
    private http: HttpClient
  ) { }

  public Get(): Observable<any> {
    return this.http.get("./assets/verificacion.json");
  }
}
