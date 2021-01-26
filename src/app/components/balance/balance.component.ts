import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Balance } from 'src/app/model/balance';
import DataSelect from '../../data-select/dataselect.json';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IdbSolicitudService } from '../admin/idb-solicitud.service';
import { Solicitud } from 'src/app/model/solicitud';
import { Inventario } from 'src/app/model/inventario';
import { ActivosFamilia } from 'src/app/model/activosfamilia';
import { ActivosNegocio } from 'src/app/model/activosnegocio';
import { Recuperacion } from 'src/app/model/recuperacion';
import { Proveedores } from 'src/app/model/proveedores';
import { Creditos } from 'src/app/model/creditos';
import { Inversiones } from 'src/app/model/inversiones';
import { Pasivos } from 'src/app/model/pasivos';
import Utils from '../../utils'

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {
  dataSolicitud: Solicitud = new Solicitud();
  dataBalance: Balance = new Balance();

  //Listas desplegables
  tipoActivoFam: any = DataSelect.TipoActivoFam;
  tipoInventario: any = DataSelect.TipoInventario;
  tipoInventarioAgro: any = DataSelect.TipoInventarioAgro;
  tipoActivo: any = DataSelect.TipoActivoNeg;
  tipoPasivo: any = DataSelect.TipoPasivo;
  clasePasivo: any = DataSelect.ClasePasivo;
  periodo: any = DataSelect.Periodo;
  meses: any = DataSelect.Meses;
  CuotasDifiere: any= DataSelect.CuotasDifiere;

  tipoSol: number;
  totalActFam: number;
  totalProv: number;
  sol: string;

  constructor(
    public srvSol: IdbSolicitudService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
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
    inventarioRow: this.fb.array([this.initInventarioRows()]),
    inventarioTotal: '',
    actividadNegRows: this.fb.array([this.initActinegRow()]),
    actnegTotal: '',
    activosFamRows: this.fb.array([this.initActifamRow()]),
    actfamTotal: '',
    aplicaproveedores: false,
    proveedoresRow: this.fb.array([this.initProvRows()]),
    proveedoresTotal: '',
    creditoactual: '',
    creditos: this.fb.array([this.initCreditos()]),
    totalCreditos: '',
    aplicaInversiones: '',
    inversiones: this.fb.array([this.initInversiones()]),
    totalInversiones: '',
    pasivosRows: this.fb.array([this.initPasivoRows()]),
    tcuotaf: [0],
    tcorrientef: [0],
    tnocorrientef: [0],
    tcuotan: [0],
    tcorrienten: [0],
    tnocorrienten: [0]
  })

  ngOnInit() {

    this.route.queryParamMap.subscribe((params) => {
      this.sol = params.get('solicitud')
    });

    this.srvSol.getSol(this.sol).subscribe((datasol) => {
      if (this.sol) {
        this.tipoSol = datasol.asesor

        if (this.tipoSol == 1)
          this.tipoPasivo = DataSelect.TipoPasivo.filter(pas => pas.id != 7)

        this.dataSolicitud = datasol as Solicitud
        if (this.dataSolicitud.Balance) {
          this.loadBalance(this.dataSolicitud.Balance)
        }
      }
      this.balanceForm.valueChanges.subscribe(form => {

        let efectivo = Utils.formatNumber(this.balanceForm.controls.efectivo.value)
        let incobrable = Utils.formatNumber(this.balanceForm.controls.incobrableCobrar.value)
        let valorCobrar = Utils.formatNumber(this.balanceForm.controls.valorCobrar.value)
        if (incobrable > valorCobrar) {
          incobrable = 0
          this._snackBar.open("Valor incobrable no pude ser mayor al valor", "Ok!", {
            duration: 3000,
          });
        }

        let porcentajeCobrar = (incobrable / valorCobrar) * 100
        let totalCobrar = 0
        if (incobrable == 0) {
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

        //Calculo inventario
        let totalInv = 0
        const inven = <FormArray>this.balanceForm.controls['inventarioRow'];
        inven.controls.forEach(x => {
          let cantidad=Utils.formatNumber(x.get('cantidad').value)
          let vlrUni=Utils.formatNumber(x.get('vlrUni').value)
          let valor=vlrUni*cantidad
          totalInv += valor
          x.patchValue({
            valor: isFinite(valor) ? valor.toLocaleString() : 0
          }, { emitEvent: false })
        });

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

        //Calculo activos negocio
        let totalactneg = 0
        const actneg = <FormArray>this.balanceForm.controls['actividadNegRows'];
        actneg.controls.forEach(x => {
          let cantidad=Utils.formatNumber(x.get('cantidad').value)
          let vlrUni=Utils.formatNumber(x.get('vlrUni').value)
          let valor=cantidad*vlrUni
          totalactneg += valor
          x.patchValue({
            valor: isFinite(valor) ? valor.toLocaleString() : 0
          }, { emitEvent: false });
        });
        //Calculo activos familia
        let totalactfam = 0
        const actfam = <FormArray>this.balanceForm.controls['activosFamRows'];
        actfam.controls.forEach(x => {
          let cantidad=Utils.formatNumber(x.get('cantidad').value)
          let vlrUni=Utils.formatNumber(x.get('vlrUni').value)
          let valor=cantidad*vlrUni
          totalactfam += valor
          x.patchValue({
            valor: isFinite(valor) ? valor.toLocaleString() : 0
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

        //calculo inversiones
        let totalInversiones = 0
        const inversiones = <FormArray>this.balanceForm.controls['inversiones'];
        inversiones.controls.forEach(x => {
          let valor = Utils.formatNumber(x.get('valor').value)
          totalInversiones += valor
          x.patchValue({
            valor: isFinite(valor) ? valor.toLocaleString() : 0
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

        ctrl.controls.forEach((x) => {
          let tipo = x.get('tipo').value
          let clase = x.get('clase').value
          let periodo = (x.get('periodo').value ? x.get('periodo').value.period : 0)
          let saldo = Utils.formatNumber(x.get('saldo').value)
          let plazo = Utils.formatNumber(x.get('plazo').value)
          let monto = Utils.formatNumber(x.get('monto').value)
          let numcuota = Utils.formatNumber(x.get('cuota').value)
          let valor = Utils.formatNumber(x.get('valor').value)
          let meses = 12
          let netocuota = plazo - numcuota

          // Entidades Financieras
          if (tipo.id == "1" || tipo.id == "3" || tipo.id == "5" || tipo.id == "8") {
            let corriente = (saldo / netocuota) * meses > saldo ? saldo : (saldo / netocuota) * meses
            let nocorriente = saldo - corriente
            let proyeccion = valor / periodo
            let descuentolibranza = false
            if (tipo.id == 3) {
              descuentolibranza = x.get('descuentolibranza').value
              if (descuentolibranza) {
                valor = 0
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
              tcuotaf += proyeccion
              tcorrientef += corriente
              tnocorrientef += nocorriente
              x.patchValue({
                corrienteF: isFinite(corriente) ? corriente.toLocaleString() : 0,
                nocorrienteF: isFinite(nocorriente) ? nocorriente.toLocaleString() : 0,
              }, { emitEvent: false })
            } else {
              tcuotan += proyeccion
              tcorrienten += corriente
              tnocorrienten += nocorriente
              x.patchValue({
                corrienteN: isFinite(corriente) ? corriente.toLocaleString() : 0,
                nocorrienteN: isFinite(nocorriente) ? nocorriente.toLocaleString() : 0,
                proyeccion:isFinite(proyeccion) ? proyeccion.toLocaleString() : 0,
              }, { emitEvent: false })
            }

            x.patchValue({
              proyeccion: isFinite(proyeccion) ? proyeccion.toLocaleString() : 0,
              descuentolibranza: descuentolibranza
            }, { emitEvent: false })

            // Hipotecario
          } else if (tipo.id == "2") {
            let porcentajeneg = x.get('porcentajeneg').value
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
            let montoneg = (saldo * porcentajeneg) / 100
            let montofam = saldo - montoneg

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

            x.patchValue({
              montoF: isFinite(montofam) ? montofam.toLocaleString() : 0,
              montoN: isFinite(montoneg) ? montoneg.toLocaleString() : 0,
              corrienteN: isFinite(corrienteN) ? corrienteN.toLocaleString() : 0,
              nocorrienteN: isFinite(nocorrienteN) ? nocorrienteN.toLocaleString() : 0,
              corrienteF: isFinite(corrienteF) ? corrienteF.toLocaleString() : 0,
              nocorrienteF: isFinite(nocorrienteF) ? nocorrienteF.toLocaleString() : 0,

            }, { emitEvent: false })

            // Pagadiario
          } else if (tipo.id == "4") {

            let corrienteN = numcuota * 30
            tcorrienten += saldo
            tcuotan +=corrienteN
            x.patchValue({
              cuota: isFinite(numcuota) ? numcuota.toLocaleString() : 0,
              corrienteN: isFinite(corrienteN) ? corrienteN.toLocaleString() : 0
            }, { emitEvent: false })

            //Tarjetas de credito
          } else if (tipo.id == "6") {

            let corriente = 0
            let nocorriente = 0
            let valor = parseFloat("0.071078")
            let cuotacalcu = monto * valor

            if (saldo > 0) {
              nocorriente = saldo - corriente
              if (periodo == 1) {
                corriente = saldo/2
                nocorriente = saldo/2
                
              } else if (periodo == 2) {
                corriente = saldo
                nocorriente = 0
              }
            } else {
              nocorriente = 0
              corriente = 0
            }

            if (clase == 1) {
              tcuotaf += 0
              tcorrientef += corriente
              tnocorrientef += nocorriente
              x.patchValue({
                corrienteF: isFinite(corriente) ? corriente.toLocaleString() : 0,
                nocorrienteF: isFinite(nocorriente) ? nocorriente.toLocaleString() : 0,
              }, { emitEvent: false })
            } else {
              tcuotan += 0
              tcorrienten += corriente
              tnocorrienten += nocorriente
              x.patchValue({
                corrienteN: isFinite(corriente) ? corriente.toLocaleString() : 0,
                nocorrienteN: isFinite(nocorriente) ? nocorriente.toLocaleString() : 0,
              }, { emitEvent: false })
            }

            x.patchValue({
              cuotacalcu: isFinite(cuotacalcu) ? cuotacalcu.toLocaleString() : 0,
            }, { emitEvent: false })

          //Otras periodicidades
          } else if (tipo.id == "7") {

            let tasa = x.get('tasa').value
            if (tasa < 0.8 && tasa > 4) {
              x.get("tasa").setValue("", { emitEvent: false });
              this._snackBar.open("La tasa de interes no puede ser menor a 0,8 ni superior a 4", "Ok!", {
                duration: 4000,
              });
            }
            let periodo = Utils.formatNumber(x.get('periodoint').value ? x.get('periodoint').value.period : 0)
            let calcinteres = saldo * tasa * periodo
            let calculocap = saldo / (plazo - numcuota)
            x.patchValue({
              calculoint: isFinite(calcinteres) ? calcinteres.toLocaleString() : 0,
              calculocap: isFinite(calculocap) ? calculocap.toLocaleString() : 0,
            }, { emitEvent: false })

          }

          x.patchValue({
            saldo: isFinite(saldo) ? saldo.toLocaleString() : 0,
            plazo: isFinite(plazo) ? plazo.toLocaleString() : 0,
            monto: isFinite(monto) ? monto.toLocaleString() : 0,
            valor: isFinite(valor) ? valor.toLocaleString() : 0,
            numcoutaneto: netocuota
          }, { emitEvent: false })
        });

        this.balanceForm.patchValue({
          efectivo: isFinite(efectivo) ? efectivo.toLocaleString() : 0,
          totalCreditos: isFinite(totalCredito) ? totalCredito.toLocaleString() : 0,
          incobrableCobrar: isFinite(incobrable) ? incobrable.toLocaleString() : 0,
          valorCobrar: isFinite(valorCobrar) ? valorCobrar.toLocaleString() : 0,
          cobrarTotal: isFinite(totalCobrar) ? totalCobrar.toLocaleString() : 0,
          porcentajeCobrar: isFinite(porcentajeCobrar) ? porcentajeCobrar.toFixed() : 0,
          totalRecuperacion: isFinite(totalrec) ? totalrec.toLocaleString() : 0,
          inventarioTotal: isFinite(totalInv) ? totalInv.toLocaleString() : 0,
          actnegTotal: isFinite(totalactneg) ? totalactneg.toLocaleString() : 0,
          actfamTotal: isFinite(totalactfam) ? totalactfam.toLocaleString() : 0,
          proveedoresTotal: isFinite(totalProv) ? totalProv.toLocaleString() : 0,
          totalInversiones: isFinite(totalInversiones) ? totalInversiones.toLocaleString() : 0,
          tcuotaf: isFinite(tcuotaf) ? tcuotaf.toLocaleString() : 0,
          tcuotan: isFinite(tcuotan) ? tcuotan.toLocaleString() : 0,
          tcorrientef: isFinite(tcorrientef) ? tcorrientef.toLocaleString() : 0,
          tnocorrientef: isFinite(tnocorrientef) ? tnocorrientef.toLocaleString() : 0,
          tcorrienten: isFinite(tcorrienten) ? tcorrienten.toLocaleString() : 0,
          tnocorrienten: isFinite(tnocorrienten) ? tnocorrienten.toLocaleString() : 0,
        }, { emitEvent: false })

        this.dataBalance = this.balanceForm.value
        this.dataSolicitud.Balance = this.dataBalance
        this.srvSol.saveSol(this.sol, this.dataSolicitud)
      })

    });
  }

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
      inventarioRow: this.loadInventarioRows(bal.inventarioRow),
      inventarioTotal: bal.inventarioTotal,
      actividadNegRows: this.loadActividad(bal.actividadNegRows),
      actnegTotal: bal.actnegTotal,
      activosFamRows: this.loadActividadFam(bal.activosFamRows),
      actfamTotal: bal.actfamTotal,
      aplicaproveedores: bal.aplicaproveedores,
      proveedoresRow: this.laodProveedores(bal.proveedoresRow),
      proveedoresTotal: bal.proveedoresTotal,
      creditoactual: bal.creditoactual,
      creditos: this.loadCreditos(bal.creditos),
      totalCreditos: bal.totalCreditos,
      aplicaInversiones: bal.aplicaInversiones,
      inversiones: this.loadInversiones(bal.inversiones),
      totalInversiones: bal.totalInversiones,
      pasivosRows: this.loadPasivos(bal.pasivosRows),
      tcuotaf: [bal.tcuotaf],
      tcorrientef: [bal.tcorrientef],
      tnocorrientef: [bal.tnocorrientef],
      tcuotan: [bal.tcuotan],
      tcorrienten: [bal.tcorrienten],
      tnocorrienten: [bal.tnocorrienten]
    })
  }

  //----------------Inventario--------------------------------
  initInventarioRows() {
    return this.fb.group({
      tipo: ['', Validators.required],
      cantidad: ['', Validators.required],
      vlrUni: ['', Validators.required],
      descripcion: ['', Validators.required],
      valor: ['']
    });
  }
  loadInventarioRows(inventarios: Inventario[]) {
    let arrayInventario = this.fb.array([])
    inventarios.forEach(inv => {
      arrayInventario.push(this.fb.group({
        tipo: [inv.tipo],
        cantidad: [inv.cantidad],
        vlrUni: [inv.vlrUni],
        descripcion: [inv.descripcion],
        valor: [inv.valor]
      }))
    });
    return arrayInventario
  }

  inventario() {
    return this.balanceForm.get('inventarioRow') as FormArray;
  }
  addInventarioRow() {
    this.inventario().push(this.initInventarioRows());
  }
  deleteInventarioRow(index: number) {
    this.inventario().removeAt(index);
  }
  //------------------------------------------------------------------

  //------------------------Activos negocio--------------------------
  initActinegRow() {
    return this.fb.group({
      tipo: ['', Validators.required],
      detalle: ['', Validators.required],
      cantidad: ['', Validators.required],
      vlrUni: ['', Validators.required],
      valor: [null, Validators.required]
    });
  }
  loadActividad(act: ActivosNegocio[]) {
    let activosArr = this.fb.array([]);
    act.forEach(a => {
      activosArr.push(
        this.fb.group({
          tipo: [a.tipo, Validators.required],
          detalle: [a.detalle, Validators.required],
          cantidad: [a.cantidad],
        vlrUni: [a.vlrUni],
          valor: a.valor,
        })
      )
    });
    return activosArr;
  }
  activosNegocio() {
    return this.balanceForm.get('actividadNegRows') as FormArray;
  }
  addActNegNewRow() {
    this.activosNegocio().push(this.initActinegRow());
  }
  deleteActNegRow(index: number) {
    this.activosNegocio().removeAt(index);
  }
  //-------------------------------------------------------------------

  //-------------------------------------activos familia---------------
  initActifamRow() {
    return this.fb.group({
      tipo: ['', Validators.required],
      detalle: ['', Validators.required],
      cantidad: ['', Validators.required],
      vlrUni: ['', Validators.required],
      valor: ['', Validators.required]
    });
  }
  loadActividadFam(act: ActivosFamilia[]) {
    let activosArr = this.fb.array([]);
    act.forEach(a => {
      activosArr.push(
        this.fb.group({
          tipo: [a.tipo, Validators.required],
          detalle: [a.detalle, Validators.required],
          cantidad: [a.cantidad],
          vlrUni: [a.vlrUni],
          valor: a.valor,
        })
      )
    });
    return activosArr;
  }
  activosFamilia() {
    return this.balanceForm.get('activosFamRows') as FormArray;
  }
  addActFamNewRow() {
    this.activosFamilia().push(this.initActinegRow());
  }
  deleteActFamRow(index: number) {
    this.activosFamilia().removeAt(index);
  }
  //----------------------------------------------------------------

  //---------------Proveedoresd-------------------------
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
  //----------------------------------------

  //---------------Creditos-------------------------
  creditos() {
    return this.balanceForm.get('creditos') as FormArray;
  }
  initCreditos() {
    return this.fb.group({
      valor: ['']
    });
  }
  loadCreditos(creaditos: Creditos[]) {
    let creditosArr = this.fb.array([])
    creaditos.forEach(cred => {
      creditosArr.push(
        this.fb.group({
          valor: cred.valor
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

  //---------------Inversiones-------------------------
  inversiones() {
    return this.balanceForm.get('inversiones') as FormArray;
  }
  initInversiones() {
    return this.fb.group({
      detalle: [''],
      mes: [''],
      origen: [''],
      valor: [''],
    });
  }
  loadInversiones(inversiones: Inversiones[]) {
    let inversionesArra = this.fb.array([])
    inversiones.forEach(inv => {
      inversionesArra.push(
        this.fb.group({
          detalle: inv.detalle,
          mes: inv.mes,
          origen: inv.origen,
          valor: inv.valor,
        })
      )
    });
    return inversionesArra
  }
  addInversion() {
    this.inversiones().push(this.initInversiones());
  }
  deleteInversion(index: number) {
    this.inversiones().removeAt(index);
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
      clase: [''],
      negociovivienda: [false],
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
      fechaproxint: [null],
      calculocap: [''],
      periodocap: [''],
      fechaproxcap: [''],
      montoF: '',
      montoN: '',
      cuotaN: [''],
      cuotaF: [''],
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
      let tipopas = [];
      let periodopas = [];

      if (pas.tipo)
        tipopas = this.tipoPasivo.find(el => el.id == pas.tipo.id)
      if (pas.periodo)
        periodopas = this.periodo.find(pe => pe.id == pas.periodo.id)

      pasivosArray.push(
        this.fb.group({
          tipo: [tipopas],
          clase: [pas.clase],
          negociovivienda: [pas.negociovivienda],
          porcentajeneg: [pas.porcentajeneg],
          acreedor: [pas.acreedor],
          descuentolibranza: [pas.descuentolibranza],
          monto: [pas.monto],
          plazo: [pas.plazo],
          saldo: [pas.saldo],
          destino: [pas.destino],
          cuota: [pas.cuota],
          valor: [pas.valor],
          periodo: [periodopas],
          cuotacalcu: [pas.cuotacalcu],
          tasa: [pas.tasa],
          pago: [pas.pago],//Periodico =1, Irregular=2
          calculoint: [pas.calculoint],
          periodoint: [''],
          fechaproxint: [pas.fechaproxint],
          calculocap: [pas.calculocap],
          periodocap: [''],
          fechaproxcap: [''],
          montoF: [pas.montoF],
          montoN: [pas.montoN],
          cuotaN: [pas.cuotaN],
          cuotaF: [pas.cuotaF],
          proyeccion: [pas.proyeccion],
          corrienteF: [pas.corrienteF],
          nocorrienteF: [pas.nocorrienteF],
          corrienteN: [pas.corrienteN],
          nocorrienteN: [pas.nocorrienteN],
          numcoutaneto: [pas.numcoutaneto],
          cuotasRow: this.fb.array([])
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
  deletePasivosRow(index: number) {
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
  addCuotas(ti: number) {
    let neto = this.pasivos().at(ti).get("numcoutaneto").value
    this.cuotas(ti).clear();

    for (let cuo = 0; cuo < neto; cuo++) {
      this.cuotas(ti).push(this.itemsCuotas());
    }
  }
  changeHipoteca(pasivo: FormGroup) {
    pasivo.patchValue({
      porcentajeneg: 0,
      montoN: 0,
      corrienteN: 0,
      nocorrienteN: 0
    }, { emitEvent: false })

  }

}
