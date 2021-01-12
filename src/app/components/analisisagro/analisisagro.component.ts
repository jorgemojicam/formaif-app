import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Solicitud } from 'src/app/model/solicitud';
import { IdbSolicitudService } from '../admin/idb-solicitud.service';

@Component({
  selector: 'app-analisisagro',
  templateUrl: './analisisagro.component.html',
  styleUrls: ['./analisisagro.component.scss']
})
export class AnalisisagroComponent implements OnInit {

  datasolicitud: Solicitud = new Solicitud()
  tipoAsesor: number;
  fechahoy:string;
  
  constructor(
    private activeRoute: ActivatedRoute,
    public srvSol: IdbSolicitudService,) { }

  ngOnInit(): void {
    this.activeRoute.queryParamMap
      .subscribe((params) => {
        let sol = params.get('solicitud')
        this.srvSol.getSol(sol).subscribe((datasol) => {
          let hoy = new Date()
          let mes: number = hoy.getMonth() + 1
          this.fechahoy = hoy.getDate() + "/" + mes + "/" + hoy.getFullYear()
          this.datasolicitud = datasol as Solicitud
          this.tipoAsesor = this.datasolicitud.asesor
        })
      });
  }

}
