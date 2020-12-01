import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';

//const AUTH_API = 'https://fidelapi.fundaciondelamujer.com:54000/api/';
const AUTH_API = 'http://172.22.10.202:8099/api/'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-type':'application/json'
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
     return this.http.post(AUTH_API+'login/authenticate', {
       Username: user.Username,
       Passw: user.Passw
     },httpOptions);
  }
}
