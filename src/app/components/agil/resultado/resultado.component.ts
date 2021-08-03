import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Solicitud } from 'src/app/model/agil/solicitud';
import Utils from 'src/app/utils';
import { IdbSolicitudService } from '../../../services/idb-solicitud.service';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.scss']
})
export class ResultadoComponent implements OnInit {

  datasolicitud: Solicitud = new Solicitud()
  flujo
  tiposol: number;
  ced: string;
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
  totalrecuperacioncartera: number = 0;
  costodeventaA: number = 0;
  salariosA: number = 0;
  gastosGeneralesA: number = 0;
  obligacionesA: number = 0;
  otrosIngresosA: number = 0;
  gastosFamiliaresA: number = 0;
  Costodeventa: number = 0;
  VentasContado: number = 0;
  loadflujo = true

  constructor(
    private activeRoute: ActivatedRoute,
    private _srvSol: IdbSolicitudService
  ) { }

  getSolicitud() {
    return new Promise(resolve => {
      this._srvSol.getSol(this.ced).subscribe((datasol) => {
        resolve(JSON.parse(datasol))
      })
    })
  }

  async ngOnInit() {

    this.activeRoute.queryParamMap.subscribe((params) => {
      this.ced = params.get('cedula')
    });

    this.datasolicitud = await this.getSolicitud() as Solicitud
    this.tiposol = this.datasolicitud.asesor

    this.datasolicitud = await this.getSolicitud() as Solicitud
    this.flujo = this.datasolicitud.Flujo
  }

  async loadResultado() {

    this.datasolicitud = await this.getSolicitud() as Solicitud
    if (this.tiposol == 2) {
      this.flujo = this.datasolicitud.Flujo
    }

    let totalrecuperacion = 0
    let otrosingresos = 0
    if (this.datasolicitud.Gastos) {
      this.salarios = this.datasolicitud.Gastos.totalRemuneracion
      this.totalgastosfam = Utils.formatNumber(this.datasolicitud.Gastos.totalF)
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
      let totalcoutaf = Utils.formatNumber(this.datasolicitud.Balance.tcuotaf)
      this.totalgastosfam += totalcoutaf
      let totalcuootan = Utils.formatNumber(this.datasolicitud.Balance.tcuotan) + Utils.formatNumber(this.datasolicitud.Balance.totalCreditos)
      this.obligacionesfin = totalcuootan
      this.recuperacion = Utils.formatNumber(this.datasolicitud.Balance.recuperacionCobrar)
      this.creditosproveedores = this.datasolicitud.Balance.proveedoresTotal
      this.otraspasivoscor = Utils.formatNumber(this.datasolicitud.Balance.tcorrienten)
      this.otraspasivosNocor = Utils.formatNumber(this.datasolicitud.Balance.tnocorrienten)
      this.totalpasivosfam = Utils.formatNumber(this.datasolicitud.Balance.tnocorrientef) + Utils.formatNumber(this.datasolicitud.Balance.tcorrientef)

      if (this.datasolicitud.Balance.recuperacion) {
        let cantidadre = this.datasolicitud.Balance.recuperacion.length
        let totalre = this.datasolicitud.Balance.totalRecuperacion
        totalrecuperacion = totalre / cantidadre
      }

    }
    this.VentasContado = 0
    let costoscruce = []
    if (this.datasolicitud.Cruces) {
      for (let j = 0; j < this.datasolicitud.Cruces.length; j++) {
        const cru = this.datasolicitud.Cruces[j];
        let cruces = []
        if (cru.totalCruce1 > 0)
          cruces.push(cru.totalCruce1)
        if (cru.totalCruce2 > 0)
          cruces.push(cru.totalCruce2)
        if (cru.totalCruce3 > 0)
          cruces.push(cru.totalCruce3)

        let mincruces = Math.min.apply(null, cruces)
        costoscruce.push([mincruces, cru.costo])
        this.VentasContado += mincruces
      }
    }

    let costototal = 0
    for (let c = 0; c < costoscruce.length; c++) {
      const item = costoscruce[c];
      const crucemin = parseInt(item[0])
      const costo = parseInt(item[1]) / 100
      let participacion = crucemin / this.VentasContado
      let porcentaje = costo * participacion
      costototal += porcentaje
    }
    let ventastotales = this.recuperacion + this.VentasContado
    this.Costodeventa = ventastotales * costototal;

    if (this.tiposol == 2) {

      if (this.datasolicitud.Flujo) {
        let formapago = 0
        let plazo = 0
        if (this.datasolicitud.Propuesta) {
          if (this.datasolicitud.Propuesta.tipocuota == 2) {
            formapago = 3
          } else {
            formapago = this.datasolicitud.Propuesta.formapgo ? this.datasolicitud.Propuesta.formapgo.period : 0
          }
          plazo = Utils.formatNumber(this.datasolicitud.Propuesta.plazo)
        }
        let totalingreso = 0
        let totalegresos = 0
        let totalgastos = 0
        let totalobligaciones = 0
        let totalgastosyobfam = 0

        for (let i = 0; i < this.flujo.length; i++) {
          const flujo = this.flujo[i]
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
        this.costodeventaA = (totalegresos / plazo) * formapago
        this.totalrecuperacioncartera = totalrecuperacion * formapago
        this.salariosA = Utils.formatNumber(this.salarios) * formapago
        this.gastosGeneralesA = (totalgastos / plazo) * formapago
        this.obligacionesA = (totalobligaciones / plazo) * formapago
        this.otrosIngresosA = otrosingresos * formapago
        this.gastosFamiliaresA = ((totalgastosyobfam / plazo) * formapago)
      }
    }
    if (this.datasolicitud.CrucesAgro) {
      let totalotroing = 0
      this.datasolicitud.CrucesAgro.forEach(element => {
        totalotroing += Utils.formatNumber(element.ingresoLiquido)
      });
      let totalotringfam = isNaN(this.otrosIngresosA) ? 0 : Utils.formatNumber(this.otrosIngresosA)

      if (this.datasolicitud.Propuesta) {
        console.log(this.datasolicitud.Propuesta.formapgo)
        if (this.datasolicitud.Propuesta.formapgo) {
          let periodo = this.datasolicitud.Propuesta.formapgo          
          this.otrosIngresosA = (totalotringfam + totalotroing) * periodo.period
        }
      }

    }
    this.loadflujo = false
    return false
  }

}
