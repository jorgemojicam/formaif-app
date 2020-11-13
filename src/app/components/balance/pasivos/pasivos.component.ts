import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NodeCompatibleEventEmitter } from 'rxjs/internal/observable/fromEvent';
import DataSelect from '../../../data-select/dataselect.json';

@Component({
  selector: 'app-pasivos',
  templateUrl: './pasivos.component.html',
  styleUrls: ['./pasivos.component.scss']
})
export class PasivosComponent implements OnInit {

  public pasivosForm: FormGroup;
  cuota: number;
  corriente:number;
  nocorriente:NodeCompatibleEventEmitter;

  tipoPasivo: any = DataSelect.TipoInventario;
  constructor(
    private formBuild:FormBuilder
  ) { }

  ngOnInit(): void {
  }

  get formArr() {
    return this.pasivosForm.get('pasivosForm') as FormArray;
  }
  initItemRows() {
    return this.formBuild.group({
      tipo: ['', Validators.required]
    });
  }
  addNewRow() {
    this.formArr.push(this.initItemRows());
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }
}
