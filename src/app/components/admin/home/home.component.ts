import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from "../../../shared/modal/modal.component";
import { Solicitud } from 'src/app/model/solicitud';
import { IdbSolicitudService } from '../idb-solicitud.service';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

  displayedColumns: string[] = ['tipo', 'solicitud', 'gestion', 'delete', 'upload'];
  dataSource: MatTableDataSource<Solicitud>;
  dataSolicitudes: any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private srvSol: IdbSolicitudService,
    private route: Router,
    private tokenStorage: TokenStorageService
  ) {
  }

  ngAfterViewInit(): void {
    this.srvSol.get().subscribe((sol) => {
      this.dataSource = new MatTableDataSource(sol);
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
  onInitSol() {
    const msg = 'Crear Solicitud';
    this.openDialog(msg);
  }

  openDialog(menssage: string) {
    const config = {
      data: {
        mensaje: menssage,
        content: ''
      }
    };
    const dialogRef = this.dialog.open(ModalComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.srvSol.get().subscribe((sol) => {
        this.dataSource = new MatTableDataSource(sol);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    })
  }
  onLoad() {
    this.srvSol.get().subscribe((sol) => {
      this.dataSource = new MatTableDataSource(sol);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  onLogout() {
    this.tokenStorage.signOut()
    this.route.navigate(['auth'])
  }

  onGestion(element) {
    this.route.navigate(['admin'], { queryParams: { solicitud: element.solicitud } })
  }
  onDelete(element) {
    let solicitud = element.solicitud
    Swal.fire({
      title: 'Se eliminara permanentemente la informacion de la solicitud ¿Esta seguro de eliminarla?',
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(solicitud)
        this.srvSol.deleteSol(solicitud).subscribe((res) => {
          console.log(res)
        })
        this.srvSol.get().subscribe((sol) => {
          let newSol = sol.filter(a =>  a.solicitud != solicitud )
          console.log(newSol)
          this.srvSol.save(newSol)
          this.onLoad()
        })

        Swal.fire('Información eliminada!', '', 'success')
      }
    })


  }
}

