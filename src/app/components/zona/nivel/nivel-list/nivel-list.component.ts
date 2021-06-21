import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Flujo } from 'src/app/model/zona/flujo';
import { Nivel } from 'src/app/model/zona/nivel';
import { FlujoService } from 'src/app/services/zona/flujo.service';
import { NivelService } from 'src/app/services/zona/nivel.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-nivel-list',
  templateUrl: './nivel-list.component.html',
  styleUrls: ['./nivel-list.component.scss']
})
export class NivelListComponent implements AfterViewInit {

  displayedColumns: string[] = ['nombre', 'flujo', 'orden', 'aprobador', 'edit', 'delete'];
  dataSource: MatTableDataSource<Nivel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  aNiveles: Nivel[] = new Array()
  aFlujo: Flujo[] = new Array()

  nivel: Nivel = new Nivel()
  flujo = new FormControl('');
  nombre = new FormControl('');


  constructor(
    public dialog: MatDialog,
    private _srvNivel: NivelService,
    private _srvFlujo: FlujoService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {

  }

  async ngAfterViewInit() {
    this.aNiveles = await this.get() as Nivel[]
    this.aFlujo = await this.getFlujo() as Flujo[]

    this.flujo = new FormControl(this.aFlujo[0]);
    
    this.dataSource = new MatTableDataSource(this.aNiveles);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = function (data, filter: any): boolean {
      let searchTerms = JSON.parse(filter);
      return data.Flujo.Id === searchTerms.Flujo.Id &&
        data.Nombre.toLowerCase().indexOf(searchTerms.Nombre) !== -1
    };

    this.nivel.Nombre = ''
    this.nivel.Flujo = this.aFlujo[0]
    this.dataSource.filter = JSON.stringify(this.nivel);

    this.flujo.valueChanges.subscribe(val => {
      this.nivel.Flujo = val
      this.dataSource.filter = JSON.stringify(this.nivel);
    })

    this.nombre.valueChanges.subscribe(val => {
      this.nivel.Nombre = val
      this.dataSource.filter = JSON.stringify(this.nivel);
    })
  }

  get() {
    return new Promise(resolve => {
      this._srvNivel.get().subscribe((succ) => {        
        resolve(succ)
      }, (err) => {
        console.log(err)
        resolve([])
      })
    })
  }
  getFlujo() {
    return new Promise(resolve => {
      this._srvFlujo.get().subscribe((suc) => {
        resolve(suc)
      }, (err) => {
        resolve([])
      })
    })
  }

  onCreate() {
    const msg = 'Crear Nivel';
    this.openDialog(msg, null);
  }

  openDialog(menssage: string, datos: any) {

    const config = {
      data: {
        mensaje: menssage,
        form: 'Nivel',
        content: datos
      }
    };
    const dialogRef = this.dialog.open(ModalComponent, config);
    dialogRef.afterClosed().subscribe(async result => {

      if (result) {
        this.aNiveles = await this.get() as Nivel[]
        this.dataSource.data = this.aNiveles
        this.changeDetectorRefs.detectChanges();
      }

    })
  }

  compareFunction(o1: any, o2: any) {
    return o1 && o2 ? o1.Id === o2.Id : o1 === o2;
  }


}
