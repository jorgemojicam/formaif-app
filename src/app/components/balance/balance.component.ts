import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Balance } from 'src/app/model/balance';
import DataSelect from '../../data-select/dataselect.json';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';
import { IdbSolicitudService } from '../admin/idb-solicitud.service';
import { Solicitud } from 'src/app/model/solicitud';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {
  dataSolicitud: Solicitud = new Solicitud();
  dataBalance: Balance = new Balance();
  balanceForm: FormGroup;

  //Listas desplegables
  tipoActivoFam: any = DataSelect.TipoActivoFam;
  tipoInventario: any = DataSelect.TipoInventario;
  tipoActivo: any = DataSelect.TipoActivoNeg;
  tipoPasivo: any = DataSelect.TipoPasivo;
  clasePasivo: any = DataSelect.ClasePasivo;
  periodo: any = DataSelect.Periodo;

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

  ngOnInit() {

    this.route.queryParamMap
      .subscribe((params) => {
        this.sol = params.get('solicitud')
      });

    this.srvSol.getSol(this.sol)
      .subscribe((datasol) => {
        if (this.sol) {
          this.dataSolicitud = datasol as Solicitud
        } else {

        }
      });


    this.balanceForm = this.fb.group({
      efectivo: '',
      clienteCobrar: '',
      observacionesCobrar: '',
      valorCobrar: '',
      incobrableCobrar: '',
      recuperacionCobrar: '',
      cobrarTotal: '',
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


    this.balanceForm.valueChanges.subscribe(form => {

      this.dataSolicitud.Balance = this.dataBalance

      let valorefec = this.formatNumber(this.balanceForm.controls.efectivo.value)
      let efecsin = this.curPipe.transform(valorefec, 'USD', 'symbol', '1.0-0')      
      this.balanceForm.patchValue({efectivo:efecsin==null ? "":efecsin.replace("$","")},{ emitEvent: false });

      let totalInv =0
      const inven = <FormArray>this.balanceForm.controls['inventarioRow'];
      inven.controls.forEach(x => {       
        totalInv += this.formatNumber(x.get('valor').value)
        let sinCurr = this.curPipe.transform(this.formatNumber(x.get('valor').value), 'USD', 'symbol', '1.0-0')
        x.get("valor").setValue(sinCurr==null?"":sinCurr.replace("$",""), { emitEvent: false });
      });
 
      let totalactneg =0
      const actneg = <FormArray>this.balanceForm.controls['actividadNegRows'];
      actneg.controls.forEach(x => {       
        totalactneg += this.formatNumber(x.get('valor').value)
        let sinCurr = this.curPipe.transform(this.formatNumber(x.get('valor').value), 'USD', 'symbol', '1.0-0')
        x.get("valor").setValue(sinCurr==null?"":sinCurr.replace("$",""), { emitEvent: false });
      });

      this.balanceForm.patchValue({
        inventarioTotal: this.curPipe.transform(totalInv, 'USD', 'symbol', '1.0-0'),
        actnegTotal: this.curPipe.transform(totalactneg, 'USD', 'symbol', '1.0-0')
      },{ emitEvent: false });

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

        if (numcuota > plazo) {
          x.get("cuota").setValue("", { emitEvent: false });
          this._snackBar.open("El numero de cuota actual no puede superar el plazo", "Ok!", {
            duration: 3000,
          });
        }

        if (netocuota > 0 && numcuota > 0) {
          x.get("numcoutaneto").setValue(netocuota, { emitEvent: false });
        } else {

        }

        if (tipo.id == "1") {

          let corriente = (saldo / netocuota) * meses > saldo ? saldo : (saldo / netocuota) * meses
          let nocorriente = saldo - corriente
          let proyeccion = valor / periodo.period

          x.get("proyeccion").setValue(proyeccion, { emitEvent: false });

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

      this.srvSol.saveSol(this.sol, this.dataSolicitud)
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
