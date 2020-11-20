import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-remuneracion',
  templateUrl: './remuneracion.component.html',
  styleUrls: ['./remuneracion.component.scss']
})
export class RemuneracionComponent implements OnInit {

  constructor(private _fb:FormBuilder) { }

  public remuneracionForm:FormGroup;
  total:number;

  ngOnInit(): void {
    this.remuneracionForm = this._fb.group({
      itemRows: this._fb.array([]),
      total: [null]
    });
  }

  get formArr(){
    return this.remuneracionForm.get('itemRows') as FormArray;
  }

  initItemRows() {
    return this._fb.group({
      cargo: ['', Validators.required],
      valor: ['', Validators.required]  
    });
  }

  addNewRow() {
    this.formArr.push(this.initItemRows());
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }



}
