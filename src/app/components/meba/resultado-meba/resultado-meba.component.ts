import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EChartsOption } from 'echarts';
import { Sensibilidad } from 'src/app/model/sensibilidad';
import { Solicitud } from 'src/app/model/solicitud';
import { EncryptService } from 'src/app/services/encrypt.service';
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
  ced;
  verificacion: any[] = [];
  adaptativa: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private srvSol: IdbSolicitudService
  ) { }

  async ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.ced = params.get('cedula')
    });

    if (!this.datossol) {
      this.dataSolicitud = await this.getSolicitud() as Solicitud
    } else {
      console.log("entro datos sol resultado ", this.datossol)
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

          for (let mi = 0; mi < adapta.Preguntas.length; mi++) {
            if (adapta.Preguntas[mi].Resultado) {
              tmp = adapta.Preguntas[mi].Resultado.Punaje;
              if (tmp < min) {
                min = tmp
                pre = adapta.Preguntas[mi];
              }
            }
          }
          if (min == Number.POSITIVE_INFINITY)
            min = 0

          adapta.Preguntas = pre
          this.adaptativa.push(adapta)
        }
      }
      if (this.dataSolicitud.verificacion) {
        for (let a = 0; a < this.dataSolicitud.verificacion.length; a++) {
          let verifica = this.dataSolicitud.verificacion[a];
          if (verifica.Preguntas) {
            for (let ve = 0; ve < verifica.Preguntas.length; ve++) {

              const preguntas = verifica.Preguntas[ve];
              let total = Utils.formatFloat(preguntas.Total)

              if (total < 3) {
                this.verificacion.push(preguntas)
              }

            }
          }


        }
      }
    }


  }
  getSolicitud() {
    return new Promise((resolve, reject) => {
      this.srvSol.getSol(this.ced).subscribe(
        (d) => {
          resolve(JSON.parse(d))
        })
    })
  }

  optionChar(sensibilidad: Sensibilidad[]): EChartsOption {

    let options: EChartsOption
    let dataA = new Array()
    let globos = new Array()
    if (sensibilidad) {

      for (let i = 0; i < sensibilidad.length; i++) {
        const se = sensibilidad[i];
        globos.push(se.nombre.Global)
        let name = se.nombre.Nombre
        dataA.push(name)
      }

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
