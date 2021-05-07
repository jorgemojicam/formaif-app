import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Solicitud } from 'src/app/model/solicitud';
import { AnalisismebaprodService } from 'src/app/services/analisismebaprod.service';
import { IdbSolicitudService } from '../../../services/idb-solicitud.service';
import * as html2pdf from "html2pdf.js";
import { ResultadoMebaComponent } from '../resultado-meba/resultado-meba.component';
import { Email } from 'src/app/model/email';
import { EmailService } from 'src/app/services/email.service';
import Swal from 'sweetalert2';
import { Asesor } from 'src/app/model/asesor';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { CarpetadigitalService } from 'src/app/services/carpetadigital.service';
import { ResultadoService } from 'src/app/services/resultado.service';

@Component({
  selector: 'app-home-meba',
  templateUrl: './home-meba.component.html',
  styleUrls: ['./home-meba.component.scss']
})
export class HomeMebaComponent implements AfterViewInit {

  displayedColumns: string[] = ['cedula', 'gestion', 'upload'];
  dataSource: MatTableDataSource<Solicitud>;
  @ViewChild(ResultadoMebaComponent, { static: false }) resultado: ResultadoMebaComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  procesando = false
  datasol: Solicitud;

  constructor(
    private srvSol: IdbSolicitudService,
    private _router: Router,
    private _srvAnalisis: AnalisismebaprodService,
    private _srvEmail: EmailService,
    private _srvCarpeta: CarpetadigitalService,
    private _srvResultado:ResultadoService,
    private _srvToken: TokenStorageService
  ) { }

  ngAfterViewInit(): void {

    this.srvSol.get().subscribe((sol) => {
      if (sol) {
        let solicitud = sol.filter(a => a.asesor == 2)
        this.dataSource = new MatTableDataSource(solicitud);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })

  }

  onGetSol() {
    alert("Aqui consulta")
  }

  onGestion(element) {
    this._router.navigate(['meba/sensibilidad'], { queryParams: { cedula: element.cedula } })
  }

  async onSend(element) {

    if (navigator.onLine) {

      const cedula: string = element.cedula.toString();
      this.datasol = await this.getSolicitud(cedula) as Solicitud
      let datos = this.datasol

      if (!datos.solicitud) {
        Swal.fire('Incompleto!', 'Por favor ingresar el numero de solicitud en Asesor Agil', 'info')
        return
      }

      let asesores: Asesor = this._srvToken.getUser()

      let analisisArr = new Array()
      //Recorre los datos de sensibilidad
      if (datos.Sensibilidad) {
        datos.Sensibilidad.forEach(async element => {
          if (element.nombre) {
            analisisArr.push({
              Id: element.nombre.Id
            })
          }
        });
      } else {
        Swal.fire('Incompleto!', 'Por favor ingresar los datos de Sensibilidad', 'info')
        return
      }

      let listRespuestas = new Array()
      //Recorre las respuestas 
      if (datos.dimensiones) {
        datos.dimensiones.forEach(dim => {
          if (dim.Preguntas.length > 0) {
            dim.Preguntas.forEach(pre => {
              if (pre.Resultado) {
                listRespuestas.push({
                  Id: pre.Resultado.Id
                })
              }
            });
          }
        });
      } else {
        Swal.fire('Incompleto!', 'Por favor complete el cuestionario de Capacidad Adaptativa', 'info')
        return
      }
      //Recorre las espuestas de verificacion
      if (datos.verificacion) {
        datos.verificacion.forEach(ver => {

          if (ver.Preguntas.length > 0) {
            ver.Preguntas.forEach(pre => {

              if (pre.Resultado) {
                let resul = pre.Resultado as any

                if (resul.length >= 1) {
                  resul.forEach(res => {
                    listRespuestas.push({
                      Id: res.Id
                    })
                  });
                } else {
                  listRespuestas.push({
                    Id: pre.Resultado.Id
                  })

                }
              }
            });
          }
        })
      } else {
        Swal.fire('Incompleto!', 'Por favor complete el cuestionario de Verificacion EBA', 'info')
        return
      }
      
      Swal.fire({
        title: '¿Desea Enviar el Resultado MEBA?',
        html: `Se enviara email a:
      <br><b>`+ asesores.Nombre + `</b>, 
      <br><small>`+ asesores.Clave.toLocaleLowerCase() + `@fundaciondelamujer.com</small>
      <br><b>Solicitud :</b>` + datos.solicitud + `
      <br><b>Oficina :</b> `+ asesores.Sucursales.Nombre,
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

                  b.textContent = "Creando pdf..."
                  let pdfBase64: string = "";
                  const resultado = this.resultado.reporte.nativeElement
                  pdfBase64 = await this.createpdf(resultado, "MEBA_", datos.solicitud, "p") as string
                  this.datasol = null

                  b.textContent = "Enviando email..."
                  let email = `${asesores.Clave.toLocaleLowerCase()}@fundaciondelamujer.com`;
                  let envio = await this.send(pdfBase64, "", "Soporte", email)

                  b.textContent = "Cargando en base de datos..."
                  let idAnalisis: any = await this.setAnalisis(datos)

                  console.log("Se carga el estudio a base de datos o cualquier cosa ", idAnalisis)

                  if (idAnalisis > 0) {

                    let dataprod = {
                      listProduccion: analisisArr,
                      AnalisisMeba: {
                        Id: idAnalisis
                      }
                    }
                    let anapro = await this.setAnalisisProduccion(dataprod)
                    console.log('analisis produccion ->', anapro)
                  }

                  if (listRespuestas.length > 0 && idAnalisis > 0) {
                    let datoresultados = {
                      Analisis: {
                        Id: idAnalisis
                      },
                      listRespuestas: listRespuestas
                    }
                    let resul = this._srvResultado.create(datoresultados);
                    console.log('resultado analisis ->', resul)
                  }

                  Swal.close()
                  Swal.fire('Enviado!', 'Se envio correctamente', 'success')
                  this.procesando = false
                  //let existeSolicitud = await this.getCarpetaDigital(this.datasol) as string
                  //console.log(existeSolicitud)
                  //let insertaCarpeta = await this.inserCarpetaDigital(this.datasol,pdfBase64)
                  //console.log("Insertndo el carpeta digital",insertaCarpeta)

                }
              }
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.procesando = false
          this.datasol = null
          Swal.fire('Cancelado', 'El proceso de envio se interrumpio :(', 'error')
        }
      })

    }

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

  /**
 * Autor: Jorge Enrique Mojica Martinez
 * Fecha: 2021-03-26
 * Nombre: setAnalisis
 * Descripcion : inserta los datos del analisis de meba en la base de datos 
 * 
 * @param {object} datos 
 *
 * @return {string}
 */
  setAnalisis(datos) {

    let fechahoy = new Date()

    let data = {
      Cedula: datos.cedula,
      Solicitud: datos.solicitud,
      FechaInicio: datos.fechacreacion,
      FechaFin: fechahoy,
      Sucursal: {
        Codigo: datos.oficina
      },
      Analista: datos.usuario
    }

    return new Promise((resolve, reject) => {
      this._srvAnalisis.create(data).subscribe(
        (a) => {
          return resolve(a)
        },
        (err) => {
          reject(err)
        })
    })
  }

  setAnalisisProduccion(data) {
    return new Promise((resolve, reject) => {
      this._srvAnalisis.createAnaProd(data).subscribe(
        (a) => {
          return resolve(a)
        },
        (err) => {
          reject(err)
        })
    })
  }

  /**
 * Autor: Jorge Enrique Mojica Martinez
 * Fecha: 2021-03-26
 * Nombre: createpdf
 * Descripcion : crea el archivo pdf del contenido html 
 * 
 * @param {string} content 
 * @param {string} namefile
 * @param {string} numeroSolicitud 
 * @param {string} orintation 
 *
 * @return {string} archivo pdf en base64
 */
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

  /**
 * Autor: Jorge Enrique Mojica Martinez
 * Fecha: 2021-03-26
 * Nombre: send
 * Descripcion : envia un email al correo destinatario con los adjuntos respectivos 
 * 
 * @param {string} pdfBase64 
 * @param {string} pdfBase64Agro
 * @param {string} destinatario nombre de la persona a la que va dirijido el mensaje
 * @param {string} emaildestinatario email de la persona a la que va dirigido
 *
 */
  send(pdfBase64: string, pdfBase64Agro: string, destinatario: string, emaildestinatario: string) {

    let email: Email = new Email;
    email.To = emaildestinatario;
    email.Subject = "Analisis de credito"
    email.Body = `<h3>Buen dia, ` + destinatario + ` </h3>
              <p>A continuacion adjunto se encuentra el estudio MEBA</p>`
    email.Base64Pdf = pdfBase64
    email.Base64PdfAgro = pdfBase64Agro

    return new Promise((resolve, reject) => {
      this._srvEmail.Send(email).subscribe(
        (su) => {
          return resolve(su)
        },
        (er) => {
          reject(er)
        }
      )
    })
  }

  /**
 * Autor: Jorge Enrique Mojica Martinez
 * Fecha: 2021-03-26
 * Nombre: getSolicitud
 * Descripcion : consulta si el numero de solicitud existe en carpeta digital 
 * 
 * @param {Solicitud} solicitud 
 */
  getCarpetaDigital(solicitud: Solicitud) {
    return new Promise(resolve => {
      this._srvCarpeta.get(solicitud.solicitud)
        .subscribe((res) => {
          return resolve(res)
        });
    })

  }
  /**
   * Autor: Jorge Enrique Mojica Martinez
   * Fecha: 2021-05-06
   * Nombre: getSolicitud
   * Descripcion : inserta el archivo en carpeta digital 
   * 
   * @param {Solicitud} solicitud
   * @param {string} pfd
   * @param {number} tipo
   */
  inserCarpetaDigital(solicitud: Solicitud, pfd: string, tipo: number) {
    return new Promise(resolve => {
      this._srvCarpeta.insert(solicitud, pfd, tipo)
        .subscribe((res) => {
          return resolve(res)
        });
    })
  }

}
