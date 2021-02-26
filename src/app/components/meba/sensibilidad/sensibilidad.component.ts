import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import DataSelect from '../../../data-select/dataselect.json';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-sensibilidad',
  templateUrl: './sensibilidad.component.html',
  styleUrls: ['./sensibilidad.component.scss']
})


export class SensibilidadComponent implements OnInit {

  actividadesForm: FormGroup
  DataSensibilidad = DataSelect.Sensibilidad
  selected = new FormControl(0);
  options: EChartsOption;
  arrayOptions: EChartsOption[] = new Array(1);

  constructor(
    private _formBuilder: FormBuilder
  ) {

    this.actividadesForm = this._formBuilder.group({
      act: this._formBuilder.array([this.itemActividad()])
    })

    this.actividadesForm.get('act').valueChanges.subscribe(values => {

      const ctrl = <FormArray>this.actividadesForm.controls['act'];
      ctrl.controls.forEach((x, index) => {

        let element = x.get('nombre').value

        if (element) {
          this.arrayOptions[index] = this.optionChar(element) as EChartsOption        
        }
      })
    })
  }


  ngOnInit(): void {


  }

  optionChar(form: any): EChartsOption {

    let options: EChartsOption

    if (form) {
      let temperatura = form.temperatura
      let precipitacion = form.precipitacion
      let ph = form.ph

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
    return user && user.name ? user.name : '';
  }
  _filter(name: any): Observable<any[]> {
    const filterValue = (typeof name === 'string' ? name.toLowerCase() : name.name.toLowerCase())
    return this.DataSensibilidad.filter(option => option.name.toLowerCase().indexOf(filterValue) >= 0);
  }
  itemActividad() {
    return this._formBuilder.group({
      nombre: [''],
      cientifico: [''],
      temperatura: [''],
      precipitacion: [''],
      ph: [''],
    })

  }
  actividades() {
    return this.actividadesForm.get('act') as FormArray;
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
