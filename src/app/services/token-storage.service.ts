import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { EncryptService } from './encrypt.service';
import { LocalStorageService } from './local-storage.service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})

export class TokenStorageService {

  constructor(
    private srvLocalS: LocalStorageService,
  ) { }

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
    this.srvLocalS.set(USER_KEY,JSON.stringify(user));
  }
  public getUser(): any {
    let data = this.srvLocalS.get(USER_KEY)
    return JSON.parse(data);
  }

  
}
