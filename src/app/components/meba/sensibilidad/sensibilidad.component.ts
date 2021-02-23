import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sensibilidad',
  templateUrl: './sensibilidad.component.html',
  styleUrls: ['./sensibilidad.component.scss']
})
export class SensibilidadComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder
  ) { }
  
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;


  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

}
