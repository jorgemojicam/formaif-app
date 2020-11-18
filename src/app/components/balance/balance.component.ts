import { Component, OnInit } from '@angular/core';
import { Balance } from 'src/app/model/balance';
import { IdbBalanceService } from './idb-balance.service'

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  dataBalance: Balance = new Balance();

  constructor(
    private srv: IdbBalanceService
  ) { }

  ngOnInit() {
   
  }


  saveInventario(inventario: any) {
    this.dataBalance.Inventario = inventario;
    this.srv.save(this.dataBalance);
  }

}
