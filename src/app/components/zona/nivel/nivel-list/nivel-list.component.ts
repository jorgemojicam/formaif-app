import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Flujo } from 'src/app/model/zona/flujo';
import { Nivel } from 'src/app/model/zona/nivel';
import { FlujoService } from 'src/app/services/zona/flujo.service';
import { NivelService } from 'src/app/services/zona/nivel.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import {  CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
  niveles: any
  aFlujo: Flujo[] = new Array()

  nivel: Nivel = new Nivel()
  flujo;
  nombre;
  
  constructor(
    public dialog: MatDialog,
    private _srvNivel: NivelService,
    private _srvFlujo: FlujoService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {
  }

  async ngAfterViewInit() {
    this.niveles = await this.get() as Nivel[]
    this.aFlujo = await this.getFlujo() as Flujo[]
    this.flujo = this.aFlujo[0];
    this.aNiveles = this.niveles.filter(a => a.Flujo.Id == this.flujo.Id)
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
    let data = {
      Flujo: {
        Id: this.flujo.Id,
        Nombre: this.flujo.Nombre
      },
      Orden: this.aNiveles.length + 1
    }
    this.openDialog(msg, data);
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
        this.changeDetectorRefs.detectChanges();
      }

    })
  }

  compareFunction(o1: any, o2: any) {
    return o1 && o2 ? o1.Id === o2.Id : o1 === o2;
  }

  async drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.aNiveles, event.previousIndex, event.currentIndex);

    this.aNiveles.forEach(async (value, index) => {
      value.Orden = index + 1
     
      let data = {
        Id: value.Id,
        Flujo: {
          Id: value.Flujo.Id
        },
        Nombre: value.Nombre,
        Orden: index + 1,
        Rol: {
          Id: value.Rol.Id
        }
      }      
      let res = await this.update(data)     
      console.log(res)

    });

    

  }


  changeFlujo(e) {
    this.aNiveles = new Array()
    this.aNiveles = this.niveles.filter(a => a.Flujo.Id == e.Id)
    console.log(e)
  }

  update(data) {
    return new Promise(resolve => {
      this._srvNivel.update(data).subscribe((sus) => {
        resolve(sus)
      }, (err) => {
        console.log(err)
        resolve(null)
      })
    })
  }


}
