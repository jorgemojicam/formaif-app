import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdbBalanceService {

  constructor(
    private storage: StorageMap
  ) { }

  balance:any;

  save(bal: any) {
    this.storage.set('balance', bal).subscribe(() => { });
  }

  delete() {
    this.storage.delete('balance').subscribe(() => { });
  }

  get(): any {
    return this.storage.get('balance');
  }

  getAll(): Observable<any> {
    let balances: any;
    var subject = new Subject<string>();
    this.storage.get('balance')
      .subscribe(items => {
        balances = items;
        console.log(balances);
        subject.next(balances);
      });
    return subject.asObservable();
  }
}
