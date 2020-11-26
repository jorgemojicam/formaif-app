import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public opened: boolean = false
  sol: string;
  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private tokenStorage: TokenStorageService
  ) { }
  ngOnInit(): void {    
    this.activateRoute.queryParamMap
      .subscribe((params) => {
        this.sol = params.get('solicitud')
      });
  }

  goHome() {
    this.router.navigate(['home'])
  }
  onLogout() {
    this.tokenStorage.signOut()
  }




}
