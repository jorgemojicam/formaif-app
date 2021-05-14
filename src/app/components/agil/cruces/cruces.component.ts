
import {  Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Solicitud } from 'src/app/model/solicitud';
import { EncryptService } from 'src/app/services/encrypt.service';
import { IdbSolicitudService } from '../../../services/idb-solicitud.service';

@Component({
  selector: 'app-cruces',
  templateUrl: './cruces.component.html',
  styleUrls: ['./cruces.component.scss']
})
export class CrucesComponent implements OnInit {

  constructor(
    public srvSol: IdbSolicitudService,
    private activeRoute: ActivatedRoute,
    private _srvEncr: EncryptService
  ) { }
  tipoAsesor: number;
  loadData: boolean = false
  ced: string;

  datasolicitud: Solicitud = new Solicitud()
  dataCruces: [] = []

  ngOnInit(): void {

    this.activeRoute.queryParamMap
      .subscribe((params) => {
        this.ced = params.get('cedula')
      });

    this.srvSol.getSol(this.ced).subscribe((datasol) => {

      this.datasolicitud = JSON.parse(this._srvEncr.decrypt(datasol)) as Solicitud
      this.tipoAsesor = this.datasolicitud.asesor
    
    })
  }
  cahngeLoad(event){
    this.loadData = event
  }

}
