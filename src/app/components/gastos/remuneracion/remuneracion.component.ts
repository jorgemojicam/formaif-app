import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-remuneracion',
  templateUrl: './remuneracion.component.html',
  styleUrls: ['./remuneracion.component.scss']
})
export class RemuneracionComponent implements OnInit {

  constructor(private _fb:FormBuilder) { }

  public gastosForm:FormGroup;
  total:number;

  ngOnInit(): void {

  }

  get formArr(){
    return this.gastosForm.get('itemRows') as FormArray;
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
