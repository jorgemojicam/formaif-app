import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class OficinaService {

  constructor(
    private http: HttpClient
  ) { }

  //Consulta la oficina del asesor
  getOficina(clave:string){
    return this.http.post(environment.AUTH_API + 'Usuarios/GetByClave', { 
      Clave: clave
    });
  }

  //Consulta los asesore se la oficina para saber el director
  getAsesores(sucursal){
    return this.http.post(environment.AUTH_API + 'Usuarios/GetByOfi', { 
      Sucursales:{
        Codigo:sucursal
      }
    });
  }
}
