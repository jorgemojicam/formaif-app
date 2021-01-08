import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Solicitud } from 'src/app/model/solicitud';
import { IdbSolicitudService } from '../admin/idb-solicitud.service';
import DataSelect from '../../data-select/dataselect.json';
import { LoteAgro } from 'src/app/model/loteAgro';
import { CrucesAgro } from 'src/app/model/crucesagro';
import { LotePecuario } from 'src/app/model/lotePecuario';

@Component({
  selector: 'app-flujocaja',
  templateUrl: './flujocaja.component.html',
  styleUrls: ['./flujocaja.component.scss']
})
export class FlujocajaComponent implements OnInit {

  constructor(
    private activeRoute: ActivatedRoute,
    public srvSol: IdbSolicitudService,
  ) { }

  datasolicitud: Solicitud = new Solicitud()
  fechahoy: string;
  dataFlujo: any[] = []
  meses: any = DataSelect.Meses;

  ngOnInit(): void {

    this.activeRoute.queryParamMap.subscribe((params) => {

        let sol = params.get('solicitud')
        this.srvSol.getSol(sol).subscribe((datasol) => {

          let hoy = new Date()
          let mes: number = hoy.getMonth() + 1
          this.fechahoy = hoy.getDate() + "/" + mes + "/" + hoy.getFullYear()
          this.datasolicitud = datasol as Solicitud
          let mesingreso = this.meses.slice();

          for (let i = 1; i <= this.datasolicitud.Propuesta.plazofija; i++) {
            let mes: any = mesingreso.shift();
            this.dataFlujo.push([i, mes.id, mes.name, 0, 0, 0, 0, 0])
            if (i % 12 == 0) {
              mesingreso = this.meses.slice();
            }
          }

          for (let cr = 0; cr < this.datasolicitud.CrucesAgro.length; cr++) {
            let cruce: CrucesAgro = this.datasolicitud.CrucesAgro[cr];

            let totalingresos = 0
            let totalegresos = 0
            for (let flujocaja = 0; flujocaja < this.dataFlujo.length; flujocaja++) {
              const flujo = this.dataFlujo[flujocaja];
              totalingresos = 0
              totalegresos = 0

              for (let lote = 0; lote < cruce.lotesPecuario.length; lote++) {
                let lotesP: LotePecuario = cruce.lotesPecuario[lote];   
                if(lotesP.mesingreso){
                  lotesP.mesingreso.forEach(me => {
                    if (flujo[1] == me) {
                      totalingresos += this.formatNumber(lotesP.ingresomes)
                      this.dataFlujo[flujocaja][3+cr] = totalingresos
                    }
                  });
                }
                if(lotesP.egresos){
                  for (let eg = 0; eg < lotesP.egresos.length; eg++) {
                    const egreso = lotesP.egresos[eg];
                    for (let me = 0; me < egreso.mes.length; me++) {
                      const mes = egreso.mes[me];
                      if (flujo[1] == mes) {
                        totalegresos += this.formatNumber(egreso.total)
                        this.dataFlujo[flujocaja][11+cr] = totalegresos
                      }                      
                    }                    
                  }
                }
              }

              for (let lote = 0; lote < cruce.lotesAgro.length; lote++) {
                let lotesA: LoteAgro = cruce.lotesAgro[lote];
               
                if(lotesA.mesCos){
                  lotesA.mesCos.forEach(me => {
                    if (flujo[1] == me) {
                      totalingresos += this.formatNumber(lotesA.totalCos)
                      this.dataFlujo[flujocaja][3+cr] = totalingresos
                    }
                  });
                }
                if(lotesA.mesTra){
                  lotesA.mesTra.forEach(me => {
                    if (flujo[1] == me) {
                      totalingresos += this.formatNumber(lotesA.totalTra)
                      this.dataFlujo[flujocaja][3+cr] = totalingresos
                    }
                  });
                }
                if(lotesA.mesPepeo){
                  lotesA.mesPepeo.forEach(me => {
                    if (flujo[1] == me) {
                      totalingresos += this.formatNumber(lotesA.totalPepeo)
                      this.dataFlujo[flujocaja][3+cr] = totalingresos
                    }
                  });
                }
                if (lotesA.cocecha) {
                  lotesA.cocecha.forEach(me => {
                    if (flujo[1] == me) {
                      totalingresos += this.formatNumber(lotesA.totalIngreso)
                      this.dataFlujo[flujocaja][3+cr] = totalingresos
                    }
                  });
                }
                if(lotesA.egresosAdecuacion){
                  for (let eg = 0; eg < lotesA.egresosAdecuacion.length; eg++) {
                    const egreso = lotesA.egresosAdecuacion[eg];
                    for (let me = 0; me < egreso.mes.length; me++) {
                      const mes = egreso.mes[me];
                      if (flujo[1] == mes) {
                        totalegresos += this.formatNumber(egreso.total)
                        this.dataFlujo[flujocaja][11+cr] = totalegresos
                      }                      
                    }                    
                  }
                }
                if(lotesA.egresosMante){
                  for (let eg = 0; eg < lotesA.egresosMante.length; eg++) {
                    const egreso = lotesA.egresosMante[eg];
                    for (let me = 0; me < egreso.mes.length; me++) {
                      const mes = egreso.mes[me];
                      if (flujo[1] == mes) {
                        totalegresos += this.formatNumber(egreso.total)
                        this.dataFlujo[flujocaja][11+cr] = totalegresos
                      }
                    }
                  }
                }
                if(lotesA.egresosSiembra){
                  for (let eg = 0; eg < lotesA.egresosSiembra.length; eg++) {
                    const egreso = lotesA.egresosSiembra[eg];
                    for (let me = 0; me < egreso.mes.length; me++) {
                      const mes = egreso.mes[me];
                      if (flujo[1] == mes) {
                        totalegresos += this.formatNumber(egreso.total)
                        this.dataFlujo[flujocaja][11+cr] = totalegresos
                      }
                    }
                  }
                }
                if(lotesA.egresosCocecha){
                  for (let eg = 0; eg < lotesA.egresosCocecha.length; eg++) {
                    const egreso = lotesA.egresosCocecha[eg];
                    for (let me = 0; me < egreso.mes.length; me++) {
                      const mes = egreso.mes[me];
                      if (flujo[1] == mes) {
                        totalegresos += this.formatNumber(egreso.total)
                        this.dataFlujo[flujocaja][11+cr] = totalegresos
                      }
                    }
                  }
                }
              }
            }
          }

        })
      });
  }

  formatNumber(num) {
    if (typeof (num) == "number") {
      return num
    } else {
      return parseInt(num == "0" || num == "" || num == null ? "0" : num.replace(/\D/g, '').replace(/^0+/, ''))
    }
  }

}
