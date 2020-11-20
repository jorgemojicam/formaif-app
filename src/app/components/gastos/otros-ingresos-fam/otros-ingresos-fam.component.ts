import { CurrencyPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import DataSelect from '../../../data-select/dataselect.json';

@Component({
  selector: 'app-otros-ingresos-fam',
  templateUrl: './otros-ingresos-fam.component.html',
  styleUrls: ['./otros-ingresos-fam.component.scss']
})
export class OtrosIngresosFamComponent implements OnInit {

  constructor(
    private _fb:FormBuilder,
    private ref: ChangeDetectorRef,
    private curPipe: CurrencyPipe,
  ) { }

  public otrosForm:FormGroup;
  otroIngreso: any = DataSelect.OtrosIngresosFamiliar;
  total:number

  ngOnInit(): void {
    this.otrosForm = this._fb.group({
      itemRows: this._fb.array([]),
      total: [null]
    });

    this.otrosForm.get('itemRows').valueChanges.subscribe(values => {
      this.total = 0;
      const ctrl = <FormArray>this.otrosForm.controls['itemRows'];
      //this.save.emit(values);
      ctrl.controls.forEach(x => {
        let valor = this.formatNumber(x.get('valor').value)
        this.total += valor
        this.ref.detectChanges()
      });
    })

    this.otrosForm.valueChanges.subscribe(form => {
      let langArr = <FormArray>this.otrosForm.controls["itemRows"];
      for (let i = 0; i < langArr.controls.length; i++) {
        console.log("entro")
        if (langArr.controls[i].get('valor').value) {
          langArr.controls[i].patchValue({
            valor: this.curPipe.transform(this.formatNumber(langArr.controls[i].get('valor').value), 'USD', 'symbol', '1.0-0')
          }, { emitEvent: false });
        }
      }
    })
  }

  formatNumber(num: string) {
    if (typeof (num) == "number") {
      return parseInt(num)
    } else {
      return parseInt(num == "" || num == null ? "0" : num.replace(/\D/g, '').replace(/^0+/, ''))
    }
  }

  get formArr(){
    return this.otrosForm.get('itemRows') as FormArray;
  }

  initItemRows() {
    return this._fb.group({
      ingreso: ['', Validators.required],
      valor: ['', Validators.required],
      observacion: ['', Validators.required]
    });
  }

  addNewRow() {
    this.formArr.push(this.initItemRows());
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }



}
