import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Solicitud } from 'src/app/model/solicitud';
import { IdbSolicitudService } from '../admin/idb-solicitud.service';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.scss']
})
export class ResultadoComponent implements OnInit {

  datasolicitud: Solicitud = new Solicitud()
  sol: string;
  salarios: number = 0;
  totalinventarios:number=0;
  totalactivosneg: number = 0;
  totalactivosfam: number =0;
  totalgastosfam:number =0;
  totalotrosingresosfam:number =0;
  obligacionesfin:number=0;
  gastosgenerales:number=0;
  creditosproveedores:number=0;


  constructor(
    private activeRoute: ActivatedRoute,
    public srvSol: IdbSolicitudService,
  ) { }

  ngOnInit(): void {

    this.activeRoute.queryParamMap
      .subscribe((params) => {
        this.sol = params.get('solicitud')
      });

    this.srvSol.getSol(this.sol)
      .subscribe((datasol) => {
        this.datasolicitud = datasol as Solicitud
        if (this.datasolicitud.Gastos) {
          this.salarios = this.datasolicitud.Gastos.totalRemuneracion
          this.totalgastosfam =this.datasolicitud.Gastos.totalF
          this.totalotrosingresosfam = this.datasolicitud.Gastos.totalOtros
          this.gastosgenerales=this.datasolicitud.Gastos.totalN
        }
        if (this.datasolicitud.Balance) {
          this.totalinventarios = this.datasolicitud.Balance.inventarioTotal
          this.totalactivosneg = this.datasolicitud.Balance.actnegTotal
          this.totalactivosfam = this.datasolicitud.Balance.actfamTotal
          this.obligacionesfin = this.datasolicitud.Balance.totalCreditos
          this.creditosproveedores=this.datasolicitud.Balance.proveedoresTotal
        }
      })

  }

}
