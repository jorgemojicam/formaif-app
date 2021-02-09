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
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ProfileComponent } from '../profile/profile.component';
import { AnalisisagroComponent } from '../../analisisagro/analisisagro.component';
import { FlujocajaComponent } from '../../flujocaja/flujocaja.component';
import { AnalisisService } from 'src/app/services/analisis.service';
import { CarpetadigitalService } from 'src/app/services/carpetadigital.service';

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
  @ViewChild(AnalisisagroComponent, { static: false }) analisisAgro: AnalisisagroComponent;
  @ViewChild(FlujocajaComponent, { static: false }) flujo: FlujocajaComponent;
  procesando: boolean = false

  constructor(
    public dialog: MatDialog,
    private srvSol: IdbSolicitudService,
    private route: Router,
    private tokenStorage: TokenStorageService,
    private ofiServ: OficinaService,
    private analisisServ: AnalisisService,
    private emailServ: EmailService,
    private carpetaServ: CarpetadigitalService,
    private _bottomSheet: MatBottomSheet
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


  async onSend(element) {

    this.procesando = true
    if (navigator.onLine) {

      const numeroSolicitud: string = element.solicitud.toString();

      this.srvSol.getSol(numeroSolicitud).subscribe((datasol) => {
        this.datasol = datasol as Solicitud;
      })


      let aseso = await this.getDirector() as Asesor

      if (aseso.Nombre) {

        Swal.fire({
          title: '¿Desea Enviar Analisis de credito?',
          html: `Se enviara email al director:
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
        }).then(async (result) => {
          if (result.isConfirmed) {

            Swal.fire({
              title: 'Enviando analisis de credito!',
              html: 'Por favor espere mientras se envia el analisis<br><b></b>',
              allowOutsideClick: false,
              didOpen: async () => {
                Swal.showLoading()

                const content = Swal.getContent()
                if (content) {
                  const b = content.querySelector('b')
                  if (b) {

                    let pdfBase64: string = await this.createpdf("Analisis de credito",numeroSolicitud) as string
                    console.log("generacion pdf: ", pdfBase64)
                    b.textContent = "Generacion pdf..."

                    let sendEmail = await this.send(pdfBase64, aseso.Nombre, "jorge.mojica@fundaciondelamujer.com")
                    console.log("Envio email", sendEmail)
                    b.textContent = "Envio email..."

                    let insertAnalisis = await this.insert(this.datasol)
                    console.log("Insertndo el analisis", insertAnalisis)
                    b.textContent = "Insertndo el analisis..."

                    //let insertaCarpeta = await this.inserCarpetaDigital(this.datasol,pdfBase64)
                    //console.log("Insertndo el carpeta digital",insertaCarpeta)
       
                  }
                }
              }
            })



          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('Cancelado', 'El proceso de envio se interrumpio :(', 'error')
            this.procesando = false
          }
        })

      } else {
        this.procesando = false
        Swal.fire({
          icon: 'info',
          title: 'No autorizado',
          text: 'En este momento la oficina a la que corresponde no tiene director por favor comuniquese con el area de riesgos',
        })
      }
    } else {
      this.procesando = false
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: 'En este momento no tiene conexion a internet, su informacion seguira guardada en el movil pero debe tener conexion para enviarla :('
      })

    }
  }
  openProfile(): void {
    this._bottomSheet.open(ProfileComponent);
  }

  createpdf(namefile,numeroSolicitud) {

    const content = this.analisis.reporte.nativeElement
    const op = {
      filename: namefile + numeroSolicitud + '.pdf',
      image: { type: 'jpeg' },
      html2canvas: {
      },
      margin: 15,
      jsPDF: { format: 'a3', orientation: 'p' }
    }
    return new Promise(resolve => {
      html2pdf().from(content).set(op).outputPdf()
        .then((pdf) => {
          return resolve(btoa(pdf))
        });
    })
  }

  insert(solicitud: Solicitud) {
    return new Promise(resolve => {
      this.analisisServ.insert(solicitud)
        .subscribe((res) => {
          return resolve(res)
        });
    })
  }
  send(pdfBase64: string, nombreDir: string, emailDir: string) {

    let email: Email = new Email;
    email.To = emailDir;
    email.Subject = "Analisis de credito"
    email.Body = `<h3>Buen dia, ` + nombreDir + ` </h3>
              <p>A continuacion adjunto se encuentra el formato de analisis de credito</p>`
    email.Base64Pdf = pdfBase64

    return new Promise(resolve => {
      this.emailServ.Send(email).subscribe(
        (su) => {
          Swal.close()
          Swal.fire('Enviado!', 'Se envio correctamente', 'success')
          this.procesando = false
          return resolve(su)
        },
        (er) => {
          Swal.close()
          Swal.fire('Error', 'Se ha producido un error en el envio de correo' + er, 'error')
          this.procesando = false
        }
      )
    })
  }

  inserCarpetaDigital(solicitud: Solicitud, pfd: string) {
    return new Promise(resolve => {
      this.carpetaServ.insert(solicitud, pfd)
        .subscribe((res) => {
          return resolve(res)
        });
    })
  }

  getDirector() {

    let asesores: Asesor = this.tokenStorage.getUser()
    let suc = asesores.Sucursales.Codigo;

    if (suc == "969") {
      return asesores.Director as Asesor
    } else {

      return new Promise((resolve, reject) => {
        this.ofiServ.getAsesores(suc).subscribe(
          (ase) => {
            let diretores = ase as Asesor[]
            if (ase) {
              diretores.forEach(aseso => {
                if (aseso.Grupo == 'DTRAGMGE' || aseso.Grupo == 'LIDPDS' || aseso.Grupo == 'LDRANMGE' || aseso.Grupo == 'LIDPDSMJ') {
                  return resolve(aseso)
                }
              })
            } else {
              console.error('No se encontro la oficina')
              return resolve(diretores)
            }
          },
          (err) => {
            console.error('error algo', err)
            return reject([])
          })
      })

    }

  }

}

/**
 * Análisis de crédito (PDF Generado Asesor Agil) COL-FO-001
 * Análisis de crédito Agropecuario (PDF Generado Asesor Agil) COL-FO-006
 * Flujo de Caja Agropecuario (PDF Generado Asesor Agil) COL-FO-017
 * */