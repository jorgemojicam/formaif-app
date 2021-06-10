import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultadoService {

  constructor(
    private http: HttpClient
  ) { }

  create(res:any){
    return this.http.post(`${environment.AUTH_API}Resultado`,res)
  }
}
