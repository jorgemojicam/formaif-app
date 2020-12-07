
import { ChangeDetectorRef, Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { Cruces } from 'src/app/model/cruces';
import { Solicitud } from 'src/app/model/solicitud';
import DataSelect from '../../../data-select/dataselect.json';
import { IdbSolicitudService } from '../../admin/idb-solicitud.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-urbano',
  templateUrl: './urbano.component.html',
  styleUrls: ['./urbano.component.scss']
})
export class UrbanoComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    public srvSol: IdbSolicitudService,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  @Input() loadData: boolean = false
  @Output() isLoad = new EventEmitter

  tipoAsesor: number;
  fullActiviti: boolean = false
  actividadesForm: FormGroup = this.fb.group({
    act: this.fb.array([this.itemactividad()])
  })

  ventasHisForm: FormGroup
  comprasForm: FormGroup
  produccionForm: FormGroup
  selected = new FormControl(0);

  //Listas desplegables
  frecuencia: any = DataSelect.Frecuencia;
  tipoAct: any = DataSelect.TipoActividadUrban;
  unidades: any = DataSelect.Unidades;

  diasSema: any = [];
  sol: string;
  datasolicitud: Solicitud = new Solicitud()
  dataCruces: [] = []

  diasSemana = DataSelect.DiasSemana;
  quincena = DataSelect.Quince;
  semanas = DataSelect.Semanas;

  ngOnInit(): void {

    this.activeRoute.queryParamMap
      .subscribe((params) => {
        this.sol = params.get('solicitud')
      });

    this.srvSol.getSol(this.sol).subscribe((datasol) => {

      this.datasolicitud = datasol as Solicitud
      this.tipoAsesor = this.datasolicitud.asesor
      if (this.datasolicitud.Cruces) {
        this.loadactividad(this.datasolicitud.Cruces)
      }
      this.loadData = true
      this.isLoad.emit(true)
      this.actividadesForm.valueChanges.subscribe(values => {
        this.dataCruces = values.act
        this.datasolicitud.Cruces = this.dataCruces
        this.srvSol.saveSol(this.sol, this.datasolicitud)
      })

      this.actividadesForm.get('act').valueChanges.subscribe(values => {

        const ctrl = <FormArray>this.actividadesForm.controls['act'];
        //---------------------Ventas Historicas--------------------------------------
        ctrl.controls.forEach((x, index) => {
          let total = 0
          let frechis = this.formatNumber(x.get("periodohistoricas").value == null ? 0 : x.get("periodohistoricas").value.cant)
          let frechisdias = this.formatNumber(x.get("periodohistoricas").value == null ? 0 : x.get("periodohistoricas").value.dias)
          const ventashistoricas = <FormArray>x.get('ventasHis')
          ventashistoricas.controls.forEach((ven, idxven) => {
            let valor = this.formatNumber(ven.get("valor").value)
            total += valor
            ven.patchValue({
              valor: isFinite(valor) ? valor.toLocaleString() : 0
            }, { emitEvent: false })
          })
          let promedioven = total / frechis
          let totalPromedio = promedioven * frechisdias
          x.patchValue({
            promtotalvenHis: isFinite(totalPromedio) ? totalPromedio.toLocaleString() : 0,
            totalVentasHis: isFinite(promedioven) ? promedioven.toLocaleString() : 0
          }, { emitEvent: false })

          //--------------------Produccion --------------------------------------------
          let totalprod = 0
          const produccionArr = <FormArray>x.get('produccion')
          produccionArr.controls.forEach((prod, idxprod) => {
            let valor = this.formatNumber(prod.get("valor").value)
            let cantidad = this.formatNumber(prod.get("cantidad").value)
            let frec = this.formatNumber(prod.get("frecuencia").value == null ? 0 : prod.get("frecuencia").value.dias)
            let total = valor * cantidad * frec
            prod.get("total").setValue(total, { emitEvent: false });
            totalprod += total
          })
          x.get("totalProduccion").setValue(totalprod, { emitEvent: false });
          //---------------------------------------------------------------

          let margen = 0
          let totalparticipacion = 0
          //------------------Costo de venta------------------------------
          const costoventa = <FormArray>x.get('costoventa')
          costoventa.controls.forEach((cos, idxmat) => {
            let preciocompra = this.formatNumber(cos.get("precioCompra").value)
            let precioventa = this.formatNumber(cos.get("precioVenta").value)
            let porcentaje = ((1 - (preciocompra / precioventa)) * 100)
            var participacion = this.formatNumber(cos.get("participacion").value)
            let margenglobal = (participacion / 100) * porcentaje
            totalparticipacion += participacion
            margen += margenglobal
            cos.patchValue({
              porcentaje: isFinite(porcentaje) ? porcentaje.toFixed() : 0
            }, { emitEvent: false })
          })
          //-----------------------------------------------------------------

          //--------------Costo de venta [materia prima]----------------------
          const materiapri = <FormArray>x.get('materiaprima')
          materiapri.controls.forEach((mat, idxmat) => {
            let cantidad = this.formatNumber(mat.get("cantidad").value)
            let preciovenorod = this.formatNumber(mat.get("precioVenProd").value)
            let valormatpri = this.formatNumber(mat.get("valorMatPri").value)
            let valormatpri2 = this.formatNumber(mat.get("valorMatPri2").value)
            let valormatpri3 = this.formatNumber(mat.get("valorMatPri3").value)
            let valormatpri4 = this.formatNumber(mat.get("valorMatPri4").value)
            let valormatpri5 = this.formatNumber(mat.get("valorMatPri5").value)
            let valormao = this.formatNumber(mat.get("valorMao").value)
            let valorcif = this.formatNumber(mat.get("valorCif").value)
            var participacion = this.formatNumber(mat.get("participacion").value)
            totalparticipacion += participacion
            if (totalparticipacion > 100) {
              participacion = 0
              this._snackBar.open("No puede superar el 100% en el total de participacion", "Ok!", {
                duration: 3000,
              });
            }
            let preciocompra = valormatpri + valormatpri2 + valormatpri3 + valormatpri4 + valormatpri5 + valormao + valorcif
            let precioventa = cantidad * preciovenorod
            let porcentaje = ((1 - (preciocompra / precioventa)) * 100)
            let margenglobal = (participacion / 100) * porcentaje
            margen += margenglobal
            mat.patchValue({
              precioVenProd: preciovenorod.toLocaleString("es-CO"),
              valorMatPri: valormatpri.toLocaleString("es-CO"),
              valorMatPri2: valormatpri2.toLocaleString("es-CO"),
              valorMatPri3: valormatpri3.toLocaleString("es-CO"),
              valorMatPri4: valormatpri4.toLocaleString("es-CO"),
              valorMatPri5: valormatpri5.toLocaleString("es-CO"),
              valorMao: valormao.toLocaleString("es-CO"),
              valorCif: valorcif.toLocaleString("es-CO"),
              precioCompra: preciocompra.toLocaleString("es-CO"),
              precioVenta: precioventa.toLocaleString("es-CO"),
              porcentaje: isNaN(porcentaje) ? 0 : porcentaje.toFixed(),
              participacion: participacion
            }, { emitEvent: false })

          })
          //Aplica para costo de venta y el calculo que se hace con  costo de venta [Materia Prima]
          let costo = 100 - margen
          x.patchValue({
            costo: isNaN(costo) ? 0 : costo.toFixed(),
            margen: isNaN(margen) ? 0 : margen.toFixed()
          }, { emitEvent: false })

          let unidadrend = materiapri.controls[0].get("unidad").value.name
          let materiaprimarend = materiapri.controls[0].get("materiaprimapri").value

          x.patchValue({
            rendUnidad: unidadrend,
            rendMateriaprima: materiaprimarend
          }, { emitEvent: false })

          //--------------------Compras-----------------------------------
          let totalcomporas = 0
          const compras = <FormArray>x.get('compras')
          compras.controls.forEach((com, idxcom) => {
            let cantidad = this.formatNumber(com.get("cantidad").value)
            let valor = this.formatNumber(com.get("valor").value)
            let frec = this.formatNumber(com.get("frecuencia").value == null ? 0 : com.get("frecuencia").value.dias)
            let total = cantidad * valor * frec
            totalcomporas += total
            com.patchValue({
              valor: valor.toLocaleString(),
              total: isFinite(total) ? total.toLocaleString() : 0,
            }, { emitEvent: false })
          })
          x.patchValue({
            totalCompras: isFinite(totalcomporas) ? totalcomporas.toLocaleString() : 0
          }, { emitEvent: false })
          //---------------------------------------------------------------

          let cantperiodo = 0
          let valorpromedio = 0
          let periodoventas = x.get('periodoventas').value
          if (periodoventas == 1) {
            cantperiodo = 4
            valorpromedio = 3
          } else if (periodoventas == 2) {
            cantperiodo = 1
            valorpromedio = 3
          } else if (periodoventas == 3) {
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

          let promedio = (totalB + totalR + totalM) * valorpromedio

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
      totalVentasHis: '',
      promtotalvenHis: '',
      produccion: this.fb.array([this.itemProd()]),
      totalProduccion: '',
      compras: this.fb.array([this.itemCompras()]),
      costoventa: this.fb.array([this.itemCostoventa()]),
      materiaprima: this.fb.array([this.itemMateriaprima()]),
      margen: '',
      costo: '',
      rendUnidad: '',
      rendCantidad: '',
      rendMateriaprima: '',
      rendFrecuencia: '',
      rendValorU: '',
      rendValorT: '',
      rendTotal: ''
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
          promtotalvenHis: '',
          totalVentasHis: '',
          produccion: this.loadProd(cruces[cru].produccion),
          totalProduccion: '',
          compras: this.fb.array([this.itemCompras()]),
          totalCompras: '',
          costoventa: this.fb.array([this.itemCostoventa()]),
          materiaprima: this.fb.array([this.itemMateriaprima()]),
          margen: '',
          costo: '',
          rendUnidad: '',
          rendCantidad: '',
          rendMateriaprima: '',
          rendFrecuencia: '',
          rendValorU: '',
          rendValorT: '',
          rendTotal: '',

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
  deleteAct(act: number) {

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
      valor: ['', Validators.required]
    })
  }
  loadVentas(ac: number, event) {
    this.ventashistoricas(ac).clear();
    for (let i = 0; i < event.value.cant; i++) {
      this.addVentashis(ac);
    }
  }
  //--------------------------------------------------------------------

  //---------------------Produccion-------- -----------------
  produccion(ti): FormArray {
    return this.actividades().at(ti).get("produccion") as FormArray
  }
  addProduccion(ti) {
    this.produccion(ti).push(this.itemProd());
  }
  loadProd(produccion: any) {
    let produArr = this.fb.array([])
    produccion.forEach(pro => {
      produArr.push(
        this.fb.group({
          nombre: pro.nombre,
          cantidad: pro.cantidad,
          valor: pro.valor,
          frecuencia: pro.frecuencia,
          total: pro.total
        }))
    });
    return produArr
  }
  itemProd() {
    return this.fb.group({
      nombre: '',
      cantidad: '',
      valor: '',
      frecuencia: '',
      total: ''
    })
  }
  removeProduccion(act: number, venta: number) {
    this.produccion(act).removeAt(venta);
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
      valor: '',
      total: ''
    })
  }
  removeCompras(act: number, compra: number) {
    this.compras(act).removeAt(compra);
  }
  //-----------------------------------------------------------------

  //--------------------------Costo de venta-----------------------
  costoventa(ti) {
    return this.actividades().at(ti).get("costoventa") as FormArray
  }
  addCostoventa(ti) {
    this.costoventa(ti).push(this.itemCostoventa());
  }
  deleteCostoventaRow(actividad: number, index: number) {
    this.costoventa(actividad).removeAt(index);
  }
  itemCostoventa() {
    return this.fb.group({
      nombre: '',
      participacion: '',
      precioCompra: '',
      precioVenta: '',
      porcentaje: ''
    })
  }
  //------------------------------------------------------------------

  //----------------materia prima -------------------------------

  materiaprima(ti) {
    return this.actividades().at(ti).get("materiaprima") as FormArray
  }
  addMateriaprima(ti) {
    this.materiaprima(ti).push(this.itemMateriaprima());
  }
  itemMateriaprima() {
    return this.fb.group({
      producto: '',
      cantidad: '',
      precioVenProd: '',
      materiaprimapri: '',
      cantMatPri: '',
      unidad: '',
      valorMatPri: '',
      matPrima2: '',
      valorMatPri2: '',
      matPrima3: '',
      valorMatPri3: '',
      matPrima4: '',
      valorMatPri4: '',
      matPrima5: '',
      valorMatPri5: '',
      ManoObra: '',
      valorMao: '',
      cif: '',
      valorCif: '',
      precioCompra: '',
      precioVenta: '',
      participacion: '',
      porcentaje: ''
    })
  }
  deleteMarteriaRow(actividad: number, index: number) {
    this.materiaprima(actividad).removeAt(index);
  }
  //--------------------------------------------------------------

  formatNumber(num: string) {
    if (typeof (num) == "number") {
      return parseInt(num)
    } else {
      return parseInt(num == "" || num == null ? "0" : num.replace(/[\D\s\._\-]+/g, ""))
    }
  }

}
