import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Estacionales } from 'src/app/model/estacionales';
import { Gastos } from 'src/app/model/gastos';
import { OtrosIngresos } from 'src/app/model/otrosingresosfamilia';
import { Remuneracion } from 'src/app/model/remuneracion';
import { Solicitud } from 'src/app/model/solicitud';
import DataSelect from '../../data-select/dataselect.json';
import { IdbSolicitudService } from '../admin/idb-solicitud.service';


@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.scss']
})
export class GastosComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    public srvSol: IdbSolicitudService,
    private activeRoute: ActivatedRoute
  ) { }

  public gastosForm: FormGroup = this.fb.group({
    remuneracionRow: this.loadRemuneracion([]),
    totalRemuneracion: [null],
    arriendoF: '',
    alimentacionF: '',
    educacionF: '',
    vestuarioF: '',
    saludF: '',
    transporteF: '',
    serviciosF: '',
    entretenimientoF: '',
    otrosF: '',
    totalF: '',
    alquilerN: '',
    serviciosN: '',
    transporteN: '',
    fletesN: '',
    impuestosN: '',
    mantenimientoN: '',
    imprevistosN: '',
    otrosN: '',
    totalN: '',
    estacionalesN: this.fb.array([]),
    totalEstacionalesN: '',
    estacionalesF: this.fb.array([]),
    totalEstacionalesF: '',
    otrosIngresosRow: this.fb.array([]),
    totalOtros: ''
  });

  dataSolicitud: Solicitud = new Solicitud();
  dataGastos: Gastos = new Gastos();
  otroIngreso: any = DataSelect.OtrosIngresosFamiliar;
  meses: any = DataSelect.Meses;
  tipoSol:number;
  sol: string;

  ngOnInit(): void {

    this.activeRoute.queryParamMap
      .subscribe((params) => {
        this.sol = params.get('solicitud')
      });

    this.srvSol.getSol(this.sol).subscribe((datasol) => {

      if (datasol) {
        this.dataSolicitud = datasol as Solicitud
        this.tipoSol = datasol.asesor
        if (this.dataSolicitud.Gastos) {
          this.gastosForm = this.loadDataGastosRow(this.dataSolicitud.Gastos);
        }
      }

      this.gastosForm.valueChanges.subscribe((values) => {

        let alquilerN = this.formatNumber(values.alquilerN)
        let serviciosN = this.formatNumber(values.serviciosN)
        let transporteN = this.formatNumber(values.transporteN)
        let fletesN = this.formatNumber(values.fletesN)
        let impuestosN = this.formatNumber(values.impuestosN)
        let mantenimientoN = this.formatNumber(values.mantenimientoN)
        let imprevistosN = this.formatNumber(values.imprevistosN)
        let otrosN = this.formatNumber(values.otrosN)
        let totalgatosN = alquilerN + serviciosN + transporteN + fletesN + impuestosN + mantenimientoN + imprevistosN + otrosN

        let totalEstacionalesN = 0
        const estacionalesN = <FormArray>this.gastosForm.controls['estacionalesN'];
        estacionalesN.controls.forEach((x) => {
          let valor = this.formatNumber(x.get('valor').value)
          totalEstacionalesN += valor
          x.patchValue({
            valor: isFinite(valor) ? valor.toLocaleString() : 0,
          }, { emitEvent: false })
        })

        let arriendoF = this.formatNumber(values.arriendoF)
        let alimentacionF = this.formatNumber(values.alimentacionF)
        let educacionF = this.formatNumber(values.educacionF)
        let vestuarioF = this.formatNumber(values.vestuarioF)
        let saludF = this.formatNumber(values.saludF)
        let transporteF = this.formatNumber(values.transporteF)
        let serviciosF = this.formatNumber(values.serviciosF)
        let entretenimientoF = this.formatNumber(values.entretenimientoF)
        let otrosF = this.formatNumber(values.otrosF)
        let totalgatosF = arriendoF + alimentacionF + educacionF + vestuarioF + saludF + transporteF + serviciosF + entretenimientoF + otrosF

        let totalEstacionalesF = 0
        const estacionalesF = <FormArray>this.gastosForm.controls['estacionalesF'];
        estacionalesF.controls.forEach((x) => {
          let valor = this.formatNumber(x.get('valor').value)
          totalEstacionalesF += valor
          x.patchValue({
            valor: isFinite(valor) ? valor.toLocaleString() : 0,
          }, { emitEvent: false })
        })

        let totalre = 0
        const ctrl = <FormArray>this.gastosForm.controls['remuneracionRow'];
        ctrl.controls.forEach((x) => {
          let valor = this.formatNumber(x.get('valor').value)
          totalre += valor
          x.patchValue({
            valor: isFinite(valor) ? valor.toLocaleString() : 0,
          }, { emitEvent: false })
        })

        let totalOtros = 0
        const otrosI = <FormArray>this.gastosForm.controls['otrosIngresosRow'];
        otrosI.controls.forEach((x) => {
          let valor = this.formatNumber(x.get('valor').value)
          totalOtros += valor
          x.patchValue({
            valor: isFinite(valor) ? valor.toLocaleString() : 0,
          }, { emitEvent: false })
        })

        this.gastosForm.patchValue({
          totalRemuneracion: isFinite(totalre) ? totalre.toLocaleString() : 0,
          alquilerN: isFinite(alquilerN) ? alquilerN.toLocaleString() : 0,
          serviciosN: isFinite(serviciosN) ? serviciosN.toLocaleString() : 0,
          transporteN: isFinite(transporteN) ? transporteN.toLocaleString() : 0,
          fletesN: isFinite(fletesN) ? fletesN.toLocaleString() : 0,
          impuestosN: isFinite(impuestosN) ? impuestosN.toLocaleString() : 0,
          mantenimientoN: isFinite(mantenimientoN) ? mantenimientoN.toLocaleString() : 0,
          imprevistosN: isFinite(imprevistosN) ? imprevistosN.toLocaleString() : 0,
          otrosN: isFinite(otrosN) ? otrosN.toLocaleString() : 0,
          totalEstacionalesN: isFinite(totalEstacionalesN) ? totalEstacionalesN.toLocaleString() : 0,
          arriendoF: isFinite(arriendoF) ? arriendoF.toLocaleString() : 0,
          alimentacionF: isFinite(alimentacionF) ? alimentacionF.toLocaleString() : 0,
          educacionF: isFinite(educacionF) ? educacionF.toLocaleString() : 0,
          vestuarioF: isFinite(vestuarioF) ? vestuarioF.toLocaleString() : 0,
          saludF: isFinite(saludF) ? saludF.toLocaleString() : 0,
          transporteF: isFinite(transporteF) ? transporteF.toLocaleString() : 0,
          serviciosF: isFinite(serviciosF) ? serviciosF.toLocaleString() : 0,
          entretenimientoF: isFinite(entretenimientoF) ? entretenimientoF.toLocaleString() : 0,
          otrosF: isFinite(otrosF) ? otrosF.toLocaleString() : 0,
          totalEstacionalesF: isFinite(totalEstacionalesF) ? totalEstacionalesF.toLocaleString() : 0,
          totalN: isFinite(totalgatosN) ? totalgatosN.toLocaleString() : 0,
          totalF: isFinite(totalgatosF) ? totalgatosF.toLocaleString() : 0,
          totalOtros: isFinite(totalOtros) ? totalOtros.toLocaleString() : 0,
        }, { emitEvent: false })

        this.dataGastos = values
        this.dataSolicitud.Gastos = this.dataGastos
        this.srvSol.saveSol(this.sol, this.dataSolicitud)
      })
    });
  }

  loadDataGastosRow(remu: Gastos) {
    return this.fb.group({
      remuneracionRow: this.loadRemuneracion(remu.remuneracionRow),
      totalRemuneracion: [remu.totalRemuneracion],
      arriendoF: remu.arriendoF,
      alimentacionF: remu.alimentacionF,
      educacionF: remu.educacionF,
      vestuarioF: remu.vestuarioF,
      saludF: remu.saludF,
      transporteF: remu.transporteF,
      serviciosF: remu.serviciosF,
      entretenimientoF: remu.entretenimientoF,
      otrosF: remu.otrosF,
      totalF: remu.totalF,
      alquilerN: remu.alquilerN,
      serviciosN: remu.serviciosN,
      transporteN: remu.transporteN,
      fletesN: remu.fletesN,
      impuestosN: remu.impuestosN,
      mantenimientoN: remu.mantenimientoN,
      imprevistosN: remu.imprevistosN,
      otrosN: remu.otrosN,
      totalN: remu.totalN,
      estacionalesN: this.loadEstacionales(remu.estacionalesN),
      totalEstacionalesN: remu.totalEstacionalesN,
      estacionalesF: this.loadEstacionales(remu.estacionalesF),
      totalEstacionalesF: remu.totalEstacionalesF,
      otrosIngresosRow: this.loadOtrosIngresos(remu.otrosIngresosRow),
      totalOtros: remu.totalOtros
    });
  }

  //-------------Remuneracion --------------------
  loadRemuneracion(remu: Remuneracion[]): FormArray {
    let remuneraArray = this.fb.array([])
    remu.forEach(re => {
      remuneraArray.push(this.fb.group({
        cargo: [re.cargo, Validators.required],
        valor: [re.valor, Validators.required]
      }))
    });
    return remuneraArray
  }
  initRemuneraRows() {
    return this.fb.group({
      cargo: [null, Validators.required],
      valor: [null, Validators.required]
    });
  }
  remuenracion() {
    return this.gastosForm.get('remuneracionRow') as FormArray;
  }
  addRemuneraRow() {
    this.remuenracion().push(this.initRemuneraRows());
  }
  deleteRemuneraRow(index: number) {
    this.remuenracion().removeAt(index);
  }
  //-----------------------------------------------

  //---------------Estacionales---------------------
  initEstacionales() {
    return this.fb.group({
      concepto: ['', Validators.required],
      descripcion: ['', Validators.required],
      mes: ['', Validators.required],
      valor: ['', Validators.required],
    });
  }
  loadEstacionales(estacionales?: Estacionales[]) {
    let esta = this.fb.array([]);
    estacionales.forEach(estacional => {
      esta.push(
        this.fb.group({
          concepto: [estacional.concepto, Validators.required],
          descripcion: [estacional.descripcion, Validators.required],
          mes: [estacional.mes, Validators.required],
          valor: [estacional.valor, Validators.required]
        })
      )
    });
    return esta;
  }
  estacionales() {
    return this.gastosForm.get('estacionalesN') as FormArray;
  }
  addEstacionales() {
    this.estacionales().push(this.initEstacionales());
  }
  deleteEstacionales(index: number) {
    this.estacionales().removeAt(index);
  }
  //------------------------------------------------------

  //---------------EstacionalesFamilia---------------------
  estacionalesF() {
    return this.gastosForm.get('estacionalesF') as FormArray;
  }
  addEstacionalesF() {
    this.estacionalesF().push(this.initEstacionales());
  }
  deleteEstacionalesF(index: number) {
    this.estacionalesF().removeAt(index);
  }
  //----------------------------------------------

  //---------------Otros ingresos---------------------
  initOtrosRows() {
    return this.fb.group({
      ingreso: ['', Validators.required],
      valor: ['', Validators.required],
      observacion: ['', Validators.required]
    });
  }
  loadOtrosIngresos(otrosI: OtrosIngresos[]) {
    let otrosiArr = this.fb.array([]);
    otrosI.forEach(otr => {
      otrosiArr.push(
        this.fb.group({
          ingreso: [otr.ingreso, Validators.required],
          valor: [otr.valor, Validators.required],
          observacion: [otr.observacion, Validators.required]
        })
      )
    });
    return otrosiArr;
  }
  otrosingresos() {
    return this.gastosForm.get('otrosIngresosRow') as FormArray;
  }
  addOtrosRow() {
    this.otrosingresos().push(this.initOtrosRows());
  }
  deleteOtrosRow(index: number) {
    this.otrosingresos().removeAt(index);
  }

  formatNumber(num: string) {
    if (typeof (num) == "number") {
      return parseInt(num)
    } else {
      return parseInt(num == "" || num == null ? "0" : num.replace(/\D/g, '').replace(/^0+/, ''))
    }
  }

}
