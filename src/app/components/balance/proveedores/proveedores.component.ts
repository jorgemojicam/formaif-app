import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent implements OnInit {

  public proveedoresForm: FormGroup;
  total: number;

  constructor(
    private _fb:FormBuilder
  ) { }
  ngOnInit(): void {
    this.proveedoresForm = this._fb.group({
      itemRows: this._fb.array([]),
      total: [null]
    });
    this.formArr.push(this.initItemRows());

  }

  get formArr() {
    return this.proveedoresForm.get('itemRows') as FormArray;
  }

  initItemRows() {
    return this._fb.group({  
      descripcion: ['', Validators.required],
      valor: ['']
    });
  }
  addNewRow() {
    this.formArr.push(this.initItemRows());
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }

}
