import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Solicitud } from 'src/app/model/solicitud';
import { AnalisismebaprodService } from 'src/app/services/analisismebaprod.service';
import { IdbSolicitudService } from '../../admin/idb-solicitud.service';

@Component({
  selector: 'app-home-meba',
  templateUrl: './home-meba.component.html',
  styleUrls: ['./home-meba.component.scss']
})
export class HomeMebaComponent implements AfterViewInit {

  displayedColumns: string[] = ['solicitud', 'gestion', 'upload'];
  dataSource: MatTableDataSource<Solicitud>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  procesando = false

  constructor(
    private srvSol: IdbSolicitudService,
    private _router: Router,
    private _srvAnalisis: AnalisismebaprodService
  ) { }

  ngAfterViewInit(): void {

    this.srvSol.get().subscribe((sol) => {
      let solicitud = sol.filter(a => a.asesor == 2)
      this.dataSource = new MatTableDataSource(solicitud);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

  }

  onGetSol() {
    alert("Aqui consulta")
  }

  onGestion(element) {
    this._router.navigate(['meba/sensibilidad'], { queryParams: { solicitud: element.solicitud } })

  }
  async onSend(element) {

    if (navigator.onLine) {

      const numeroSolicitud: string = element.solicitud.toString();
      let datasol = await this.getSolicitud(numeroSolicitud) as Solicitud
      let fechahoy = new Date()

      let data = {
        Cedula: datasol.cedula,
        Solicitud: datasol.solicitud,
        Produccion: {
          Id: 1
        },
        FechaInicio: datasol.fechacreacion,
        FechaFin: fechahoy,
        Sucursal: {
          Codigo: datasol.oficina
        },
        Analista: datasol.usuario
      }

      let idAnalisis = await this.setAnalisis(data)
      console.log("Se carga el estudio a base de datos o cualquier cosa ", datasol)

      if (datasol.Sensibilidad) {
        datasol.Sensibilidad.forEach(async element => {
          if (element.nombre) {
    
            let dataprod = {
              Produccion: {
                Id: element.nombre.id
              },
              AnalisisMeba: {
                Id: idAnalisis
              }
            }
            let anapro = await this.setAnalisisProduccion(dataprod)
            console.log(anapro)
          }
        });
      }
    }

  }

  getSolicitud(solicitud) {
    return new Promise((resolve, reject) => {
      this.srvSol.getSol(solicitud).subscribe(
        (datasol) => {
          return resolve(datasol)
        },
        (err) => {
          reject(err)
        })
    })
  }

  setAnalisis(data) {
    return new Promise((resolve, reject) => {
      this._srvAnalisis.create(data).subscribe(
        (a) => {
          return resolve(a)
        },
        (err) => {
          reject(err)
        })
    })
  }
  setAnalisisProduccion(data) {
    return new Promise((resolve, reject) => {
      this._srvAnalisis.createAnaProd(data).subscribe(
        (a) => {
          return resolve(a)
        },
        (err) => {
          reject(err)
        })
    })
  }

}
