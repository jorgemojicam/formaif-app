import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
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

  ced: string;
  titulo: string;
  tipo:number;
  perfil:Asesor = this.srvTokn.getUser();

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private tokenStorage: TokenStorageService,
    public srvSol: IdbSolicitudService,
    public srvTokn:TokenStorageService,
   
  ) { }

  ngOnInit(): void {   
    
    this.activateRoute.queryParamMap .subscribe((params) => {
        this.ced = params.get('cedula')

        this.srvSol.getSol(this.ced).subscribe((datasol) => {
          this.tipo = datasol.asesor
          if (datasol.asesor == 2)
            this.titulo = "Agro";
          else
            this.titulo = "Asesor";
        })
      });
  }

  goHome() {
    this.router.navigate(['home'])
  }
  onLogout(){
    this.tokenStorage.signOut()
    this.router.navigate(['auth'])
  }
  action(){
    

    if(this.sidenav.opened){
      this.sidenav.close();
    }else{
      this.sidenav.open()
    }
  }


  




}
