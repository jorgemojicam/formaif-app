import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-gastos-negocio',
  templateUrl: './gastos-negocio.component.html',
  styleUrls: ['./gastos-negocio.component.scss']
})
export class GastosNegocioComponent implements OnInit {

  total: number;
  gastosnForm = new FormGroup({
    alquiler: new FormControl(''),
    servicios: new FormControl(''),
    transporte: new FormControl(''),
    fletes: new FormControl(''),
    impuestos: new FormControl(''),
    mantenimiento: new FormControl(''),
    imprevistos: new FormControl(''),
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

    this.gastosnForm.valueChanges.subscribe(values => {

      let alquiler = this.formatNumber(values.alquiler)
      let servicios = this.formatNumber(values.servicios)
      let transporte = this.formatNumber(values.transporte)
      let fletes = this.formatNumber(values.fletes)
      let impuestos = this.formatNumber(values.impuestos)
      let mantenimiento = this.formatNumber(values.mantenimiento)
      let imprevistos = this.formatNumber(values.imprevistos)
      let otros = this.formatNumber(values.otros)
      let total = this.formatNumber(values.total)
      this.total = alquiler + servicios + transporte + fletes + impuestos + mantenimiento + imprevistos +  otros
      this.gastosnForm.get("total").setValue(total, { emitEvent: false });

    })

  }

}
