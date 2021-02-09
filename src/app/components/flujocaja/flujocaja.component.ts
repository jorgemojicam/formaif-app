import { Component, Input, OnInit } from '@angular/core';
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

  @Input() datossol: Solicitud

  constructor(
    private activeRoute: ActivatedRoute,
    public srvSol: IdbSolicitudService,
  ) { }

  datasolicitud: Solicitud = new Solicitud()
  actividadPrincipal: string = ""
  fechahoy: string;
  dataFlujo: any[] = []
  dataFlujoAcumulado: any[] = []
  cantidadActividades: number = 0;
  cantidadTotalAct: number = 0;
  meses: any = DataSelect.Meses;

  sol: string;
  datasol: any;

  ngOnInit(): void {

    this.activeRoute.queryParamMap
      .subscribe(
        (params) => {
          this.sol = params.get('solicitud')
        }
      )

    const obtenerSol = () => {
      return new Promise(resolve => {
        this.srvSol.getSol(this.sol).subscribe(
          (datasol) => {
            return resolve(datasol)
          }
        )
      })
    }

    const afterInit = async () => {
      let hoy = new Date()
      let meshoy: number = hoy.getMonth() + 1
      this.fechahoy = hoy.getDate() + "/" + meshoy + "/" + hoy.getFullYear()
      this.datasolicitud = await obtenerSol() as Solicitud

      this.actividadPrincipal = this.datasolicitud.CrucesAgro[0].nombre.name
      this.cantidadActividades = this.datasolicitud.CrucesAgro.length

      let mesingreso = this.meses.slice();
      mesingreso.splice(0, meshoy);

      if (this.datasolicitud.Propuesta) {
        let planinversion = Utils.formatNumber(this.datasolicitud.Propuesta.valorcapital)
        let cantidadValores = []
        this.datasolicitud.CrucesAgro.forEach(actividades => {
          cantidadValores.push(0)
        });
        this.datasolicitud.CrucesAgro.forEach(actividades => {
          cantidadValores.push(0)
        });

        //-Construccion de la proyeccion segun el plazo
        for (let i = 1; i <= this.datasolicitud.Propuesta.plazo; i++) {
          let mes: any = mesingreso.shift();
          let columnas = [i, mes.id, mes.name, 0, 0].concat(cantidadValores)
          let columnasAcomu = [i, mes.id, mes.name, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          this.dataFlujo.push(columnas)
          this.dataFlujoAcumulado.push(columnasAcomu)
          if (mesingreso.length == 0) {
            mesingreso = this.meses.slice();
          }
        }

        this.cantidadTotalAct = this.dataFlujo.length
        //-Actividades
        for (let cr = 0; cr < this.datasolicitud.CrucesAgro.length; cr++) {
          let cruce: CrucesAgro = this.datasolicitud.CrucesAgro[cr];

          let totalingresos = 0
          let totalegresos = 0

          //-Posicion de las columnas ingresos
          let columnIngreso = cr + 3
          let columnaTotalIngresos = this.cantidadActividades + 3

          //-Posicion de las columnas Egresos
          let columnEgresos = columnaTotalIngresos + cr + 1
          let columnaTotalEgreos = columnaTotalIngresos + this.cantidadActividades + 1

          for (let flujocaja = 0; flujocaja < this.dataFlujo.length; flujocaja++) {
            const flujo = this.dataFlujo[flujocaja];
            totalingresos = 0
            totalegresos = 0

            // ---------------- pecuario ----------------------------------
            for (let lote = 0; lote < cruce.lotesPecuario.length; lote++) {
              let lotesP: LotePecuario = cruce.lotesPecuario[lote];
              //----------------------------Egresos---------------------------------
              if (lotesP.egresos) {
                for (let eg = 0; eg < lotesP.egresos.length; eg++) {
                  const egreso = lotesP.egresos[eg];
                  for (let me = 0; me < egreso.mes.length; me++) {
                    const mes = egreso.mes[me];
                    if (flujo[1] == mes) {
                      totalegresos += Utils.formatNumber(egreso.total)
                      this.dataFlujo[flujocaja][columnEgresos] = totalegresos;

                      let totalMesegresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalEgreos])
                      this.dataFlujo[flujocaja][columnaTotalEgreos] = (totalMesegresos + totalegresos)

                      let totalEgAcumu = Utils.formatNumber(this.dataFlujoAcumulado[flujocaja][5])
                      this.dataFlujoAcumulado[flujocaja][5] = (totalEgAcumu + totalegresos)

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
                  let totalmes = Utils.formatNumber(this.dataFlujo[flujocaja][columnIngreso])
                  this.dataFlujo[flujocaja][columnIngreso] = (totalmes + valorMesCos)

                  let totalMesingresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalIngresos])
                  this.dataFlujo[flujocaja][columnaTotalIngresos] = (totalMesingresos + valorMesCos)

                  let totalIngAcumu = Utils.formatNumber(this.dataFlujo[flujocaja][3])
                  this.dataFlujoAcumulado[flujocaja][3] = (valorMesCos + totalIngAcumu)
                }
              });
              cruce.mesTra.forEach(mes => {
                if (flujo[1] == mes) {
                  let totalmes = Utils.formatNumber(this.dataFlujo[flujocaja][columnIngreso])
                  this.dataFlujo[flujocaja][columnIngreso] = (totalmes + valorMesTra)

                  let totalMesingresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalIngresos])
                  this.dataFlujo[flujocaja][columnaTotalIngresos] = (totalMesingresos + valorMesTra)

                  let totalIngAcumu = Utils.formatNumber(this.dataFlujo[flujocaja][3])
                  this.dataFlujoAcumulado[flujocaja][3] = (valorMesTra + totalIngAcumu)
                }
              });
              cruce.mesPepeo.forEach(mes => {
                if (flujo[1] == mes) {
                  let totalmes = Utils.formatNumber(this.dataFlujo[flujocaja][columnIngreso])
                  this.dataFlujo[flujocaja][columnIngreso] = (totalmes + valorMesPepeo)

                  let totalMesingresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalIngresos])
                  this.dataFlujo[flujocaja][columnaTotalIngresos] = (totalMesingresos + valorMesPepeo)

                  let totalIngAcumu = Utils.formatNumber(this.dataFlujo[flujocaja][3])
                  this.dataFlujoAcumulado[flujocaja][3] = (valorMesPepeo + totalIngAcumu)
                }
              });

              // -------------------Egresos------------------------------------
              for (let index = 0; index < cruce.lotesAgro.length; index++) {
                const lote = cruce.lotesAgro[index];

                //-Adecuacion
                if (lote.egresosAdecuacion) {
                  for (let eg = 0; eg < lote.egresosAdecuacion.length; eg++) {
                    const egreso = lote.egresosAdecuacion[eg];
                    for (let me = 0; me < egreso.mes.length; me++) {
                      const mes = egreso.mes[me];
                      if (flujo[1] == mes) {

                        totalegresos += Utils.formatNumber(egreso.total);
                        this.dataFlujo[flujocaja][columnEgresos] = totalegresos;

                        let totalMesegresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalEgreos])
                        this.dataFlujo[flujocaja][columnaTotalEgreos] = (totalMesegresos + totalegresos)

                        let totalIngAcumu = Utils.formatNumber(this.dataFlujo[flujocaja][3])
                        this.dataFlujoAcumulado[flujocaja][3] = (totalegresos + totalIngAcumu)

                        let totalEgAcumu = Utils.formatNumber(this.dataFlujoAcumulado[flujocaja][5])
                        this.dataFlujoAcumulado[flujocaja][5] = (totalEgAcumu + totalegresos)
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
                        totalegresos += Utils.formatNumber(egreso.total)
                        this.dataFlujo[flujocaja][columnEgresos] = totalegresos

                        let totalMesegresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalEgreos])
                        this.dataFlujo[flujocaja][columnaTotalEgreos] = (totalMesegresos + totalegresos)

                        let totalEgAcumu = Utils.formatNumber(this.dataFlujoAcumulado[flujocaja][5])
                        this.dataFlujoAcumulado[flujocaja][5] = (totalegresos + totalEgAcumu)
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
                        totalegresos += Utils.formatNumber(egreso.total)
                        this.dataFlujo[flujocaja][columnEgresos] = totalegresos
                        let totalMesegresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalEgreos])
                        this.dataFlujo[flujocaja][columnaTotalEgreos] = (totalMesegresos + totalegresos)

                        let totalEgAcumu = Utils.formatNumber(this.dataFlujoAcumulado[flujocaja][5])
                        this.dataFlujoAcumulado[flujocaja][5] = (totalegresos + totalEgAcumu)
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
                        totalegresos += Utils.formatNumber(egreso.total)
                        this.dataFlujo[flujocaja][columnEgresos] = totalegresos
                        let totalMesegresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalEgreos])
                        this.dataFlujo[flujocaja][columnaTotalEgreos] = (totalMesegresos + totalegresos)

                        let totalEgAcumu = Utils.formatNumber(this.dataFlujoAcumulado[flujocaja][5])
                        this.dataFlujoAcumulado[flujocaja][5] = (totalegresos + totalEgAcumu)
                      }
                    }
                  }
                }
              }

            }
          }
          //Agricola transitorio
          if (cruce.nombre.tipoproducto == "Transitorio") {

            for (let lote = 0; lote < cruce.lotesAgro.length; lote++) {
              let lotesA: LoteAgro = cruce.lotesAgro[lote];

              let mesprod = 0
              let mesnoprod = 0
              let flag = true

              for (let flujocaja = 0; flujocaja < this.dataFlujo.length; flujocaja++) {
                const flujo = this.dataFlujo[flujocaja];
                // -------------------Ingresos------------------------------------
                let totalingresos = Utils.formatNumber(lotesA.totalIngreso)
                let proxcosecha = Utils.formatNumber(lotesA.proxcocecha)
                let cantcosecha = Utils.formatNumber(lotesA.cantmesescocecha)

                if (flujo[1] >= proxcosecha && flag) {
                  mesprod = Utils.formatNumber(lotesA.cantmesescocecha)
                  mesnoprod = Utils.formatNumber(lotesA.cantmesesnoproduccion)
                  flag = false
                }
                let totalmes = totalingresos / cantcosecha


                if (!flag) {
                  if (mesprod > 0) {

                    let sumatoriaTotalmes = Utils.formatNumber(this.dataFlujo[flujocaja][columnIngreso])
                    this.dataFlujo[flujocaja][columnIngreso] = (sumatoriaTotalmes + totalmes)

                    let totalMesingresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalIngresos])
                    this.dataFlujo[flujocaja][columnaTotalIngresos] = (totalMesingresos + totalmes)

                    let totalIngAcumu = Utils.formatNumber(this.dataFlujoAcumulado[flujocaja][3])
                    this.dataFlujoAcumulado[flujocaja][3] = (totalmes + totalIngAcumu)

                    mesprod--
                  } else if (mesnoprod > 0) {
                    let sumatoriaTotalmes = Utils.formatNumber(this.dataFlujo[flujocaja][columnIngreso])
                    this.dataFlujo[flujocaja][columnIngreso] = (sumatoriaTotalmes)
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
                        totalegresos += Utils.formatNumber(egreso.total);
                        this.dataFlujo[flujocaja][columnEgresos] = totalegresos;
                        let totalMesegresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalEgreos])
                        this.dataFlujo[flujocaja][columnaTotalEgreos] = (totalMesegresos + totalegresos)

                        let totalEgAcumu = Utils.formatNumber(this.dataFlujoAcumulado[flujocaja][5])
                        this.dataFlujoAcumulado[flujocaja][5] = (totalegresos + totalEgAcumu)
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
                        totalegresos += Utils.formatNumber(egreso.total)
                        this.dataFlujo[flujocaja][columnEgresos] = totalegresos
                        let totalMesegresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalEgreos])
                        this.dataFlujo[flujocaja][columnaTotalEgreos] = (totalMesegresos + totalegresos)

                        let totalEgAcumu = Utils.formatNumber(this.dataFlujoAcumulado[flujocaja][5])
                        this.dataFlujoAcumulado[flujocaja][5] = (totalegresos + totalEgAcumu)
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
                        totalegresos += Utils.formatNumber(egreso.total)
                        this.dataFlujo[flujocaja][columnEgresos] = totalegresos
                        let totalMesegresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalEgreos])
                        this.dataFlujo[flujocaja][columnaTotalEgreos] = (totalMesegresos + totalegresos)

                        let totalEgAcumu = Utils.formatNumber(this.dataFlujoAcumulado[flujocaja][5])
                        this.dataFlujoAcumulado[flujocaja][5] = (totalegresos + totalEgAcumu)
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
                        totalegresos += Utils.formatNumber(egreso.total)
                        this.dataFlujo[flujocaja][columnEgresos] = totalegresos
                        let totalMesegresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalEgreos])
                        this.dataFlujo[flujocaja][columnaTotalEgreos] = (totalMesegresos + totalegresos)

                        let totalEgAcumu = Utils.formatNumber(this.dataFlujoAcumulado[flujocaja][5])
                        this.dataFlujoAcumulado[flujocaja][5] = (totalegresos + totalEgAcumu)
                      }
                    }
                  }
                }
              }

            }
          }

          //Pecuario Ingresos

          // -------------------Ingresos------------------------------------
          for (let lote = 0; lote < cruce.lotesPecuario.length; lote++) {
            let lotesP: LotePecuario = cruce.lotesPecuario[lote];
            let flagp = true

            let produccion = 0
            let noproduccion = 0

            for (let flujocaja = 0; flujocaja < this.dataFlujo.length; flujocaja++) {
              const flujo = this.dataFlujo[flujocaja];

              let totalingresos = Utils.formatNumber(lotesP.ingresomes)
              let mesingreso = Utils.formatNumber(lotesP.mesingreso)

              if (flujo[1] >= mesingreso && flagp) {
                produccion = Utils.formatNumber(lotesP.produccion)
                noproduccion = Utils.formatNumber(lotesP.noproduccion)
                flagp = false
              }

              if (!flagp) {
                if (produccion > 0) {

                  let sumatoriaTotalmes = Utils.formatNumber(this.dataFlujo[flujocaja][columnIngreso])
                  this.dataFlujo[flujocaja][columnIngreso] = (sumatoriaTotalmes + totalingresos)

                  let totalMesingresos = Utils.formatNumber(this.dataFlujo[flujocaja][columnaTotalIngresos])
                  this.dataFlujo[flujocaja][columnaTotalIngresos] = (totalMesingresos + totalingresos)

                  let totalIngAcumu = Utils.formatNumber(this.dataFlujoAcumulado[flujocaja][3])
                  this.dataFlujoAcumulado[flujocaja][3] = (totalingresos + totalIngAcumu)

                  produccion--
                } else if (noproduccion > 0) {

                  let sumatoriaTotalmes = Utils.formatNumber(this.dataFlujo[flujocaja][columnIngreso])
                  this.dataFlujo[flujocaja][columnIngreso] = sumatoriaTotalmes

                  let totalIngAcumu = Utils.formatNumber(this.dataFlujoAcumulado[flujocaja][3])
                  this.dataFlujoAcumulado[flujocaja][3] = (totalIngAcumu)

                  noproduccion--
                  if (produccion == 0 && noproduccion == 0) {
                    produccion = Utils.formatNumber(lotesP.produccion)
                    noproduccion = Utils.formatNumber(lotesP.noproduccion)
                  }
                }
              }
            }
          }

        }

        let primerano: boolean = true
        let totalRec = 0

        let totalRemuneracion = 0
        let efectivo = 0
        let totalGastosN = 0
        let totalGastosF = 0
        let totalObligaciones = 0
        let totalOtrosIngresos = 0
        //Existe gastos
        if (this.datasolicitud.Gastos) {
          totalRemuneracion = Utils.formatNumber(this.datasolicitud.Gastos.totalRemuneracion)
          totalGastosN = Utils.formatNumber(this.datasolicitud.Gastos.totalN)
          totalGastosF = Utils.formatNumber(this.datasolicitud.Gastos.totalF)
          totalOtrosIngresos = Utils.formatNumber(this.datasolicitud.Gastos.totalOtros)
          totalRec = this.datasolicitud.Balance.recuperacion.length - 1
        }
        //-Existe Balance
        if (this.datasolicitud.Balance) {
          efectivo = Utils.formatNumber(this.datasolicitud.Balance.efectivo)
          totalObligaciones = Utils.formatNumber(this.datasolicitud.Balance.tcuotan)
        }

        //-Ingresos Líquidos Otras actividades comerciales
        let totalIngresos = 0
        if (this.datasolicitud.CrucesAgro) {
          for (let cru = 0; cru < this.datasolicitud.CrucesAgro.length; cru++) {
            const cruce = this.datasolicitud.CrucesAgro[cru];
            if (cruce.tipo == 3) {
              totalIngresos += Utils.formatNumber(cruce.ingresoLiquido)
            }
          }
        }

        let primermes = true;
        let primermes1 = true;
        let primermes2 = true;
        for (let f = 0; f < this.dataFlujoAcumulado.length; f++) {
          const flujo = this.dataFlujoAcumulado[f];

          //-Existe Balance
          if (this.datasolicitud.Balance) {
            //Solo aplica para el primer año
            if (primerano) {
              for (let b = 0; b < this.datasolicitud.Balance.recuperacion.length; b++) {
                const recuperacion = this.datasolicitud.Balance.recuperacion[b];
                if (recuperacion.mes == flujo[1]) {
                  this.dataFlujoAcumulado[f][4] = recuperacion.valor
                  if (totalRec == b) {
                    primerano = false
                  }
                }
              }
            }
          }

          //Remuneracion de personal
          this.dataFlujoAcumulado[f][6] = totalRemuneracion

          //Existe gastos
          if (this.datasolicitud.Gastos) {
            //-gastos estacionales del negocio
            let totalEstacionalN = 0
            for (let g = 0; g < this.datasolicitud.Gastos.estacionalesN.length; g++) {
              const estacional = this.datasolicitud.Gastos.estacionalesN[g];
              if (estacional.mes == flujo[1]) {
                totalEstacionalN = Utils.formatNumber(estacional.valor);
                break;
              }
            }
            //-gastos estacionales de familiares
            let totalEstacionalF = 0
            for (let g = 0; g < this.datasolicitud.Gastos.estacionalesF.length; g++) {
              const estacional = this.datasolicitud.Gastos.estacionalesF[g];
              if (estacional.mes == flujo[1]) {
                totalEstacionalF = Utils.formatNumber(estacional.valor);
                break;
              }
            }

            this.dataFlujoAcumulado[f][7] = (totalEstacionalN + totalGastosN)
            this.dataFlujoAcumulado[f][13] = (totalEstacionalF + totalGastosF)
          }

          //Imprevistos Operativos
          let costos = Utils.formatNumber(this.dataFlujoAcumulado[f][5])
          let imprevistos = costos * 0.1
          this.dataFlujoAcumulado[f][8] = imprevistos

          //Obligaciones Finacieras
          this.dataFlujoAcumulado[f][9] = totalObligaciones

          let ingreso = Utils.formatNumber(this.dataFlujoAcumulado[f][3])
          let recuperacion = Utils.formatNumber(this.dataFlujoAcumulado[f][4])
          let costo = Utils.formatNumber(this.dataFlujoAcumulado[f][5])
          let remuneracion = Utils.formatNumber(this.dataFlujoAcumulado[f][6])
          let gastosneg = Utils.formatNumber(this.dataFlujoAcumulado[f][7])
          let imprevistosag = Utils.formatNumber(this.dataFlujoAcumulado[f][8])
          let obligaciones = Utils.formatNumber(this.dataFlujoAcumulado[f][9])
          let gastosfam = Utils.formatNumber(this.dataFlujoAcumulado[f][13])

          let ingresoLiquido = ingreso + recuperacion - costo - remuneracion - gastosneg - imprevistosag - obligaciones
          this.dataFlujoAcumulado[f][10] = ingresoLiquido

          //-Ingresos Líquidos Otras actividades comerciales
          this.dataFlujoAcumulado[f][11] = totalIngresos

          //-Otros Ingresos  familiares (Independientes)
          this.dataFlujoAcumulado[f][12] = totalOtrosIngresos

          //Flujo de caja antes financiación (sin acumular)
          let flujoantes = ingresoLiquido + totalIngresos + totalOtrosIngresos + gastosfam
          this.dataFlujoAcumulado[f][14] = flujoantes

          //Flujo de caja antes financiación acumulable 85%
          let flujoantesacumu = 0
          if (primermes2) {
            if (flujoantes < 0) {
              flujoantesacumu = flujoantes + efectivo
            } else {
              flujoantesacumu = (flujoantes * 0.85) + efectivo
            }
            this.dataFlujoAcumulado[f][15] = flujoantesacumu
          } else {
            let flujoantesantes = Utils.formatNumber(this.dataFlujoAcumulado[f - 1][15])
            if (flujoantes < 0) {
              flujoantesacumu = flujoantes + flujoantesantes
            } else {
              flujoantesacumu = flujoantesantes + (flujoantes * 0.85)
            }
            this.dataFlujoAcumulado[f][15] = flujoantesacumu

          }

          this.dataFlujoAcumulado[f][15] = flujoantesacumu

          let tipocuota = this.datasolicitud.Propuesta.tipocuota
          if (tipocuota == 1) {
            let cuota = Utils.formatNumber(this.datasolicitud.Propuesta.valorcouta)
            let periodo = this.datasolicitud.Propuesta.formapgo

            if (periodo.id == 1) {
              this.dataFlujoAcumulado[f][16] = cuota
            } else if (periodo.id == 2 && f % 2 == 0) {
              this.dataFlujoAcumulado[f][16] = cuota
            } else if (periodo.id == 3 && f % 3 == 0) {
              this.dataFlujoAcumulado[f][16] = cuota
            }
          } else if (tipocuota == 2) {
            for (let ir = 0; ir < this.datasolicitud.Propuesta.irregular.length; ir++) {
              const item = this.datasolicitud.Propuesta.irregular[ir];
              let mes = item.fechacuota.getMonth() + 1
              if (flujo[1] == mes) {
                this.dataFlujoAcumulado[f][16] = item.valorcuota
              }
            }
          }

          //Flujo de caja descontando cuota de crédito
          let cuotacredito = Utils.formatNumber(this.dataFlujoAcumulado[f][16])
          let flujodescontando = 0
          if (primermes) {
            if (flujoantes < 0) {
              flujodescontando = flujoantes + efectivo - cuotacredito
            } else {
              flujodescontando = (flujoantes * 0.85) + efectivo - cuotacredito
            }

            this.dataFlujoAcumulado[f][17] = flujodescontando
            primermes = false;
          } else {
            let flujodescAnterior = this.dataFlujoAcumulado[f - 1][17]
            if (flujoantes < 0) {
              flujodescontando = flujoantes + flujodescAnterior - cuotacredito
            } else {
              flujodescontando = flujodescAnterior + (flujoantes * 0.85) - cuotacredito
            }
            this.dataFlujoAcumulado[f][17] = flujodescontando
          }

          //Flujo de caja con financiación
          let flujofinan = 0
          if (primermes1) {
            if (flujoantes < 0) {
              flujofinan = planinversion + efectivo - cuotacredito
            } else {
              flujofinan = (flujoantes * 0.85) + efectivo - cuotacredito
            }
            primermes1 = false
            this.dataFlujoAcumulado[f][18] = flujofinan
          } else {
            let flujofinanantes = Utils.formatNumber(this.dataFlujoAcumulado[f - 1][18])
            if (flujoantes < 0) {
              flujofinan = flujoantes + flujofinanantes - cuotacredito
            } else {
              flujofinan = flujofinanantes + (flujoantes * 0.85) - cuotacredito
            }
            this.dataFlujoAcumulado[f][18] = flujofinan
          }

          //Relación cuota liquidez
          let relacionculiq = 0
          if (cuotacredito > 0) {
            relacionculiq = (cuotacredito / flujoantesacumu) * 100
            this.dataFlujoAcumulado[f][19] = relacionculiq.toFixed(2)
          }



        }
      }
    }

    afterInit()
  }
}
