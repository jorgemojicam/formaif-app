import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  loginForm = new FormGroup({
    Username: new FormControl('', Validators.required),
    Passw: new FormControl('', Validators.required)
  });

  constructor(
    private authServ: AuthService,
    private route: Router,
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit(): void { 
  }


  onLogin(form: User) {
   
    this.authServ.login(form)
      .subscribe(
        res => {
          console.log(res)
          this.tokenStorage.saveToken(res.accessToken);
          this.tokenStorage.saveUser(res);
          this.route.navigate(['/']);
        },
        err => {
          console.log('Error' , err)
        }
      )
  }

}
