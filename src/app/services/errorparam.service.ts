import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ErrorparamService {

  constructor(
    private http: HttpClient
  ) { }

  get() {
    return this.http.get(`${environment.AUTH_API}ParamErrores`);
  }
  create(data) {
    return this.http.post(`${environment.AUTH_API}ParamErrores`,data);
  }
}
