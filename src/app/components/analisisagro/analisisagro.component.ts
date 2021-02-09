import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Solicitud } from 'src/app/model/solicitud';
import { IdbSolicitudService } from '../admin/idb-solicitud.service';
import DataSelect from '../../data-select/dataselect.json';

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
    public srvSol: IdbSolicitudService
  ) { }

  datasolicitud: Solicitud = new Solicitud()
  tipoAsesor: number;
  fechahoy: string;
  sol: string;

  ngOnInit(): void {

    if (!this.datossol) {
      this.activeRoute.queryParamMap.subscribe((params) => {
        this.sol = params.get('solicitud')
        this.srvSol.getSol(this.sol).subscribe((datasol) => {
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

  transform(base) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(base);
  }

  equivalencia(id: number, lista: string) {
    if (lista == 'tipoinventario') {
      let inventario = DataSelect.TipoInventarioAgro.filter(i => i.id == id);
      console.log(inventario)
      return inventario[0].name
    }
  }

  TipoUnidades(id: string, lista: string){
    if(id!==""){
      if (lista == 'Unidades') {
        let descripcion=DataSelect.Unidades.filter(i => i.id == id);
        console.log(descripcion)
        return descripcion[0].name
      }
    }
  }
  TipoEdad(id: string, lista: string){
    if(id!==""){
      if (lista == 'Periodo') {
        let descripcion=DataSelect.Unidades.filter(i => i.id == id);
        console.log(descripcion)
        return descripcion[0].name
      }

    }
  }

  TipoFrecuencia(id: string, lista: string){
   if(id!==""){
    if (lista == 'PeriodoEdad') {
      let descripcion=DataSelect.PeriodoEdad.filter(i => i.id == id);
      console.log(descripcion)
      return descripcion[0].name
    }
   }
  }
  
  MesNombre(id: string, lista: string) {
    if(id==""){
      return ""
    }

    if (lista == 'MesNombre') {
      let Mes = DataSelect.Meses.filter(i => i.id == id);
      return Mes[0].name
    }
  }

  TipoIngreso(id: number, lista: string) {
    if (lista == 'tipoingreso') {
      let tipo = DataSelect.OtrosIngresosFamiliar.filter(i => i.id == id);
      console.log(tipo)
      return tipo[0].name
    }
  }

  DescripcionEgresos(id: string, lista: string) {
    if(id!==""){
      if (lista == 'descripcionegreso') {
        let descripcion = DataSelect.DetalleAgricola.filter(i => i.id == id);
        console.log(descripcion)
        return descripcion[0].name
      }

    }
    
  }

  DescripcionEgresosPec(id: string, lista: string) {
    if(id!==""){
      if (lista == 'DescripcionEgresosPec') {
        let descripcion = DataSelect.DetallePecuario.filter(i => i.id == id);
        console.log(descripcion)
        return descripcion[0].name
      }
    }
   
  }
}


