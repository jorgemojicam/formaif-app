import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import DataSelect from '../../../data-select/dataselect.json';


@Component({
  selector: 'app-activos-familia',
  templateUrl: './activos-familia.component.html',
  styleUrls: ['./activos-familia.component.scss']
})
export class ActivosFamiliaComponent implements OnInit {

  constructor(
    private formbuild: FormBuilder
  ) { }

  public activofamForm: FormGroup;
  total:number;
  tipoActivo:any = DataSelect.TipoActivoFam;

  get formArr() {
    return this.activofamForm.get('itemActivos') as FormArray;
  }

  ngOnInit(): void {
    this.activofamForm = this.formbuild.group({
      itemActivos: this.formbuild.array([this.iniItemActifam()]),
      total: [null]
    });
  }
  
  iniItemActifam(){
    return this.formbuild.group({
      tipo: ['',Validators.required],
      detalle: ['',Validators.required],
      valor: ['',Validators.required]
    });
  }

  addNewRow() {
    this.formArr.push(this.iniItemActifam());
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }

}
