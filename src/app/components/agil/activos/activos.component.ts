import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Activos } from 'src/app/model/agil/activos';
import Utils from 'src/app/utils';

@Component({
  selector: 'app-activos',
  templateUrl: './activos.component.html',
  styleUrls: ['./activos.component.scss']
})
export class ActivosComponent implements OnChanges {

  @Input() dataActivos: Activos[]
  @Input() listTipo
  @Input() activo
  @Input() total
  @Input() tipoSol
  @Output() newActivo = new EventEmitter<any>();
  totalActivos

  activosForm: FormGroup = new FormGroup({
    activos: this._formbuilder.array([this.initActinegRow()]),
    totalActivos: new FormControl(0)
  })
  constructor(
    private _formbuilder: FormBuilder
  ) { }

  ngOnChanges() {

    if (this.dataActivos) {
      if (this.tipoSol == 1) {
        this.listTipo = this.listTipo.filter(ac => ac.id != 5)
      }
      this.load(this.dataActivos)
    }

    this.activosForm.valueChanges.subscribe(form => {

      this.totalActivos = 0
      const actneg = <FormArray>this.activosForm.controls['activos'];
      actneg.controls.forEach(x => {
        let cantidad = Utils.formatNumber(x.get('cantidad').value)
        let vlrUni = Utils.formatNumber(x.get('vlrUni').value)
        let valor = cantidad * vlrUni
        this.totalActivos += valor
        x.patchValue({
          valor: isFinite(valor) ? valor.toLocaleString() : 0,
          vlrUni: isFinite(vlrUni) ? vlrUni.toLocaleString() : 0,
        }, { emitEvent: false });
      });

      this.activosForm.patchValue({
        totalActivos: isFinite(this.totalActivos) ? this.totalActivos : 0,
      }, { emitEvent: false })

      let data = {
        values: this.activosForm.value.activos,
        total: this.activosForm.value.totalActivos
      }
      this.newActivo.emit(data);
    });
  }

  initActinegRow() {
    return this._formbuilder.group({
      tipo: ['', Validators.required],
      detalle: ['', Validators.required],
      cantidad: ['', Validators.required],
      vlrUni: ['', Validators.required],
      valor: [null, Validators.required],
      pasivo:[-1]
    });
  }
  loadActivos(act: Activos[]) {
    let activosArr = this._formbuilder.array([]);

    act.forEach(a => {

      activosArr.push(
        this._formbuilder.group({
          tipo: [a.tipo, Validators.required],
          detalle: [a.detalle, Validators.required],
          cantidad: [a.cantidad],
          vlrUni: [a.vlrUni],
          valor: a.valor,
          pasivo:a.pasivo
        })
      )
    });
    return activosArr;
  }
  load(act: Activos[]) {
    this.activosForm = this._formbuilder.group({
      activos: this.loadActivos(act),
      totalActivos: this.total,
    })
  }
  activos() {
    return this.activosForm.get('activos') as FormArray;
  }
  addActNegNewRow() {
    this.activos().push(this.initActinegRow());
  }
  delete(index: number) {
    this.activos().removeAt(index);
  }
  compareFunction(o1: any, o2: any) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

}
