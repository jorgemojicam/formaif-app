import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Asesor } from 'src/app/model/admin/asesor';
import { SolicitudZona } from 'src/app/model/zona/solicitudzona';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { SolicitudzonaService } from 'src/app/services/zona/solicitudzona.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-solitudes',
  templateUrl: './solitudes.component.html',
  styleUrls: ['./solitudes.component.scss']
})
export class SolitudesComponent implements OnInit {

  displayedColumns: string[] = ['tipo', 'sucursal', 'estado', 'gestion'];
  dataSource: MatTableDataSource<SolicitudZona>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  procesando = false
  data: SolicitudZona[];
  loading: boolean = true
  dataUsuario: Asesor = this._srvStorage.getUser();
  oficina
  isOficce:boolean = true

  constructor(
    private _srvSolicitudZ: SolicitudzonaService,
    private _route: Router,
    private _srvStorage: TokenStorageService
  ) {
    console.log(this.dataUsuario.Rol.Nombre)
  }

  async ngOnInit() {
    const that = this
    if (this.dataUsuario.Rol.Nombre == environment.director) {
      this.isOficce = true
      this.oficina = this.dataUsuario.Sucursales.Codigo     
      that.data = await this.getByOfi(this.oficina) as any
    
    } 
    else if (this.dataUsuario.Rol.Nombre == environment.regional) {
      this.oficina = this.dataUsuario.Sucursales.Codigo      
      that.data = await this.getByOfi(this.oficina) as any
      
    }
    else {
      that.data = await this.get() as any
    }
    that.dataSource = new MatTableDataSource(that.data);
    that.dataSource.paginator = that.paginator;
    that.dataSource.sort = that.sort;
    that.loading = false    
  }

  get() {
    return new Promise(resolve => {
      this._srvSolicitudZ.get().subscribe(
        (res) => {
          resolve(res)
        }, (err) => {
          console.log(err)
          resolve([])
        })
    })
  }
  getByOfi(oficina) {
    return new Promise(resolve => {
      this._srvSolicitudZ.getByOfi(oficina).subscribe(
        (res) => {
          if (res) {
            resolve(res)
          }else{
            resolve([])
          }
        }, (err) => {
          console.log(err)
          resolve([])
        })
    })
  }
  onGestion(e) {
    this._route.navigate(['zona/gestion'], { queryParams: { id: e.Id } });
  }
  onCreate() {
    this._route.navigate(['zona/gestion'])
  }

}
