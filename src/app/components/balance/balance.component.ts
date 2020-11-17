import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  constructor() { }
  datosBalance:any[] = []

  dataa:any = {
    "Inventario":[
      {"Cosa":1},
      {"Cosa":2}
    ],
    "Activos":[
      {"mas":1},
      {"mas":2}
    ],
    "ActivosNeg":[
      {"opt":1},
      {"opt":2},
      {"opt":3}
    ]    
  }

  ngOnInit(): void {
    this.datosBalance = this.dataa
  }

}
