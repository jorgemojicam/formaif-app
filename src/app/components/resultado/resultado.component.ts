import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Solicitud } from 'src/app/model/solicitud';
import Utils from 'src/app/utils';
import { IdbSolicitudService } from '../admin/idb-solicitud.service';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.scss']
})
export class ResultadoComponent implements OnInit {

  datasolicitud: Solicitud = new Solicitud()
  tiposol: number;
  sol: string;
  efectivo: number = 0;
  totalcuentascobrar: number = 0;
  recuperacion: number = 0;
  otraspasivoscor: number = 0;
  otraspasivosNocor: number = 0;
  salarios: number = 0;
  totalinventarios: number = 0;
  totalactivosneg: number = 0;
  totalactivosfam: number = 0;
  totalgastosfam: number = 0;
  totalotrosingresosfam: number = 0;
  totalpasivosfam: number;
  obligacionesfin: number = 0;
  gastosgenerales: number = 0;
  creditosproveedores: number = 0;
  totalingreosflujo: number = 0;
  totalrecuperacioncartera:number=0;
  costodeventaA:number =0;
  salariosA:number=0;
  gastosGeneralesA:number=0;
  obligacionesA:number=0;
  otrosIngresosA:number=0;
  gastosFamiliaresA:number=0;

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
        this.tiposol = this.datasolicitud.asesor
        let totalrecuperacion = 0
        let otrosingresos =0
        if (this.datasolicitud.Gastos) {
          this.salarios = this.datasolicitud.Gastos.totalRemuneracion
          this.totalgastosfam = this.datasolicitud.Gastos.totalF
          this.totalotrosingresosfam = this.datasolicitud.Gastos.totalOtros
          this.gastosgenerales = this.datasolicitud.Gastos.totalN
          otrosingresos = Utils.formatNumber(this.datasolicitud.Gastos.totalOtros)
        }
        if (this.datasolicitud.Balance) {
          this.efectivo = this.datasolicitud.Balance.efectivo
          this.totalcuentascobrar = this.datasolicitud.Balance.cobrarTotal
          this.totalinventarios = this.datasolicitud.Balance.inventarioTotal
          this.totalactivosneg = this.datasolicitud.Balance.actnegTotal
          this.totalactivosfam = this.datasolicitud.Balance.actfamTotal
          this.obligacionesfin = this.datasolicitud.Balance.totalCreditos
          this.recuperacion = Utils.formatNumber(this.datasolicitud.Balance.recuperacionCobrar)
          this.creditosproveedores = this.datasolicitud.Balance.proveedoresTotal
          this.otraspasivoscor = Utils.formatNumber(this.datasolicitud.Balance.tcorrienten)
          this.otraspasivosNocor = Utils.formatNumber(this.datasolicitud.Balance.tnocorrienten)
          this.totalpasivosfam = Utils.formatNumber(this.datasolicitud.Balance.tnocorrientef) + Utils.formatNumber(this.datasolicitud.Balance.tcorrientef)
          
          if(this.datasolicitud.Balance.recuperacion){
            let cantidadre = this.datasolicitud.Balance.recuperacion.length
            let totalre = this.datasolicitud.Balance.totalRecuperacion
            totalrecuperacion = totalre/ cantidadre
          }

        }
        if (this.datasolicitud.Flujo) {
          let formapago = 0
          let plazo = 0
          if (this.datasolicitud.Propuesta) {
            if (this.datasolicitud.Propuesta.tipocuota == 2) {
              formapago = 3
            } else {
              formapago = this.datasolicitud.Propuesta.formapgo.period
            }
            plazo = Utils.formatNumber(this.datasolicitud.Propuesta.plazo)
          }
          let totalingreso = 0
          let totalegresos =0
          let totalgastos =0
          let totalobligaciones =0
          let totalgastosyobfam =0

          for (let i = 0; i < this.datasolicitud.Flujo.length; i++) {
            const flujo = this.datasolicitud.Flujo[i]
            let ingresosagro = flujo[3]
            let egresosagro = flujo[5]
            let gastosneg = flujo[7]
            let obligaciones = flujo[9]     
            let gastosyobfam = flujo[13]     
   
            totalingreso += Utils.formatNumber(ingresosagro)
            totalegresos += Utils.formatNumber(egresosagro)
            totalgastos += Utils.formatNumber(gastosneg)
            totalobligaciones += Utils.formatNumber(obligaciones)
            totalgastosyobfam += Utils.formatNumber(gastosyobfam)
          }
          this.totalingreosflujo = (totalingreso / plazo) * formapago
          this.costodeventaA =  (totalegresos / plazo) * formapago
          this.totalrecuperacioncartera = totalrecuperacion * formapago
          this.salariosA = Utils.formatNumber(this.salarios) * formapago
          this.gastosGeneralesA = (totalgastos / plazo) * formapago
          this.obligacionesA =  (totalobligaciones / plazo) * formapago
          this.otrosIngresosA= otrosingresos * formapago
          this.gastosFamiliaresA =  (totalgastosyobfam / plazo) * formapago
        }

      })

  }

}