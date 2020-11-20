import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'https://fidelapi.fundaciondelamujer.com:8443/api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  login(credentials): Observable<any> {
    return this.http.post(AUTH_API + 'login/authenticate', {
      Username: credentials.username,
      Passw: credentials.password
    }, httpOptions);
  }
  

}
