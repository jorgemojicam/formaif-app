import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';

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
      return this.http.post(environment.AUTH_APIInt + 'login/authenticate', {
        Username: use,
        Passw: user.Passw,
        Rol: "User"
      }, httpOptions);
    } else {
      return this.http.post(environment.AUTH_API + 'login/authenticate', {
        Username: user.Username,
        Passw: user.Passw,
        Rol: "User"
      }, httpOptions);
    }
  }
}
