import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Solicitud } from 'src/app/model/solicitud';
import { IdbSolicitudService } from '../../../services/idb-solicitud.service';
import DataSelect from '../../../data-select/dataselect.json';

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

    let hoy = new Date()
    let mes: number = hoy.getMonth() + 1
    this.fechahoy = hoy.getDate() + "/" + mes + "/" + hoy.getFullYear()

    if (!this.datossol) {
      this.activeRoute.queryParamMap.subscribe((params) => {
        let ced = params.get('cedula')
        this.srvSol.getSol(ced).subscribe((datasol) => {
          this.datasolicitud = datasol as Solicitud;
          this.tipoAsesor = this.datasolicitud.asesor;
        })
      });
    } else {
      this.datasolicitud = this.datossol
      this.tipoAsesor = this.datasolicitud.asesor;
    }
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
  diaNombre(dias: [], periodo: number) {
    let nombres = ""
    let aNombre = []
    
    if (!periodo)
      return ""
    if (!dias)
      return ""

    if (periodo == 1) {
      aNombre = DataSelect.DiasSemana
    } else if (periodo == 2) {
      aNombre = DataSelect.Semanas
    } else if (periodo == 3) {
      aNombre = DataSelect.Quince
    }
    for (let d = 0; d < dias.length; d++) {
      nombres += " " + aNombre.find(a => a.id == dias[d]).name;
    }
    return nombres
  }


  TipoIngreso(id: number, lista: string) {
    if (lista == 'tipoingreso') {
      let tipo = DataSelect.OtrosIngresosFamiliar.filter(i => i.id == id);
      return tipo[0].name
    }
  }

}
