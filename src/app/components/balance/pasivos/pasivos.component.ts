import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import DataSelect from '../../../data-select/dataselect.json';

@Component({
  selector: 'app-pasivos',
  templateUrl: './pasivos.component.html',
  styleUrls: ['./pasivos.component.scss']
})
export class PasivosComponent implements OnInit {

  public pasivosForm: FormGroup;
  tcuota: number;
  tcorriente:number;
  tnocorriente:number;

  tipoPasivo: any = DataSelect.TipoPasivo;
  clasePasivo: any = DataSelect.ClasePasivo;
  periodo: any = DataSelect.Periodo;

  constructor(
    private formBuild:FormBuilder
  ) { }

  ngOnInit(): void {
    this.pasivosForm = this.formBuild.group({
      pasivosRows: this.formBuild.array([this.initItemRows()]),
      tcuota: [null],
      tcorriente: [null],
      tnocorriente: [null]
    });
  }

  get formArr() {
    return this.pasivosForm.get('pasivosRows') as FormArray;
  }
  initItemRows() {
    return this.formBuild.group({
      tipo: ['', Validators.required],
      clase:[''],
      acreedor:[''],
      monto:[''],
      plazo:[''],
      saldo:[''],
      cuota:[''],
      destino:[''],
      valor:[''],
      periodo:[''],
      corriente:[],
      nocorriente:[]

    });
  }
  addNewRow() {
    this.formArr.push(this.initItemRows());
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }
}
