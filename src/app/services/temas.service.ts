import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Temas } from '../model/temas';

@Injectable({
  providedIn: 'root'
})
export class TemasService {

  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<any> {
    return this.http.get(`${environment.AUTH_API}Temas`);
  }
  getById(id){
    return this.http.get<Temas[]>(`${environment.AUTH_API}Temas/${id}`)
    
  }
  create(tema:Temas){    
    return this.http.post(`${environment.AUTH_API}Temas`,tema)
  }
  update(tema:any){
    return this.http.put(`${environment.AUTH_API}Temas`,tema)
  }
  createByAnalisis(data){    
    return this.http.post(`${environment.AUTH_API}AnalisismebaTema`,data)
  }
}
