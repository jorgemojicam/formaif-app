import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Adjuntos } from 'src/app/model/zona/adjuntos';
import { AdjuntosService } from 'src/app/services/zona/adjuntos.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-adjuntos',
  templateUrl: './adjuntos.component.html',
  styleUrls: ['./adjuntos.component.scss']
})
export class AdjuntosComponent implements OnInit {

  @Input() idSolicitud: any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['tipo', 'estrato', 'edit', 'delete'];
  dataSource: MatTableDataSource<Adjuntos>;
  @ViewChild(MatSort) sort: MatSort;
  datosPorud: any = []

  constructor(
    private _srvAdjuntos: AdjuntosService,
    public dialog: MatDialog,
  ) { }

  async ngOnInit() {

    if (this.idSolicitud) {
      this.datosPorud = await this.getBySol(this.idSolicitud)
      console.log(this.datosPorud)
      this.dataSource = new MatTableDataSource(this.datosPorud);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  getBySol(idSolicitud) {
    return new Promise((resolve, reject) => {
      this._srvAdjuntos.getBySolicitud(idSolicitud).subscribe(
        (sus) => {
          resolve(sus)
        }, (err) => {
          reject([])
        })
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onEdit(datos) {
    const msg = 'Adjuntos';
    this.openDialog(msg, datos);
  }

  onDelete(datos) {
    console.log(datos)
  }

  onCreate() {
    const msg = 'Crear Adjunto';
    this.openDialog(msg, null);
  }

  openDialog(menssage: string, datos: any) {

    const config = {
      data: {
        mensaje: menssage,
        form: 'Adjuntos',
        content: datos
      }
    };
    const dialogRef = this.dialog.open(ModalComponent, config);
    dialogRef.afterClosed().subscribe(async result => {
      this.datosPorud = await this.getBySol(this.idSolicitud)
    })
  }



}
