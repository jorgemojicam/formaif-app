import { Component, AfterViewInit, ViewChild, ElementRef, ViewChildren } from '@angular/core';
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
import Utils from 'src/app/utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

  displayedColumns: string[] = ['tipo', 'cedula', 'gestion', 'delete', 'upload'];
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
    private _bottomSheet: MatBottomSheet,
    private srvCarpeta: CarpetadigitalService
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
    this.openDialog(msg,"");
  }

  openDialog(menssage: string,datos:any) {
    const config = {
      data: {
        mensaje: menssage,
        content: datos
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
    this.route.navigate(['admin'], { queryParams: { cedula: element.cedula } })
  }

  onDelete(element) {
    let cedula = element.cedula
    Swal.fire({
      icon: 'warning',
      title: '¿Esta seguro de Eliminar?',
      html: `Se eliminara permanentemente la informacion de la solicitud`,
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvSol.deleteSol(cedula).subscribe((res) => {
          console.log(res)
        })
        this.srvSol.get().subscribe((sol) => {
          let newSol = sol.filter(a => a.cedula != cedula)
          this.srvSol.save(newSol)
          this.onLoad()
        })

        Swal.fire('Información eliminada!', '', 'success')
      }
    })
  }

  async onSend(element) {

    this.procesando = true
    if(element.solicitud == ""){
      Swal.fire({
        icon: 'info',
        title: 'Información Incompleta',
        html: 'Debe ingresar el numero de solicitud',
      })
      this.onEdit(element)
      this.procesando = false
      return
    }
    if (navigator.onLine) {

      const numeroCedula: string = element.cedula.toString();

      this.datasol = await this.getSolicitud(numeroCedula) as Solicitud

      let faltante = this.validateSol()

      if (faltante != "") {
        this.procesando = false
        Swal.fire({
          icon: 'info',
          title: 'Información Incompleta',
          html: 'Aun tiene pendiente completar la siguiente información: ' + faltante,
        })
        return
      }

      let aseso = await this.getDirector() as Asesor

      if (aseso.Nombre) {

        Swal.fire({
          title: '¿Desea Enviar Analisis de credito?',
          html: `Se enviara email al director:
        <br><b>`+ aseso.Nombre + `</b>, 
        <br><small>`+ aseso.Clave.toLocaleLowerCase() + `@fundaciondelamujer.com</small>
        <br><b>Solicitud :</b>` + numeroCedula + `
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

                    let pdfBase64: string = "";
                    let pdfBase64Agro: string = "";

                    if (this.datasol.asesor == 2) {
                      const contentagro = this.analisisAgro.reporte.nativeElement
                      const contentflujo = this.flujo.reporte.nativeElement
                      b.textContent = "Generacion Analisis de credito pdf..."
                      pdfBase64 = await this.createpdf(contentagro, "Analisis de credito", numeroCedula, "p") as string
                      b.textContent = "Generacion Flujo de caja pdf..."
                      pdfBase64Agro = await this.createpdf(contentflujo, "Flujo de caja", numeroCedula, "l") as string

                    } else if (this.datasol.asesor == 1) {
                      const contentana = this.analisis.reporte.nativeElement
                      b.textContent = "Generacion Analisis de credito pdf..."
                      pdfBase64 = await this.createpdf(contentana, "Analisis de credito", numeroCedula, "p") as string
                    }

                    b.textContent = "Enviando email..."                  
                    let email = aseso.Clave.toLocaleLowerCase() + "@fundaciondelamujer.com"
                    //let email = "jorge.mojica@fundaciondelamujer.com"
                    await this.send(pdfBase64, pdfBase64Agro, aseso.Nombre, email)

                    b.textContent = "Insertando el analisis..."
                    await this.insert(this.datasol)

                    Swal.close()
                    Swal.fire('Enviado!', 'Se envio correctamente', 'success')
                    this.procesando = false

                    let existeSolicitud = await this.getCarpetaDigital(this.datasol) as string
                    console.log(existeSolicitud)
                    //let insertaCarpeta = await this.inserCarpetaDigital(this.datasol,pdfBase64)
                    //console.log("Insertndo el carpeta digital",insertaCarpeta)

                  }
                }
              }
            })
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.procesando = false
            Swal.fire('Cancelado', 'El proceso de envio se interrumpio :(', 'error')
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

  getSolicitud(solicitud) {
    return new Promise((resolve, reject) => {
      this.srvSol.getSol(solicitud).subscribe(
        (datasol) => {
          return resolve(datasol)
        },
        (err) => {
          reject(err)
        })
    })

  }

  createpdf(content, namefile, numeroSolicitud, orintation) {

    const op = {
      filename: namefile + numeroSolicitud + '.pdf',
      image: { type: 'jpeg' },
      html2canvas: {
      },
      margin: 15,
      jsPDF: { format: 'a3', orientation: orintation }
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

  send(pdfBase64: string, pdfBase64Agro: string, nombreDir: string, emailDir: string) {

    let email: Email = new Email;
    email.To = emailDir;
    email.Subject = "Analisis de credito"
    email.Body = `<h3>Buen dia, ` + nombreDir + ` </h3>
              <p>A continuacion adjunto se encuentra el formato de analisis de credito</p>`
    email.Base64Pdf = pdfBase64
    email.Base64PdfAgro = pdfBase64Agro

    return new Promise((resolve, reject) => {
      this.emailServ.Send(email).subscribe(
        (su) => {
          return resolve(su)
        },
        (er) => {
          Swal.close()
          Swal.fire('Error', 'Se ha producido un error en el envio de correo' + er.reason, 'error')
          this.procesando = false
          reject(er)
        }
      )
    })
  }

  getCarpetaDigital(solicitud: Solicitud) {
    return new Promise(resolve => {
      this.carpetaServ.get(solicitud.solicitud)
        .subscribe((res) => {
          return resolve(res)
        });
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

  //Consulta los datos del diretor de la oficina a la cual esta asociado el colaborador
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
              return resolve([])
            }
          },
          (err) => {
            console.error('error algo', err)
            return reject([])
          })
      })

    }

  }

  onEdit(row) {   
    const msg = 'Editar Solicitud';
    this.openDialog(msg,row);
  }

  validateSol(): string {

    let faltantes: string = ""

    if (this.datasol.Balance) {
      if (this.datasol.Balance.inventarioTotal == 0) {
        faltantes += "<br>Inventario"
      }
      if (this.datasol.Balance.actnegTotal == 0) {
        faltantes += "<br>Activos del Negocio"
      }
      if (this.datasol.Balance.actfamTotal == 0) {
        faltantes += "<br>Activos de la Familia"
      }
    } else {
      faltantes += "<br><b>Balance: </b> Inventario, Activos de la Familia, Activos del Negocio"
    }

    if (this.datasol.Gastos) {
      if (this.datasol.Gastos.totalF == 0) {
        faltantes += "<br>Gastos de la Familia"
      }
    } else {
      faltantes += "<br><b>Gastos :</b> Gastos de la Familia"
    }

    if (this.datasol.asesor == 1) {
      if (this.datasol.Cruces) {
        if (this.datasol.Cruces.length == 0) {
          faltantes += "<br>Actividades"
        }
      } else {
        faltantes += "<br>Cruces"
      }
    } else if (this.datasol.asesor == 2) {
      if (this.datasol.CrucesAgro) {
        for (let act = 0; act < this.datasol.CrucesAgro.length; act++) {
          let num: number = act + 1
          const cruces = this.datasol.CrucesAgro[act];
          if (cruces.tipo) {

          } else {
            faltantes += "<br>Tipo de Actividad " + num
          }
          if (cruces.nombre) {

          } else {
            faltantes += "<br>Nombre Actividad " + num
          }
        }
        if (this.datasol.CrucesAgro.length == 0) {
          faltantes += "<br>Actividades"
        }
      } else {
        faltantes += "<br><b>Cruces</b>"
      }
      if (this.datasol.Propuesta) {
        if (Utils.formatNumber(this.datasol.Propuesta.montorecomendado) == 0) {
          faltantes += "<br>Monto recomendado"
        }
        if (this.datasol.Propuesta.plazo == 0) {
          faltantes += "<br>Plazo"
        }
        if (this.datasol.Propuesta.tipocuota == 0) {
          faltantes += "<br>Propuesta de credito"
        }
      } else {
        faltantes += "<br><b>Propuesta: </b> Monto recomendado, Plazo, Propuesta de credito"
      }
    }
    return faltantes
  }

}

/**
 * Análisis de crédito (PDF Generado Asesor Agil) COL-FO-001
 * Análisis de crédito Agropecuario (PDF Generado Asesor Agil) COL-FO-006
 * Flujo de Caja Agropecuario (PDF Generado Asesor Agil) COL-FO-017
 * */