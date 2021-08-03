import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Tipo } from 'src/app/model/zona/tipo';
import { TipoService } from 'src/app/services/zona/tipo.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipos',
  templateUrl: './tipos.component.html',
  styleUrls: ['./tipos.component.scss']
})
export class TiposComponent implements OnInit {


  displayedColumns: string[] = ['nombre', 'iniciales', 'flujo', 'edit', 'delete'];
  dataSource: MatTableDataSource<Tipo>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  aTipo: Tipo[] = new Array()

  constructor(
    private _srvTipo: TipoService,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.aTipo = await this.get() as Tipo[]

    this.dataSource = new MatTableDataSource(this.aTipo);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onCreate() {
    const msg = 'Crear Tipo';
    this.openDialog(msg, null);
  }
  onEdit(elemen) {
    const msg = 'Editar Tipo'  
    this.openDialog(msg, elemen)
  }

  openDialog(menssage: string, datos: any) {

    const config = {
      data: {
        mensaje: menssage,
        form: 'Tipo',
        content: datos
      }
    };
    const dialogRef = this.dialog.open(ModalComponent, config);
    dialogRef.afterClosed().subscribe(async result => {

      if (result) {
        this.aTipo = await this.get() as Tipo[]
        console.log(this.aTipo)
        this.dataSource.data = this.aTipo
        this.changeDetectorRefs.detectChanges();
      }

    })
  }

  get() {
    return new Promise(resolve => {
      this._srvTipo.get().subscribe((succ) => {
        resolve(succ)
      }, (err) => {
        console.log(err)
        resolve([])
      })
    })
  }

  onDeleting(element) {
    let id = element.Id
    Swal.fire({
      icon: 'warning',
      title: '¿Esta seguro de Eliminar?',
      html: `Se eliminara permanentemente la informacion de la solicitud`,
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this._srvTipo.delete(id).subscribe(
          (res) => {
            if (res) {
              Swal.fire('Información eliminada!', '', 'success')
            }
          },(err)=>{
            Swal.fire('Se presento error eliminando registro', '', 'error')
          })
      }
    })

  }

}
