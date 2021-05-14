import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Rol } from 'src/app/model/rol';
import { RolService } from 'src/app/services/rol.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.scss']
})
export class RolComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['Nombre', 'Permiso', 'edit', 'delete'];
  dataSource: MatTableDataSource<Rol>;
  @ViewChild(MatSort) sort: MatSort;
  datos: any = []

  constructor(
    private _serv: RolService,
    public dialog: MatDialog,
  ) { }

  async ngOnInit() {
    this.datos = await this.getRol()
    this.dataSource = new MatTableDataSource(this.datos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getRol() {
    return new Promise((resolve, reject) => {
      this._serv.get().subscribe(
        (sus) => {
          resolve(sus)
        }, (err) => {
          reject([])
        })
    })
  }

  onEdit(datos) {
    const msg = 'Rol';
    this.openDialog(msg, datos);
  }

  onDelete(datos) {
    console.log(datos)
  }

  onCreate() {
    const msg = 'Crear Rol';
    this.openDialog(msg, null);
  }


  openDialog(menssage: string, datos: any) {

    const config = {
      data: {
        mensaje: menssage,
        form: 'Rol',
        content: datos
      }
    };
    const dialogRef = this.dialog.open(ModalComponent, config);
    dialogRef.afterClosed().subscribe(async result => {
      this.datos = await this.getRol()

    })
  }

}
