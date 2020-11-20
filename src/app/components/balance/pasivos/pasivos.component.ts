import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import DataSelect from '../../../data-select/dataselect.json';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-pasivos',
  templateUrl: './pasivos.component.html',
  styleUrls: ['./pasivos.component.scss']
})
export class PasivosComponent implements OnInit {

  public pasivosForm: FormGroup;
  tcuotaf: number;
  tcorrientef: number;
  tnocorrientef: number;

  tipoPasivo: any = DataSelect.TipoPasivo;
  clasePasivo: any = DataSelect.ClasePasivo;
  periodo: any = DataSelect.Periodo;

  constructor(
    private formBuild: FormBuilder,
    private ref: ChangeDetectorRef,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.pasivosForm = this.formBuild.group({
      pasivosRows: this.formBuild.array([this.initItemRows()]),
      tcuotaf: [null],
      tcorrientef: [null],
      tnocorrientef: [null]
    });

    this.pasivosForm.get('pasivosRows').valueChanges.subscribe(values => {
      this.tcorrientef = 0;
      const ctrl = <FormArray>this.pasivosForm.controls['pasivosRows'];

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

        if(numcuota > plazo){
          x.get("cuota").setValue("", { emitEvent: false });
          this._snackBar.open("El numero de cuota actual no puede superar el plazo", "Ok!", {
            duration: 3000,
          });
        }

        if(netocuota > 0){
          for (let cuo = 0; cuo <netocuota; cuo++) {          
            this.addCuotas(index)
          }
          
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

      this.pasivosForm.patchValue(ctrl)

    })
  }

  formatNumber(num: string) {
    if (typeof (num) == "number") {
      return parseInt(num)
    } else {
      return parseInt(num == "" || num == null ? "0" : num.replace(/\D/g, '').replace(/^0+/, ''))
    }
  }

  get formArr() {
    return this.pasivosForm.get('pasivosRows') as FormArray;
  }
  initItemRows() {
    return this.formBuild.group({
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
      tasa:[''],
      pago:[''],//Periodico =1, Irregular=2
      calculoint:[''],
      periodoint:[''],
      fechaproxint:[null],
      calculocap:[''],
      periodocap:[''],
      fechaproxcap:[''],
      cuotaN: [''],
      cuotaF: [''],
      proyeccion: [''],
      corrienteF: [],
      nocorrienteF: [],
      corrienteN: [],
      nocorrienteN: [],
      cuotasarr:this.formBuild.group({
        pasivosRows: this.formBuild.array([this.itemsCuotas()])
      })

    });
  }
  addNewRow() {
    this.formArr.push(this.initItemRows());
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }

  pasivos(): FormArray {
    return this.pasivosForm.get("itemRow") as FormArray
  }

  newCuotas(): FormGroup {
    return this.formBuild.group({    
      cuotasirre: this.formBuild.array([this.itemsCuotas])
    })
  }
  cuotas(ti): FormArray {
    return this.pasivos().at(ti).get("cuotasarr") as FormArray
  }
  addCuotas(ti: number) {
    this.cuotas(ti).push(this.newCuotas());
  }
  itemsCuotas() {
    return this.formBuild.group({
      fecha: [''],
      cuota: [''],
    });
  }

}
