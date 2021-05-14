import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Asesor } from 'src/app/model/asesor';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  perfil: Asesor = this._srvTokn.getUser();
  rol: number

  constructor(
    private route: Router,
    private _srvTokn: TokenStorageService
  ) {
    console.log(this.perfil)
  }

  ngOnInit(): void {


    if (!this.perfil) {
      this._srvTokn.signOut()
      this.route.navigate(['auth'])
      return
    } else {
      console.log(this.perfil.Rol)
      this.rol = this.perfil.Rol.Permiso.Id
    }

  }

  onRouter(module: string) {
    this.route.navigate([module])
  }

}
