import { Component, OnInit } from '@angular/core';
import { Balance } from 'src/app/model/balance';
import {IdbBalanceService} from './idb-balance.service'

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  bal:any=["cosa"];
  dataBalance:Balance = new Balance();  

  constructor(
    private srv:IdbBalanceService
  ) { }

  ngOnInit() {
    //this.srv.get().subscribe((res) => this.bal = res as Balance);    
    console.log(this.bal)
  }

  saveInventario(inventario:any){     
    this.dataBalance.Inventario = inventario; 
    this.srv.save(this.dataBalance);
  }

}
