import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private http: HttpClient
  ) { }

  Send(email: any) {
    return this.http.post(environment.AUTH_API + 'Envios/Send', email, httpOptions);
  }

  SendAdjunto(email: any) {
    return this.http.post(environment.AUTH_API + 'Envios/SendAdjunto', email, httpOptions);
  }

}
