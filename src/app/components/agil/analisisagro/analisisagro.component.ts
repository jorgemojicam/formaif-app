import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Solicitud } from 'src/app/model/agil/solicitud';
import { IdbSolicitudService } from '../../../services/idb-solicitud.service';
import DataSelect from '../../../data-select/dataselect.json';
import Utils from '../../../utils';
import { CrucesAgro } from 'src/app/model/agil/crucesagro';
import { EncryptService } from 'src/app/services/encrypt.service';

@Component({
  selector: 'app-analisisagro',
  templateUrl: './analisisagro.component.html',
  styleUrls: ['./analisisagro.component.scss']
})
export class AnalisisagroComponent implements OnInit {

  @ViewChild('reporte') reporte: ElementRef
  @Input() datossol: Solicitud

  constructor(
    private activeRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    public srvSol: IdbSolicitudService,
    
  ) { }

  datasolicitud: Solicitud = new Solicitud();
  tipoAsesor: number;
  fechahoy: string;


  ngOnInit(): void {

    let hoy = new Date()
    let mes: number = hoy.getMonth() + 1
    this.fechahoy = hoy.getDate() + "/" + mes + "/" + hoy.getFullYear()

    if (!this.datossol) {
      this.activeRoute.queryParamMap.subscribe((params) => {
        let ced = params.get('cedula')
        this.srvSol.getSol(ced).subscribe((res) => {
          let datasol = JSON.parse(res)
          this.datasolicitud = datasol as Solicitud;
          this.tipoAsesor = this.datasolicitud.asesor;
    
        })
      });
    } else {
      this.datasolicitud = this.datossol
      this.tipoAsesor = this.datasolicitud.asesor;
    }
  }



  transform(base) {
    if (base != "") {
      return this.sanitizer.bypassSecurityTrustResourceUrl(base);
    } else {
      return ""
    }
  }

  equivalencia(id: string, lista: string) {

    if (id == "") {
      return ""
    }
    let texto:any
    switch (lista) {
      case 'tipoinventario':
        let inventario = DataSelect.TipoInventarioAgro.filter(i => i.id == id);
        texto = inventario[0]
        break;
      case 'MesNombre':
        let Mes = DataSelect.Meses.filter(i => i.id == id);        
        texto = Mes[0]
        break;
      case 'TipoActividad':
        let act = DataSelect.TipoActividadRural.filter(i => i.id == id);
        texto = act[0]
        break;
      case 'Periodo':
        let periodo = DataSelect.PeriodoEdad.filter(i => i.id == id);
        texto = periodo[0]
        break;
      case 'Unidades':
        let uni = DataSelect.Unidades.filter(i => i.id == id);
        texto = uni[0]
        break;
      case 'PeriodoEdad':
        let priodo = DataSelect.PeriodoEdad.filter(i => i.id == id);
        texto = priodo[0]
        break;
      case 'tipoingreso':
        let tipo = DataSelect.OtrosIngresosFamiliar.filter(i => i.id == id);
        texto = tipo[0]
        break;
      case 'descripcionegreso':
        let deta = DataSelect.DetalleAgricola.filter(i => i.id == id);
        texto = deta[0]
        break;
      case 'DescripcionEgresosPec':
        let descripcion = DataSelect.DetallePecuario.filter(i => i.id == id);
        texto = descripcion[0]
        break;
      default:
        texto = ""
        break;
    }
    if(texto){
      return texto.name
    }
    return texto

  }

  totales(perdidaPepeo, perdidaTra, perdidaCos) {
    return Utils.formatNumber(perdidaPepeo) + Utils.formatNumber(perdidaCos) + Utils.formatNumber(perdidaTra)
  }

  totalegreso(act: CrucesAgro) {
    let totalegreso = 0
    act.lotesAgro.forEach(loteA => {
      loteA.egresosAdecuacion.forEach(eg => {
        totalegreso += Utils.formatNumber(eg.total)
      });
      loteA.egresosCocecha.forEach(eg => {
        totalegreso += Utils.formatNumber(eg.total)
      });
      loteA.egresosMante.forEach(eg => {
        totalegreso += Utils.formatNumber(eg.total)
      });
      loteA.egresosSiembra.forEach(eg => {
        totalegreso += Utils.formatNumber(eg.total)
      });
    });
    return totalegreso.toLocaleString()
  }
  totalegresoP(act: CrucesAgro) {

    let totalegreso = 0
    act.lotesPecuario.forEach(loteP => {
      loteP.egresos.forEach(eg => {
        totalegreso += Utils.formatNumber(eg.total)
      });
    });
    return totalegreso
  }

  totalingreso(act: CrucesAgro) {
    let totalingreso = 0
    act.lotesAgro.forEach(LoteA => {
      totalingreso += Utils.formatNumber(LoteA.totalIngreso)
    });
    return totalingreso.toLocaleString()
  }
  totalingresoP(act: CrucesAgro) {
    let totalingreso = 0
    act.lotesPecuario.forEach(lotP => {
      totalingreso += Utils.formatNumber(lotP.ingresomes)
    });
    return totalingreso.toLocaleString()
  }

  Mes(mes: []) {
    let mesTexto = []
    if (mes.length > 0) {
      if (mes.length > 11) {
        return "Todo el Año"
      } else {
        mes.forEach(m => {
          mesTexto.push(Utils.changeMonth(m))
        });
        return mesTexto
      }
    } else {
      return ""
    }
  }
}


