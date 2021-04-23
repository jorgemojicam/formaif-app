import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CuestionarioService {

  constructor(
    private http: HttpClient
  ) {
    
   }
   get(): Observable<any> {
    return this.http.get(environment.AUTH_API + 'Cuestionario');
  }
}
