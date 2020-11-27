import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Gastos } from 'src/app/model/gastos';
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
    private activeRoute: ActivatedRoute,
    private ref: ChangeDetectorRef,
  ) { }

  public gastosForm: FormGroup;
  dataSolicitud: Solicitud = new Solicitud();
  dataGastos: Gastos = new Gastos();
  otroIngreso: any = DataSelect.OtrosIngresosFamiliar;
  totalRemuneracion: number;
  totalgatosF: number;
  totalgatosN: number;
  sol: string;

  ngOnInit(): void {

    this.activeRoute.queryParamMap
      .subscribe((params) => {
        this.sol = params.get('solicitud')
      });

    this.gastosForm = this.loadGastosRow();

    this.srvSol.getSol(this.sol)
      .subscribe((datasol) => {

        if (datasol) {
          this.dataSolicitud = datasol as Solicitud
          if(this.dataSolicitud.Gastos){
            this.gastosForm = this.loadDataGastosRow(this.dataSolicitud.Gastos);
          } else {  
            this.gastosForm = this.loadGastosRow();
          }
        }else{
          this.gastosForm = this.loadGastosRow();
        }  
        
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
          this.totalgatosN = alquilerN + serviciosN + transporteN + fletesN + impuestosN + mantenimientoN + imprevistosN + otrosN

          this.dataGastos.alquilerN = alquilerN
          this.dataGastos.serviciosN = serviciosN
          this.dataGastos.transporteN = transporteN
          this.dataGastos.fletesN = fletesN
          this.dataGastos.mantenimientoN = mantenimientoN
          this.dataGastos.impuestosN = impuestosN
          this.dataGastos.imprevistosN = imprevistosN
          this.dataGastos.otrosN = otrosN
          this.dataGastos.totalN = totalN
          this.gastosForm.get("totalN").setValue(totalN, { emitEvent: false });

          let arriendoF= this.formatNumber(values.arriendoF)
          let alimentacionF= this.formatNumber(values.alimentacionF)
          let educacionF= this.formatNumber(values.educacionF)
          let vestuarioF= this.formatNumber(values.vestuarioF)
          let saludF= this.formatNumber(values.saludF)
          let transporteF= this.formatNumber(values.transporteF)
          let serviciosF= this.formatNumber(values.serviciosF)
          let entretenimientoF= this.formatNumber(values.entretenimientoF)
          let otrosF= this.formatNumber(values.otrosF)
          
          this.totalgatosF = arriendoF + alimentacionF + educacionF + vestuarioF + saludF + transporteF + serviciosF + entretenimientoF+otrosF

          this.dataGastos.arriendoF = alquilerN
          this.dataGastos.alimentacionF = serviciosN
          this.dataGastos.educacionF = transporteN
          this.dataGastos.vestuarioF = fletesN
          this.dataGastos.saludF = mantenimientoN
          this.dataGastos.transporteF = impuestosN
          this.dataGastos.serviciosF = imprevistosN
          this.dataGastos.entretenimientoF = otrosN
          this.dataGastos.totalF = this.totalgatosF

          let totalre = 0
          values['remuneracionRow'].forEach(remu => { 
            totalre = this.formatNumber(remu.valor)
            totalre += totalre
            console.log(totalre)
            this.ref.detectChanges()
          });
          this.totalRemuneracion= totalre
          this.dataGastos.totalRemuneracion = this.totalRemuneracion
          this.dataGastos.Remuneracion = values['remuneracionRow']

          this.dataSolicitud.Gastos = this.dataGastos
          this.srvSol.saveSol(this.sol, this.dataSolicitud)
        })
      });
  }

  formatNumber(num: string) {
    if (typeof (num) == "number") {
      return parseInt(num)
    } else {
      return parseInt(num == "" || num == null ? "0" : num.replace(/\D/g, '').replace(/^0+/, ''))
    }
  }

  loadGastosRow() {
    return this.fb.group({
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
      otrosIngresosRow: this.fb.array([]),
      totalOtros: ''
    });
  }

  loadDataGastosRow(remu: Gastos) {
    
    return this.fb.group({
      remuneracionRow: this.loadRemuneracion(remu.Remuneracion),
      totalRemuneracion: [null],
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
      otrosIngresosRow: this.fb.array([]),
      totalOtros: remu.totalOtros
    });
    
  }

  loadRemuneracion(remu: Remuneracion[]):FormArray {
    let remuneraArray = this.fb.array([])
    if (remu) {
      console.log(remu)
      for (let i = 0; i < remu.length; i++) {     
        
        remuneraArray.push(this.loadRemuneraRows(remu[i]))
      }
    } else {
      remuneraArray.push(this.initRemuneraRows())
    }
    
    return remuneraArray
  }

  initRemuneraRows() {
    return this.fb.group({
      cargo: [null, Validators.required],
      valor: [null, Validators.required]
    });
  }
  loadRemuneraRows(remu?: Remuneracion) {
    return this.fb.group({
      cargo: [remu.cargo, Validators.required],
      valor: [remu.valor, Validators.required]
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
  otrosingresos() {
    return this.gastosForm.get('otrosIngresosRow') as FormArray;
  }
  addOtrosRow() {
    this.otrosingresos().push(this.initOtrosRows());
  }
  deleteOtrosRow(index: number) {
    this.otrosingresos().removeAt(index);
  }

}
