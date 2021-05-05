import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { EChartsOption } from 'echarts';
import { Solicitud } from 'src/app/model/solicitud';
import { Sensibilidad } from 'src/app/model/sensibilidad';
import { ActivatedRoute } from '@angular/router';
import { IdbSolicitudService } from '../../../services/idb-solicitud.service';
import { IdbService } from 'src/app/services/idb.service';

@Component({
  selector: 'app-sensibilidad',
  templateUrl: './sensibilidad.component.html',
  styleUrls: ['./sensibilidad.component.scss']
})


export class SensibilidadComponent implements OnInit {

  actividadesForm: FormGroup
  DataSensibilidad: any = new Array()
  dataSolicitud: Solicitud = new Solicitud();
  dataSen: [] = [];
  selected = new FormControl(0);
  options: EChartsOption;
  arrayOptions: EChartsOption[] = new Array(1);
  ced;

  constructor(
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public srvSol: IdbSolicitudService,
    private _srvIdb: IdbService,
  ) {

    this.actividadesForm = this._formBuilder.group({
      sensibilidad: this._formBuilder.array([this.itemActividad()])
    })
    this.route.queryParamMap.subscribe((params) => {
      this.ced = params.get('cedula')
    });
    this.srvSol.getSol(this.ced).subscribe((datasol) => {
      if (this.ced) {

        this.dataSolicitud = datasol as Solicitud
        if (this.dataSolicitud.Sensibilidad) {
          this.loadActividad(this.dataSolicitud.Sensibilidad)
        }
      }

      this.actividadesForm.get('sensibilidad').valueChanges.subscribe(values => {

        const ctrl = <FormArray>this.actividadesForm.controls['sensibilidad'];
        ctrl.controls.forEach((x, index) => {

          let element = x.get('nombre').value
          if (element) {
            this.arrayOptions[index] = this.optionChar(element) as EChartsOption
          }
          x.patchValue({
            name: element.name     
          }, { emitEvent: false })

        })
        this.dataSen = this.actividadesForm.value.sensibilidad
        this.dataSolicitud.Sensibilidad = this.dataSen
        this.srvSol.saveSol(this.ced, this.dataSolicitud)

      })

    })
  }


  async ngOnInit() {
    this.DataSensibilidad = await this.getProduccion() 
  }

  getProduccion() {
    return new Promise((resolve, reject) => {
      this._srvIdb.get('produccion').subscribe(
        (a) => {
          let agro = a.filter(a => a.TipoProduccion == 1)
          return resolve(agro)
        },
        (err) => {
          reject([])
        }
      )
    });
  }

  optionChar(form: any): EChartsOption {

    let options: EChartsOption

    if (form) {
      let temperatura = form.Temperatura
      let precipitacion = form.Precipitacion
      let ph = form.Ph

      options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['temperatura', 'precipitacion', 'ph']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['']
        },
        series: [
          {
            name: 'temperatura',
            type: 'bar',
            color: 'grey',
            data: [temperatura]
          },
          {
            name: 'precipitacion',
            type: 'bar',
            color: 'purple',
            data: [precipitacion]
          },
          {
            name: 'ph',
            color: 'orange',
            type: 'bar',
            data: [ph]
          }
        ]
      };
    }
    return options
  }

  displayFn(user: any): string {
    return user && user.Nombre ? user.Nombre : '';
  }
  _filter(name: any): Observable<any[]> {
      const filterValue = (typeof name === 'string' ? name.toLowerCase() : name.Nombre.toLowerCase())
      return this.DataSensibilidad.filter(option => option.Nombre.toLowerCase().indexOf(filterValue) >= 0);    
  }
  itemActividad() {
    return this._formBuilder.group({
      nombre: ['']    
    })

  }

  loadActividad(sensibilidad: Sensibilidad[]) {

    let sensibilidadArray = this._formBuilder.array([])

    for (let se = 0; se < sensibilidad.length; se++) {

      let sens = sensibilidad[se]

      this.arrayOptions[se] = this.optionChar(sens.nombre) as EChartsOption
      sensibilidadArray.push(
        this._formBuilder.group({
          nombre: [sens.nombre]     
        })
      )
    }
    return this.actividadesForm = this._formBuilder.group({
      sensibilidad: sensibilidadArray
    })
  }
  actividades() {
    return this.actividadesForm.get('sensibilidad') as FormArray;
  }
  addActividad() {
    this.actividades().push(this.itemActividad());
    this.selected.setValue(this.actividades().length - 1);
  }
  deleteActividad(act: number) {
    Swal.fire({
      title: 'Se eliminara permanentemente la informacion de la actividad ¿Esta seguro de eliminarla?',
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.actividades().removeAt(act);
        Swal.fire('Información eliminada!', '', 'success')
      }
    })

  }

}
