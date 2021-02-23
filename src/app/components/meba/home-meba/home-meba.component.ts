import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Solicitud } from 'src/app/model/solicitud';
import { IdbSolicitudService } from '../../admin/idb-solicitud.service';

@Component({
  selector: 'app-home-meba',
  templateUrl: './home-meba.component.html',
  styleUrls: ['./home-meba.component.scss']
})
export class HomeMebaComponent implements AfterViewInit {

  displayedColumns: string[] = ['solicitud', 'gestion', 'delete', 'upload'];
  dataSource: MatTableDataSource<Solicitud>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  procesando = false

  constructor(
    private srvSol: IdbSolicitudService,
    private _router: Router,
  ) { }

  ngAfterViewInit(): void {

    this.srvSol.get().subscribe((sol) => {     
      let solicitud = sol.filter(a=>a.asesor == 2)
      this.dataSource = new MatTableDataSource(solicitud);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

  }

  onGetSol() {
    alert("Aqui consulta")
  }

  onDelete(elemnt) {
    alert("Elimina localmente ")
  }

  onGestion(element) {
    this._router.navigate(['meba/sensibilidad'], { queryParams: { solicitud: element.solicitud } })
 
  }
  onSend(element) {
    alert("Se carga el estudio a base de datos o cualquier cosa ")
  }

}
