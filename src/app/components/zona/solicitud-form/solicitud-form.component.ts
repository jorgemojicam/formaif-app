import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SolicitudZona } from 'src/app/model/zona/solicitudzona';
import { SolicitudzonaService } from 'src/app/services/zona/solicitudzona.service';

@Component({
  selector: 'app-solicitud-form',
  templateUrl: './solicitud-form.component.html',
  styleUrls: ['./solicitud-form.component.scss']
})
export class SolicitudFormComponent implements AfterViewInit {


  displayedColumns: string[] = ['tipo', 'sucursal', 'estado', 'gestion'];
  dataSource: MatTableDataSource<SolicitudZona>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  procesando = false
  data: SolicitudZona[];
  loading: boolean = true

  constructor(
    private _srvSolicitudZ: SolicitudzonaService,
    private _route: Router,

  ) { }

  ngAfterViewInit() {

    const that = this
    this._srvSolicitudZ.get().subscribe(
      (res) => {
        that.data = res as any
        if (that.data) {
          console.log(this.data)
          that.dataSource = new MatTableDataSource(that.data);
          that.dataSource.paginator = that.paginator;
          that.dataSource.sort = that.sort;
          that.loading = false
        }
      }, (err) => {

      })

  }

  onGestion(e) {
    this._route.navigate(['zona/gestion'], { queryParams: { id: e.Id } });
  }
  onCreate() {
    this._route.navigate(['zona/gestion'])
  }

}
