import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalisismebaprodService {

  constructor(
    private http: HttpClient
  ) { }

  create(analisis:any){
    return this.http.post(`${environment.AUTH_API}AnalisisMeba`,analisis)
  }
  createAnaProd(data:any){
    return this.http.post(`${environment.AUTH_API}AnalisisMebaProduccion`,data)
  }
}
