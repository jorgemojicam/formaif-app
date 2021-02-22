import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { Asesor } from 'src/app/model/asesor';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { IdbSolicitudService } from './idb-solicitud.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;

  sol: string;
  titulo: string;
  tipo: number = 0;
  perfil: Asesor = this.srvTokn.getUser();

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    public srvSol: IdbSolicitudService,
    public srvTokn: TokenStorageService,

  ) { }

  ngOnInit(): void {

    this.activateRoute.queryParamMap.subscribe((params) => {
      this.sol = params.get('solicitud')  
    });
  }
}
