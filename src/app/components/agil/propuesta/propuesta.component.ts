import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Propuesta } from 'src/app/model/agil/propuesta';
import { Solicitud } from 'src/app/model/agil/solicitud';
import { IdbSolicitudService } from '../../../services/idb-solicitud.service';
import DataSelect from '../../../data-select/dataselect.json';
import Utils from '../../../utils'

@Component({
  selector: 'app-propuesta',
  templateUrl: './propuesta.component.html',
  styleUrls: ['./propuesta.component.scss']
})
export class PropuestaComponent implements OnInit {

  ced: string;
  tipoSol: number;
  dataSolicitud: Solicitud;
  dataPropuesta: Propuesta;
  meses: any = DataSelect.Meses;
  periodo: any = DataSelect.Periodo.filter((pe) => pe.id < 4);
  minDate = new Date();

  constructor(
    private _srvSol: IdbSolicitudService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  propuestaForm: FormGroup = this.fb.group({
    montorecomendado: '',
    plazo: '',
    destino: '',
    detalle: '',
    valor: 0,
    detallecapital: '',
    valorcapital: '',
    tipocuota: 0,
    formapgo: '',
    valorcouta: '',
    numerocuotas: '',
    irregular: this.fb.array([])
  })

  cuotas(): FormArray {
    return this.propuestaForm.get('irregular') as FormArray;
  }

  getSol() {
    return new Promise(resolve => {
      this._srvSol.getSol(this.ced).subscribe(
        (datasol) => {
          resolve(JSON.parse(datasol))
        }, (err) => {
          resolve([])
        })

    })
  }

  async ngOnInit() {

    this.route.queryParamMap.subscribe((params) => {
      this.ced = params.get('cedula')
    });

    this.dataSolicitud = await this.getSol() as Solicitud
    this.tipoSol = this.dataSolicitud.asesor

    if (this.dataSolicitud.Propuesta) {
      this.loadPropuesta(this.dataSolicitud.Propuesta)
    }
    this.propuestaForm.valueChanges.subscribe(form => {

      let montorecomentado = Utils.formatNumber(form.montorecomendado)
      let valor = Utils.formatNumber(form.valor)
      let valorcapital = Utils.formatNumber(form.valorcapital)
      let valorcouta = Utils.formatNumber(form.valorcouta)
      let tipocuota = form.tipocuota


      if (valor > montorecomentado) {
        valor = 0
        this._snackBar.open("El valor no puede superar el monto recomendado", "Ok!", {
          duration: 6000,
        });
      }
      if (valorcapital > montorecomentado) {
        valorcapital = 0
        this._snackBar.open("El valor no puede superar el monto recomendado", "Ok!", {
          duration: 6000,
        });
      }
      let totalmonto = valor + valorcapital
      if (totalmonto > montorecomentado) {
        valorcapital = 0
        this._snackBar.open("La suma de los valores no puede superar el monto recomentado", "Ok!", {
          duration: 9000,
        });
      }
      const irregular = <FormArray>this.propuestaForm.controls['irregular'];
      let arrDate = []

      if (tipocuota == 2) {
        irregular.controls.forEach(x => {

          let valorcuota = Utils.formatNumber(x.get('valorcuota').value)
          let fecha = x.get('fechacuota').value

          if (fecha || fecha != "" || fecha != null) {

            if (fecha == "") {
              console.log("No tiene mes")
            } else {


              let ano = new Date(fecha).getMonth()
              let mes = new Date(fecha).getFullYear()
              let fulldate = ano + "-" + mes

              if (arrDate.indexOf(fulldate) >= 0) {
                this._snackBar.open("La cuota del mes ya se ingreso", "Ok!", {
                  duration: 9000,
                });
                fecha = ""
              }
              arrDate.push(fulldate)
            }
          }
          x.patchValue({
            valorcuota: isFinite(valorcuota) ? valorcuota.toLocaleString() : 0,
            fechacuota: fecha
          }, { emitEvent: false })
        });
      }

      this.propuestaForm.patchValue({
        montorecomendado: isFinite(montorecomentado) ? montorecomentado.toLocaleString() : 0,
        valor: isFinite(valor) ? valor.toLocaleString() : 0,
        valorcapital: isFinite(valorcapital) ? valorcapital.toLocaleString() : 0,
        valorcouta: isFinite(valorcouta) ? valorcouta.toLocaleString() : 0
      }, { emitEvent: false })

      this.dataPropuesta = this.propuestaForm.value
      this.dataSolicitud.Propuesta = this.dataPropuesta
      this._srvSol.saveSol(this.ced, this.dataSolicitud)
    })

  }
  itemsCuotas() {
    return this.fb.group({
      fechacuota: [''],
      valorcuota: [''],
    });
  }
  initCuotas(numcuotas, maxcuotas) {

    let num = 0
    if (numcuotas == "" || numcuotas == null) {
      this._snackBar.open("Ingrese el valor de las cuotas", "Ok!", {
        duration: 6000,
      });

    } else {
      if (numcuotas > maxcuotas) {
        this.cuotas().clear();
        this._snackBar.open("No puede superar el plazo", "Ok!", {
          duration: 6000,
        });
      } else {
        num = Utils.formatNumber(numcuotas)
        this.cuotas().clear();
        for (let i = 0; i < num; i++) {
          this.cuotas().push(this.itemsCuotas());
        }
      }
    }
  }
  loadCuotas(irregular) {
    let array = this.fb.array([])
    irregular.forEach(ir => {
      array.push(this.fb.group({
        fechacuota: ir.fechacuota,
        valorcuota: ir.valorcuota,
      }))
    });
    return array
  }


  loadPropuesta(propuestas: Propuesta) {

    let per = []
    if (propuestas.formapgo) {
      per = this.periodo.find(a => a.id == propuestas.formapgo.id)
    }
    return this.propuestaForm = this.fb.group({
      montorecomendado: propuestas.montorecomendado,
      plazo: propuestas.plazo,
      destino: propuestas.destino,
      detalle: propuestas.detalle,
      valor: propuestas.valor,
      detallecapital: propuestas.detalle,
      valorcapital: propuestas.valorcapital,
      tipocuota: propuestas.tipocuota,
      formapgo: per,
      valorcouta: propuestas.valorcouta,
      numerocuotas: propuestas.numerocuotas,
      irregular: this.loadCuotas(propuestas.irregular)
    })
  }

  onChangeTipo(e) {
  
    this.propuestaForm.patchValue({
      numerocuotas: 0 
    }, { emitEvent: false })
    this.cuotas().clear()
    
  }
}
