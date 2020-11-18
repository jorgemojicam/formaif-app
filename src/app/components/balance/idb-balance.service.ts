import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root'
})
export class IdbBalanceService {

  constructor(
    private storage: StorageMap
  ) { }

  save(bal:any) {
    this.storage.set('balance', bal).subscribe(() => { });
  }

  delete(){
    this.storage.delete('balance').subscribe(() => {});
  }

  get():any{
    return this.storage.get('balance');
  }
}
