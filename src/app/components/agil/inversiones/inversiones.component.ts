import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Inversiones } from 'src/app/model/agil/inversiones';
import Utils from 'src/app/utils';

@Component({
  selector: 'app-inversiones',
  templateUrl: './inversiones.component.html',
  styleUrls: ['./inversiones.component.scss']
})
export class InversionesComponent implements OnChanges {

  @Input() dataInversion
  @Input() total
  @Input() tipoSol
  @Input() aplica
  @Input() meses
  @Output() newInversion = new EventEmitter<any>();

  totalInversion
  
  constructor(
    private _formBuild: FormBuilder,
  ) { }

  inversionesForm: FormGroup = new FormGroup({
    aplicaInversiones: new FormControl(false),
    inversiones: this._formBuild.array([this.initInversiones()]),
    totalInversiones: new FormControl(0),
  })

  ngOnChanges() {
    
    if (this.dataInversion) {
      this.load(this.dataInversion)
    }

    this.totalInversion = this.total
    this.inversionesForm.valueChanges.subscribe(form => {
      this.totalInversion = 0
      const inversiones = <FormArray>this.inversionesForm.controls['inversiones'];
      inversiones.controls.forEach(x => {
        let valor = Utils.formatNumber(x.get('valor').value)
        this.totalInversion += valor
        x.patchValue({
          valor: isFinite(valor) ? valor.toLocaleString() : 0
        }, { emitEvent: false });
      });
      this.inversionesForm.patchValue({
        totalInversiones: isFinite(this.totalInversion) ? this.totalInversion : 0,
      }, { emitEvent: false })

      let data = {
        aplica: this.inversionesForm.value.aplicaInversiones,
        inversiones: this.inversionesForm.value.inventarioRow,
        total: this.inversionesForm.value.totalInversiones
      }

      this.newInversion.emit(data);

    });
  }

  inversiones() {
    return this.inversionesForm.get('inversiones') as FormArray;
  }
  initInversiones() {
    return this._formBuild.group({
      detalle: [''],
      mes: [''],
      origen: [''],
      valor: [''],
    });
  }
  load(inv: Inversiones[]) {
    
    this.inversionesForm = this._formBuild.group({
      aplicaInversiones: this.aplica,
      inversiones: this.loadInversiones(inv),
      totalInversiones: this.total,
    })
  }
  loadInversiones(inversiones: Inversiones[]) {
    let inversionesArra = this._formBuild.array([])
    inversiones.forEach(inv => {
      inversionesArra.push(
        this._formBuild.group({
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
  clear(form) {
    form.clear()
    this.addInversion()
  }
  compareFunction(o1: any, o2: any) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
}
