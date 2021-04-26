import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root'
})
export class IdbService {

  constructor(
    private storage: StorageMap,
  ) { }

  save(name: string, data: any) { 
    this.storage.set(name, data).subscribe(() => { });
  }
  get(name: string): any {
    return this.storage.get(name.toString());
  }
  delete(name: string) {
    return this.storage.delete(name.toString())
  }
}
