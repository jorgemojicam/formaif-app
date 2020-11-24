
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import DataSelect from '../../data-select/dataselect.json';

@Component({
  selector: 'app-cruces',
  templateUrl: './cruces.component.html',
  styleUrls: ['./cruces.component.scss']
})
export class CrucesComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private _snackBar: MatSnackBar
  ) { }

  actividadesForm: FormGroup
  ventasHisForm: FormGroup
  comprasForm: FormGroup
  produccionForm: FormGroup
  selected = new FormControl(0);
  frecuencia: any = DataSelect.Frecuencia;
  tipoAct: any = DataSelect.TipoActividadUrban;
  diasSema: any = [];

  selecteditemB =[]
  selecteditemR=[]
  selecteditemM = []

  ngOnInit(): void {
    this.actividadesForm = this.fb.group({
      act: this.fb.array([this.itemactividad()])
    })   

    this.actividadesForm.get('act').valueChanges.subscribe(values => {

      console.log(values)
      const ctrl = <FormArray>this.actividadesForm.controls['act'];

      ctrl.controls.forEach((x, index) => {
        let periodoventas = x.get('periodoventas').value

        if (periodoventas == 1) {
          this.diasSema = DataSelect.DiasSemana;
        } else if (periodoventas == 2) {
          this.diasSema = DataSelect.Semanas;
        } else if (periodoventas == 3) {
          this.diasSema = DataSelect.Quince;
        }
        this.ref.detectChanges()
      });

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
      totalR:'',
      totalM:'',
      ventasHis: this.fb.array([this.itemventas()]),
      produccion: this.fb.array([this.itemProd()]),
      compras: this.fb.array([this.itemCompras()]),
      costoventa: this.fb.array([this.itemCostoventa()]),
      materiaprima : this.fb.array([this.itemMateriaprima()]),
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
  costoventa(ti){
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
      totalParticipacion:''
    })
  }
  //------------------------------------------------------------------

  //----------------materia prima -------------------------------

  materiaprima(ti){
    return this.actividades().at(ti).get("materiaprima") as FormArray
  }
  itemMateriaprima() {
    return this.fb.group({
      nombre: '',

    })
  }
}
