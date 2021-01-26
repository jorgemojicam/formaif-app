import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as html2pdf from "html2pdf.js";
import { Solicitud } from 'src/app/model/solicitud';
import { IdbSolicitudService } from '../admin/idb-solicitud.service';
import DataSelect from '../../data-select/dataselect.json';


@Component({
  selector: 'app-analisis',
  templateUrl: './analisis.component.html',
  styleUrls: ['./analisis.component.scss']
})
export class AnalisisComponent implements OnInit {
  @ViewChild('reporte') reporte: ElementRef
  @Input() datossol: Solicitud

  constructor(
    private activeRoute: ActivatedRoute,
    public srvSol: IdbSolicitudService,
  ) { }

  datasolicitud: Solicitud = new Solicitud()
  tipoAsesor: number;
  fechahoy: string;

  ngOnInit(): void {

    if (!this.datossol) {
      this.activeRoute.queryParamMap.subscribe((params) => {
        let sol = params.get('solicitud')
        this.srvSol.getSol(sol).subscribe((datasol) => {
          let hoy = new Date()
          let mes: number = hoy.getMonth() + 1
          this.fechahoy = hoy.getDate() + "/" + mes + "/" + hoy.getFullYear()
          this.datasolicitud = datasol as Solicitud
          this.tipoAsesor = this.datasolicitud.asesor
        })
      });
    } else {
      this.datasolicitud = this.datossol
    }
  }

  download() {
    const op = {
      filename: 'Analisis de credito.pdf',
      image: { type: 'jpeg' },
      html2canvas: {
      },
      margin: 15,
      jsPDF: { format: 'a3', orientation: 'p' }
    }
    const element = document.querySelector("#contentPDF")

    html2pdf()
      .from(element)
      .set(op)
      .outputPdf().then(function (pdf) {
        console.log(btoa(pdf));
      });

    html2pdf().from(element).set(op).save();
  }

  MesNombre(id: string, lista: string) {
    if (lista == 'MesNombre') {
      if (id != "") {
        let Mes = DataSelect.Meses.filter(i => i.id == id);
        return Mes[0].name
      } else {
        return ''
      }
    }
  }


  TipoIngreso(id: number, lista: string) {
    if (lista == 'tipoingreso') {
      let tipo = DataSelect.OtrosIngresosFamiliar.filter(i => i.id == id);
      return tipo[0].name
    }
  }

}
