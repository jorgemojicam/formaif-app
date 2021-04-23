import { Component, OnInit, ViewChild } from '@angular/core';
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
  /**
   * Global: 48
  Id: 1
  Nombre: "Achiote"
  NombreCientifico: "Bixa orellana"
  Ph: 10
  Precipitacion: 57
  Temperatura: 76
  TipoProduccion: 1
   */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['Nombre', 'Ph', 'Precipitacion', 'Temperatura'];
  dataSource: MatTableDataSource<TipoProduccion>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private serv: ProduccionService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.serv.get().subscribe(a => {      
      this.dataSource = new MatTableDataSource(a);    
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;    
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  abrir(datos){
    const msg = 'Produccion';
    this.openDialog(msg,datos);
  }


  openDialog(menssage: string,datos:any) {
    
    const config = {
      data: {
        mensaje: menssage,
        form: 'produccion',
        content: datos
      }
    };
    const dialogRef = this.dialog.open(ModalComponent, config);
    dialogRef.afterClosed().subscribe(result => {
 
    })
  }
}
