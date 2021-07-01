import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Regional } from 'src/app/model/admin/regional';
import { Rol } from 'src/app/model/admin/rol';
import { Responsable } from 'src/app/model/zona/responsable';
import { RolService } from 'src/app/services/rol.service';
import { ResponsablesService } from 'src/app/services/zona/responsables.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-responsables',
  templateUrl: './responsables.component.html',
  styleUrls: ['./responsables.component.scss']
})
export class ResponsablesComponent implements AfterViewInit {

  displayedColumns: string[] = ['username', 'rol','regional', 'edit', 'delete'];
  dataSource: MatTableDataSource<Responsable>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  aResponsables: Responsable[] = new Array()
  nivel: Regional = new Regional

  nombre = new FormControl('')

  constructor(
    public dialog: MatDialog,
    private _srvResponsable:ResponsablesService,  
    private changeDetectorRefs: ChangeDetectorRef
  ) {

  }

  async ngAfterViewInit() {
    this.aResponsables = await this.get() as Responsable[]   
    this.dataSource = new MatTableDataSource(this.aResponsables);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; 
  }

  get() {
    return new Promise(resolve => {
      this._srvResponsable.get().subscribe((succ) => {   
        console.log(succ)     
        resolve(succ)
      }, (err) => {
        console.log(err)
        resolve([])
      })
    })
  }

  onCreate() {
    const msg = 'Crear Responsable';
    this.openDialog(msg, null);
  }

  openDialog(menssage: string, datos: any) {

    const config = {
      data: {
        mensaje: menssage,
        form: 'Responsables',
        content: datos
      }
    };
    const dialogRef = this.dialog.open(ModalComponent, config);
    dialogRef.afterClosed().subscribe(async result => {

      if (result) {
        this.aResponsables = await this.get() as Responsable[]
        this.dataSource.data = this.aResponsables
        this.changeDetectorRefs.detectChanges();
      }

    })
  }

  compareFunction(o1: any, o2: any) {
    return o1 && o2 ? o1.Id === o2.Id : o1 === o2;
  }


}
