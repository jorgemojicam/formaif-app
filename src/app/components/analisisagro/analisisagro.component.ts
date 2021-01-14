import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Solicitud } from 'src/app/model/solicitud';
import { IdbSolicitudService } from '../admin/idb-solicitud.service';
import DataSelect from '../../data-select/dataselect.json';



@Component({
  selector: 'app-analisisagro',
  templateUrl: './analisisagro.component.html',
  styleUrls: ['./analisisagro.component.scss']
})
export class AnalisisagroComponent implements OnInit {

  constructor(
    private activeRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    public srvSol: IdbSolicitudService
  ) { }

  datasolicitud: Solicitud = new Solicitud()
  tipoAsesor: number;
  fechahoy: string;
  sol: string;

  ngOnInit(): void {
    this.activeRoute.queryParamMap.subscribe((params) => {
      this.sol = params.get('solicitud')
      this.srvSol.getSol(this.sol).subscribe((datasol) => {
        let hoy = new Date()
        let mes: number = hoy.getMonth() + 1
        this.fechahoy = hoy.getDate() + "/" + mes + "/" + hoy.getFullYear()
        this.datasolicitud = datasol as Solicitud
        this.tipoAsesor = this.datasolicitud.asesor
      })
    });

  }

   transform(base) {
     return this.sanitizer.bypassSecurityTrustResourceUrl(base);
   }

}
