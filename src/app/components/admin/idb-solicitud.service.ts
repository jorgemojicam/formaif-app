import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root'
})
export class IdbSolicitudService {

  constructor(
    private storage: StorageMap
  ) { }

  saveSol(name:string,data: any) {
    this.storage.set(name, data).subscribe(() => { });
  }
  getSol(name:string): any {
    return this.storage.get(name);
  }  
  deleteSol(name:string) {    
    console.log("este esta", name.toString())
    return this.storage.delete(name.toString())
  } 

  delete() {
    this.storage.delete('solicitudes').subscribe(() => { });
  }  
  save(data:any){
    this.storage.set("solicitudes", data).subscribe(() => { });
  }
  get(): any {
    return this.storage.get("solicitudes");
  } 
}
