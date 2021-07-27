import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Flujo } from 'src/app/model/zona/flujo';
import { FlujoService } from 'src/app/services/zona/flujo.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-flujo-list',
  templateUrl: './flujo-list.component.html',
  styleUrls: ['./flujo-list.component.scss']
})
export class FlujoListComponent implements AfterViewInit {

  displayedColumns: string[] = ['nombre', 'edit', 'delete'];
  dataSource: MatTableDataSource<Flujo>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  aFlujo: Flujo[] = new Array()
  


  constructor(
    private _srvFlujo: FlujoService,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef
  ) { }

  async ngAfterViewInit() {
    this.aFlujo = await this.get() as Flujo[]

    this.dataSource = new MatTableDataSource(this.aFlujo);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onCreate() {
    const msg = 'Crear Flujo';
    this.openDialog(msg, null);
  }
  onEdit(elemen) {
    const msg = 'Editar Flujo'
    this.openDialog(msg, elemen)
  }

  openDialog(menssage: string, datos: any) {

    const config = {
      data: {
        mensaje: menssage,
        form: 'Flujo',
        content: datos
      }
    };
    const dialogRef = this.dialog.open(ModalComponent, config);
    dialogRef.afterClosed().subscribe(async result => {

      if (result) {
        this.aFlujo = await this.get() as Flujo[]
        this.dataSource.data = this.aFlujo
        this.changeDetectorRefs.detectChanges();
      }

    })
  }

  get() {
    return new Promise(resolve => {
      this._srvFlujo.get().subscribe((succ) => {
        resolve(succ)
      }, (err) => {
        console.log(err)
        resolve([])
      })
    })
  }



}
