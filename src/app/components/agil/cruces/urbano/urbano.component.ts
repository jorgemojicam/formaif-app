import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Cruces } from 'src/app/model/agil/cruces';
import { Solicitud } from 'src/app/model/agil/solicitud';
import DataSelect from '../../../../data-select/dataselect.json';
import { IdbSolicitudService } from '../../../../services/idb-solicitud.service';
import Swal from 'sweetalert2'
import { MateriaPrima } from 'src/app/model/agil/materiaprima';
import { Compras } from 'src/app/model/agil/compras';
import { CostoVenta } from 'src/app/model/agil/costoventa';
import Utils from '../../../../utils';
import { EncryptService } from 'src/app/services/encrypt.service';

@Component({
  selector: 'app-urbano',
  templateUrl: './urbano.component.html',
  styleUrls: ['./urbano.component.scss']
})
export class UrbanoComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    public _srvSol: IdbSolicitudService,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
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
  tipoAnual = {
    id: 5,
    name: "Anual",
    dias: 11,
    cant: 12
  }

  diasSema: any = [];
  ced: string;
  datasolicitud: Solicitud = new Solicitud()
  dataCruces: [] = []

  diasSemana = DataSelect.DiasSemana;
  quincena = DataSelect.Quince;
  semanas = DataSelect.Semanas;

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

    this.activeRoute.queryParamMap.subscribe((params) => {
      this.ced = params.get('cedula')
    });

    this.datasolicitud = await this.getSol() as Solicitud
    this.tipoAsesor = this.datasolicitud.asesor

    if (this.datasolicitud.Cruces) {
      this.loadactividad(this.datasolicitud.Cruces)
    }
    this.loadData = true;
    this.isLoad.emit(true);
    this.actividadesForm.get('act').valueChanges.subscribe(values => {

      const ctrl = <FormArray>this.actividadesForm.controls['act'];
      ctrl.controls.forEach((x) => {

        //-----------------------Cruce 1 ventas B R M -------------------  
        let cantperiodo = 0
        let valorpromedio = 0
        let periodoventas = x.get('periodoventas').value

        let cantB = x.get('diasB').value.length
        let cantR = x.get('diasR').value.length
        let cantM = x.get('diasM').value.length
        let valorB = Utils.formatNumber(x.get('valorB').value)
        let valorR = Utils.formatNumber(x.get('valorR').value)
        let valorM = Utils.formatNumber(x.get('valorM').value)
        let totaldias = Utils.formatNumber(x.get('totalDias').value)

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
        let cantDias = cantB + cantM + cantR
        totaldias = cantDias * cantperiodo

        if (totaldias > 26) {
          totaldias = 26
        }

        let totalB = cantB * valorB * cantperiodo
        let totalR = cantR * valorR * cantperiodo
        let totalM = cantM * valorM * cantperiodo

        let promedio = (valorB + valorR + valorM) / valorpromedio
        let totalpromedio = promedio * totaldias
        let totalbrm = totalB + totalR + totalM

        if (periodoventas == 3) {
          if (valorM > valorB) {
            valorR = 0
            this._snackBar.open("Ventas malas no puede ser mayor a ventas buenas", "Ok!", {
              duration: 3000,
            });
          }
        } else {
          if (valorR > valorB) {
            valorR = 0
            this._snackBar.open("Ventas regulares no puede ser mayor a Ventas buenas", "Ok!", {
              duration: 3000,
            });
          }
          if (valorM > valorR) {
            valorM = 0
            this._snackBar.open("Ventas malas no puede ser mayor a Ventas regulares", "Ok!", {
              duration: 3000,
            });
          }
        }
        let totalCruce1 = 0
        if (totalpromedio > totalbrm) {
          totalCruce1 = totalbrm
        } else {
          totalCruce1 = totalpromedio
        }
        //---------------------------------------------------------------------------

        //---------------------Ventas Historicas--------------------------------------
        let total = 0
        let tipoactividad = x.get("tipo").value
        let frechis = 0
        let frechisdias = Utils.formatNumber(x.get("periodohistoricas").value == null ? 0 : x.get("periodohistoricas").value.dias)

        const ventashistoricas = <FormArray>x.get('ventasHis')
        ventashistoricas.controls.forEach((ven) => {
          let valor = Utils.formatNumber(ven.get("valor").value)
          total += valor
          frechis++
          ven.patchValue({
            valor: isFinite(valor) ? valor.toLocaleString() : 0
          }, { emitEvent: false })
        })
        let promedioven = total / frechis
        let totalPromedio = promedioven * frechisdias
        x.patchValue({
          promtotalvenHis: isFinite(totalPromedio) ? totalPromedio.toFixed() : 0,
          totalVentasHis: isFinite(promedioven) ? promedioven.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 0
        }, { emitEvent: false })

        //--------------------Produccion --------------------------------------------
        let totalprod = 0
        const produccionArr = <FormArray>x.get('produccion')
        produccionArr.controls.forEach((prod) => {
          let valor = Utils.formatNumber(prod.get("valor").value)
          let cantidad = Utils.formatNumber(prod.get("cantidad").value)
          let frec = Utils.formatNumber(prod.get("frecuencia").value == null ? 0 : prod.get("frecuencia").value.dias)
          let total = valor * cantidad * frec
          prod.patchValue({
            valor: isFinite(valor) ? valor.toLocaleString() : 0,
            total: isFinite(total) ? total.toLocaleString() : 0,
          }, { emitEvent: false })
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
        let costo = 0
        let totalparticipacion = 0
        //------------------Costo de venta------------------------------
        const costoventa = <FormArray>x.get('costoventa')
        costoventa.controls.forEach((cos) => {
          let preciocompra = Utils.formatNumber(cos.get("precioCompra").value)
          let precioventa = Utils.formatNumber(cos.get("precioVenta").value)
          let porcentaje = ((1 - (preciocompra / precioventa)) * 100)
          var participacion = Utils.formatNumber(cos.get("participacion").value)

          let margenglobal = (participacion / 100) * porcentaje
          totalparticipacion += participacion
          if (totalparticipacion > 100) {
            participacion = 0;
            this._snackBar.open("No puede superar el 100% en el total de participacion", "Ok!", {
              duration: 6000,
            });
          }
          margen += margenglobal

          cos.patchValue({
            participacion: isFinite(participacion) ? participacion.toLocaleString() : 0,
            precioVenta: isFinite(precioventa) ? precioventa.toLocaleString() : 0,
            precioCompra: isFinite(preciocompra) ? preciocompra.toLocaleString() : 0,
            porcentaje: isFinite(porcentaje) ? porcentaje.toFixed() : 0
          }, { emitEvent: false })
        })
        //------------------------------------------------------------------

        //--------------Costo de venta [materia prima] ----------------------
        let totalcomporas = 0
        if (tipoactividad == 2) {
          margen = 0
          totalcomporas = 0
          const materiapri = <FormArray>x.get('materiaprima')
          materiapri.controls.forEach((mat) => {
            let cantidad = Utils.formatNumber(mat.get("cantidad").value)
            let preciovenorod = Utils.formatNumber(mat.get("precioVenProd").value)
            let valormatpri = Utils.formatNumber(mat.get("valorMatPri").value)
            let valormatpri2 = Utils.formatNumber(mat.get("valorMatPri2").value)
            let valormatpri3 = Utils.formatNumber(mat.get("valorMatPri3").value)
            let valormatpri4 = Utils.formatNumber(mat.get("valorMatPri4").value)
            let valormatpri5 = Utils.formatNumber(mat.get("valorMatPri5").value)
            let valormao = Utils.formatNumber(mat.get("valorMao").value)
            let valorcif = Utils.formatNumber(mat.get("valorCif").value)
            var participacion = Utils.formatNumber(mat.get("participacion").value)
            totalparticipacion += participacion
            if (totalparticipacion > 100) {
              participacion = 0
              this._snackBar.open("No puede superar el 100% en el total de participacion", "Ok!", {
                duration: 3000,
              });
            }
            let precioventa = cantidad * preciovenorod
            let preciocompra = 0

            preciocompra += valormatpri
            if (preciocompra > precioventa) {
              preciocompra -= valormatpri
              valormatpri = 0

              this._snackBar.open("El precio de compra no puede superar el precio de venta", "Ok!", {
                duration: 9000,
              });
            }
            preciocompra += valormatpri2
            if (preciocompra > precioventa) {
              preciocompra -= valormatpri2
              valormatpri2 = 0

              this._snackBar.open("El precio de compra no puede superar el precio de venta", "Ok!", {
                duration: 9000,
              });
            }
            preciocompra += valormatpri3
            if (preciocompra > precioventa) {
              preciocompra -= valormatpri3
              valormatpri3 = 0
              this._snackBar.open("El precio de compra no puede superar el precio de venta", "Ok!", {
                duration: 9000,
              });
            }
            preciocompra += valormatpri4
            if (preciocompra > precioventa) {
              preciocompra -= valormatpri4
              valormatpri4 = 0
              this._snackBar.open("El precio de compra no puede superar el precio de venta", "Ok!", {
                duration: 9000,
              });
            }
            preciocompra += valormatpri5
            if (preciocompra > precioventa) {
              preciocompra -= valormatpri5
              valormatpri5 = 0
              this._snackBar.open("El precio de compra no puede superar el precio de venta", "Ok!", {
                duration: 9000,
              });
            }
            preciocompra += valormao
            if (preciocompra > precioventa) {
              preciocompra -= valormao
              valormao = 0
              this._snackBar.open("El precio de compra no puede superar el precio de venta", "Ok!", {
                duration: 9000,
              });
            }
            preciocompra += valorcif
            if (preciocompra > precioventa) {
              preciocompra -= valorcif
              valorcif = 0
              this._snackBar.open("El precio de compra no puede superar el precio de venta", "Ok!", {
                duration: 9000,
              });
            }

            let porcentaje = ((1 - (preciocompra / precioventa)) * 100)
            let margenglobal = (participacion / 100) * porcentaje
            margen += margenglobal

            mat.patchValue({
              precioVenProd: preciovenorod.toLocaleString("es-CO"),
              valorMatPri: valormatpri.toLocaleString("es-CO"),
              valorMatPri2: valormatpri2.toLocaleString("es-CO"),
              valorMatPri3: valormatpri3.toLocaleString("es-CO"),
              valorMatPri4: valormatpri4.toLocaleString("es-CO"),
              valorMatPri5: isNaN(valormatpri5) ? 0 : valormatpri5.toLocaleString("es-CO"),
              valorMao: isNaN(valormao) ? 0 : valormao.toLocaleString("es-CO"),
              valorCif: isNaN(valorcif) ? 0 : valorcif.toLocaleString("es-CO"),
              precioCompra: preciocompra.toLocaleString("es-CO"),
              precioVenta: precioventa.toLocaleString("es-CO"),
              porcentaje: isNaN(porcentaje) ? 0 : porcentaje.toFixed(),
              participacion: participacion
            }, { emitEvent: false })

          })

          let unidadrend = materiapri.controls[0].get("unidad").value ? materiapri.controls[0].get("unidad").value.name : ""
          let materiaprimarend = materiapri.controls[0].get("materiaprimapri").value
          let cantidad = materiapri.controls[0].get("cantMatPri").value
          let cantpro = materiapri.controls[0].get("cantidad").value
          let precioVenProd = Utils.formatNumber(materiapri.controls[0].get("precioVenProd").value)

          const rendCantidad = Utils.formatNumber(x.get('rendCantidad').value)
          const rendFrecuencia = (x.get('rendFrecuencia').value ? x.get('rendFrecuencia').value.dias : 0)
          const rendValorU = Utils.formatNumber(x.get('rendValorU').value)

          let rendValorT = rendValorU * rendFrecuencia * rendCantidad
          let rendTotal = (rendCantidad * rendFrecuencia * cantpro) / cantidad

          totalcomporas += rendValorT

          x.patchValue({
            rendUnidad: unidadrend,
            rendMateriaprima: materiaprimarend,
            rendValorT: rendValorT.toLocaleString(),
            rendTotal: isNaN(rendTotal) ? 0 : rendTotal.toLocaleString(),
          }, { emitEvent: false })

          let totalcruce = rendTotal * precioVenProd
          x.patchValue({
            totalCruce3: isFinite(totalcruce) ? totalcruce.toFixed() : 0
          }, { emitEvent: false })


        }
        //Costo de venta cuando la actividad es servicios
        if (tipoactividad == 3) {
          costo = Utils.formatNumber(x.get('costo').value)
          if (costo > 100) {
            costo = 0
            this._snackBar.open("El porcentaje de costo de venta no puede superar el 100", "Ok!", {
              duration: 9000,
            });
          }
        } else if (tipoactividad == 4) {
          costo = Utils.formatNumber(x.get('costo').value)
          if (costo > 100) {
            costo = 0
            this._snackBar.open("El porcentaje de costo de venta no puede superar el 100", "Ok!", {
              duration: 9000,
            });
          }
        } else {
          //Aplica para costo de venta y el calculo que se hace con  costo de venta [Materia Prima]
          costo = 100 - margen
        }
        //--------------------Compras---------------------------------------
        const compras = <FormArray>x.get('compras')
        compras.controls.forEach((com) => {
          let cantidad = Utils.formatNumber(com.get("cantidad").value)
          let valor = Utils.formatNumber(com.get("valor").value)

          let idFrec = com.get("frecuencia").value == null ? 0 : com.get("frecuencia").value.id
          let frec = Utils.formatNumber(com.get("frecuencia").value == null ? 0 : com.get("frecuencia").value.dias)
          let cantAnua = Utils.formatNumber(com.get("frecuencia").value == null ? 0 : com.get("frecuencia").value.cant)
          let total = 0

          //Condicion solo aplica para anual en servicios
          if (idFrec == 5) {
            total = (cantidad * valor * frec) / cantAnua
          } else {
            total = cantidad * valor * frec
          }
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

        //--------------Total cruce3-------------------------------------

        let promreal: number = 0;
        if (tipoactividad == 1) {
          promreal = (100 - margen) / 100
          let totalcruce = totalcomporas / promreal
          x.patchValue({
            totalCruce3: isFinite(totalcruce) ? totalcruce.toFixed() : 0
          }, { emitEvent: false })
        } else if (tipoactividad == 3 || tipoactividad == 4) {
          x.patchValue({
            totalCruce3: isFinite(totalcomporas) ? totalcomporas.toFixed() : 0
          }, { emitEvent: false })
        }

        x.patchValue({
          valorB: isFinite(valorB) ? valorB.toLocaleString() : 0,
          valorR: isFinite(valorR) ? valorR.toLocaleString() : 0,
          valorM: isFinite(valorM) ? valorM.toLocaleString() : 0,
          totalB: isFinite(totalB) ? totalB.toLocaleString() : 0,
          totalR: isFinite(totalR) ? totalR.toLocaleString() : 0,
          totalM: isFinite(totalM) ? totalM.toLocaleString() : 0,
          totalDias: totaldias,
          promedio: isFinite(promedio) ? promedio.toLocaleString() : 0,
          totalVentas: isFinite(totalbrm) ? totalbrm.toLocaleString() : 0,
          totalPromedio: isFinite(totalpromedio) ? totalpromedio.toLocaleString() : 0,
          totalCruce1: isFinite(totalCruce1) ? totalCruce1.toFixed() : 0,
          totalCruce2: isFinite(totalCruce2) ? totalCruce2.toFixed() : 0,
          costo: isNaN(costo) ? 0 : costo.toFixed(),
          margen: isNaN(margen) ? 0 : margen.toFixed(),
        }, { emitEvent: false })
      });

      this.save(this.actividadesForm.get('act').value)
    })

  }

  save(actividad) {
    this.dataCruces = actividad
    this.datasolicitud.Cruces = this.dataCruces
    this._srvSol.saveSol(this.ced, this.datasolicitud)
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
      rendTotal: '',
      totalCruce3: ''
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
          promedio: [cruces[cru].promedio],
          totalVentas: [cruces[cru].totalVentas],
          totalCruce1: [cruces[cru].totalCruce1],
          totalDias: [cruces[cru].totalDias],
          periodohistoricas: [cruces[cru].periodohistoricas],
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
          rendUnidad: cruces[cru].rendUnidad,
          rendCantidad: cruces[cru].rendCantidad,
          rendMateriaprima: cruces[cru].rendMateriaprima,
          rendFrecuencia: cruces[cru].rendFrecuencia,
          rendValorU: cruces[cru].rendValorU,
          rendValorT: cruces[cru].rendValorT,
          rendTotal: cruces[cru].rendTotal,
          totalCruce3: cruces[cru].totalCruce3,
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
    let periodo = event.value
    let listPeriodo = []
    if (periodo.id == 1) {
      listPeriodo = DataSelect.DiasSemana
    } else if (periodo.id == 2) {
      listPeriodo = DataSelect.Semanas
    } else if (periodo.id == 3) {
      listPeriodo = DataSelect.Quince
    }
    this.ventashistoricas(ac).clear();
    for (let i = 0; i < event.value.cant; i++) {

      let valordia = ""
      if (listPeriodo.length > 0) {
        valordia = listPeriodo[i].name
      } else {
        valordia = (i + 1).toString()
      }

      this.ventashistoricas(ac).push(
        this.fb.group({
          dia: [valordia],
          valor: ['', Validators.required]
        })
      );

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
      comprasArr.push(
        this.fb.group({
          descripcion: com.descripcion,
          cantidad: com.cantidad,
          valor: com.valor,
          frecuencia: com.frecuencia,
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

  changePeriodo(acti) {

    acti.patchValue({
      diasB: [],
      diasR: [],
      diasM: [],
      valorB: 0,
      valorR: 0,
      valorM: 0,
      totalB: 0,
      totalR: 0,
      totalM: 0,
      totalDias: 0,
      promedio: 0,
      totalVentas: 0,
      totalPromedio: 0,
      totalCruce1: 0,
    }, { emitEvent: false })

    this.save(this.actividadesForm.get('act').value)

  }

  onTipoChange(ac) {

    this.actividades().at(ac).get("ventasHis").reset()
    /*
    acti.controls.ventasHis = this.fb.array([this.itemventas()])
    acti.controls.produccion = this.fb.array([this.itemProd()])
    acti.controls.materiaprima = this.fb.array([this.itemMateriaprima()])
    acti.controls.compras = this.fb.array([this.itemCompras()])
    acti.controls.costoventa = this.fb.array([this.itemCostoventa()])
    */
  }

  compareFunction(o1: any, o2: any) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

}
