import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";
import { Balance } from 'src/app/model/balance';
import { Inventario } from 'src/app/model/inventario';
import { IdbInventarioService } from "../inventario/idb-inventario.service";

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private srvInvibd: IdbInventarioService
  ) { }
  public inventarioForm: FormGroup;


  ngOnInit(): void {    
    this.inventarioForm = this._fb.group({
      itemRows: this._fb.array([this.initItemRows()])
    });

    this.srvInvibd.get().subscribe((inventa)=>{
      for(let i = 0;i < inventa.length;i++){
        this.formArr.push(this.loadItemRows(inventa[i]));
      };
    });    
   
  }
  get formArr() {
    return this.inventarioForm.get('itemRows') as FormArray;
  }
  initItemRows() {
    return this._fb.group({
      tipo: ['ds'],
      cantidad: [''],
      descripcion: [''],
      valor: ['']
    });
  }
  loadItemRows(inv:Inventario) {
    return this._fb.group({
      tipo: [inv.tipo],
      cantidad: [inv.cantidad],
      descripcion: [inv.descripcion],
      valor: [inv.valor]
    });
  }
  addNewRow() {
    this.formArr.push(this.initItemRows());
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }

  onSubmit(bal:any) {
    console.log(bal.itemRows);
    this.srvInvibd.saveInventario(bal.itemRows);
  }
}
