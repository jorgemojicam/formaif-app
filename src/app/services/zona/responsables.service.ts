import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResponsablesService {

  constructor(
    private http:HttpClient
  ) { }

  get() {
    return this.http.get(`${environment.AUTH_API}Responsable`);
  } 
  create(data){
    return this.http.post(`${environment.AUTH_API}Responsable`,data);
  }
  update(data){
    return this.http.put(`${environment.AUTH_API}Responsable`,data);
  }
}
