import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { VentasHis } from "../../../model/ventas-historicas";

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) { }

  public ventaLS: VentasHis;

  ventasForm = new FormGroup({
    email: new FormControl('', Validators.required),
    valor: new FormControl('', Validators.required),
    venta: new FormControl('', Validators.required),
    total: new FormControl('')
  })

  ngOnInit(): void {

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    
    this.ventaLS = JSON.parse(localStorage.getItem('ventasHis'))
    if (this.ventaLS !== null) {
      this.initialVentas();
    }
  }

  saveVentas(form: VentasHis) {
    console.log('form', form)
    localStorage.setItem('ventasHis', JSON.stringify(form));
  }

  keyPress(event: VentasHis) {
    console.log("entrooo", event)
  }

  initialVentas() {
    this.ventasForm.patchValue({
      valor: this.ventaLS.valor,
      venta: this.ventaLS.venta
    })
  }

}
