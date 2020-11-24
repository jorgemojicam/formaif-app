import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';

const AUTH_API = 'https://fidelapi.fundaciondelamujer.com:55000/api/';
//const AUTH_API = 'http://172.22.10.202:8099/api/'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Methods': "GET,POST,OPTIONS,DELETE,PUT"
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

    //return this.http.post<any>('https://fidelapi.fundaciondelamujer.com:54000/api/login/authenticate', user);   
     return this.http.post('https://fidelapi.fundaciondelamujer.com:54000/api/login/authenticate', {
       Username: user.Username,
       Passw: user.Passw
     }, httpOptions);


  }
}
