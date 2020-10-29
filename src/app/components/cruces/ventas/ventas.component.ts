import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { VentasHis } from "../../../model/ventas-historicas";

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.sass']
})
export class VentasComponent implements OnInit {

  constructor() { }

  public ventaLS: VentasHis;

  ventasForm = new FormGroup({
    valor: new FormControl('', Validators.required),
    venta: new FormControl('', Validators.required)
  })

  ngOnInit(): void {
    this.ventaLS = JSON.parse(localStorage.getItem('ventasHis'))
    if(this.ventaLS !== null){
      this.initialVentas();
    }
    
  }

  saveVentas(form: VentasHis) {
    console.log('form', form)
    localStorage.setItem('ventasHis', JSON.stringify(form));
  }

  keyPress(event: VentasHis) {
    console.log("entrooo",event)
  }

  initialVentas(){
    this.ventasForm.patchValue({
      valor: this.ventaLS.valor,
      venta:this.ventaLS.venta
    })
  }

}
