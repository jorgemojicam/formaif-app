import { ChangeDetectorRef, Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { Cruces } from 'src/app/model/cruces';
import { Solicitud } from 'src/app/model/solicitud';
import DataSelect from '../../../data-select/dataselect.json';
import { IdbSolicitudService } from '../../admin/idb-solicitud.service';
import Swal from 'sweetalert2'
import { MateriaPrima } from 'src/app/model/materiaprima';
import { Compras } from 'src/app/model/compras';
import { CostoVenta } from 'src/app/model/costoventa';

@Component({
  selector: 'app-urbano',
  templateUrl: './urbano.component.html',
  styleUrls: ['./urbano.component.scss']
})
export class UrbanoComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
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

    this.activeRoute.queryParamMap.subscribe((params) => {
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

      this.actividadesForm.get('act').valueChanges.subscribe(values => {

        const ctrl = <FormArray>this.actividadesForm.controls['act'];
        //---------------------Ventas Historicas--------------------------------------
        ctrl.controls.forEach((x) => {
          let total = 0
          let tipoactividad = x.get("tipo").value
          let frechis = this.formatNumber(x.get("periodohistoricas").value == null ? 0 : x.get("periodohistoricas").value.cant)
          let frechisdias = this.formatNumber(x.get("periodohistoricas").value == null ? 0 : x.get("periodohistoricas").value.dias)
          const ventashistoricas = <FormArray>x.get('ventasHis')
          ventashistoricas.controls.forEach((ven) => {
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
          produccionArr.controls.forEach((prod) => {
            let valor = this.formatNumber(prod.get("valor").value)
            let cantidad = this.formatNumber(prod.get("cantidad").value)
            let frec = this.formatNumber(prod.get("frecuencia").value == null ? 0 : prod.get("frecuencia").value.dias)
            let total = valor * cantidad * frec
            prod.get("total").setValue(total, { emitEvent: false });
            totalprod += total
          })
          x.get("totalProduccion").setValue(totalprod, { emitEvent: false });
          //---------------------------------------------------------------

          //----------------Total Cruce 2----------------------------------
          let totalCruce2 = 0
          if (tipoactividad == 2) {
            if (totalPromedio > totalprod) {
              totalCruce2 = totalprod
            } else {
              totalCruce2 = totalPromedio
            }
          } else {
            totalCruce2 = totalPromedio
          }          
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
          //------------------------------------------------------------------

          //--------------Costo de venta [materia prima]----------------------
          const materiapri = <FormArray>x.get('materiaprima')
          materiapri.controls.forEach((mat) => {
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
          compras.controls.forEach((com) => {
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

          //-----------------------Cruce 1 ventas B R M -------------------  
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
          let cantR = x.get('diasR').value.length
          let cantM = x.get('diasM').value.length
          let valorB = this.formatNumber(x.get('valorB').value)
          let valorR = this.formatNumber(x.get('valorR').value)
          let valorM = this.formatNumber(x.get('valorM').value)

          let totalB = cantB * valorB * cantperiodo
          let totalR = cantR * valorR * cantperiodo
          let totalM = cantM * valorM * cantperiodo

          let totaldias = this.formatNumber(x.get('totalDias').value)

          let promedio = (valorB + valorR + valorM) / valorpromedio
          let totalpromedio = promedio * totaldias
          let totalbrm = totalB + totalR + totalM


          if (valorR > valorB) {
            valorR = 0
            this._snackBar.open("Ventas regulares no puede ser mayor a Ventas buenas", "Ok!", {
              duration: 9000,
            });
          }
          if (valorM > valorR) {
            valorM = 0
            this._snackBar.open("Ventas malas no puede ser mayor a Ventas regulares", "Ok!", {
              duration: 9000,
            });
          }
          let totalCruce1 = 0
          if (totalpromedio > totalbrm) {
            totalCruce1 = totalbrm
          } else {
            totalCruce1 = totalpromedio
          }

          x.patchValue({
            valorB: isFinite(valorB) ? valorB.toLocaleString() : 0,
            valorR: isFinite(valorR) ? valorR.toLocaleString() : 0,
            valorM: isFinite(valorM) ? valorM.toLocaleString() : 0,
            totalB: isFinite(totalB) ? totalB.toLocaleString() : 0,
            totalR: isFinite(totalR) ? totalR.toLocaleString() : 0,
            totalM: isFinite(totalM) ? totalM.toLocaleString() : 0,
            promedio: isFinite(promedio) ? promedio.toLocaleString() : 0,
            totalVentas: isFinite(totalbrm) ? totalbrm.toLocaleString() : 0,
            totalPromedio: isFinite(totalpromedio) ? totalpromedio.toLocaleString() : 0,
            totalCruce1: isFinite(totalCruce1) ? totalCruce1.toLocaleString() : 0,
            totalCruce2: isFinite(totalCruce2) ? totalCruce2.toLocaleString() : 0,
          }, { emitEvent: false })
        });

        this.dataCruces = this.actividadesForm.get('act').value
        this.datasolicitud.Cruces = this.dataCruces
        this.srvSol.saveSol(this.sol, this.datasolicitud)
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
      totalVentas: '',
      totalDias: '',
      totalPromedio: '',
      totalCruce1: '',
      ventasHis: this.fb.array([this.itemventas()]),
      totalVentasHis: '',
      promtotalvenHis: '',
      totalCruce2: '',
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
      let periodhis = []
      if (cruces[cru].periodohistoricas)
        periodhis = this.frecuencia.find(el => el.id == cruces[cru].periodohistoricas.id)
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
          promedio: [cruces[cru].promedio],
          totalVentas: [cruces[cru].totalVentas],
          totalCruce1: [cruces[cru].totalCruce1],
          totalDias: [cruces[cru].totalDias],
          periodohistoricas: [periodhis],
          ventasHis: this.loadDataVentas(cruces[cru].ventasHis),
          promtotalvenHis: [cruces[cru].promtotalvenHis],
          totalPromedio: [cruces[cru].totalPromedio],
          totalVentasHis: [cruces[cru].totalVentasHis],
          produccion: this.loadProd(cruces[cru].produccion),
          totalProduccion: cruces[cru].totalProduccion,
          totalCruce2: cruces[cru].totalCruce2,
          compras: this.loadCompras(cruces[cru].compras),
          totalCompras: cruces[cru].totalCompras,
          costoventa: this.loadCostoVenta(cruces[cru].costoventa),
          materiaprima: this.loadMateriaPrima(cruces[cru].materiaprima),
          margen: cruces[cru].margen,
          costo: cruces[cru].costo,
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
  loadDataVentas(ventas: any) {
    let ventasArr = this.fb.array([])
    ventas.forEach(ven => {
      ventasArr.push(
        this.fb.group({
          valor: ven.valor,
          dia: ven.dia
        }))
    });
    return ventasArr
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
      let fre = []
      if (pro.frecuencia)
        fre = this.frecuencia.find(el => el.id == pro.frecuencia.id)
      produArr.push(
        this.fb.group({
          nombre: pro.nombre,
          cantidad: pro.cantidad,
          valor: pro.valor,
          frecuencia: fre,
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
  loadCompras(compras: Compras[]) {
    let comprasArr = this.fb.array([])
    compras.forEach(com => {
      let fre = []
      if (com.frecuencia)
        fre = this.frecuencia.find(el => el.id == com.frecuencia.id)
      comprasArr.push(
        this.fb.group({
          descripcion: com.descripcion,
          cantidad: com.cantidad,
          valor: com.valor,
          frecuencia: fre,
          total: com.total
        }))
    });
    return comprasArr
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
  loadCostoVenta(csotoventa: CostoVenta[]) {
    let costoventaArr = this.fb.array([])
    csotoventa.forEach(cos => {
      costoventaArr.push(
        this.fb.group({
          nombre: cos.nombre,
          participacion: cos.participacion,
          precioCompra: cos.precioCompra,
          precioVenta: cos.precioVenta,
          porcentaje: cos.porcentaje
        }))
    });
    return costoventaArr
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

  loadMateriaPrima(materiaprima: MateriaPrima[]) {
    let materiaprimaArr = this.fb.array([])
    materiaprima.forEach(mat => {
      let fre = this.frecuencia.find(el => el.id == mat.unidad)
      materiaprimaArr.push(
        this.fb.group({
          producto: mat.producto,
          cantidad: mat.cantidad,
          precioVenProd: mat.precioVenProd,
          materiaprimapri: mat.materiaprimapri,
          cantMatPri: mat.cantMatPri,
          unidad: mat.unidad,
          valorMatPri: mat.valorMatPri,
          matPrima2: mat.matPrima2,
          valorMatPri2: mat.valorMatPri2,
          matPrima3: mat.matPrima3,
          valorMatPri3: mat.valorMatPri3,
          matPrima4: mat.matPrima4,
          valorMatPri4: mat.valorMatPri4,
          matPrima5: mat.matPrima5,
          valorMatPri5: mat.valorMatPri5,
          ManoObra: mat.ManoObra,
          valorMao: mat.valorMao,
          cif: mat.cif,
          valorCif: mat.valorCif,
          precioCompra: mat.precioCompra,
          precioVenta: mat.precioVenta,
          participacion: mat.participacion,
          porcentaje: mat.porcentaje,
        }))
    });
    return materiaprimaArr
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
