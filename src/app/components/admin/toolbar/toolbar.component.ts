import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { Asesor } from 'src/app/model/asesor';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { IdbSolicitudService } from '../idb-solicitud.service';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;
  sol: string;
  perfil: Asesor = this.tokenStorage.getUser();
  tipo: number = 0;
  titulo: string;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private _bottomSheet: MatBottomSheet,
    private tokenStorage: TokenStorageService,
    public srvSol: IdbSolicitudService,
  ) { }

  ngOnInit(): void {

    this.activateRoute.queryParamMap.subscribe(
      (params) => {
        this.sol = params.get('solicitud')
      }, (err) => {
        console.log(err)
      });
  }

  openProfile(): void {
    this._bottomSheet.open(ProfileComponent);
  }
  action() {

    if (this.sidenav.opened) {
      this.sidenav.close();
    } else {
      this.sidenav.open()
    }
  }

  onLogout() {
    this.tokenStorage.signOut()
    this.router.navigate(['auth'])
  }

}
