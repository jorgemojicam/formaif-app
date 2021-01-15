import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren } from '@angular/core';
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
import { AnalisisComponent } from '../../analisis/analisis.component';
import * as html2pdf from "html2pdf.js";
import { OficinaService } from 'src/app/services/oficina.service';
import { Asesor } from 'src/app/model/asesor';
import { EmailService } from 'src/app/services/email.service';
import { Email } from 'src/app/model/email';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

  displayedColumns: string[] = ['tipo', 'solicitud', 'gestion', 'delete', 'upload'];
  dataSource: MatTableDataSource<Solicitud>;
  dataSolicitudes: any;
  datasol: Solicitud;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(AnalisisComponent, { static: false }) analisis: AnalisisComponent;

  constructor(
    public dialog: MatDialog,
    private srvSol: IdbSolicitudService,
    private route: Router,
    private tokenStorage: TokenStorageService,
    private ofiServ: OficinaService,
    private emailServ: EmailService

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
      icon: 'warning',
      title: '¿Esta seguro de Eliminar?',
      html: `Se eliminara permanentemente la informacion de la solicitud`,
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
          let newSol = sol.filter(a => a.solicitud != solicitud)
          console.log(newSol)
          this.srvSol.save(newSol)
          this.onLoad()
        })

        Swal.fire('Información eliminada!', '', 'success')
      }
    })
  }

  onSend(element) {
    const numeroSolicitud: string = element.solicitud.toString();
    this.srvSol.getSol(numeroSolicitud).subscribe((datasol) => {
      this.datasol = datasol as Solicitud;
    })

    let suc = this.tokenStorage.getSuc()
    this.ofiServ.getAsesores(suc).subscribe((ase) => {
      if (ase) {
        let asesores = ase as Asesor[]
        asesores.forEach(aseso => {
          if (aseso.Grupo == 'DTRAGMGE') {

            Swal.fire({
              title: '¿Desea Enviar Analisis de credito?',
              html: `Se enviara el analisis de credito al Director:
              <br><b>`+ aseso.Nombre + `</b>, 
              <br><small>`+ aseso.Clave.toLocaleLowerCase() + `@fundaciondelamujer.com</small>
              <br><b>Solicitud :</b>` + numeroSolicitud + `
              <br><b>Oficina :</b> `+ aseso.Sucursales.Nombre,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Si, Enviar!',
              cancelButtonText: 'No, Cancelar!',
              reverseButtons: true,
              allowOutsideClick: false
            }).then((result) => {
              if (result.isConfirmed) {

                Swal.fire({
                  title: 'Enviando analisis de credito!',
                  html: 'Por favor espere mientras se envia el reporte',
                  allowOutsideClick: false,
                  didOpen: () => {
                    Swal.showLoading()
                  }
                })

                const content = this.analisis.reporte.nativeElement
                const op = {
                  filename: 'Analisis de credito ' + numeroSolicitud + '.pdf',
                  image: { type: 'jpeg' },
                  html2canvas: {
                  },
                  margin: 15,
                  jsPDF: { format: 'a3', orientation: 'p' }
                }
                let email: Email = new Email;
                email.To = "jorge.mojica@fundaciondelamujer.com";
                email.Subject = "Analisis de credito"
                email.Body = `<h3>Buen dia, ` + aseso.Nombre + ` </h3>
                              <p>A continuacion adjunto se encuentra el formato de analisis de credito</p>`
                html2pdf()
                  .from(content)
                  .set(op)
                  .outputPdf()
                  .then((pdf) => {
                    let pdfBase64 = btoa(pdf)
                    email.Base64Pdf = pdfBase64
                    this.emailServ.Send(email).subscribe(
                      (su) => {
                        Swal.close()
                        Swal.fire('Enviado!', 'Se envio correctamente', 'success')
                      },
                      (er)=>{
                        Swal.close()
                        Swal.fire('Error', 'Se ha producido un error'+er, 'error')                        
                      }
                    )

                  });
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelado', 'El proceso de envio se interrumpio :(', 'error')
              }
            })
          }
        });
      }
    })
  }
}

