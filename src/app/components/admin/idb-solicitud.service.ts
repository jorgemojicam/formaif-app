import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root'
})
export class IdbSolicitudService {

  constructor(
    private storage: StorageMap
  ) { }

  save(data: any) {
    this.storage.set('solicitudes', data).subscribe(() => { });
  }

  delete() {
    this.storage.delete('solicitudes').subscribe(() => { });
  }

  get(): any {
    return this.storage.get('solicitudes');
  }
}
