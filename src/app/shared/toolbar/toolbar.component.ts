import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, ActivationEnd, ActivationStart, NavigationEnd, Router } from '@angular/router';

import { TokenStorageService } from 'src/app/services/token-storage.service';
import { IdbSolicitudService } from '../../services/idb-solicitud.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})

export class ToolbarComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;  
  titulo: string;
  color: string = 'primary'

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private _bottomSheet: MatBottomSheet,
    private tokenStorage: TokenStorageService,
    public srvSol: IdbSolicitudService
  ) {

    this.titulo = 'QUIZ'
  }

  ngOnInit(): void {
  }

  action() {

    if (this.sidenav.opened) {
      this.sidenav.close();
    } else {
      this.sidenav.open()
    }
  }

  onLogout() {
    console.log("cerro sesion")
  }

}
