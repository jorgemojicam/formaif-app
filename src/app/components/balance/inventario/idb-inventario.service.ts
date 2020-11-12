import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Balance } from 'src/app/model/balance';
import { Inventario } from 'src/app/model/inventario';

@Injectable({
  providedIn: 'root'
})


export class IdbInventarioService {

  
  constructor(
    private storage: StorageMap
  ) { }
  
  saveInventario(bal:any) {
    this.storage.set('inventario', bal).subscribe(() => { });
  }

  delete(){
    this.storage.delete('inventario').subscribe(() => {});
  }

  get():any{
    return this.storage.get('inventario');
  }

}