import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";
import DataSelect from '../../../data-select/dataselect.json';

import { Inventario } from 'src/app/model/inventario';
import { IdbInventarioService } from "../inventario/idb-inventario.service";


@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private srvInvibd: IdbInventarioService,
    private ref: ChangeDetectorRef
  ) { }

  public inventarioForm: FormGroup;
  summed: number;
  tipoInventario:any = DataSelect.TipoInventario;

  ngOnInit(): void {
    this.inventarioForm = this._fb.group({
      itemRows: this._fb.array([this.initItemRows()]),
      summed: [null]
    });

    this.srvInvibd.get().subscribe((inventa: Inventario[]) => {
      if (inventa) {
        if (inventa.length == 0) {
        } else {
          for (let i = 0; i < inventa.length; i++) { 
            this.formArr.push(this.loadItemRows(inventa[i]));
          }
        }
      }
    });

    this.inventarioForm.get('itemRows').valueChanges.subscribe(values => {
      this.summed = 0;
      const ctrl = <FormArray>this.inventarioForm.controls['itemRows'];
      ctrl.controls.forEach(x => {    
        let parsed = parseInt(x.get('valor').value == "" || x.get('valor').value == null ? 0 : x.get('valor').value)
        this.summed += parsed
        this.ref.detectChanges()
      });
    })

  }
  get formArr() {
    return this.inventarioForm.get('itemRows') as FormArray;
  }

  initItemRows() {
    return this._fb.group({
      tipo: ['',Validators.required],
      cantidad: ['',Validators.required],
      descripcion: ['',Validators.required],
      valor: ['',Validators.required]
    });
  }
  loadItemRows(inv: Inventario) {
    return this._fb.group({
      tipo: [inv.tipo,Validators.required],
      cantidad: [inv.cantidad,Validators.required],
      descripcion: [inv.descripcion,Validators.required],
      valor: [inv.valor,Validators.required]
    });
  }
  addNewRow() {
    this.formArr.push(this.initItemRows());
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }

  onSubmit(bal: any) {
    console.log(bal.itemRows);
    this.srvInvibd.saveInventario(bal.itemRows);
  }
}
