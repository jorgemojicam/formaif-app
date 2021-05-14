import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(
    private http: HttpClient
  ) { }


  get() {
    return this.http.get(`${environment.AUTH_API}Rol`);
  }
  getById(id){
    return this.http.get(`${environment.AUTH_API}Rol/${id}`)
    
  }
  create(tema){    
    return this.http.post(`${environment.AUTH_API}Rol`,tema)
  }
  update(tema:any){
    return this.http.put(`${environment.AUTH_API}Rol`,tema)
  }
}
