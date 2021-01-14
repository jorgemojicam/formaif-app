import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';

const AUTH_API = 'https://fidelapi.fundaciondelamujer.com:54000/api/';
const AUTH_APIInt = 'https://fidelapipruebas.fundaciondelamujer.com:8085/api/';
const API_PROD = 'https://fidelapi.fundaciondelamujer.com:55000/api/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  login(user: User): Observable<any> {

    let userdom = user.Username.split('/')
    let dom = userdom[0];
    let use = userdom[1];

    if (dom == "pruebas") {
      return this.http.post(AUTH_APIInt + 'login/authenticate', {
        Username: use,
        Passw: user.Passw,
        Rol: "User"
      }, httpOptions);
    } else {
      return this.http.post(AUTH_API + 'login/authenticate', {
        Username: user.Username,
        Passw: user.Passw,
        Rol: "User"
      }, httpOptions);
    }
  }
}
