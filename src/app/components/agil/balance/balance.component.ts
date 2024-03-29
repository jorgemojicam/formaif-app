import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Balance } from 'src/app/model/agil/balance';
import DataSelect from '../../../data-select/dataselect.json';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IdbSolicitudService } from '../../../services/idb-solicitud.service';
import { Solicitud } from 'src/app/model/agil/solicitud';
import { Recuperacion } from 'src/app/model/agil/recuperacion';
import { Proveedores } from 'src/app/model/agil/proveedores';
import { Creditos } from 'src/app/model/agil/creditos';
import { Inversiones } from 'src/app/model/agil/inversiones';
import { Pasivos } from 'src/app/model/agil/pasivos';
import Utils from '../../../utils'
import { ProveedoresEstacionales } from 'src/app/model/agil/proveedoresestacinales';
import { CreditoDetalle } from 'src/app/model/agil/creditodetalle';
import { ActivosComponent } from '../activos/activos.component';
import { Activos } from 'src/app/model/agil/activos';
import { InventarioComponent } from '../inventario/inventario.component';
import { Inventario } from 'src/app/model/agil/inventario';
import { InversionesComponent } from '../inversiones/inversiones.component';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  dataSolicitud: Solicitud = new Solicitud();
  dataBalance: Balance = new Balance();
  solicitud: Solicitud

  @ViewChild("activosNegocio") activosNeg: ActivosComponent;
  @ViewChild("activosFamilia") activosFam: ActivosComponent;
  @ViewChild(InventarioComponent) inventario: InventarioComponent;
  @ViewChild(InversionesComponent) inversiones: InversionesComponent;

  tituloActivoNeg = "Negocio"
  tituloActivoFam = "Familia"

  //Listas desplegables
  tipoActivoFam: any = DataSelect.TipoActivoFam;
  tipoActivo: any = DataSelect.TipoActivoNeg;

  aActivosNeg: Activos[]
  totalActNeg
  aActivosFam: Activos[]
  totalActFam
  aInventario: Inventario[]
  totalInv
  aInversion: Inversiones[]
  totalInversiones
  aplicaInversiones

  tipoPasivo: any = DataSelect.TipoPasivo;
  clasePasivo: any = DataSelect.ClasePasivo;
  periodo: any = DataSelect.Periodo;
  meses: any = DataSelect.Meses;
  CuotasDifiere: any = DataSelect.CuotasDifiere;
  fechahoy: Date = new Date()
  tipoSol: number;

  totalProv: number;
  ced: string;
  minDate = new Date();
  minDatenxt = new Date(this.minDate.getFullYear(), this.minDate.getMonth() + 1, 1)

  constructor(
    public _srvSol: IdbSolicitudService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
  ) { }

  balanceForm: FormGroup = this.fb.group({
    efectivo: '',
    clienteCobrar: '',
    observacionesCobrar: '',
    valorCobrar: '',
    incobrableCobrar: '',
    recuperacionCobrar: '',
    cobrarTotal: '',
    porcentajeCobrar: '',
    recuperacion: this.fb.array([this.initRecuperacion()]),
    totalRecuperacion: '',
    aplicaproveedores: false,
    proveedoresRow: this.fb.array([this.initProvRows()]),
    proveedoresTotal: '',
    proveedoresEstacionales: this.fb.array([this.initProvEstacionales()]),
    totalProveedoresEst: '',
    creditoactual: '',
    creditos: this.fb.array([this.initCreditos()]),
    totalCreditos: '',
    creditosDetalle: this.fb.array([this.initCreditosDetalle()]),
    totalcreditosDetalle: [0],

    pasivosRows: this.fb.array([this.initPasivoRows()]),
    tcuotaf: [0],
    tcorrientef: [0],
    tnocorrientef: [0],
    tcuotan: [0],
    tcorrienten: [0],
    tnocorrienten: [0]
  })

  getSol() {
    return new Promise(resolve => {
      this._srvSol.getSol(this.ced).subscribe(
        (datasol) => {
          resolve(JSON.parse(datasol))
        }, (err) => {
          resolve([])
        })
    })
  }

  async ngOnInit() {

    this.route.queryParamMap.subscribe((params) => {
      this.ced = params.get('cedula')
    });

    this.dataSolicitud = await this.getSol() as Solicitud
    this.solicitud = this.dataSolicitud
    this.tipoSol = this.dataSolicitud.asesor

    if (this.tipoSol == 1) {
      this.tipoPasivo = DataSelect.TipoPasivo.filter(pas => pas.id != 7)
    }

    if (this.dataSolicitud.Balance) {

      this.aActivosNeg = this.dataSolicitud.Balance.actividadNegRows
      this.totalActNeg = this.dataSolicitud.Balance.actnegTotal

      this.aActivosFam = this.dataSolicitud.Balance.activosFamRows
      this.totalActFam = this.dataSolicitud.Balance.actfamTotal

      this.aInventario = this.dataSolicitud.Balance.inventarioRow
      this.totalInv = this.dataSolicitud.Balance.inventarioTotal

      this.aplicaInversiones = this.dataSolicitud.Balance.aplicaInversiones
      this.aInversion = this.dataSolicitud.Balance.inversiones
      this.totalInversiones = this.dataSolicitud.Balance.totalInversiones

      this.loadBalance(this.dataSolicitud.Balance)
    }
    //------------Se ejecuta cuando se realiza cualquier cambio en el formulario-----------

    this.balanceForm.valueChanges.subscribe(form => {

      let efectivo = Utils.formatNumber(this.balanceForm.controls.efectivo.value)
      let incobrable = Utils.formatNumber(this.balanceForm.controls.incobrableCobrar.value)
      let valorCobrar = Utils.formatNumber(this.balanceForm.controls.valorCobrar.value)
      let recuperacionCobrar = Utils.formatNumber(this.balanceForm.controls.recuperacionCobrar.value)

      if (incobrable > valorCobrar) {
        incobrable = 0
        this._snackBar.open("Valor incobrable no pude ser mayor al valor", "Ok!", {
          duration: 3000,
        });
      }

      let porcentajeCobrar = (incobrable / valorCobrar) * 100

      if (porcentajeCobrar < 10) {
        porcentajeCobrar = 10
      }

      let totalCobrar = 0
      if (incobrable == 0) {
        totalCobrar = valorCobrar - (valorCobrar * 0.1)
      } else {
        totalCobrar = valorCobrar - incobrable
      }

      if (incobrable < totalCobrar * 0.1) {
        totalCobrar = valorCobrar - (valorCobrar * 0.1)
      } else {
        totalCobrar = valorCobrar - incobrable
      }

      //Calcular recuperacion de cartera        
      let totalrec = 0
      const recupera = <FormArray>this.balanceForm.controls['recuperacion'];
      recupera.controls.forEach(x => {
        let valor = Utils.formatNumber(x.get('valor').value)
        totalrec += valor
        if (totalrec > totalCobrar) {
          totalrec -= valor
          valor = 0
        }
        x.patchValue({
          valor: isFinite(valor) ? valor.toLocaleString() : 0
        }, { emitEvent: false })
      });

      if (recuperacionCobrar > totalCobrar) {
        recuperacionCobrar = 0
        this._snackBar.open("Valor de recuperacion no puede superar las cuentas por cobrar", "Ok!", {
          duration: 3000,
        });
      }

      //Calculo creditos fdlm
      let totalCredito = 0
      const credito = <FormArray>this.balanceForm.controls['creditos'];
      credito.controls.forEach(x => {
        let valor = Utils.formatNumber(x.get('valor').value)
        totalCredito += valor
        x.patchValue({
          valor: isFinite(valor) ? valor.toLocaleString() : 0
        }, { emitEvent: false });
      });

      //Calculo creditos FDLM agro
      const creditosDetalle = <FormArray>this.balanceForm.controls['creditosDetalle'];

      creditosDetalle.controls.forEach(x => {
        const cuotas = <FormArray>x.get('cuotas')
        let total = 0
        let arrMese = []
        let frecuencia = x.value.frecuencia

        cuotas.controls.forEach(cuo => {
          let valor = Utils.formatNumber(cuo.get('valor').value)
          let fecha = cuo.get('fecha').value

          if (fecha && fecha != "") {
            let mes = new Date(fecha).getMonth()
            let ano = new Date(fecha).getFullYear()
            let fullfecha = mes + "-" + ano
            if (arrMese.indexOf(fullfecha) < 0)
              arrMese.push(fullfecha)
            else
              fecha = ""
          }
          total += valor
          cuo.patchValue({
            valor: isFinite(valor) ? valor.toLocaleString() : 0,
            fecha: fecha
          }, { emitEvent: false });
        });

        let proyeccion = 0
        if (frecuencia) {
          proyeccion = (total / cuotas.length) / frecuencia.period
        }

        totalCredito += proyeccion
        x.patchValue({
          total: isFinite(total) ? total.toLocaleString() : 0,
          proyeccion: isFinite(proyeccion) ? proyeccion.toLocaleString() : 0,
        }, { emitEvent: false });
      });

      //Calculo proveedores
      let totalProv = 0
      const proveedores = <FormArray>this.balanceForm.controls['proveedoresRow'];
      proveedores.controls.forEach(x => {
        let valor = Utils.formatNumber(x.get('valor').value)
        totalProv += valor
        x.patchValue({
          valor: isFinite(valor) ? valor.toLocaleString() : 0
        }, { emitEvent: false });
      });

      //Calculo proveedores Estacionales  
      const proveedoresEst = <FormArray>this.balanceForm.controls['proveedoresEstacionales'];
      proveedoresEst.controls.forEach(x => {
        const cuotas = <FormArray>x.get('cuotas')
        let total = 0
        let arrMese = []
        cuotas.controls.forEach(cuo => {
          let valor = Utils.formatNumber(cuo.get('valor').value)
          let mes = cuo.get('mes').value

          if (arrMese.indexOf(mes) < 0)
            arrMese.push(mes)
          else
            mes = ""

          total += valor
          cuo.patchValue({
            valor: isFinite(valor) ? valor.toLocaleString() : 0,
            mes: mes
          }, { emitEvent: false });
        });

        totalProv += total
        x.patchValue({
          total: isFinite(total) ? total.toLocaleString() : 0
        }, { emitEvent: false });
      });

      //Calculo pasivos
      const ctrl = <FormArray>this.balanceForm.controls['pasivosRows'];
      let tcorrientef = 0
      let tnocorrientef = 0
      let tcorrienten = 0
      let tnocorrienten = 0
      let tcuotaf = 0
      let tcuotan = 0

      ctrl.controls.forEach((x, i) => {
        let tipo = x.get('tipo').value
        let clase = x.get('clase').value
        let periodo = (x.get('periodo').value ? x.get('periodo').value.period : 0)
        let meses = (x.get('periodo').value ? x.get('periodo').value.meses : 0)
        let saldo = Utils.formatNumber(x.get('saldo').value)
        let plazo = Utils.formatNumber(x.get('plazo').value)
        let monto = Utils.formatNumber(x.get('monto').value)
        let numcuota = Utils.formatNumber(x.get('cuota').value)
        let valor = Utils.formatNumber(x.get('valor').value)

        let netocuota = plazo - numcuota

        if (tipo) {
          // Entidades Financieras
          if (tipo.id == "1" || tipo.id == "3" || tipo.id == "5" || tipo.id == "8") {

            let cuotacalcu = Utils.formatNumber(x.get('cuotacalcu').value)
            let corriente = (saldo / netocuota) * meses > saldo ? saldo : (saldo / netocuota) * meses
            let nocorriente = saldo - corriente
            let proyeccion = cuotacalcu / periodo

            let descuentolibranza = false
            if (tipo.id == 3) {
              descuentolibranza = x.get('descuentolibranza').value
              if (descuentolibranza) {
                cuotacalcu = 0
                proyeccion = 0
              }
            } else if (tipo.id == "5") {
              x.get("clase").setValue(1, { emitEvent: false });
              clase = 1
            }

            if (saldo > monto) {
              saldo = 0
              this._snackBar.open("Saldo no puede superar el valor del monto", "Ok!", {
                duration: 4000,
              });
            }

            if (numcuota > plazo) {
              x.get("cuota").setValue("", { emitEvent: false });
              this._snackBar.open("El numero de cuota actual no puede superar el plazo", "Ok!", {
                duration: 4000,
              });
            }

            if (netocuota > 0 && numcuota > 0) {
              x.get("numcoutaneto").setValue(netocuota, { emitEvent: false });
            }
            if (clase == 1) {
              tcuotaf += isFinite(proyeccion) ? proyeccion : 0
              tcorrientef += isFinite(corriente) ? corriente : 0
              tnocorrientef += isFinite(nocorriente) ? nocorriente : 0

              x.patchValue({
                corrienteF: isFinite(corriente) ? corriente.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0,
                nocorrienteF: isFinite(nocorriente) ? nocorriente.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0,
              }, { emitEvent: false })
            } else {
              tcuotan += isFinite(proyeccion) ? proyeccion : 0
              tcorrienten += isFinite(corriente) ? corriente : 0
              tnocorrienten += isFinite(nocorriente) ? nocorriente : 0

              x.patchValue({
                corrienteN: isFinite(corriente) ? corriente.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0,
                nocorrienteN: isFinite(nocorriente) ? nocorriente.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0,
              }, { emitEvent: false })
            }

            x.patchValue({
              cuotacalcu: isFinite(cuotacalcu) ? cuotacalcu.toLocaleString() : 0,
              valor: isFinite(proyeccion) ? proyeccion.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0,
              proyeccion: isFinite(proyeccion) ? proyeccion.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0,
              descuentolibranza: descuentolibranza
            }, { emitEvent: false })

          }
          // Hipotecario
          else if (tipo.id == "2") {
            let porcentajeneg = x.get('porcentajeneg').value ? x.get('porcentajeneg').value : 0
            let valorcomercial = Utils.formatNumber(x.get('valorcomercial').value ? x.get('valorcomercial').value : 0)
            let negociovivienda = x.get('negociovivienda').value ? x.get('negociovivienda').value : false
            let cuotahipoteca = Utils.formatNumber(x.get('cuotahipoteca').value ? x.get('cuotahipoteca').value : 0)

            if (!negociovivienda) {
              porcentajeneg = 0
            }

            if (porcentajeneg > 100) {
              x.get("porcentajeneg").setValue("", { emitEvent: false });
              this._snackBar.open("No puede superar el 100%", "Ok!", {
                duration: 3000,
              });
            }
            if (numcuota > plazo) {
              x.get("cuota").setValue("", { emitEvent: false });
              this._snackBar.open("El numero de cuota actual no puede superar el plazo", "Ok!", {
                duration: 4000,
              });
            }
            if (saldo > monto) {
              saldo = 0
              this._snackBar.open("Saldo actual no puede superar el monto", "Ok!", {
                duration: 4000,
              });
            }

            let montoneg = (saldo * porcentajeneg) / 100
            let montofam = saldo - montoneg

            let saldoneg = (monto * porcentajeneg) / 100
            let saldofam = monto - saldoneg

            let comercialneg = (valorcomercial * porcentajeneg) / 100
            let comercialfam = valorcomercial - comercialneg

            let corrienteN = 0
            let corrienteF = 0

            let neto = plazo - numcuota
            if (neto < 12) {
              corrienteN = montoneg
              corrienteF = montofam
            } else {
              corrienteN = (montoneg / neto) * 12
              corrienteF = (montofam / neto) * 12
            }
            let nocorrienteN = montoneg - corrienteN
            let nocorrienteF = montofam - corrienteF

            tcorrientef += corrienteF
            tnocorrientef += nocorrienteF
            tcorrienten += corrienteN
            tnocorrienten += nocorrienteN

            const actfam = this.activosFam.activos();
            //let totalFamilia = Utils.formatNumber(this.totalActFam ) + comercialfam          
            this.totalActFam = comercialfam

            actfam.controls.forEach(x => {
              let pasivo = x.get('pasivo').value
              if (pasivo == i) {

                x.patchValue({
                  tipo: { id: 4, name: "Inmuebles o terrenos" },
                  detalle: 'Casa aval Negocio',
                  cantidad: 1,
                  valor: isFinite(comercialfam) ? comercialfam.toLocaleString() : 0,
                  vlrUni: isFinite(comercialfam) ? comercialfam.toLocaleString() : 0,
                }, { emitEvent: true });
              }
            });

            if (negociovivienda) {
              const actneg = this.activosNeg.activos();
              //this.totalActNeg = Utils.formatNumber(this.totalActNeg ) + comercialneg          

              actneg.controls.forEach(x => {
                let pasivo = x.get('pasivo').value
                if (pasivo == i) {
                  x.patchValue({
                    cantidad: 1,
                    tipo: { id: 4, name: "Inmuebles o terrenos" },
                    detalle: 'Casa aval Negocio',
                    valor: isFinite(comercialneg) ? comercialneg.toLocaleString() : 0,
                    vlrUni: isFinite(comercialneg) ? comercialneg.toLocaleString() : 0,
                  }, { emitEvent: true });
                }
              });
            }

            x.patchValue({
              clase: 0,
              porcentajeneg: isFinite(porcentajeneg) ? porcentajeneg.toLocaleString() : 0,
              cuotahipoteca: isFinite(cuotahipoteca) ? cuotahipoteca.toLocaleString() : 0,
              montoF: isFinite(montofam) ? montofam.toLocaleString() : 0,
              montoN: isFinite(montoneg) ? montoneg.toLocaleString() : 0,
              saldoF: isFinite(saldofam) ? saldofam.toLocaleString() : 0,
              saldoN: isFinite(saldoneg) ? saldoneg.toLocaleString() : 0,
              valorcomercial: isFinite(valorcomercial) ? valorcomercial.toLocaleString() : 0,
              corrienteN: isFinite(corrienteN) ? corrienteN.toLocaleString() : 0,
              nocorrienteN: isFinite(nocorrienteN) ? nocorrienteN.toLocaleString() : 0,
              corrienteF: isFinite(corrienteF) ? corrienteF.toLocaleString() : 0,
              nocorrienteF: isFinite(nocorrienteF) ? nocorrienteF.toLocaleString() : 0,

            }, { emitEvent: false })


          }
          // Pagadiario
          else if (tipo.id == "4") {

            let proyeccion = Utils.formatNumber(x.get('proyeccion').value)
            valor = proyeccion * 30
            tcorrienten += saldo
            tcuotan += valor

            x.patchValue({
              clase: 2,
              cuota: 0,
              proyeccion: isFinite(proyeccion) ? proyeccion.toLocaleString() : 0,
              valor: isFinite(valor) ? valor.toLocaleString() : 0,
              corrienteN: isFinite(saldo) ? saldo.toLocaleString() : 0
            }, { emitEvent: false })


          }
          //Tarjetas de credito
          else if (tipo.id == "6") {

            let corriente = 0
            let nocorriente = 0
            let taza = parseFloat("0.071078")
            let cuotacalcu = monto * taza
            let cuotacent = Utils.formatNumber(x.get('proyeccion').value)
            let cuotareal = 0

            if (cuotacalcu > cuotacent)
              cuotareal = cuotacalcu
            else if (cuotacent > cuotacalcu)
              cuotareal = cuotacent

            valor = cuotareal

            if (saldo > 0) {
              nocorriente = saldo - corriente
              if (periodo == 1) {
                corriente = saldo / 2
                nocorriente = saldo / 2

              } else if (periodo == 2) {
                corriente = saldo
                nocorriente = 0
              }
            } else {
              nocorriente = 0
              corriente = 0
            }

            if (clase == 1) {
              tcuotaf += cuotareal
              tcorrientef += corriente
              tnocorrientef += nocorriente
              x.patchValue({
                corrienteF: isFinite(corriente) ? corriente.toLocaleString() : 0,
                nocorrienteF: isFinite(nocorriente) ? nocorriente.toLocaleString() : 0,
              }, { emitEvent: false })
            } else {
              tcuotan += cuotareal
              tcorrienten += corriente
              tnocorrienten += nocorriente

              x.patchValue({
                corrienteN: isFinite(corriente) ? corriente.toLocaleString() : 0,
                nocorrienteN: isFinite(nocorriente) ? nocorriente.toLocaleString() : 0,
              }, { emitEvent: false })
            }

            x.patchValue({
              proyeccion: isFinite(cuotacent) ? cuotacent.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0,
              valor: isFinite(valor) ? valor.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0,
              cuota: 0,
              cuotacalcu: isFinite(cuotacalcu) ? cuotacalcu.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0,
            }, { emitEvent: false })

          }
          //Otras periodicidades
          else if (tipo.id == "7") {

            let pago = x.get('pago').value
            let tasa = Utils.formatNumber(x.get('tasa').value)
            let corriente = (saldo / netocuota) * meses > saldo ? saldo : (saldo / netocuota) * meses
            let nocorriente = saldo - corriente
            let proyeccion = 0

            if (clase == 1) {
              tcuotaf += isFinite(proyeccion) ? proyeccion : 0
              tcorrientef += isFinite(corriente) ? corriente : 0
              tnocorrientef += isFinite(nocorriente) ? nocorriente : 0

              x.patchValue({
                corrienteF: isFinite(corriente) ? corriente.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0,
                nocorrienteF: isFinite(nocorriente) ? nocorriente.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0,
              }, { emitEvent: false })
            } else {
              tcuotan += isFinite(proyeccion) ? proyeccion : 0
              tcorrienten += isFinite(corriente) ? corriente : 0
              tnocorrienten += isFinite(nocorriente) ? nocorriente : 0

              x.patchValue({
                corrienteN: isFinite(corriente) ? corriente.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0,
                nocorrienteN: isFinite(nocorriente) ? nocorriente.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0,
              }, { emitEvent: false })
            }

            //Pago regular
            if (pago == 1) {
              let tasaporcen = tasa / 100
              if (tasa < 0.8 && tasa > 4) {
                x.get("tasa").setValue("", { emitEvent: false });
                this._snackBar.open("La tasa de interes no puede ser menor a 0,8 ni superior a 4", "Ok!", {
                  duration: 4000,
                });
              }
              let periodoint = Utils.formatNumber(x.get('periodoint').value ? x.get('periodoint').value.period : 0)
              let calcinteres = saldo * tasaporcen * periodoint
              let calculocap = saldo / (plazo - numcuota)
              
              let cuotaint = (calcinteres / periodoint)
              let cuotacap = (calculocap / periodo)
              if (clase == 2) {
                tcuotan += (cuotaint + cuotacap)
              } else {
                tcuotaf += (cuotaint + cuotacap)
              }

              x.patchValue({
                calculoint: isFinite(calcinteres) ? calcinteres.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0,
                calculocap: isFinite(calculocap) ? calculocap.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0,
              }, { emitEvent: false })

            }
            //Pago irregular 
            else if (pago == 2) {
              const cuotas = <FormArray>x.get('cuotasRow')
              let total = 0
              let arrMese = []
              cuotas.controls.forEach(cuo => {
                let cuota = Utils.formatNumber(cuo.get('cuota').value)
                let fecha = cuo.get('fecha').value

                if (fecha && fecha != "") {

                  let mes = new Date(fecha).getMonth()
                  let ano = new Date(fecha).getFullYear()
                  let fullfehca = mes + "-" + ano

                  if (arrMese.indexOf(fullfehca) < 0) {
                    arrMese.push(fullfehca)
                  } else {
                    this._snackBar.open("Ya existe una cuota para este mes", "Ok!", {
                      duration: 5000,
                    });
                    fecha = ""
                  }
                }

                total += valor
                cuo.patchValue({
                  cuota: isFinite(cuota) ? cuota.toLocaleString() : 0,
                  fecha: fecha
                }, { emitEvent: false });
              });
            }
          }
        }

        x.patchValue({
          saldo: isFinite(saldo) ? saldo.toLocaleString() : 0,
          plazo: isFinite(plazo) ? plazo.toLocaleString() : 0,
          monto: isFinite(monto) ? monto.toLocaleString() : 0,
          numcoutaneto: netocuota
        }, { emitEvent: false })
      });

      this.balanceForm.patchValue({
        efectivo: isFinite(efectivo) ? efectivo.toLocaleString() : 0,
        totalCreditos: isFinite(totalCredito) ? totalCredito.toLocaleString() : 0,
        incobrableCobrar: isFinite(incobrable) ? incobrable.toLocaleString() : 0,
        valorCobrar: isFinite(valorCobrar) ? valorCobrar.toLocaleString() : 0,
        cobrarTotal: isFinite(totalCobrar) ? totalCobrar.toLocaleString() : 0,
        recuperacionCobrar: isFinite(recuperacionCobrar) ? recuperacionCobrar.toLocaleString() : 0,
        porcentajeCobrar: isFinite(porcentajeCobrar) ? porcentajeCobrar.toFixed() : 0,
        totalRecuperacion: isFinite(totalrec) ? totalrec : 0,
        proveedoresTotal: isFinite(totalProv) ? totalProv.toLocaleString() : 0,
        tcuotaf: isFinite(tcuotaf) ? tcuotaf.toFixed() : 0,
        tcuotan: isFinite(tcuotan) ? tcuotan.toFixed() : 0,
        tcorrientef: isFinite(tcorrientef) ? tcorrientef.toFixed() : 0,
        tnocorrientef: isFinite(tnocorrientef) ? tnocorrientef.toFixed() : 0,
        tcorrienten: isFinite(tcorrienten) ? tcorrienten.toFixed() : 0,
        tnocorrienten: isFinite(tnocorrienten) ? tnocorrienten.toFixed() : 0,
      }, { emitEvent: false })

      this.insert()
    })

  }

  //----------Carga el balance cuando ya existe en la BD Local
  loadBalance(bal: Balance) {

    return this.balanceForm = this.fb.group({
      efectivo: bal.efectivo,
      clienteCobrar: bal.clienteCobrar,
      observacionesCobrar: bal.observacionesCobrar,
      valorCobrar: bal.valorCobrar,
      incobrableCobrar: bal.incobrableCobrar,
      recuperacionCobrar: bal.recuperacionCobrar,
      cobrarTotal: bal.cobrarTotal,
      porcentajeCobrar: bal.porcentajeCobrar,
      recuperacion: this.loadRecuperacion(bal.recuperacion),
      totalRecuperacion: bal.totalRecuperacion,
      aplicaproveedores: bal.aplicaproveedores,
      proveedoresRow: this.laodProveedores(bal.proveedoresRow),
      proveedoresTotal: bal.proveedoresTotal,
      proveedoresEstacionales: this.laodProveedoresEst(bal.proveedoresEstacionales),
      totalProveedoresEst: bal.totalProveedoresEst,
      creditoactual: bal.creditoactual,
      creditos: this.loadCreditos(bal.creditos),
      totalCreditos: bal.totalCreditos,
      creditosDetalle: this.loadCreditoDetalle(bal.creditosDetalle),
      totalcreditosDetalle: bal.totalcreditosDetalle,
      pasivosRows: this.loadPasivos(bal.pasivosRows),
      tcuotaf: [bal.tcuotaf],
      tcorrientef: [bal.tcorrientef],
      tnocorrientef: [bal.tnocorrientef],
      tcuotan: [bal.tcuotan],
      tcorrienten: [bal.tcorrienten],
      tnocorrienten: [bal.tnocorrienten]
    })
  }

  insert() {

    this.dataBalance = this.balanceForm.value

    this.dataBalance['inventarioRow'] = this.inventario.inventario().value
    this.dataBalance['inventarioTotal'] = this.inventario.totalInventaio

    this.dataBalance.activosFamRows = this.activosFam.activos().value
    this.dataBalance.actfamTotal = this.activosFam.totalActivos

    this.dataBalance.actividadNegRows = this.activosNeg.activos().value
    this.dataBalance.actnegTotal = this.activosNeg.totalActivos

    this.dataBalance.inversiones = this.inversiones.inversiones().value
    this.dataBalance.totalInversiones = this.inversiones.totalInversion
    this.dataBalance.aplicaInversiones = this.inversiones.inversionesForm.value.aplicaInversiones

    this.dataSolicitud.Balance = this.dataBalance
    this._srvSol.saveSol(this.ced, this.dataSolicitud)
  }
  insertInventario(data) {
    this.insert()
  }
  insertActivosNeg(data) {
    this.insert()
  }
  insertActivosFam(data) {
    this.insert()
  }
  insertInversion(data) {
    this.insert()
  }
  //------------------------------------------------------------------

  //---------------Proveedoresd-------------------------------------
  proveedores() {
    return this.balanceForm.get('proveedoresRow') as FormArray;
  }
  initProvRows() {
    return this.fb.group({
      descripcion: ['', Validators.required],
      valor: ['']
    });
  }
  laodProveedores(proveedores: Proveedores[]) {
    let proveedoresArr = this.fb.array([])
    proveedores.forEach(prov => {
      proveedoresArr.push(
        this.fb.group({
          descripcion: prov.descripcion,
          valor: prov.valor
        })
      )
    });
    return proveedoresArr;
  }
  addNewProvRow() {
    this.proveedores().push(this.initProvRows());
  }
  deleteProvRow(index: number) {
    this.proveedores().removeAt(index);
  }
  //----------------------------------------------------------------

  //---------------Proveedores Estacionales-------------------------
  proveedoresEst() {
    return this.balanceForm.get('proveedoresEstacionales') as FormArray;
  }
  initProvEstacionales() {
    return this.fb.group({
      nombre: '',
      numcuotas: '',
      total: '',
      cuotas: this.fb.array([])
    });
  }
  laodProveedoresEst(proveedores: ProveedoresEstacionales[]) {
    let proveedoresArr = this.fb.array([])
    proveedores.forEach(prov => {
      proveedoresArr.push(
        this.fb.group({
          nombre: prov.nombre,
          numcuotas: prov.numcuotas,
          total: prov.total,
          cuotas: this.loadcuotaprovEst(prov.cuotas)
        })
      )
    });
    return proveedoresArr;
  }
  addNewProvEst() {
    this.proveedoresEst().push(this.initProvEstacionales());
  }
  deleteProvEst(index: number) {
    this.proveedoresEst().removeAt(index);
  }
  cuotasproveedores(id: number) {
    return this.proveedoresEst().at(id).get("cuotas") as FormArray
  }
  loadcuotasProveedores(id: number, num: number) {
    this.cuotasproveedores(id).clear();
    for (let cuo = 0; cuo < num; cuo++) {
      this.cuotasproveedores(id).push(this.initcuotaprov());
    }
  }
  initcuotaprov() {
    return this.fb.group({
      mes: '',
      valor: ''
    })
  }
  loadcuotaprovEst(cuotas: any[]) {
    let arr = this.fb.array([])
    cuotas.forEach(cuo => {
      arr.push(
        this.fb.group({
          mes: cuo.mes,
          valor: cuo.valor
        })
      )
    });
    return arr
  }
  //------------------------------------------------

  //--------------Crefitos FDLM AGRO----------------
  creditosDetalle() {
    return this.balanceForm.get('creditosDetalle') as FormArray;
  }
  initCreditosDetalle() {
    return this.fb.group({
      frecuencia: '',
      proyeccion: '',
      numcuota: '',
      total: 0,
      cuotas: this.fb.array([])
    })
  }
  addCreditoDetalle() {
    this.creditosDetalle().push(this.initCreditosDetalle());
  }
  loadCreditoDetalle(creaditos: CreditoDetalle[]) {
    let creditosArr = this.fb.array([])

    if (creaditos) {
      creaditos.forEach(cred => {
        creditosArr.push(
          this.fb.group({
            numcuota: cred.numcuota,
            frecuencia: cred.frecuencia,
            total: cred.total,
            proyeccion: cred.proyeccion,
            cuotas: this.loadcuotaCredito(cred.cuotas)
          })
        )
      });
    }
    return creditosArr
  }
  cuotasCreditos(ti: number) {
    return this.creditosDetalle().at(ti).get("cuotas") as FormArray
  }
  loadcuotasCreditos(id: number, num: number) {
    this.cuotasCreditos(id).clear();
    for (let cuo = 0; cuo < num; cuo++) {
      this.cuotasCreditos(id).push(this.initcuotaCredito());
    }
  }
  initcuotaCredito() {
    return this.fb.group({
      fecha: '',
      valor: [0]
    })
  }
  loadcuotaCredito(cuotas: any[]) {
    let arr = this.fb.array([])
    cuotas.forEach(cuo => {
      arr.push(
        this.fb.group({
          fecha: cuo.fecha,
          valor: cuo.valor
        })
      )
    });
    return arr
  }
  deleteCreditoDetalle(cred: number) {
    this.creditosDetalle().removeAt(cred)
  }
  //-------------------------------------------------

  //---------------Creditos-------------------------
  creditos() {
    return this.balanceForm.get('creditos') as FormArray;
  }
  initCreditos() {
    return this.fb.group({
      valor: [''],
      obligacion: ['']
    });
  }
  loadCreditos(creaditos: Creditos[]) {
    let creditosArr = this.fb.array([])
    creaditos.forEach(cred => {
      creditosArr.push(
        this.fb.group({
          valor: cred.valor,
          obligacion: cred.obligacion
        })
      )
    });
    return creditosArr
  }
  addNewCredito() {
    this.creditos().push(this.initCreditos());
  }
  deleteCredito(index: number) {
    this.creditos().removeAt(index);
  }
  //--------------------------------------------------

  //--------------Recuperacion cartera-------------------------
  recuperacion() {
    return this.balanceForm.get('recuperacion') as FormArray;
  }
  initRecuperacion() {
    return this.fb.group({
      mes: ['', Validators.required],
      valor: ['']
    });
  }
  loadRecuperacion(recuperacion: Recuperacion[]) {
    var recuperacionArr = this.fb.array([])
    recuperacion.forEach(rec => {
      recuperacionArr.push(
        this.fb.group({
          mes: rec.mes,
          valor: rec.valor
        })
      )
    });
    return recuperacionArr;
  }
  addNewRecuperacion() {
    this.recuperacion().push(this.initRecuperacion());
  }
  deleteRecuperacion(index: number) {
    this.recuperacion().removeAt(index);
  }
  //-------------------pasivos---------------------
  initPasivoRows() {
    return this.fb.group({
      tipo: ['', Validators.required],
      fechaprox: [''],
      clase: [''],
      negociovivienda: [false],
      valorcomercial: [0],
      cuotahipoteca: [0],
      cuotafam: [0],
      coutaneg: [0],
      porcentajeneg: '',
      acreedor: [''],
      descuentolibranza: [false],
      monto: [''],
      plazo: [''],
      saldo: [''],
      destino: [''],
      cuota: [''],
      valor: [''],
      periodo: [''],
      cuotacalcu: '',
      tasa: [''],
      pago: [''],//Periodico =1, Irregular=2
      calculoint: [''],
      periodoint: [''],
      fechaproxint: [''],
      calculocap: [''],
      periodocap: [''],
      fechaproxcap: [''],
      montoF: '',
      montoN: '',
      cuotaN: [''],
      cuotaF: [''],
      saldoF: [0],
      saldoN: [0],
      proyeccion: [''],
      corrienteF: [],
      nocorrienteF: [],
      corrienteN: [],
      nocorrienteN: [],
      numcoutaneto: [],
      cuotasRow: this.fb.array([])
    });
  }
  loadPasivos(pasivos: Pasivos[]) {
    let pasivosArray = this.fb.array([])

    pasivos.forEach(pas => {
      let periodocap = [];

      if (pas.periodocap)
        periodocap = this.periodo.find(pe => pe.id == pas.periodocap.id)

      pasivosArray.push(
        this.fb.group({
          tipo: [pas.tipo],
          fechaprox: [pas.fechaprox],
          clase: [pas.clase],
          negociovivienda: [pas.negociovivienda],
          valorcomercial: [pas.valorcomercial],
          cuotahipoteca: [pas.cuotahipoteca],
          cuotafam: [pas.cuotafam],
          coutaneg: [pas.coutaneg],
          porcentajeneg: [pas.porcentajeneg],
          acreedor: [pas.acreedor],
          descuentolibranza: [pas.descuentolibranza],
          monto: [pas.monto],
          plazo: [pas.plazo],
          saldo: [pas.saldo],
          destino: [pas.destino],
          cuota: [pas.cuota],
          valor: [pas.valor],
          periodo: [pas.periodo],
          cuotacalcu: [pas.cuotacalcu],
          tasa: [pas.tasa],
          pago: [pas.pago],//Periodico =1, Irregular=2
          calculoint: [pas.calculoint],
          periodoint: [pas.periodoint],
          fechaproxint: [pas.fechaproxint],
          calculocap: [pas.calculocap],
          periodocap: [periodocap],
          fechaproxcap: [pas.fechaproxcap],
          montoF: [pas.montoF],
          montoN: [pas.montoN],
          saldoF: [pas.saldoF],
          saldoN: [pas.saldoN],
          cuotaN: [pas.cuotaN],
          cuotaF: [pas.cuotaF],
          proyeccion: [pas.proyeccion],
          corrienteF: [pas.corrienteF],
          nocorrienteF: [pas.nocorrienteF],
          corrienteN: [pas.corrienteN],
          nocorrienteN: [pas.nocorrienteN],
          numcoutaneto: [pas.numcoutaneto],
          cuotasRow: this.loadCuotas(pas.cuotasRow)
        })
      )
    });
    return pasivosArray;
  }
  pasivos() {
    return this.balanceForm.get('pasivosRows') as FormArray;
  }
  addNewPasivosRow() {
    this.pasivos().push(this.initPasivoRows());
  }
  deletePasivosRow(index: number, tipo) {

    if (tipo) {
      if (tipo.id == 2) {
        const ctrlfam = this.activosFam.activos();
        ctrlfam.controls.forEach((x, i) => {
          let pasivo = x.get('pasivo').value
          if (pasivo == index) {
            this.activosFam.delete(i)
          }
        })

        const ctrlneg = this.activosNeg.activos();
        ctrlneg.controls.forEach((x, i) => {
          let pasivo = x.get('pasivo').value
          if (pasivo == index) {
            this.activosNeg.delete(i)
          }
        })
      }
    }

    this.pasivos().removeAt(index);
  }
  cuotas(ti): FormArray {
    return this.pasivos().at(ti).get("cuotasRow") as FormArray
  }
  itemsCuotas() {
    return this.fb.group({
      fecha: [''],
      cuota: [''],
    });
  }
  loadCuotas(cuotas: any[]): FormArray {
    let aCuotas: FormArray = this.fb.array([])

    for (let c = 0; c < cuotas.length; c++) {
      const cuo = cuotas[c];
      aCuotas.push(
        this.fb.group({
          fecha: [cuo.fecha],
          cuota: [cuo.cuota],
        })
      )
    }
    return aCuotas
  }
  addCuotas(ti: number) {
    let neto = this.pasivos().at(ti).get("numcoutaneto").value
    this.cuotas(ti).clear();

    for (let cuo = 0; cuo < neto; cuo++) {
      this.cuotas(ti).push(this.itemsCuotas());
    }
  }

  changeHipoteca(pasivo: FormGroup, e, pass: number) {

    const ctrlneg = this.activosNeg.activos();
    ctrlneg.controls.forEach((x, i) => {
      let pasivo = x.get('pasivo').value
      if (pasivo == pass) {
        this.activosNeg.delete(i)
      }
    })

    if (e.checked) {
      this.activosNeg.activos().push(
        this.fb.group({
          tipo: [{ id: 4, name: "Inmuebles o terrenos" }],
          detalle: ['Casa aval Negocio'],
          cantidad: [1],
          vlrUni: [0],
          valor: [0],
          pasivo: [pass]
        })
      );
    }

    pasivo.patchValue({
      porcentajeneg: 0,
      montoN: 0,
      corrienteN: 0,
      nocorrienteN: 0
    }, { emitEvent: false })

  }

  changeTipo(e, pas) {

    const ctrlfam = this.activosFam.activos();
    ctrlfam.controls.forEach((x, i) => {
      let pasivo = x.get('pasivo').value
      if (pasivo == pas) {
        this.activosFam.delete(i)
      }
    })

    const ctrlneg = this.activosNeg.activos();
    ctrlneg.controls.forEach((x, i) => {
      let pasivo = x.get('pasivo').value
      if (pasivo == pas) {
        this.activosNeg.delete(i)
      }
    })

    if (e.value.id == 2) {

      this.activosFam.activos().push(
        this.fb.group({
          tipo: [{ id: 4, name: "Inmuebles o terrenos" }],
          detalle: ['Casa aval Negocio'],
          cantidad: [1],
          vlrUni: [0],
          valor: [0],
          pasivo: [pas]
        })
      );
    }
  }

  clear(form, name) {
    form.clear()
    switch (name) {
      case 'creditoactual':
        this.addNewCredito()
        break
      case 'proveedores':
        if (this.tipoSol == 1) {
          this.addNewProvRow()
        } else if (this.tipoSol == 2) {
          this.proveedoresEst().clear()
          this.addNewProvEst()
        }
        break
    }
  }

  compareFunction(o1: any, o2: any) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

}
