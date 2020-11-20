import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private tknServ: TokenStorageService,
    private router: Router
    ){}
    
  canActivate(){

    if(this.tknServ.getUser()){
      return true;
    }
    this.router.navigate(['/login']);
    
  }
  
}
