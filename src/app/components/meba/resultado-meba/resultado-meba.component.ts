import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EChartsOption, number } from 'echarts';
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

  options: EChartsOption;
  dataSolicitud: Solicitud = new Solicitud();
  sol;
  verificacion: any[] = [];
  adaptativa: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public srvSol: IdbSolicitudService
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.sol = params.get('solicitud')
    });

    this.srvSol.getSol(this.sol).subscribe((datasol) => {
      if (this.sol) {
        this.dataSolicitud = datasol as Solicitud
        this.options = this.optionChar(this.dataSolicitud.Sensibilidad) as EChartsOption

        for (let a = 0; a < this.dataSolicitud.dimensiones.length; a++) {
          let adapta = this.dataSolicitud.dimensiones[a];

          var min = Number.POSITIVE_INFINITY
          var pre: any
          var tmp;

          for (let mi = 0; mi < adapta.preguntas.length; mi++) {
            tmp = adapta.preguntas[mi].resultado.puntaje;
            if (tmp < min) {
              min = tmp
              pre = adapta.preguntas[mi].resultado;
            }
          }

          if (min == Number.POSITIVE_INFINITY)
            min = 0

          adapta.preguntas = pre
          this.adaptativa.push(adapta)
        }

        for (let a = 0; a < this.dataSolicitud.verificacion.length; a++) {
          let verifica = this.dataSolicitud.verificacion[a];
          let total = Utils.formatFloat(verifica.total)

          if (total < 3) {
            this.verificacion.push(verifica)
          }

        }
      }
    })

  }

  optionChar(sensibilidad: Sensibilidad[]): EChartsOption {

    let options: EChartsOption
    let dataA = new Array()
    let globos = new Array()
    for (let i = 0; i < sensibilidad.length; i++) {
      const se = sensibilidad[i];
      globos.push(se.globo)
      let cont = i + 1
      let name = i == 0 ? 'Principal' : 'Actividad ' + cont
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
