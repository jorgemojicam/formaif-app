import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { LocalStorageService } from './local-storage.service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})

export class TokenStorageService {

  jwtToken: string;
  decodedToken: { [key: string]: string };

  constructor(
    private srvLocalS: LocalStorageService,
  ) { }

  setToken(token: string) {
    if (token) {
      this.jwtToken = token;
    }
  }
  decodeToken() {
    if (this.jwtToken) {
      this.decodedToken = jwt_decode(this.jwtToken);
    }
  }
  getDecodeToken() {
    return jwt_decode(this.jwtToken);
  }

  signOut(): void {
    this.srvLocalS.removeall();
  }
  public saveToken(token: string): void {
    this.srvLocalS.remove(TOKEN_KEY)
    this.srvLocalS.set(TOKEN_KEY,token)
  }
  public getToken(): string {
    return this.srvLocalS.get(TOKEN_KEY);
  }
  public saveUser(user): void {
    this.srvLocalS.remove(USER_KEY);
    this.srvLocalS.set(USER_KEY, JSON.stringify(user));
  }
  public getUser(): any {
    return JSON.parse(this.srvLocalS.get(USER_KEY));
  }

  
}
