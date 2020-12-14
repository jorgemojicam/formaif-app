import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Balance } from 'src/app/model/balance';
import DataSelect from '../../data-select/dataselect.json';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';
import { IdbSolicitudService } from '../admin/idb-solicitud.service';
import { Solicitud } from 'src/app/model/solicitud';
import { Inventario } from 'src/app/model/inventario';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {
  dataSolicitud: Solicitud = new Solicitud();
  dataBalance: Balance = new Balance();
  //balanceForm: FormGroup;

  //Listas desplegables
  tipoActivoFam: any = DataSelect.TipoActivoFam;
  tipoInventario: any = DataSelect.TipoInventario;
  tipoActivo: any = DataSelect.TipoActivoNeg;
  tipoPasivo: any = DataSelect.TipoPasivo;
  clasePasivo: any = DataSelect.ClasePasivo;
  periodo: any = DataSelect.Periodo;
  meses: any = DataSelect.Meses;

  totalActFam: number;
  totalProv: number;
  sol: string;

  constructor(
    public srvSol: IdbSolicitudService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private curPipe: CurrencyPipe,
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
    proveedoresRow: this.fb.array([this.initProvRows()]),
    proveedoresTotal: '',
    pasivosRows: this.fb.array([this.initPasivoRows()]),
    tcuotaf: [null],
    tcorrientef: [null],
    tnocorrientef: [null]
  })

  ngOnInit() {

    this.route.queryParamMap.subscribe((params) => {
      this.sol = params.get('solicitud')
    });

    this.srvSol.getSol(this.sol).subscribe((datasol) => {
      if (this.sol) {
        this.dataSolicitud = datasol as Solicitud
        this.loadBalance(this.dataSolicitud.Balance)
      }
      this.balanceForm.valueChanges.subscribe(form => {

        let efectivo = this.formatNumber(this.balanceForm.controls.efectivo.value)
        let incobrable = this.formatNumber(this.balanceForm.controls.incobrableCobrar.value)
        let valorCobrar = this.formatNumber(this.balanceForm.controls.valorCobrar.value)
        let porcentajeCobrar = (incobrable / valorCobrar) * 100
        let total = valorCobrar - incobrable

        let totalrec = 0
        const recupera = <FormArray>this.balanceForm.controls['recuperacion'];
        recupera.controls.forEach(x => {
          let valor = x.get('valor').value
          totalrec += this.formatNumber(x.get('valor').value)          
          x.patchValue({
            valor: isFinite(valor)?valor.toLocaleString:0
          }, { emitEvent: false }) 
        });

        let totalInv = 0
        const inven = <FormArray>this.balanceForm.controls['inventarioRow'];
        inven.controls.forEach(x => {
          totalInv += this.formatNumber(x.get('valor').value)
          let valor = this.formatNumber(x.get('valor').value)
          x.patchValue({
            valor: isFinite(valor) ? valor.toLocaleString() : 0
          }, { emitEvent: false })
        });
        
        this.balanceForm.patchValue({
          efectivo: isFinite(efectivo) ? efectivo.toLocaleString() : 0,
          incobrableCobrar: isFinite(incobrable) ? incobrable.toLocaleString() : 0,
          valorCobrar: isFinite(valorCobrar) ? valorCobrar.toLocaleString() : 0,
          cobrarTotal: isFinite(total) ? total.toLocaleString() : 0,
          porcentajeCobrar: isFinite(porcentajeCobrar) ? porcentajeCobrar.toFixed(2) : 0,
          totalRecuperacion: isFinite(totalrec) ? totalrec.toLocaleString() : 0,
        }, { emitEvent: false });

        let totalactneg = 0
        const actneg = <FormArray>this.balanceForm.controls['actividadNegRows'];
        actneg.controls.forEach(x => {
          let valor =this.formatNumber(x.get('valor').value)
          totalactneg+=valor
          x.patchValue({
            valor: isFinite(valor)?valor.toLocaleString():0
          }, { emitEvent: false });
        });

        let totalactfam = 0
        const actfam = <FormArray>this.balanceForm.controls['activosFamRows'];
        actfam.controls.forEach(x => {
          totalactfam += this.formatNumber(x.get('valor').value)
          let sinCurr = this.curPipe.transform(this.formatNumber(x.get('valor').value), 'USD', 'symbol', '1.0-0')
          x.get("valor").setValue(sinCurr == null ? "" : sinCurr.replace("$", ""), { emitEvent: false });
        });

        this.balanceForm.patchValue({
          inventarioTotal: this.curPipe.transform(totalInv, 'USD', 'symbol', '1.0-0'),
          actnegTotal: this.curPipe.transform(totalactneg, 'USD', 'symbol', '1.0-0'),
          actfamTotal: this.curPipe.transform(totalactfam, 'USD', 'symbol', '1.0-0'),
        }, { emitEvent: false });

        const ctrl = <FormArray>this.balanceForm.controls['pasivosRows'];
        ctrl.controls.forEach((x, index) => {
          let tipo = x.get('tipo').value
          let clase = x.get('clase').value
          let periodo = x.get('periodo').value
          let saldo = this.formatNumber(x.get('saldo').value)
          let plazo = this.formatNumber(x.get('plazo').value)
          let monto = this.formatNumber(x.get('monto').value)
          let numcuota = this.formatNumber(x.get('cuota').value)
          let valor = this.formatNumber(x.get('valor').value)
          let meses = 12
          let netocuota = plazo - numcuota

          if (tipo.id == "1") {

            let corriente = (saldo / netocuota) * meses > saldo ? saldo : (saldo / netocuota) * meses
            let nocorriente = saldo - corriente
            let proyeccion = valor / periodo.period

            if (numcuota > plazo) {
              x.get("cuota").setValue("", { emitEvent: false });
              this._snackBar.open("El numero de cuota actual no puede superar el plazo", "Ok!", {
                duration: 3000,
              });
            }

            if (netocuota > 0 && numcuota > 0) {
              x.get("numcoutaneto").setValue(netocuota, { emitEvent: false });
            }

            x.get("proyeccion").setValue(proyeccion, { emitEvent: false });

            if (clase == 1) {
              x.get("corrienteF").setValue(corriente, { emitEvent: false });
              x.get("nocorrienteF").setValue(nocorriente, { emitEvent: false });
            } else {
              x.get("corrienteN").setValue(corriente, { emitEvent: false });
              x.get("nocorrienteN").setValue(nocorriente, { emitEvent: false });
            }
          } else if (tipo.id == "6") {

            let corriente = 0
            let nocorriente = 0
            let valor = parseFloat("0.071078")
            let cuotacalcu = monto * valor

            if (saldo > 0) {
              nocorriente = saldo - corriente
              if (periodo == 1) {
                corriente = saldo / 2
              } else if (periodo == 2) {
                corriente = saldo
              }
            } else {
              nocorriente = 0
              corriente = 0
            }

            x.get("cuotacalcu").setValue(cuotacalcu, { emitEvent: false });

            if (clase == 1) {
              x.get("corrienteF").setValue(corriente, { emitEvent: false });
              x.get("nocorrienteF").setValue(nocorriente, { emitEvent: false });
            } else {
              x.get("corrienteN").setValue(corriente, { emitEvent: false });
              x.get("nocorrienteN").setValue(nocorriente, { emitEvent: false });
            }
          }
          this.ref.detectChanges()
        });

        this.dataBalance = form
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
      porcentajeCobrar: '',
      recuperacion: this.fb.array([this.initRecuperacion()]),
      totalRecuperacion: '',
      inventarioRow: this.loadInventarioRows(bal.inventarioRow),
      inventarioTotal: bal.inventarioTotal,
      actividadNegRows: this.fb.array([this.initActinegRow()]),
      actnegTotal: '',
      activosFamRows: this.fb.array([this.initActifamRow()]),
      actfamTotal: '',
      proveedoresRow: this.fb.array([this.initProvRows()]),
      proveedoresTotal: '',
      pasivosRows: this.fb.array([this.initPasivoRows()]),
      tcuotaf: [null],
      tcorrientef: [null],
      tnocorrientef: [null]
    })
  }

  initInventarioRows() {
    return this.fb.group({
      tipo: ['', Validators.required],
      cantidad: ['', Validators.required],
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
  initActinegRow() {
    return this.fb.group({
      tipo: ['', Validators.required],
      detalle: ['', Validators.required],
      valor: [null, Validators.required]
    });
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
  initActifamRow() {
    return this.fb.group({
      tipo: ['', Validators.required],
      detalle: ['', Validators.required],
      valor: ['', Validators.required]
    });
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
  addNewProvRow() {
    this.proveedores().push(this.initProvRows());
  }
  deleteProvRow(index: number) {
    this.proveedores().removeAt(index);
  }
  //----------------------------------------

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
  addNewRecuperacion() {
    this.recuperacion().push(this.initRecuperacion());
  }
  deleteRecuperacion(index: number) {
    this.recuperacion().removeAt(index);
  }
  //----------------------------------------
  initPasivoRows() {
    return this.fb.group({
      tipo: ['', Validators.required],
      clase: [''],
      negociovivienda: [false],
      acreedor: [''],
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
  formatNumber(num: string) {
    if (typeof (num) == "number") {
      return parseInt(num)
    } else {
      return parseInt(num == "" || num == null ? "0" : num.replace(/\D/g, '').replace(/^0+/, ''))
    }
  }
}
