import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as html2pdf from "html2pdf.js";
import { Solicitud } from 'src/app/model/solicitud';
import { IdbSolicitudService } from '../admin/idb-solicitud.service';


@Component({
  selector: 'app-analisis',
  templateUrl: './analisis.component.html',
  styleUrls: ['./analisis.component.scss']
})
export class AnalisisComponent implements OnInit{
  
  constructor(
    private activeRoute: ActivatedRoute,
    public srvSol: IdbSolicitudService,
  ) { }

  datasolicitud: Solicitud = new Solicitud()
  tipoAsesor: number;
  fechahoy:string;

  ngOnInit(): void {

    this.activeRoute.queryParamMap
      .subscribe((params) => {
        let sol = params.get('solicitud')
        this.srvSol.getSol(sol).subscribe((datasol) => {
          let hoy = new Date()
          let mes:number = hoy.getMonth()+1
          this.fechahoy = hoy.getDate()+"/"+mes+"/"+hoy.getFullYear()
          this.datasolicitud = datasol as Solicitud
          this.tipoAsesor = this.datasolicitud.asesor        
        })
      });
    }

  download() {
    const op = {
      filename: 'Analisis de credito.pdf',
      image: { type: 'jpeg' },
      html2canvas: {
      },
      margin: 15,
      jsPDF: {format:'a3', orientation: 'p' }
    }
    const element = document.querySelector("#contentPDF")

    // html2pdf()
    //   .from(element)
    //   .set(op)
    //   .outputPdf().then(function(pdf) {
    //     console.log(btoa(pdf));
    //   });
      
      html2pdf().from(element).set(op).save();
  }

}
