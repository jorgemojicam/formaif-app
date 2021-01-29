import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Solicitud } from 'src/app/model/solicitud';
import { IdbSolicitudService } from '../admin/idb-solicitud.service';
import DataSelect from '../../data-select/dataselect.json';
import { LoteAgro } from 'src/app/model/loteAgro';
import { CrucesAgro } from 'src/app/model/crucesagro';
import { LotePecuario } from 'src/app/model/lotePecuario';
import Utils from '../../utils';

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
  actividadPrincipal: string = ""
  fechahoy: string;
  dataFlujo: any[] = []
  cantidadActividades: number = 0;
  cantidadTotalAct: number = 0;
  meses: any = DataSelect.Meses;

  ngOnInit(): void {

    this.activeRoute.queryParamMap.subscribe((params) => {

      let sol = params.get('solicitud')
      this.srvSol.getSol(sol).subscribe((datasol) => {

        let hoy = new Date()
        let meshoy: number = hoy.getMonth() + 1
        this.fechahoy = hoy.getDate() + "/" + meshoy + "/" + hoy.getFullYear()
        this.datasolicitud = datasol as Solicitud
        this.actividadPrincipal = this.datasolicitud.CrucesAgro[0].nombre.name
        this.cantidadActividades = this.datasolicitud.CrucesAgro.length

        let mesingreso = this.meses.slice();
        mesingreso.splice(0, meshoy);

        if (this.datasolicitud.Propuesta) {
          let cantidadValores = []
          this.datasolicitud.CrucesAgro.forEach(actividades => {
            cantidadValores.push(0)
          });
          this.datasolicitud.CrucesAgro.forEach(actividades => {
            cantidadValores.push(0)
          });

          for (let i = 1; i <= this.datasolicitud.Propuesta.plazo; i++) {
            let mes: any = mesingreso.shift();
            let columnas = [i, mes.id, mes.name, 0, 0].concat(cantidadValores)
            this.dataFlujo.push(columnas)
            if (mesingreso.length == 0) {
              mesingreso = this.meses.slice();
            }
          }

          this.cantidadTotalAct = this.dataFlujo.length

          for (let cr = 0; cr < this.datasolicitud.CrucesAgro.length; cr++) {
            let cruce: CrucesAgro = this.datasolicitud.CrucesAgro[cr];

            let totalingresos = 0
            let totalegresos = 0
            let mesprod = 0
            let mesnoprod = 0
            let flag = true


            for (let flujocaja = 0; flujocaja < this.dataFlujo.length; flujocaja++) {
              const flujo = this.dataFlujo[flujocaja];
              totalingresos = 0
              totalegresos = 0

              // ---------------- pecuario ----------------------------------
              for (let lote = 0; lote < cruce.lotesPecuario.length; lote++) {
                let lotesP: LotePecuario = cruce.lotesPecuario[lote];
                if (lotesP.mesingreso) {
                  lotesP.mesingreso.forEach(me => {
                    if (flujo[1] == me) {
                      totalingresos += this.formatNumber(lotesP.ingresomes)
                      this.dataFlujo[flujocaja][3 + cr] = totalingresos
                    }
                  });
                }
                if (lotesP.egresos) {
                  for (let eg = 0; eg < lotesP.egresos.length; eg++) {
                    const egreso = lotesP.egresos[eg];
                    for (let me = 0; me < egreso.mes.length; me++) {
                      const mes = egreso.mes[me];
                      if (flujo[1] == mes) {
                        totalegresos += this.formatNumber(egreso.total)
                        this.dataFlujo[flujocaja][11 + cr] = totalegresos
                      }
                    }
                  }
                }
              }

              // ---------------- agricola ----------------------------------

              //-Permanente
              if (cruce.nombre.tipoproducto == "Permanente") {
                let totalCosecha = 0
                let totalTraviesa = 0
                let totalPepeo = 0

                //-------------------Ingresos---------------------------------
                let columnIngreso = cr + 3
                let columnaTotalIngresos = this.cantidadActividades + 3

                for (let index = 0; index < cruce.lotesAgro.length; index++) {
                  const lote = cruce.lotesAgro[index];
                  totalCosecha += Utils.formatNumber(lote.totalCos);
                  totalTraviesa += Utils.formatNumber(lote.totalTra);
                  totalPepeo += Utils.formatNumber(lote.totalPepeo);
                }
                let cantMesCos = cruce.mesCos.length
                let cantMesTra = cruce.mesTra.length
                let cantMesPepeo = cruce.mesPepeo.length

                let valorMesCos = totalCosecha / cantMesCos
                let valorMesTra = totalTraviesa / cantMesTra
                let valorMesPepeo = totalPepeo / cantMesPepeo

                cruce.mesCos.forEach(mesC => {
                  if (flujo[1] == mesC) {
                    this.dataFlujo[flujocaja][columnIngreso] = valorMesCos.toLocaleString()
                    let totalMesingresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalIngresos])
                    this.dataFlujo[flujocaja][columnaTotalIngresos] = (totalMesingresos + valorMesCos).toLocaleString()
                  }
                });
                cruce.mesTra.forEach(mes => {
                  if (flujo[1] == mes) {
                    this.dataFlujo[flujocaja][columnIngreso] = valorMesTra.toLocaleString()
                    let totalMesingresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalIngresos])
                    this.dataFlujo[flujocaja][columnaTotalIngresos] = (totalMesingresos + valorMesCos).toLocaleString()
                  }
                });
                cruce.mesPepeo.forEach(mes => {
                  if (flujo[1] == mes) {
                    this.dataFlujo[flujocaja][columnIngreso] = valorMesPepeo.toLocaleString()
                    let totalMesingresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalIngresos])
                    this.dataFlujo[flujocaja][columnaTotalIngresos] = (totalMesingresos + valorMesCos).toLocaleString()
                  }
                });

                // -------------------Egresos------------------------------------
                for (let index = 0; index < cruce.lotesAgro.length; index++) {
                  const lote = cruce.lotesAgro[index];
                  let columnEgresos = columnaTotalIngresos + cr + 1
                  let columnaTotalEgreos = columnaTotalIngresos + this.cantidadActividades + 1
                  //-Adecuacion
                  if (lote.egresosAdecuacion) {
                    for (let eg = 0; eg < lote.egresosAdecuacion.length; eg++) {
                      const egreso = lote.egresosAdecuacion[eg];
                      for (let me = 0; me < egreso.mes.length; me++) {
                        const mes = egreso.mes[me];
                        if (flujo[1] == mes) {
                          totalegresos += this.formatNumber(egreso.total);
                          this.dataFlujo[flujocaja][columnEgresos] = totalegresos.toLocaleString();
                          let totalMesegresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalEgreos])
                          this.dataFlujo[flujocaja][columnaTotalEgreos] = (totalMesegresos + totalegresos).toLocaleString()
                          break;
                        }
                      }
                    }
                  }
                  //-Mantenimiento
                  if (lote.egresosMante) {
                    for (let eg = 0; eg < lote.egresosMante.length; eg++) {
                      const egreso = lote.egresosMante[eg];
                      for (let me = 0; me < egreso.mes.length; me++) {
                        const mes = egreso.mes[me];
                        if (flujo[1] == mes) {
                          totalegresos += this.formatNumber(egreso.total)
                          this.dataFlujo[flujocaja][columnEgresos] = totalegresos
                          let totalMesegresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalEgreos])
                          this.dataFlujo[flujocaja][columnaTotalEgreos] = (totalMesegresos + totalegresos).toLocaleString()
                        }
                      }
                    }
                  }
                  //-Siembra
                  if (lote.egresosSiembra) {
                    for (let eg = 0; eg < lote.egresosSiembra.length; eg++) {
                      const egreso = lote.egresosSiembra[eg];
                      for (let me = 0; me < egreso.mes.length; me++) {
                        const mes = egreso.mes[me];
                        if (flujo[1] == mes) {
                          totalegresos += this.formatNumber(egreso.total)
                          this.dataFlujo[flujocaja][columnEgresos] = totalegresos
                          let totalMesegresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalEgreos])
                          this.dataFlujo[flujocaja][columnaTotalEgreos] = (totalMesegresos + totalegresos).toLocaleString()
                        }
                      }
                    }
                  }
                  //-Cosecha
                  if (lote.egresosCocecha) {
                    for (let eg = 0; eg < lote.egresosCocecha.length; eg++) {
                      const egreso = lote.egresosCocecha[eg];
                      for (let me = 0; me < egreso.mes.length; me++) {
                        const mes = egreso.mes[me];
                        if (flujo[1] == mes) {
                          totalegresos += this.formatNumber(egreso.total)
                          this.dataFlujo[flujocaja][columnEgresos] = totalegresos
                          let totalMesegresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalEgreos])
                          this.dataFlujo[flujocaja][columnaTotalEgreos] = (totalMesegresos + totalegresos).toLocaleString()
                        }
                      }
                    }
                  }
                }


              }
              //-Transitorio
              else if (cruce.nombre.tipoproducto == "Transitorio") {
                for (let lote = 0; lote < cruce.lotesAgro.length; lote++) {
                  let lotesA: LoteAgro = cruce.lotesAgro[lote];

                  // -------------------Ingresos------------------------------------
                  let totalingresos = Utils.formatNumber(lotesA.totalIngreso)
                  let proxcosecha = Utils.formatNumber(lotesA.proxcocecha)
                  let cantcosecha = Utils.formatNumber(lotesA.cantmesescocecha)

                  //-Posicion de las columnas
                  let columnIngreso = cr + 3
                  let columnaTotalIngresos = this.cantidadActividades + 3

                  if (flujo[1] >= proxcosecha && flag) {
                    mesprod = Utils.formatNumber(lotesA.cantmesescocecha)
                    mesnoprod = Utils.formatNumber(lotesA.cantmesesnoproduccion)
                    flag = false
                  }
                  let totalmes = totalingresos / cantcosecha

                  if (!flag) {
                    if (mesprod > 0) {
                      this.dataFlujo[flujocaja][columnIngreso] = totalmes.toLocaleString()
                      let totalMesingresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalIngresos])
                      this.dataFlujo[flujocaja][columnaTotalIngresos] = (totalMesingresos + totalmes).toLocaleString()
                      mesprod--
                    } else if (mesnoprod > 0) {
                      this.dataFlujo[flujocaja][columnIngreso] = 0
                      mesnoprod--
                      if (mesprod == 0 && mesnoprod == 0) {
                        mesprod = Utils.formatNumber(lotesA.cantmesescocecha)
                        mesnoprod = Utils.formatNumber(lotesA.cantmesesnoproduccion)
                      }
                    }
                  }

                  // -------------------Egresos------------------------------------
                  let columnEgresos = columnaTotalIngresos + cr + 1
                  let columnaTotalEgreos = columnaTotalIngresos + this.cantidadActividades + 1
                  //-Adecuacion
                  if (lotesA.egresosAdecuacion) {
                    for (let eg = 0; eg < lotesA.egresosAdecuacion.length; eg++) {
                      const egreso = lotesA.egresosAdecuacion[eg];
                      for (let me = 0; me < egreso.mes.length; me++) {
                        const mes = egreso.mes[me];
                        if (flujo[1] == mes) {
                          totalegresos += this.formatNumber(egreso.total);
                          this.dataFlujo[flujocaja][columnEgresos] = totalegresos.toLocaleString();
                          let totalMesegresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalEgreos])
                          this.dataFlujo[flujocaja][columnaTotalEgreos] = (totalMesegresos + totalegresos).toLocaleString()
                          break;
                        }
                      }
                    }
                  }
                  //-Mantenimiento
                  if (lotesA.egresosMante) {
                    for (let eg = 0; eg < lotesA.egresosMante.length; eg++) {
                      const egreso = lotesA.egresosMante[eg];
                      for (let me = 0; me < egreso.mes.length; me++) {
                        const mes = egreso.mes[me];
                        if (flujo[1] == mes) {
                          totalegresos += this.formatNumber(egreso.total)
                          this.dataFlujo[flujocaja][columnEgresos] = totalegresos
                          let totalMesegresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalEgreos])
                          this.dataFlujo[flujocaja][columnaTotalEgreos] = (totalMesegresos + totalegresos).toLocaleString()
                        }
                      }
                    }
                  }
                  //-Siembra
                  if (lotesA.egresosSiembra) {
                    for (let eg = 0; eg < lotesA.egresosSiembra.length; eg++) {
                      const egreso = lotesA.egresosSiembra[eg];
                      for (let me = 0; me < egreso.mes.length; me++) {
                        const mes = egreso.mes[me];
                        if (flujo[1] == mes) {
                          totalegresos += this.formatNumber(egreso.total)
                          this.dataFlujo[flujocaja][columnEgresos] = totalegresos
                          let totalMesegresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalEgreos])
                          this.dataFlujo[flujocaja][columnaTotalEgreos] = (totalMesegresos + totalegresos).toLocaleString()
                        }
                      }
                    }
                  }
                  //-Cosecha
                  if (lotesA.egresosCocecha) {
                    for (let eg = 0; eg < lotesA.egresosCocecha.length; eg++) {
                      const egreso = lotesA.egresosCocecha[eg];
                      for (let me = 0; me < egreso.mes.length; me++) {
                        const mes = egreso.mes[me];
                        if (flujo[1] == mes) {
                          totalegresos += this.formatNumber(egreso.total)
                          this.dataFlujo[flujocaja][columnEgresos] = totalegresos
                          let totalMesegresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalEgreos])
                          this.dataFlujo[flujocaja][columnaTotalEgreos] = (totalMesegresos + totalegresos).toLocaleString()
                        }
                      }
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
