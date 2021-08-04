import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Correo } from 'src/app/model/zona/correos';
import { CorreosService } from 'src/app/services/zona/correos.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-correos',
  templateUrl: './correos.component.html',
  styleUrls: ['./correos.component.scss']
})
export class CorreosComponent implements OnInit {

  displayedColumns: string[] = ['nombre','asunto','cuerpo','img','estado', 'edit', 'delete'];
  dataSource: MatTableDataSource<Correo>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  aCorreo: Correo[] = new Array()
  
  constructor(
    private _srvCorreos: CorreosService,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.aCorreo = await this.get() as Correo[]

    this.dataSource = new MatTableDataSource(this.aCorreo);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onCreate() {
    const msg = 'Crear Configuracion de correo';
    this.openDialog(msg, null);
  }
  onEdit(elemen) {
    const msg = 'Editar Configuracion'
    this.openDialog(msg, elemen)
  }

  openDialog(menssage: string, datos: any) {

    const config = {
      data: {
        mensaje: menssage,
        form: 'Correos',
        content: datos
      }
    };
    const dialogRef = this.dialog.open(ModalComponent, config);
    dialogRef.afterClosed().subscribe(async result => {

      if (result) {
        this.aCorreo = await this.get() as Correo[]
        this.dataSource.data = this.aCorreo
        this.changeDetectorRefs.detectChanges();
      }

    })
  }

  get() {
    return new Promise(resolve => {
      this._srvCorreos.get().subscribe((succ) => {
        resolve(succ)
      }, (err) => {
        console.log(err)
        resolve([])
      })
    })
  }

}
