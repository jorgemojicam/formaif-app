import { Component, OnInit } from '@angular/core';
import { Asesor } from 'src/app/model/asesor';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Router } from '@angular/router';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  perfil:Asesor = this.srvTokn.getUser();
  currentApplicationVersion = environment.appVersion;
  
  constructor(
    private srvTokn:TokenStorageService,
    private route: Router,
    private tokenStorage: TokenStorageService,
    private _bottomSheetRef: MatBottomSheetRef<ProfileComponent>
  ) { }

  onLogout() {
    this.tokenStorage.signOut()
    this.route.navigate(['auth'])
    this._bottomSheetRef.dismiss();
  }

  openLink(event: MouseEvent): void {    
    event.preventDefault();
  }

  ngOnInit(): void {
  }

}
