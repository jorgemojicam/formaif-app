import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CapacidadAdaptativaService {

  constructor(
    private http: HttpClient
  ) { }

  public getCapacidadAdap(): Observable<any> {
    return this.http.get("./assets/capacidad-adaptativa.json");
  }
}
