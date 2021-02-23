import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, ActivationEnd, ActivationStart, NavigationEnd, Router } from '@angular/router';
import { Asesor } from 'src/app/model/asesor';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { IdbSolicitudService } from '../../components/admin/idb-solicitud.service';
import { ProfileComponent } from '../../components/admin/profile/profile.component';

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
  rout: string;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private _bottomSheet: MatBottomSheet,
    private tokenStorage: TokenStorageService,
    public srvSol: IdbSolicitudService,
  ) {

    this.activateRoute.queryParamMap.subscribe((params) => {
      this.sol = params.get('solicitud')
    });

    router.events.subscribe((val) => {

      if (val instanceof ActivationStart) {
        if (val.snapshot.data.routerName) {
          this.rout = val.snapshot.data.routerName
        }
      } else if (val instanceof ActivationEnd) {
        if (val.snapshot.data.routerName) {
          this.rout = val.snapshot.data.routerName
        }   
      }
    });

  }

  ngOnInit(): void {
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

    if (this.sol) {
      this.srvSol.getSol(this.sol).subscribe((datasol) => {
        this.tipo = datasol.asesor
      })
    }
  }

  onLogout() {
    this.tokenStorage.signOut()
    this.router.navigate(['auth'])
  }

}
