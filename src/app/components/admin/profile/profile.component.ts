import { Component, OnInit } from '@angular/core';
import { Asesor } from 'src/app/model/asesor';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  perfil:Asesor = this.srvTokn.getUser();
  
  constructor(
    private srvTokn:TokenStorageService,
    private route: Router,
    private tokenStorage: TokenStorageService,
  ) { }

  onLogout() {
    this.tokenStorage.signOut()
    this.route.navigate(['auth'])
  }

  ngOnInit(): void {
  }

}
