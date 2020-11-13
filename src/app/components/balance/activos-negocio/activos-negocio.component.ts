import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import DataSelect from '../../../data-select/dataselect.json';

@Component({
  selector: 'app-activos-negocio',
  templateUrl: './activos-negocio.component.html',
  styleUrls: ['./activos-negocio.component.scss']
})
export class ActivosNegocioComponent implements OnInit {

  constructor(
    private formbuild:FormBuilder
  ) { }

  public activonegForm: FormGroup;
  total:number;
  tipoActivo:any = DataSelect.TipoActivoNeg;

  get formArr() {
    return this.activonegForm.get('itemRows') as FormArray;
  }

  ngOnInit(): void {
    this.activonegForm = this.formbuild.group({
      itemRows: this.formbuild.array([this.iniItemActineg()]),
      total: [null]
    });
  }

  iniItemActineg(){
    return this.formbuild.group({
      tipo: ['',Validators.required],
      detalle: ['',Validators.required],
      valor: [null,Validators.required]
    });
  }

  addNewRow() {
    this.formArr.push(this.iniItemActineg());
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }

}
