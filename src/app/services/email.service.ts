import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Email } from '../model/email';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private http: HttpClient
  ) { }

  Send(email: any) {
    return this.http.post(environment.AUTH_API + 'Envios/Send', email);
  }

}
