import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TipoProduccion } from 'src/app/model/tipoproduccion';
import { ProduccionService } from 'src/app/services/produccion.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-produccion',
  templateUrl: './produccion.component.html',
  styleUrls: ['./produccion.component.scss']
})
export class ProduccionComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['Nombre', 'Ph', 'Precipitacion', 'Temperatura', 'edit', 'delete'];
  dataSource: MatTableDataSource<TipoProduccion>;
  @ViewChild(MatSort) sort: MatSort;
  datosPorud: any = []

  constructor(
    private serv: ProduccionService,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.datosPorud = await this.getProduccion()
    this.dataSource = new MatTableDataSource(this.datosPorud);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getProduccion() {
    return new Promise((resolve, reject) => {
      this.serv.get().subscribe(
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
    const msg = 'Produccion';
    this.openDialog(msg, datos);
  }

  onDelete(datos) {
    console.log(datos)
  }

  onCreate() {
    const msg = 'Crear Produccion';
    this.openDialog(msg, null);
  }


  openDialog(menssage: string, datos: any) {

    const config = {
      data: {
        mensaje: menssage,
        form: 'produccion',
        content: datos
      }
    };
    const dialogRef = this.dialog.open(ModalComponent, config);
    dialogRef.afterClosed().subscribe(async result => {
      this.datosPorud = await this.getProduccion()

    })
  }
}
