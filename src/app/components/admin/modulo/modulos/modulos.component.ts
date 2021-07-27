import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModuloRol } from 'src/app/model/admin/modulorol';
import { ModuloRolesService } from 'src/app/services/modulo-roles.service';
import { RolService } from 'src/app/services/rol.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-modulos',
  templateUrl: './modulos.component.html',
  styleUrls: ['./modulos.component.scss']
})
export class ModulosComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['nombre', 'titulo', 'descripcion', 'edit'];
  dataSource: MatTableDataSource<ModuloRol>;
  @ViewChild(MatSort) sort: MatSort;
  datos: any = []
  datosRol: any = []
  selectedRoles = null

  constructor(
    private _srvModulo: ModuloRolesService,
    private _srvRol: RolService,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.datosRol = await this.getRol()
    this.dataSource = new MatTableDataSource(this.datos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  get(rol) {
    return new Promise(resolve => {
      this._srvModulo.getByRol(rol).subscribe(
        (sus) => {
          if (sus) {
            resolve(sus)
          } else {
            resolve([])
          }
        }, (err) => {
          resolve([])
        })
    })

  }
  getRol() {
    return new Promise(resolve => {
      this._srvRol.get().subscribe((sus) => {
        resolve(sus)
      }, (err) => {
        resolve([])
      })
    })
  }

  onEdit(datos) {
    const msg = 'Modulo';
    this.openDialog(msg, datos);
  }

  onCreate() {
    const msg = 'Crear Modulo';
    let datos = {
      Rol: this.selectedRoles.Id
    }
    this.openDialog(msg, datos);
  }

  async changeRol(rol) {
    this.datos = await this.get(rol.Id)
    this.dataSource.data = this.datos
    this.changeDetectorRefs.detectChanges();

  }

  openDialog(menssage: string, datos: any) {
    const config = {
      data: {
        mensaje: menssage,
        form: 'Modulo',
        content: datos
      }
    };
    const dialogRef = this.dialog.open(ModalComponent, config);
    dialogRef.afterClosed().subscribe(async result => {

      if (result) {
        this.changeRol(this.selectedRoles)
      }

    })
  }

}
