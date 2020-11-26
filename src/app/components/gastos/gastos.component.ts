import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Gastos } from 'src/app/model/gastos';
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
    private activeRoute: ActivatedRoute,
  ) { }

  public gastosForm: FormGroup;
  dataSolicitud: Solicitud = new Solicitud();
  dataGastos: Gastos = new Gastos();
  otroIngreso: any = DataSelect.OtrosIngresosFamiliar;
  totalgatosF:number;
  totalgatosN:number;
  sol:string;

  ngOnInit(): void {

    this.activeRoute.queryParamMap
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


    this.gastosForm = this.fb.group({
      remuneracionRow: this.fb.array([]),
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
      otrosIngresosRow:this.fb.array([]),
      totalOtros:''
    });

    this.gastosForm.valueChanges.subscribe(values => {
      
      let alquilerN = this.formatNumber(values.alquilerN)
      let serviciosN = this.formatNumber(values.serviciosN)
      let transporteN = this.formatNumber(values.transporteN)
      let fletesN = this.formatNumber(values.fletesN)
      let impuestosN = this.formatNumber(values.impuestosN)
      let mantenimientoN = this.formatNumber(values.mantenimientoN)
      let imprevistosN = this.formatNumber(values.imprevistosN)
      let otrosN = this.formatNumber(values.otrosN)
      let totalN = this.formatNumber(values.totalN)      
      this.totalgatosN = alquilerN + serviciosN + transporteN + fletesN + impuestosN + mantenimientoN + imprevistosN +  otrosN
      this.gastosForm.get("totalF").setValue(totalN, { emitEvent: false });

      this.dataGastos.alimentacionF = alquilerN
      this.dataGastos.serviciosF = serviciosN
      this.dataGastos.transporteF = transporteN
      this.dataGastos.fletesN = fletesN
      this.dataGastos.mantenimientoN = mantenimientoN
      this.dataGastos.impuestosN = impuestosN
      this.dataGastos.imprevistosN = imprevistosN
      this.dataGastos.otrosN = otrosN
      this.dataGastos.totalN = totalN

      this.dataSolicitud.Gastos = this.dataGastos

      this.srvSol.saveSol(this.sol, this.dataSolicitud)
      
    })
  }

  formatNumber(num: string) {
    if (typeof (num) == "number") {
      return parseInt(num)
    } else {
      return parseInt(num == "" || num == null ? "0" : num.replace(/\D/g, '').replace(/^0+/, ''))
    }
  }

  initRemuneraRows() {
    return this.fb.group({
      cargo: ['', Validators.required],
      valor: ['', Validators.required]
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
  initOtrosRows() {
    return this.fb.group({
      ingreso: ['', Validators.required],
      valor: ['', Validators.required],
      observacion: ['', Validators.required]
    });
  }
  otrosingresos(){
    return this.gastosForm.get('otrosIngresosRow') as FormArray;
  }  
  addOtrosRow() {
    this.otrosingresos().push(this.initOtrosRows());
  }
  deleteOtrosRow(index: number) {
    this.otrosingresos().removeAt(index);
  }

}
