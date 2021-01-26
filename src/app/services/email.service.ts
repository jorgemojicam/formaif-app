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

  Send(email: Email): Observable<any> {  
      return this.http.post(environment.AUTH_API + 'Envios/Send', {
          To: email.To,
          Base64Pdf: email.Base64Pdf,
          Subject: email.Subject,
          Body: email.Body
      });
  }

}
