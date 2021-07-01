import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Asesor } from 'src/app/model/admin/asesor';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class IdbSolicitudService {

  constructor(
    private storage: StorageMap,
    private tokenStorage: TokenStorageService
  ) { }

  saveSol(name: string, data: any) { 
    this.storage.set(name, JSON.stringify(data)).subscribe(() => { });
  }

  getSol(name: string): any {
    return this.storage.get(name.toString());
  }

  deleteSol(name: string) {
    return this.storage.delete(name.toString())
  }

  delete() {
    const asesores: Asesor = this.tokenStorage.getUser()
    const user = asesores.Clave.toLocaleLowerCase()
    this.storage.delete(user.toString()).subscribe(() => { });
  }

  save(data: any,) {
    const asesores: Asesor = this.tokenStorage.getUser()
    const user = asesores.Clave.toLocaleLowerCase()
    this.storage.set(user.toString(), data).subscribe(() => { });
  }

  get(): any {
    const asesores: Asesor = this.tokenStorage.getUser()
    const user = asesores.Clave.toLocaleLowerCase()
    return this.storage.get(user.toString());
  }
}
