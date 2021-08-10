import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from "../../../shared/modal/modal.component";
import { Solicitud } from 'src/app/model/agil/solicitud';
import { IdbSolicitudService } from '../../../services/idb-solicitud.service';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import Swal from 'sweetalert2';
import { AnalisisComponent } from '../analisis/analisis.component';
import * as html2pdf from "html2pdf.js";
import { Asesor } from 'src/app/model/admin/asesor';
import { EmailService } from 'src/app/services/email.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ProfileComponent } from '../../admin/profile/profile.component';
import { AnalisisagroComponent } from '../analisisagro/analisisagro.component';
import { FlujocajaComponent } from '../flujocaja/flujocaja.component';
import { AnalisisService } from 'src/app/services/analisis.service';
import { CarpetadigitalService } from 'src/app/services/carpetadigital.service';
import Utils from 'src/app/utils';
import { ErrorparamService } from 'src/app/services/errorparam.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['tipo', 'cedula', 'gestion', 'delete', 'upload'];
  dataSource: MatTableDataSource<Solicitud>;
  dataSolicitudes: Solicitud[] = [];
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
    private analisisServ: AnalisisService,
    private emailServ: EmailService,
    private _bottomSheet: MatBottomSheet,
    private _srvCarpeta: CarpetadigitalService,
    private _srvErrore: ErrorparamService
  ) {
  }


  getSol() {
    return new Promise(resolve => {
      this.srvSol.get().subscribe(
        (sol) => {
          if (sol) {
            resolve(sol)
          } else {
            resolve([])
          }
        })
    })
  }

  async ngOnInit() {
    this.dataSolicitudes = await this.getSol() as Solicitud[]
    this.dataSource = new MatTableDataSource(this.dataSolicitudes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onInitSol() {
    const title = 'Crear Solicitud';
    const datos = new Solicitud
    this.openDialog(title, "home", datos);
  }

  openDialog(title, form, datos) {
    const config = {
      data: {
        mensaje: title,
        form: form,
        content: datos
      }
    };
    const dialogRef = this.dialog.open(ModalComponent, config);
    dialogRef.afterClosed().subscribe(async result => {
      this.dataSolicitudes = await this.getSol() as Solicitud[]
      this.dataSource = new MatTableDataSource(this.dataSolicitudes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  async onLoad() {
    this.dataSolicitudes = await this.getSol() as Solicitud[]
    this.dataSource = new MatTableDataSource(this.dataSolicitudes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onLogout() {
    this.tokenStorage.signOut()
    this.route.navigate(['auth'])
  }

  onGestion(element) {
    this.route.navigate(['agil/balance'], { queryParams: { cedula: element.cedula } })
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

    try {

      this.procesando = true
      if (!element.solicitud || element.solicitud == "" || element.solicitud.length < 10) {
        this.procesando = false
        Swal.fire({
          icon: 'info',
          title: 'Información Incompleta',
          html: 'Debe ingresar el numero de solicitud',
          didOpen: async () => {
            Swal.hideLoading()
          }
        })
        this.onEdit(element)
        return
      }

      if (navigator.onLine) {

        const numeroCedula: string = element.cedula.toString();
        this.datasol = await this.getSolicitud(numeroCedula) as Solicitud
        let faltante = this.validateSol()
        if (faltante != "") {
          this.procesando = false
          Swal.hideLoading()
          Swal.fire({
            icon: 'info',
            title: 'Información Incompleta',
            html: 'Aun tiene pendiente completar la siguiente información: ' + faltante,
          })
          return
        }
        let asesor = await this.getDirector() as Asesor
        
        let strcarpetaDig = await this.getCarpetaDigital(this.datasol.solicitud) as string
        let solCarpeta = JSON.parse(strcarpetaDig)
 
       /* if (solCarpeta.EstadoCarpeta !== "Abierto") {                   
          Swal.fire('Carpeta Digital', 'La solicitud no se encontro en Carpeta Digital o no tiene estado Abierto', 'info')
          this.procesando = false
          return
        }else{
         
          solCarpeta.lstMetadata.forEach(element => {  
             
            if(element.Nombre.toLowerCase().trimEnd() =="estado credito" && element.Valor != "En Trámite"){
              Swal.fire('Carpeta Digital', `El estado del credito es <b>${element.Valor}</b> por lo tanto no puede insertar en carpeta digital`, 'info')
              this.procesando = false
              return
            }
          }); 
        }*/
     
        if (asesor.Director) {
          let emailDirector = asesor.Director.Correo
          let nombreDirector = asesor.Director.Nombre
          Swal.fire({
            title: '¿Desea Enviar Analisis de credito?',
            //html: `Insertara el analisis en carpeta digital:
            html: `Se enviara email al director:
        <br><b>${nombreDirector}</b>, 
        <br><small>${emailDirector}</small>     
        <br><b>Solicitud :</b>${numeroCedula}
        <br><b>Oficina :</b>${asesor.Sucursales.Nombre}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, Enviar!',
            cancelButtonText: 'No, Cancelar!',
            reverseButtons: true,
            allowOutsideClick: false
          }).then(async (result) => {
            if (result.isConfirmed) {
              Swal.hideLoading()
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
                      let pdfBase64flujo: string = "";
                      if (this.datasol.asesor == 2) {
                        const contentagro = this.analisisAgro.reporte.nativeElement
                        const contentflujo = this.flujo.reporte.nativeElement
                        b.textContent = "Generacion Analisis de credito pdf..."
                        pdfBase64 = await this.createpdf(contentagro, "Analisis de credito", numeroCedula, "p") as string
                        b.textContent = "Generacion Flujo de caja pdf..."
                        pdfBase64flujo = await this.createpdf(contentflujo, "Flujo de caja", numeroCedula, "l") as string
                        let listBase64 = [
                          {
                            Base64Pdf: pdfBase64,
                            Name: "AnalisisDeCredito.pdf"
                          },
                          {
                            Base64Pdf: pdfBase64flujo,
                            Name: "FlujoDeCaja.pdf"
                          }
                        ]
                        b.textContent = "Enviando email Flujo..."
                        await this.send(listBase64, nombreDirector, emailDirector, "Analisis de Credito - " + this.datasol.solicitud, asesor.Nombre)
                        /*b.textContent = "Insertando en carpeta digital..."
                        let resCarpeta = await this.inserCarpetaDigital(this.datasol, pdfBase64, 2)
                        console.log("Insetando analisis el carpeta digital", resCarpeta)
                        let resCarpetaFlujo = await this.inserCarpetaDigital(this.datasol, pdfBase64flujo, 3)
                        console.log("Insertando flujo en carpeta", resCarpetaFlujo)*/
                      } else if (this.datasol.asesor == 1) {
                        const contentana = this.analisis.reporte.nativeElement
                        b.textContent = "Generacion Analisis de credito pdf..."
                        pdfBase64 = await this.createpdf(contentana, "Analisis de credito", numeroCedula, "p") as string
                        let listBase64 = [
                          {
                            Base64Pdf: pdfBase64,
                            Name: "AnalisisDeCredito.pdf"
                          }
                        ]
                        b.textContent = "Enviando email..."
                        await this.send(listBase64, nombreDirector, emailDirector, "Analisis de Credito - " + this.datasol.solicitud, asesor.Nombre)
                        /*b.textContent = "Insertando en carpeta digital..."
                        let solCarpeta = await this.inserCarpetaDigital(this.datasol, pdfBase64, 1)
                        console.log("Insertndo en carpeta digital", solCarpeta)*/
                      }
                      b.textContent = "Insertando el analisis..."
                      await this.insert(this.datasol)
                      Swal.close()
                      Swal.fire('Enviado!', 'Se envio correctamente', 'success')
                      this.procesando = false
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

      }
      else {
        this.procesando = false
        Swal.fire({
          icon: 'info',
          title: 'Oops...',
          text: 'En este momento no tiene conexion a internet, su informacion seguira guardada en el movil pero debe tener conexion para enviarla :('
        })

      }
    } catch (e) {
      console.log(e)
      Swal.close()
      this.procesando = false
      Swal.fire({ icon: 'error', title: 'Error', text: 'Se esta presentando error por favor reportar al administrador: ' + e })
    }
  }

  openProfile(): void {
    this._bottomSheet.open(ProfileComponent);
  }

  getSolicitud(solicitud) {
    return new Promise((resolve, reject) => {
      this.srvSol.getSol(solicitud).subscribe(
        (datasol) => {
          return resolve(JSON.parse(datasol))
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
      html2canvas: { dpi: 192, letterRendering: true },
      margin: 15,
      jsPDF: { format: 'a3', orientation: orintation }
    }
    return new Promise(resolve => {
      html2pdf().from(content).set(op).outputPdf()
        .then((pdf) => {
          resolve(btoa(pdf))
        }, (err) => {
          console.log(err)
          resolve("")
        });
    })
  }

  insert(solicitud: Solicitud) {

    let data = {
      Solicitud: solicitud.solicitud,
      Identificacion: solicitud.cedula,
      Oficina: solicitud.oficina,
      Fecha_Inicio: solicitud.fechacreacion,
      Fecha_Fin: new Date(),
      Usuario: solicitud.usuario,
      Tipo: solicitud.asesor
    }
    console.log(data)

    return new Promise(resolve => {
      this.analisisServ.insert(data)
        .subscribe((res) => {
          return resolve(res)
        }, (err) => {
          console.log("error insertando analisis base de datos ", err)
        });
    })
  }

  send(pdfBase64, nombreDir, emailDir, asunto, nombreAsesor) {

    let email = {
      To: emailDir,
      Subject: asunto,
      Body: `<h3>Buen dia,</h3>
      <p>${nombreDir} a continuación adjunto se encuentra el formato de analisis de credito gestionado por el asesor ${nombreAsesor}</p>`, 
      ListBase64Pdf: pdfBase64
    }

    let emailParam = {
      To: emailDir,
      Subject: asunto,
      Body: `<h3>Buen dia,</h3>
            <p>${nombreDir} a continuación adjunto se encuentra el formato de analisis de credito gestionado por el asesor ${nombreAsesor}</p>`,
      ListBase64Pdf: pdfBase64.length
    }

    return new Promise((resolve, reject) => {
      this.emailServ.SendAdjunto(email).subscribe(
        (su) => {
          resolve(su)
        },
        async (er) => {
          console.log(er)
          await this.insertError(er.status, 'send', JSON.stringify(emailParam), 'agil/home')
          Swal.close()
          Swal.fire('Error', 'Se ha producido un error en el envio de correo ' + er.status, 'error')
          this.procesando = false
          reject(er)
        }
      )
    })
  }

  getCarpetaDigital(solicitud: number) {
    return new Promise(resolve => {
      this._srvCarpeta.get(solicitud)
        .subscribe((res) => {
          return resolve(res)
        });
    })

  }

  inserCarpetaDigital(solicitud: Solicitud, pfd: string, tipo: number) {
    return new Promise((resolve, reject) => {
      this._srvCarpeta.insert(solicitud, pfd, tipo)
        .subscribe((res) => {
          return resolve(res)
        }, async (err) => {

          await this.insertError(err.status, 'send', JSON.stringify({ solicitud: solicitud.asesor }), 'agil/home')
          Swal.close()
          Swal.fire('Error', 'Se ha producido un error en el envio de correo ' + err.status, 'error')
          this.procesando = false
          reject(err)
          console.log("error insertando carpeta digital " + err)
        });
    })
  }

  //Consulta los datos del diretor de la oficina a la cual esta asociado el colaborador
  getDirector() {
    let asesores: Asesor = this.tokenStorage.getUser()

    if (asesores) {
      return asesores as Asesor
    } else {
      return null
    }
  }

  onEdit(row) {
    const title = 'Editar Solicitud';
    this.openDialog(title, "home", row);
  }

  insertError(err, meth, param, fil) {

    let data = {
      userIniciales: "JEMM",
      error: err,
      method: meth,
      param: param,
      file: fil,
      created_at: new Date().toUTCString()
    }

    return new Promise(resolve => {
      this._srvErrore.create(data).subscribe((sus) => {
        resolve(sus)
      }, (err) => {
        resolve(err)
      })
    })
  }

  validateSol(): string {

    let faltantes: string = ""

    if (this.datasol.Balance) {

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
            if (cruces.tipo != 4) {

            }

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