import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Asesor } from 'src/app/model/admin/asesor';
import { Cartera } from 'src/app/model/zona/cartera';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { CarteraService } from 'src/app/services/zona/cartera.service';


/**
 * @title Data table with sorting, pagination, and filtering.
 */

@Component({
  selector: 'app-cartera-inicial',
  templateUrl: './cartera-inicial.component.html',
  styleUrls: ['./cartera-inicial.component.scss']
})
export class CarteraInicialComponent implements AfterViewInit,OnInit {

  @Input() datasolicitud:any
  displayedColumns: string[] = ['departamento', 'municipio','barrio', 'asesor','estrato','localizacion', 'cartera','clientes'];
  dataSource: MatTableDataSource<Cartera>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataUsuario: Asesor = this._srvStorage.getUser();

  constructor(
    private _srvCartera: CarteraService,
    private _srvStorage: TokenStorageService,
  ) {
    
  }
  async ngOnInit() {

    let oficina = this.datasolicitud.Sucursal.Codigo
    let cartera = await this.getByOficina(oficina) as Cartera[]
    this.dataSource = new MatTableDataSource(cartera);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async ngAfterViewInit() {
    
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getByOficina(oficina) {
    return new Promise(resolve => {
      this._srvCartera.getByOficina(oficina).subscribe((suc) => {
        resolve(suc)
      }, (err) => {
        console.log(err)
        resolve([])
      })
    })

  }

}
