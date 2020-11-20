import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gastos-familia',
  templateUrl: './gastos-familia.component.html',
  styleUrls: ['./gastos-familia.component.scss']
})
export class GastosFamiliaComponent implements OnInit {

  total: number;
  gastosfForm = new FormGroup({
    arriendo: new FormControl(''),
    alimentacion: new FormControl(''),
    educacion: new FormControl(''),
    vestuario: new FormControl(''),
    salud: new FormControl(''),
    transporte: new FormControl(''),
    servicios: new FormControl(''),
    entretenimiento: new FormControl(''),
    otros: new FormControl(''),
    total: new FormControl('')
  });

  constructor() { }

  formatNumber(num: string) {
    if (typeof (num) == "number") {
      return parseInt(num)
    } else {
      return parseInt(num == "" || num == null ? "0" : num.replace(/\D/g, '').replace(/^0+/, ''))
    }
  }

  ngOnInit(): void {
    this.gastosfForm.valueChanges.subscribe(values => {

      let arriendo = this.formatNumber(values.arriendo)
      let alimentacion = this.formatNumber(values.alimentacion)
      let educacion = this.formatNumber(values.educacion)
      let vestuario = this.formatNumber(values.vestuario)
      let salud = this.formatNumber(values.salud)
      let transporte = this.formatNumber(values.transporte)
      let servicios = this.formatNumber(values.servicios)
      let entretenimiento = this.formatNumber(values.entretenimiento)
      let otros = this.formatNumber(values.otros)
      let total = this.formatNumber(values.total)
      this.total = arriendo + alimentacion + educacion + vestuario + salud + transporte + servicios + entretenimiento + otros
      this.gastosfForm.get("total").setValue(total, { emitEvent: false });

    })
  }


}
