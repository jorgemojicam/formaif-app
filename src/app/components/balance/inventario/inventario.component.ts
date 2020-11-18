import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter, Host, OnChanges } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from "@angular/forms";
import DataSelect from '../../../data-select/dataselect.json';
import { CurrencyPipe } from "@angular/common";
import { Inventario } from 'src/app/model/inventario';
import { IdbBalanceService } from '../idb-balance.service';
import { Balance } from 'src/app/model/balance';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {

  @Input() data
  @Output() save = new EventEmitter<any>()

  constructor(
    private _fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private curPipe: CurrencyPipe,
    private srvBalance: IdbBalanceService
  ) { }

  public inventarioForm: FormGroup;
  summed: number;
  tipoInventario: any = DataSelect.TipoInventario;

  ngOnInit() {

    this.inventarioForm = this._fb.group({
      itemRows: this._fb.array([]),
      summed: [null]
    });

    this.srvBalance.get().subscribe((balance: Balance) => {
      if (balance) {
        if (balance.Inventario.length == 0) {
          this.formArr.push(this.initItemRows());
        } else {
          for (let i = 0; i < balance.Inventario.length; i++) {
            this.formArr.push(this.loadItemRows(balance.Inventario[i]));
          }
        }
      }
    });


    this.inventarioForm.get('itemRows').valueChanges.subscribe(values => {
      this.summed = 0;
      const ctrl = <FormArray>this.inventarioForm.controls['itemRows'];
      this.save.emit(values);
      ctrl.controls.forEach(x => {
        let parsed = parseInt(x.get('valor').value == "" || x.get('valor').value == null ? 0 : x.get('valor').value.replace(/\D/g, '').replace(/^0+/, ''))
        this.summed += parsed
        this.ref.detectChanges()
      });
    })

    this.inventarioForm.valueChanges.subscribe(form => {
      let langArr = <FormArray>this.inventarioForm.controls["itemRows"];
      for (let i = 0; i < langArr.controls.length; i++) {
        if (langArr.controls[i].get('valor').value) {
          langArr.controls[i].patchValue({
            valor: this.curPipe.transform(langArr.controls[i].get('valor').value.replace(/\D/g, '').replace(/^0+/, ''), 'USD', 'symbol', '1.0-0')
          }, { emitEvent: false });
        }
      }
    })

  }

  get formArr() {
    return this.inventarioForm.get('itemRows') as FormArray;
  }

  initItemRows() {
    return this._fb.group({
      tipo: ['', Validators.required],
      cantidad: ['', Validators.required],
      descripcion: ['', Validators.required],
      valor: ['']
    });
  }
  loadItemRows(inv: Inventario) {
    
    return this._fb.group({
      tipo: [inv.tipo, Validators.required],
      cantidad: [inv.cantidad, Validators.required],
      descripcion: [inv.descripcion, Validators.required],
      valor: [inv.valor]
    });
  }
  addNewRow() {
    this.formArr.push(this.initItemRows());
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }
}
