
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Cruces } from 'src/app/model/cruces';
import { Solicitud } from 'src/app/model/solicitud';
import DataSelect from '../../data-select/dataselect.json';
import { IdbSolicitudService } from '../admin/idb-solicitud.service';

@Component({
  selector: 'app-cruces',
  templateUrl: './cruces.component.html',
  styleUrls: ['./cruces.component.scss']
})
export class CrucesComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    public srvSol: IdbSolicitudService,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }
  tipoAsesor: number;
  actividadesForm: FormGroup
  ventasHisForm: FormGroup
  comprasForm: FormGroup
  produccionForm: FormGroup
  selected = new FormControl(0);
  frecuencia: any = DataSelect.Frecuencia;
  tipoAct: any = DataSelect.TipoActividadUrban;
  tipoActRural: any = DataSelect.TipoActividadRural;
  ActRural: any = DataSelect.ActividadRural;
  diasSema: any = [];
  sol: string;

  datasolicitud: Solicitud = new Solicitud()
  dataCruces: [] = []

  diasSemana = DataSelect.DiasSemana;
  quincena = DataSelect.Quince;
  semanas = DataSelect.Semanas;

  ngOnInit(): void {

    this.actividadesForm = this.fb.group({
      act: this.fb.array([this.itemactividad()])
    })

    this.activeRoute.queryParamMap
      .subscribe((params) => {
        this.sol = params.get('solicitud')
      });

    this.srvSol.getSol(this.sol).subscribe((datasol) => {

      this.datasolicitud = datasol as Solicitud
      this.tipoAsesor = this.datasolicitud.asesor

      if (this.datasolicitud.Cruces) {
        this.loadactividad(this.datasolicitud.Cruces)
      } else {

      }

      this.actividadesForm.valueChanges.subscribe(values => {
        this.dataCruces = values.act
        this.datasolicitud.Cruces = this.dataCruces
        this.srvSol.saveSol(this.sol, this.datasolicitud)
      })

      this.actividadesForm.get('act').valueChanges.subscribe(values => {

        const ctrl = <FormArray>this.actividadesForm.controls['act'];
        ctrl.controls.forEach((x, index) => {
          let cantperiodo = 0
          let valorpromedio = 0
          let periodoventas = x.get('periodoventas').value
          if (periodoventas == 1) {
            cantperiodo = 4
            valorpromedio = 3
          } else if(periodoventas == 2) {
            cantperiodo = 1
            valorpromedio = 3
          }else if(periodoventas == 3){
            cantperiodo = 1
            valorpromedio = 2
          }
          let cantB = x.get('diasB').value.length
          let valorB = x.get('valorB').value
          let totalB = cantB * valorB * cantperiodo

          let cantR = x.get('diasR').value.length
          let valorR = x.get('valorR').value
          let totalR = cantR * valorR * cantperiodo

          let cantM = x.get('diasM').value.length
          let valorM = x.get('valorM').value
          let totalM = cantM * valorM * cantperiodo

          let promedio= (totalB+ totalR + totalM) * valorpromedio

          x.get("totalB").setValue(totalB, { emitEvent: false });
          x.get("totalR").setValue(totalR, { emitEvent: false });
          x.get("totalM").setValue(totalM, { emitEvent: false });
          x.get("promedio").setValue(promedio, { emitEvent: false });

          this.ref.detectChanges()

        });
      })
    })
  }
  itemactividad() {
    return this.fb.group({
      nombre: [''],
      tipo: [''],
      periodoventas: [''],
      diasB: '',
      diasR: '',
      diasM: '',
      valorB: '',
      valorR: '',
      valorM: '',
      totalB: '',
      totalR: '',
      totalM: '',
      periodohistoricas: '',
      promedio: '',
      totalDias: '',
      totalPromedio: '',
      ventasHis: this.fb.array([this.itemventas()]),
      produccion: this.fb.array([this.itemProd()]),
      compras: this.fb.array([this.itemCompras()]),
      costoventa: this.fb.array([this.itemCostoventa()]),
      materiaprima: this.fb.array([this.itemMateriaprima()])
    })
  }

  loadactividad(cruces: Cruces[]): FormGroup {
    let crucesArray = this.fb.array([])
    for (let cru = 0; cru < cruces.length; cru++) {

      crucesArray.push(
        this.fb.group({
          nombre: [cruces[cru].nombre],
          tipo: [cruces[cru].tipo],
          periodoventas: [cruces[cru].periodoventas],
          diasB: [cruces[cru].diasB],
          diasR: [cruces[cru].diasR],
          diasM: [cruces[cru].diasM],
          valorB: [cruces[cru].valorB],
          valorR: [cruces[cru].valorR],
          valorM: [cruces[cru].valorM],
          totalB: [cruces[cru].totalB],
          totalR: [cruces[cru].totalR],
          totalM: [cruces[cru].totalM],
          promedio: '',
          totalDias: '',
          totalPromedio: '',
          periodohistoricas: '',
          ventasHis: this.fb.array([this.itemventas()]),
          produccion: this.fb.array([this.itemProd()]),
          compras: this.fb.array([this.itemCompras()]),
          costoventa: this.fb.array([this.itemCostoventa()]),
          materiaprima: this.fb.array([this.itemMateriaprima()]),
        })
      )
    }
    return this.actividadesForm = this.fb.group({
      act: crucesArray
    })

  }

  actividadActual(ac) {
    return this.actividades().at(ac) as FormArray
  }
  actividades() {
    return this.actividadesForm.get('act') as FormArray;
  }
  addActividad() {
    this.actividades().push(this.itemactividad());
    this.selected.setValue(this.actividades().length - 1);
  }

  //---------------------Ventas ---------------------------
  ventashistoricas(ti): FormArray {
    return this.actividades().at(ti).get("ventasHis") as FormArray
  }
  addVentashis(ti) {
    this.ventashistoricas(ti).push(this.itemventas());
  }
  itemventas() {
    return this.fb.group({
      dia: '',
      valor: ''
    })
  }
  removeVentas(act: number, venta: number) {
    this.ventashistoricas(act).removeAt(venta);
  }
  //--------------------------------------------------------------------

  //---------------------Produccion-------- -----------------
  produccion(ti): FormArray {
    return this.actividades().at(ti).get("produccion") as FormArray
  }
  addProduccion(ti) {
    this.produccion(ti).push(this.itemProd());
  }
  itemProd() {
    return this.fb.group({
      nombre: '',
      cantidad: '',
      valor: '',
      fecuencia: ''
    })
  }
  //-----------------------------------------------------------------

  //---------------------Compras-------- -----------------
  compras(ti): FormArray {
    return this.actividades().at(ti).get("compras") as FormArray
  }

  addCompras(ti) {
    this.compras(ti).push(this.itemCompras());
  }
  itemCompras() {
    return this.fb.group({
      cantidad: '',
      descripcion: '',
      frecuencia: '',
      valor: ''
    })
  }
  //-----------------------------------------------------------------

  //--------------------------Costo de venta-----------------------
  costoventa(ti) {
    return this.actividades().at(ti).get("costoventa") as FormArray
  }
  addCostoventa(ti) {
    this.costoventa(ti).push(this.itemCompras());
  }
  itemCostoventa() {
    return this.fb.group({
      nombre: '',
      participacion: '',
      precioCompra: '',
      precioVenta: '',
      totalParticipacion: ''
    })
  }
  //------------------------------------------------------------------

  //----------------materia prima -------------------------------

  materiaprima(ti) {
    return this.actividades().at(ti).get("materiaprima") as FormArray
  }
  itemMateriaprima() {
    return this.fb.group({
      nombre: '',

    })
  }
  formatNumber(num: string) {
    if (typeof (num) == "number") {
      return parseInt(num)
    } else {
      return parseInt(num == "" || num == null ? "0" : num.replace(/\D/g, '').replace(/^0+/, ''))
    }
  }
}
