import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, ActivationEnd, ActivationStart, NavigationEnd, Router } from '@angular/router';
import { Asesor } from 'src/app/model/admin/asesor';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { IdbSolicitudService } from '../../services/idb-solicitud.service';
import { ProfileComponent } from '../../components/admin/profile/profile.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})

export class ToolbarComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;

  ced: string;
  perfil: Asesor = this.tokenStorage.getUser();
  tipo: number = 0;
  titulo: string;
  color: string = 'primary'
  rout: string;
  modul: string;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private _bottomSheet: MatBottomSheet,
    private tokenStorage: TokenStorageService,
    public srvSol: IdbSolicitudService
  ) {

    this.activateRoute.queryParamMap.subscribe((params) => {
      this.ced = params.get('cedula')
    });

    router.events.subscribe((val) => {

      if (val instanceof NavigationEnd) {
        this.modul = val.url.split('/')[1]
      }

      if (val instanceof ActivationStart) {
        if (val.snapshot.data.routerName) {
          this.rout = val.snapshot.data.routerName
        }
      } else if (val instanceof ActivationEnd) {
        if (val.snapshot.data.routerName) {
          this.rout = val.snapshot.data.routerName
        }
      }
      if (this.modul) {
        if (this.modul === 'meba') {
          this.titulo = 'MEBA'
        } else if (this.modul === 'agil') {
          this.titulo = 'Asesor Agil'
        } else if (this.modul === 'zona') {
          this.titulo = 'ZONAS'
          this.color = 'accent'
        } else {
          this.titulo = 'Asesor Agil'
        }
      } else {
        this.titulo = 'Asesor Agil'
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

    if (this.ced) {
      this.srvSol.getSol(this.ced).subscribe(
        (datasol) => {
          let solici = JSON.parse(datasol)
          this.tipo = solici.asesor
        })
    }
  }

  onLogout() {
    this.tokenStorage.signOut()
    this.router.navigate(['auth'])
  }

}
