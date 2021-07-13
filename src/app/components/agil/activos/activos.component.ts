import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Activos } from 'src/app/model/agil/activos';
import { Solicitud } from 'src/app/model/agil/solicitud';
import Utils from 'src/app/utils';
import DataSelect from '../../../data-select/dataselect.json';

@Component({
  selector: 'app-activos',
  templateUrl: './activos.component.html',
  styleUrls: ['./activos.component.scss']
})
export class ActivosComponent implements OnInit {

  @Input() solicitud
  @Output() newActivo = new EventEmitter<any>();
  
  tipoActivoFam: any = DataSelect.TipoActivoFam;
  tipoActivo: any = DataSelect.TipoActivoNeg;
  dataSolicitud: Solicitud = new Solicitud;
  tipoSol
  ced: string

  activosForm: FormGroup = new FormGroup({
    activos: this._formbuilder.array([this.initActinegRow()]),
    totalActivos: new FormControl(0)
  })
  constructor(
    private _formbuilder: FormBuilder
  ) { }

  ngOnInit() {

    if (this.solicitud) {

      this.dataSolicitud = this.solicitud
      this.tipoSol = this.dataSolicitud.asesor
      this.ced = this.dataSolicitud.cedula.toString()

      if (this.dataSolicitud.Balance) {
        if (this.dataSolicitud.Balance.actividadNegRows) {
          this.load(this.solicitud.Balance.actividadNegRows, this.solicitud.Balance.activosTotal)
        }
      }
    }
    let totalactneg = 0
    this.activosForm.valueChanges.subscribe(form => {
     
      const actneg = <FormArray>this.activosForm.controls['activos'];
      actneg.controls.forEach(x => {
        let cantidad = Utils.formatNumber(x.get('cantidad').value)
        let vlrUni = Utils.formatNumber(x.get('vlrUni').value)
        let valor = cantidad * vlrUni
        totalactneg += valor
        x.patchValue({
          valor: isFinite(valor) ? valor.toLocaleString() : 0,
          vlrUni: isFinite(vlrUni) ? vlrUni.toLocaleString() : 0,
        }, { emitEvent: false });
      });

      this.activosForm.patchValue({
        totalActivos: isFinite(totalactneg) ? totalactneg.toLocaleString() : 0,
      }, { emitEvent: false })

      let data = {
        inventario: this.activosForm.value.activos,
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
      valor: [null, Validators.required]
    });
  }
  loadActivos(act: Activos[],total) {
    let activosArr = this._formbuilder.array([]);

    act.forEach(a => {
     
      activosArr.push(
        this._formbuilder.group({
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
  load(act: Activos[], total) {
    this.activosForm = this._formbuilder.group({
      activos: this.loadActivos(act,total),
      totalActivos: total,
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
