import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Inventario } from 'src/app/model/agil/inventario';
import { Solicitud } from 'src/app/model/agil/solicitud';
import { IdbSolicitudService } from 'src/app/services/idb-solicitud.service';
import Utils from 'src/app/utils';
import DataSelect from '../../../data-select/dataselect.json';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnChanges {

  @Input() dataInventario
  @Input() total
  @Input() tipoSol
  @Output() newInventario = new EventEmitter<any>();

  tipoInventario: any = DataSelect.TipoInventario;
  tipoInventarioAgro: any = DataSelect.TipoInventarioAgro;

  constructor(
    private _formBuild: FormBuilder,
    public _srvSol: IdbSolicitudService,
  ) { }

  inventarioForm: FormGroup = new FormGroup({
    inventarioRow: this._formBuild.array([this.initInventario()]),
    totalInventario: new FormControl(0)
  })

  ngOnChanges() {

    if (this.dataInventario) {
      this.load(this.dataInventario)
    }

    this.inventarioForm.valueChanges.subscribe(form => {
      let totalInv = 0
      const inven = <FormArray>this.inventarioForm.controls['inventarioRow'];
      inven.controls.forEach(x => {
        let cantidad = Utils.formatNumber(x.get('cantidad').value)
        let vlrUni = Utils.formatNumber(x.get('vlrUni').value)
        let valor = vlrUni * cantidad
        totalInv += valor
        x.patchValue({
          valor: isFinite(valor) ? valor.toLocaleString() : 0,
          vlrUni: isFinite(vlrUni) ? vlrUni.toLocaleString() : 0,
        }, { emitEvent: false })
      });

      this.inventarioForm.patchValue({
        totalInventario: isFinite(totalInv) ? totalInv.toLocaleString() : 0,
      }, { emitEvent: false })

      let data = {
        inventario: this.inventarioForm.value.inventarioRow,
        total: this.inventarioForm.value.totalInventario
      }

      this.newInventario.emit(data);
    });

  }

  initInventario() {
    return this._formBuild.group({
      tipo: ['', Validators.required],
      cantidad: ['', Validators.required],
      vlrUni: ['', Validators.required],
      descripcion: ['', Validators.required],
      valor: ['']
    });
  }

  loadInventarioRows(inventarios: Inventario[]) {
    let arrayInventario = this._formBuild.array([])
    inventarios.forEach(inv => {
      let tipoinv = []

      if (this.tipoSol == 2) {
        if (inv.tipo) {
          tipoinv = this.tipoInventarioAgro.find(inve => inve.id == inv.tipo.id)
        }
      } else if (this.tipoSol == 1) {
        if (inv.tipo) {
          tipoinv = this.tipoInventario.find(inve => inve.id == inv.tipo.id)
        }
      }
      arrayInventario.push(this._formBuild.group({
        tipo: [tipoinv],
        cantidad: [inv.cantidad],
        vlrUni: [inv.vlrUni],
        descripcion: [inv.descripcion],
        valor: [inv.valor]
      }))
    });
    return arrayInventario
  }
  inventario() {
    return this.inventarioForm.get('inventarioRow') as FormArray;
  }
  addInventarioRow() {
    this.inventario().push(this.initInventario());
  }
  deleteInventarioRow(index: number) {
    this.inventario().removeAt(index);
  }

  load(inv: Inventario[]) {
    this.inventarioForm = this._formBuild.group({
      inventarioRow: this.loadInventarioRows(inv),
      totalInventario: this.total,
    })
  }

}
