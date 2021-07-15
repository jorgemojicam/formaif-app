import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AnalisisService {

  constructor(
    private http: HttpClient
  ) { }

  insert(data) {
    return this.http.post(environment.AUTH_API + 'Analisis', data, httpOptions);
  }

}
