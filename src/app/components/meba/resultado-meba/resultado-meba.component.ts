import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EChartsOption } from 'echarts';
import { Sensibilidad } from 'src/app/model/sensibilidad';
import { Solicitud } from 'src/app/model/solicitud';
import Utils from 'src/app/utils';
import { IdbSolicitudService } from '../../../services/idb-solicitud.service';

@Component({
  selector: 'app-resultado-meba',
  templateUrl: './resultado-meba.component.html',
  styleUrls: ['./resultado-meba.component.scss']
})
export class ResultadoMebaComponent implements OnInit {

  @ViewChild('reporte') reporte: ElementRef
  @Input() datossol: Solicitud
  options: EChartsOption;
  dataSolicitud: Solicitud = new Solicitud();
  sol;
  verificacion: any[] = [];
  adaptativa: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public srvSol: IdbSolicitudService
  ) { }

  async ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.sol = params.get('solicitud')
    });

    if (!this.datossol) {
      this.dataSolicitud = await this.getSolicitud() as Solicitud
    } else {
      console.log("entro datos sol resultado ",this.datossol)
      this.dataSolicitud = this.datossol
    }

    if (this.dataSolicitud) {
      
      this.options = this.optionChar(this.dataSolicitud.Sensibilidad) as EChartsOption

      if (this.dataSolicitud.dimensiones) {
        
        for (let a = 0; a < this.dataSolicitud.dimensiones.length; a++) {
          let adapta = this.dataSolicitud.dimensiones[a];

          var min = Number.POSITIVE_INFINITY
          var pre: any = {}
          var tmp = 0;

          for (let mi = 0; mi < adapta.preguntas.length; mi++) {
            if (adapta.preguntas[mi].resultado) {
              tmp = adapta.preguntas[mi].resultado.puntaje;
              if (tmp < min) {
                min = tmp
                pre = adapta.preguntas[mi].resultado;
              }
            }
          }
          if (min == Number.POSITIVE_INFINITY)
            min = 0

          adapta.preguntas = pre
          this.adaptativa.push(adapta)
        }
      }

      for (let a = 0; a < this.dataSolicitud.verificacion.length; a++) {
        let verifica = this.dataSolicitud.verificacion[a];
        if (verifica.preguntas) {
          for (let ve = 0; ve < verifica.preguntas.length; ve++) {

            const preguntas = verifica.preguntas[ve];
            let total = Utils.formatFloat(preguntas.total)

            if (total < 3) {
              this.verificacion.push(preguntas)           
            }

          }
        }


      }
    }


  }
  getSolicitud() {
    return new Promise((resolve, reject) => {
      this.srvSol.getSol(this.sol).subscribe(
        (d) => {
          resolve(d)
        })
    })
  }

  optionChar(sensibilidad: Sensibilidad[]): EChartsOption {

    let options: EChartsOption
    let dataA = new Array()
    let globos = new Array()
    for (let i = 0; i < sensibilidad.length; i++) {
      const se = sensibilidad[i];
      globos.push(se.nombre.Global)
      let name = se.nombre.Nombre
      dataA.push(name)
    }

    if (sensibilidad) {

      options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: dataA
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          max: 100
        },
        yAxis: {
          type: 'category',
          data: dataA
        },
        series: {
          type: 'bar',
          color: 'grey',
          data: globos
        }
      };
    }
    return options
  }

}
