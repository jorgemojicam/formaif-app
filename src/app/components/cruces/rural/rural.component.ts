import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CrucesAgro } from 'src/app/model/crucesagro';
import { Egresos } from 'src/app/model/egresos';
import { LoteAgro } from 'src/app/model/loteAgro';
import { LotePecuario } from 'src/app/model/lotePecuario';
import { Solicitud } from 'src/app/model/solicitud';
import Utils from 'src/app/utils';
import Swal from 'sweetalert2';
import DataSelect from '../../../data-select/dataselect.json';
import { IdbSolicitudService } from '../../admin/idb-solicitud.service';

@Component({
  selector: 'app-rural',
  templateUrl: './rural.component.html',
  styleUrls: ['./rural.component.scss']
})
export class RuralComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    public srvSol: IdbSolicitudService,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  @Input() loadData: boolean = false
  @Output() isLoad = new EventEmitter
  tipoAsesor: number;

  actividadesForm: FormGroup = this.fb.group({
    act: this.fb.array([this.itemactividad()])
  })
  ventasHisForm: FormGroup
  comprasForm: FormGroup
  produccionForm: FormGroup
  selected = new FormControl(0);
  frecuencia: any = DataSelect.Frecuencia;
  tipoAct: any = DataSelect.TipoActividadUrban;
  tipoActRural: any = DataSelect.TipoActividadRural;
  ActRural: any = DataSelect.ActividadRural;
  edadPeriodo: any = DataSelect.PeriodoEdad;
  unidades: any = DataSelect.Unidades;
  tipoprodPecu: any = DataSelect.TipoProduccion;
  meses: any = DataSelect.Meses;
  detalleagri: any = DataSelect.DetalleAgricola;
  detallepecu: any = DataSelect.DetallePecuario;

  diasSema: any = [];
  sol: string;

  datasolicitud: Solicitud = new Solicitud()
  dataCruces: [] = []

  diasSemana = DataSelect.DiasSemana;
  quincena = DataSelect.Quince;
  semanas = DataSelect.Semanas;

  datosAuto: any[] = [DataSelect.ActividadRural]

  ngOnInit(): void {

    this.activeRoute.queryParamMap.subscribe((params) => {
      this.sol = params.get('solicitud')
    });

    this.srvSol.getSol(this.sol).subscribe((datasol) => {

      this.datasolicitud = datasol as Solicitud
      this.tipoAsesor = this.datasolicitud.asesor

      if (this.datasolicitud.CrucesAgro) {
        this.loadactividad(this.datasolicitud.CrucesAgro)
      }
      this.loadData = true
      this.isLoad.emit(true)

      this.actividadesForm.get('act').valueChanges.subscribe(values => {
        const ctrl = <FormArray>this.actividadesForm.controls['act'];
        ctrl.controls.forEach((x) => {
          //---------------------Otras actividades ---------------------------
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
          let valorB = Utils.formatNumber(x.get('valorB').value)
          let valorR = Utils.formatNumber(x.get('valorR').value)
          let valorM = Utils.formatNumber(x.get('valorM').value)

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

          let cantB = x.get('diasB').value.length
          let cantR = x.get('diasR').value.length
          let cantM = x.get('diasM').value.length

          let totalB = cantB * valorB * cantperiodo
          let totalR = cantR * valorR * cantperiodo
          let totalM = cantM * valorM * cantperiodo
          let totaldias = Utils.formatNumber(x.get('totalDias').value)
          let totaldiassel = (cantB + cantR + cantM) * cantperiodo

          if (totaldias > totaldiassel) {
            totaldias = 0
            this._snackBar.open("Los dias no pueden superar los seleccionados", "Ok!", {
              duration: 3000,
            });
          }

          let promedio = (valorB + valorR + valorM) / valorpromedio
          let totalpromedio = promedio * totaldias
          let totalventas = totalB + totalR + totalM
          let tipoproducto = (x.get('nombre').value !== null ? x.get('nombre').value.tipoproducto : 0)

          let totalCompras = Utils.formatNumber(x.get('totalCompras').value)
          let margenBruto = Utils.formatNumber(x.get('margenBruto').value)
          let otrosGastos = Utils.formatNumber(x.get('otrosGastos').value)

          if (margenBruto > 100) {
            margenBruto = 0
            this._snackBar.open("Margen no puede superar el 100%", "Ok!", {
              duration: 3000,
            });
          }

          let ventasestimadas = 0
          if (totalpromedio > totalventas) {
            ventasestimadas = totalventas
          } else {
            ventasestimadas = totalpromedio
          }
          let totalliquido = (ventasestimadas * margenBruto) - otrosGastos

          let preciomin = Utils.formatNumber(x.get("preciomin").value)
          let precioactual = Utils.formatNumber(x.get("precioactual").value)
          let preciopromedio = (preciomin + precioactual) / 2

          x.patchValue({
            valorB: isFinite(valorB) ? valorB.toLocaleString() : 0,
            valorR: isFinite(valorR) ? valorR.toLocaleString() : 0,
            valorM: isFinite(valorM) ? valorM.toLocaleString() : 0,
            totalB: isFinite(totalB) ? totalB.toLocaleString() : 0,
            totalR: isFinite(totalR) ? totalR.toLocaleString() : 0,
            totalM: isFinite(totalM) ? totalM.toLocaleString() : 0,
            totalDias: totaldias,
            promedio: isFinite(promedio) ? promedio.toLocaleString() : 0,
            totalPromedio: isFinite(totalpromedio) ? totalpromedio.toLocaleString() : 0,
            totalVentas: isFinite(totalventas) ? totalventas.toLocaleString() : 0,
            totalCompras: isFinite(totalCompras) ? totalCompras.toLocaleString() : 0,
            ventasEstimadas: isFinite(ventasestimadas) ? ventasestimadas.toLocaleString() : 0,
            otrosGastos: isFinite(otrosGastos) ? otrosGastos.toLocaleString() : 0,
            ingresoLiquido: isFinite(totalliquido) ? totalliquido.toLocaleString() : 0,
            margenBruto: isFinite(margenBruto) ? margenBruto : 0,
            preciomin: isFinite(preciomin) ? preciomin.toLocaleString() : 0,
            precioactual: isFinite(precioactual) ? precioactual.toLocaleString() : 0,
            preciopromedio: isFinite(preciopromedio) ? preciopromedio.toLocaleString() : 0
          }, { emitEvent: false })
          //---------------------------------------------------------

          //-------------------------Agricola---------------------------------------
          const lotesArr = <FormArray>x.get('lotesAgro')
          lotesArr.controls.forEach((lot) => {
            let unidadestotales = Utils.formatNumber(lot.get("unidadestotales").value)
            let rendiemientolote = Utils.formatNumber(lot.get("rendiemientolote").value)

            if (unidadestotales > rendiemientolote) {
              unidadestotales = 0
              this._snackBar.open("Unidades de venta totales no pueden ser superior al rendimiento por lote", "Ok!", {
                duration: 3000,
              });
            }

            let area = Utils.formatNumber(lot.get("areacult").value)
            let dsurco = Utils.formatNumber(lot.get("dsurcos").value)
            let dpanta = Utils.formatNumber(lot.get("dplantas").value)
            let distancia = area / (dsurco * dpanta)
            let perdida = (1 - (unidadestotales / rendiemientolote)) * 100

            //--------------------------Permanente---------------------------
            let rendimientoCos = Utils.formatNumber(lot.get("rendimientoCos").value)
            let unidadesCos = Utils.formatNumber(lot.get("unidadesCos").value)
            let perdidaCos = (1 - (unidadesCos / rendimientoCos)) * 100
            let totalCos = unidadesCos * preciopromedio
            if (unidadesCos > rendimientoCos) {
              unidadesCos = 0
              this._snackBar.open("Unidades de venta totales no pueden ser superior al rendimiento por lote", "Ok!", {
                duration: 3000,
              });
            }
            let rendimientoTra = Utils.formatNumber(lot.get("rendimientoTra").value)
            let unidadesTra = Utils.formatNumber(lot.get("unidadesTra").value)
            let perdidaTra = (1 - (unidadesTra / rendimientoTra)) * 100
            let totalTra = unidadesTra * preciopromedio
            if (rendimientoTra > rendimientoCos) {
              rendimientoTra = 0
              this._snackBar.open("Rendimiento de traviesa no puede ser mayor al de la cosecha", "Ok!", {
                duration: 3000,
              });
            }
            if (unidadesTra > rendimientoTra) {
              unidadesTra = 0
              this._snackBar.open("Unidades de venta totales no pueden ser superior al rendimiento por lote", "Ok!", {
                duration: 3000,
              });
            }

            let rendimientoPepeo = Utils.formatNumber(lot.get("rendimientoPepeo").value)
            let unidadesPepeo = Utils.formatNumber(lot.get("unidadesPepeo").value)
            let perdidaPepeo = (1 - (unidadesPepeo / rendimientoPepeo)) * 100
            let totalPepeo = unidadesPepeo * preciopromedio
            if (rendimientoPepeo > rendimientoTra) {
              rendimientoPepeo = 0
              this._snackBar.open("Rendimiento de pepeo no puede ser mayor al de la traviesa", "Ok!", {
                duration: 3000,
              });
            }
            if (unidadesPepeo > rendimientoPepeo) {
              unidadesPepeo = 0
              this._snackBar.open("Unidades de venta totales no pueden ser superior al rendimiento por lote", "Ok!", {
                duration: 3000,
              });
            }
            let totalIngreso = unidadestotales * preciopromedio
            let unidadtotal = unidadesCos + unidadesTra + unidadesPepeo
            let procentageCos = (unidadesCos / unidadtotal) * 100
            let procentageTra = (unidadesTra / unidadtotal) * 100
            let procentagePepeo = (unidadesPepeo / unidadtotal) * 100
            let totalanual = totalCos + totalTra + totalPepeo

            //------------------------Egresos ----------------------------------------------------
            let totalEgAdecuacion = 0
            const egresoAdecua = <FormArray>lot.get('egresosAdecuacion')
            egresoAdecua.controls.forEach((lot, idxlot) => {
              let valor = Utils.formatNumber(lot.get("valorunitario").value)
              let cantidad = Utils.formatNumber(lot.get("cantidad").value)
              let total = valor * cantidad
              totalEgAdecuacion += total
              lot.patchValue({
                valorunitario: isFinite(valor) ? valor.toLocaleString() : 0,
                total: isFinite(total) ? total.toLocaleString() : 0
              }, { emitEvent: false })
            })
            let totalEgSiembra = 0
            const egresosSiembra = <FormArray>lot.get('egresosSiembra')
            egresosSiembra.controls.forEach((eg, idxeg) => {
              let valor = Utils.formatNumber(eg.get("valorunitario").value)
              let cantidad = Utils.formatNumber(eg.get("cantidad").value)
              let total = valor * cantidad
              totalEgSiembra += total
              eg.patchValue({
                valorunitario: isFinite(valor) ? valor.toLocaleString() : 0,
                total: isFinite(total) ? total.toLocaleString() : 0
              }, { emitEvent: false })
            })
            let totalEgMante = 0
            const egresosMante = <FormArray>lot.get('egresosMante')
            egresosMante.controls.forEach((eg, idxeg) => {
              let valor = Utils.formatNumber(eg.get("valorunitario").value)
              let cantidad = Utils.formatNumber(eg.get("cantidad").value)
              let total = valor * cantidad
              totalEgMante += total
              eg.patchValue({
                valorunitario: isFinite(valor) ? valor.toLocaleString() : 0,
                total: isFinite(total) ? total.toLocaleString() : 0
              }, { emitEvent: false })
            })
            let totalEgCosecha = 0
            const egresosCocecha = <FormArray>lot.get('egresosCocecha')
            egresosCocecha.controls.forEach((eg, idxeg) => {
              let valor = Utils.formatNumber(eg.get("valorunitario").value)
              let cantidad = Utils.formatNumber(eg.get("cantidad").value)
              let total = valor * cantidad
              totalEgCosecha += total
              eg.patchValue({
                valorunitario: isFinite(valor) ? valor.toLocaleString() : 0,
                total: isFinite(total) ? total.toLocaleString() : 0
              }, { emitEvent: false })
            })
            
            let totalEgresos = 0
            if (tipoproducto == 'Transitorio') {
              totalEgresos = totalEgAdecuacion + totalEgCosecha + totalEgMante + totalEgSiembra
            } else {
              totalEgresos = totalEgMante + totalEgCosecha
            }

            lot.patchValue({
              unidadestotales: isFinite(unidadestotales) ? unidadestotales.toLocaleString('es-CO') : 0,
              rendimientoTra: rendimientoTra,
              rendimientoPepeo: rendimientoPepeo,
              unidadesCos: isFinite(unidadesCos) ? unidadesCos.toLocaleString('es-CO') : 0,
              unidadesTra: isFinite(unidadesTra) ? unidadesTra.toLocaleString('es-CO') : 0,
              unidadesPepeo: isFinite(unidadesPepeo) ? unidadesPepeo.toLocaleString('es-CO') : 0,
              perdida: isFinite(perdida) ? perdida.toLocaleString('es-CO') : 0,
              diastancia: isFinite(distancia) ? distancia.toLocaleString('es-CO') : 0,
              perdidaCos: isFinite(perdidaCos) ? perdidaCos.toLocaleString('es-CO') : 0,
              perdidaTra: isFinite(perdidaTra) ? perdidaTra.toLocaleString('es-CO') : 0,
              perdidaPepeo: isFinite(perdidaPepeo) ? perdidaPepeo.toLocaleString('es-CO') : 0,
              procentageCos: isFinite(procentageCos) ? procentageCos.toFixed(2) : 0,
              procentageTra: isFinite(procentageTra) ? procentageTra.toFixed(2) : 0,
              procentagePepeo: isFinite(procentagePepeo) ? procentagePepeo.toFixed(2) : 0,
              totalCos: isFinite(totalCos) ? totalCos.toLocaleString('es-CO') : 0,
              totalTra: isFinite(totalTra) ? totalTra.toLocaleString('es-CO') : 0,
              totalPepeo: isFinite(totalPepeo) ? totalPepeo.toLocaleString('es-CO') : 0,
              totalUnidades: isFinite(unidadtotal) ? unidadtotal : 0,
              totalLoteAunual: isFinite(totalanual) ? totalanual.toLocaleString('es-CO') : 0,
              totalIngreso: isFinite(totalIngreso) ? totalIngreso.toLocaleString('es-CO') : 0,
              totalEgresosAdecuacion: isFinite(totalEgAdecuacion) ? totalEgAdecuacion.toLocaleString('es-CO') : 0,
              totalEgresosSiembre: isFinite(totalEgSiembra) ? totalEgSiembra.toLocaleString('es-CO') : 0,
              totalEgresosCosecha: isFinite(totalEgCosecha) ? totalEgCosecha.toLocaleString('es-CO') : 0,
              totalEgresosMante: isFinite(totalEgMante) ? totalEgMante.toLocaleString('es-CO') : 0,
              totalEgresos: isFinite(totalEgresos) ? totalEgresos.toLocaleString('es-CO') : 0,
            }, { emitEvent: false })
          });

          //-------------------lote------------------------------------
          //-------------------Pecuario--------------------------------
          const lotesPecuArr = <FormArray>x.get('lotesPecuario')
          lotesPecuArr.controls.forEach((lot) => {
            let totalEg = 0            
            const egresoAdecua = <FormArray>lot.get('egresos')
            egresoAdecua.controls.forEach((egr) => {

              let valor = Utils.formatNumber(egr.get("valorunitario").value)
              let cantidad = Utils.formatNumber(egr.get("cantidad").value)
              let total = valor * cantidad
              totalEg += total
              egr.patchValue({
                valorunitario: isFinite(valor) ? valor.toLocaleString() : 0,
                total: isFinite(total) ? total.toLocaleString() : 0
              }, { emitEvent: false })
            })

            let numanimales = Utils.formatNumber(lot.get("numanimales").value)
            let cantidadxanimal = Utils.formatNumber(lot.get("cantidadxanimal").value)
            let frecuencia = Utils.formatNumber(lot.get("frecuencia").value != null ? lot.get("frecuencia").value.dias : 0)
            let cantidadtotal = numanimales * cantidadxanimal * frecuencia

            let unitotalesventa = Utils.formatNumber(lot.get("unitotalesventa").value)
            if (unitotalesventa > cantidadtotal) {
              unitotalesventa = 0
              this._snackBar.open("Unidades de venta totales no puede ser mayor a la cantidad producida", "Ok!", {
                duration: 3000,
              });

            }
            let perdida = (1 - (unitotalesventa / cantidadtotal)) * 100
            let totalmes = preciopromedio * unitotalesventa

            lot.patchValue({
              preciomin:isFinite(preciomin) ? preciomin.toLocaleString() : 0,
              precioactual:isFinite(precioactual) ? precioactual.toLocaleString() : 0,
              cantproducida: isFinite(cantidadtotal) ? cantidadtotal.toLocaleString() : 0,
              unitotalesventa: unitotalesventa,
              perdida: isFinite(perdida) ? perdida.toFixed(2) : 0,
              ingresomes: isFinite(totalmes) ? totalmes.toLocaleString() : 0,
              totalEgresos: isFinite(totalEg) ? totalEg.toLocaleString() : 0,
              preciopromedio:isFinite(preciopromedio) ? preciopromedio.toLocaleString() : 0,
            }, { emitEvent: false })
          })
          //---------------------------------------------------------------------

        });
        this.dataCruces = this.actividadesForm.get('act').value
        this.datasolicitud.CrucesAgro = this.dataCruces
        this.srvSol.saveSol(this.sol, this.datasolicitud)
      })

    })
  }

  changeperiodo(e: FormGroup) {
    e.patchValue({
      diasB: '',
      diasR: '',
      diasM: '',
      valorB: '',
      valorR: '',
      valorM: '',
      totalB: '',
      totalR: '',
      totalM: '',
      totalDias: '',
      promedio: '',
      totalPromedio: '',
    }, { emitEvent: false })
  }

  displayFn(user: any): string {
    return user && user.name ? user.name : '';
  }
  _filter(name: any, tipo: number, index: number): Observable<any[]> {
    const filterValue = (typeof name === 'string' ? name.toLowerCase() : name.name.toLowerCase())
    return this.datosAuto[index].filter(option => option.name.toLowerCase().indexOf(filterValue) >= 0 && option.tipo === tipo);
  }

  itemactividad() {
    return this.fb.group({
      nombre: [''],
      tipo: [''],
      periodoventas: [''],
      tipoproduccion: '',
      diasB: '',
      diasR: '',
      diasM: '',
      valorB: '',
      valorR: '',
      valorM: '',
      totalB: '',
      totalR: '',
      totalM: '',
      promedio: '',
      totalDias: '',
      totalVentas: '',
      totalPromedio: '',
      totalCompras: '',
      ventasEstimadas: '',
      margenBruto: '',
      otrosGastos: '',
      ingresoLiquido: '',
      preciomin: [''],
      precioactual: [''],
      preciopromedio: [''],
      mesPepeo: '',
      mesTra: '',
      mesCos: '',
      unidadventa: '',
      lotesAgro: this.fb.array([this.itemLotes()]),
      lotesPecuario: this.fb.array([this.itemLotesPecuario()]),

    })
  }
  loadactividad(cruces: CrucesAgro[]): FormGroup {
    let crucesArray = this.fb.array([])
    for (let cru = 0; cru < cruces.length; cru++) {
      let tipoprod
      if (cruces[cru].tipo == 2) {
        tipoprod = cruces[cru].tipoproduccion
      } else if (cruces[cru].tipo == 1) {
        tipoprod = cruces[cru].nombre.tipoproducto
      }
      crucesArray.push(
        this.fb.group({
          nombre: [cruces[cru].nombre],
          tipo: [cruces[cru].tipo],
          periodoventas: [cruces[cru].periodoventas],
          tipoproduccion: tipoprod,
          preciomin: [cruces[cru].preciomin],
          precioactual: [cruces[cru].precioactual],
          preciopromedio: [cruces[cru].preciopromedio],
          diasB: [cruces[cru].diasB],
          diasR: [cruces[cru].diasR],
          diasM: [cruces[cru].diasM],
          valorB: [cruces[cru].valorB],
          valorR: [cruces[cru].valorR],
          valorM: [cruces[cru].valorM],
          totalB: [cruces[cru].totalB],
          totalR: [cruces[cru].totalR],
          totalM: [cruces[cru].totalM],
          totalVentas: '',
          promedio: '',
          totalDias: '',
          totalPromedio: '',          
          unidadventa: [cruces[cru].unidadventa],

          totalCompras: '',
          ventasEstimadas: '',
          margenBruto: '',
          otrosGastos: '',
          ingresoLiquido: '',
          mesCos: [cruces[cru].mesCos],
          mesTra: [cruces[cru].mesTra],
          mesPepeo: [cruces[cru].mesPepeo],
          lotesAgro: this.loaditemLotes(cruces[cru].lotesAgro),
          lotesPecuario: this.loaditemLotesP(cruces[cru].lotesPecuario)
        })
      )
    }
    return this.actividadesForm = this.fb.group({
      act: crucesArray
    })
  }
  loaditemLotes(lotes: LoteAgro[]) {
    let lotesArray = this.fb.array([])
    for (let lo = 0; lo < lotes.length; lo++) {
      lotesArray.push(
        this.fb.group({
          areacult: [lotes[lo].areacult],
          aplicadiastancia: [lotes[lo].aplicadiastancia],
          aplicaplantasinformacli: [''],
          dsurcos: [lotes[lo].dsurcos],
          dplantas: [lotes[lo].dplantas],
          diastancia: [lotes[lo].diastancia],
          planatasinformacli: [lotes[lo].planatasinformacli],
          fechafinal: [lotes[lo].fechafinal],
          edadcult: [lotes[lo].edadcult],
          periodoedad: [lotes[lo].periodoedad],
          rendiemientolote: [lotes[lo].rendiemientolote],
          unidadestotales: [lotes[lo].unidadestotales],
          perdida: [lotes[lo].perdida],
          totalIngreso: [lotes[lo].totalIngreso],
          proxcocecha: [lotes[lo].proxcocecha],
          cantmesesnoproduccion: [lotes[lo].cantmesesnoproduccion],
          cantmesescocecha: [lotes[lo].cantmesescocecha],
          rendimientoCos: [lotes[lo].rendimientoCos],
          unidadesCos: [lotes[lo].unidadesCos],
          perdidaCos: [lotes[lo].perdidaCos],
          procentageCos: [lotes[lo].procentageCos],
          totalCos: [lotes[lo].totalCos],
          rendimientoTra: [lotes[lo].rendimientoTra],
          unidadesTra: [lotes[lo].unidadesTra],
          perdidaTra: [lotes[lo].perdidaTra],
          procentageTra: [lotes[lo].procentageTra],
          totalTra: [lotes[lo].totalTra],
          rendimientoPepeo: [lotes[lo].rendimientoPepeo],
          unidadesPepeo: [lotes[lo].unidadesPepeo],
          perdidaPepeo: [lotes[lo].perdidaPepeo],
          procentagePepeo: [lotes[lo].procentagePepeo],
          totalPepeo: [lotes[lo].totalPepeo],
          totalUnidades: [lotes[lo].totalUnidades],
          totalLoteAunual: [lotes[lo].totalLoteAunual],
          egresosAdecuacion: this.loadEgresos(lotes[lo].egresosAdecuacion),
          totalEgresosAdecuacion: lotes[lo].totalEgresosAdecuacion,
          egresosSiembra: this.loadEgresos(lotes[lo].egresosSiembra),
          totalEgresosSiembre: lotes[lo].totalEgresosSiembre,
          egresosMante: this.loadEgresos(lotes[lo].egresosMante),
          totalEgresosMante: lotes[lo].totalEgresosMante,
          egresosCocecha: this.loadEgresos(lotes[lo].egresosCocecha),
          totalEgresosCosecha: lotes[lo].totalEgresosCosecha,
          totalEgresos: lotes[lo].totalEgresos

        })
      )
    }
    return lotesArray
  }
  loaditemLotesP(lotes: LotePecuario[]) {
    let lotesArray = this.fb.array([])
    for (let lo = 0; lo < lotes.length; lo++) {
      lotesArray.push(
        this.fb.group({
          numanimales: [lotes[lo].numanimales],
          prodderivado: [lotes[lo].prodderivado],          
          cantidadxanimal: [lotes[lo].cantidadxanimal],
          frecuencia: [lotes[lo].frecuencia],
          cantproducida: [lotes[lo].cantproducida],
          unitotalesventa: [lotes[lo].unitotalesventa],
          perdida: [lotes[lo].perdida],
          ingresomes: [lotes[lo].ingresomes],
          produccion:[lotes[lo].produccion],
          noproduccion:[lotes[lo].noproduccion],
          mesingreso: [lotes[lo].mesingreso],
          egresos: this.loadEgresos(lotes[lo].egresos),
          totalEgresos: [lotes[lo].totalEgresos]
        })
      )
    }
    return lotesArray
  }
  actividadActual(ac) {
    return this.actividades().at(ac) as FormArray
  }
  actividades() {
    this.datosAuto.push(this.ActRural)
    return this.actividadesForm.get('act') as FormArray;
  }
  addActividad() {
    this.actividades().push(this.itemactividad());
    this.selected.setValue(this.actividades().length - 1);
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

  //---------------------Lotes Pecuario ---------------------------
  lotesPecuario(ti): FormArray {
    return this.actividades().at(ti).get("lotesPecuario") as FormArray
  }
  addLotesPecuario(ti) {
    this.lotesPecuario(ti).push(this.itemLotesPecuario());
  }
  itemLotesPecuario() {
    return this.fb.group({
      numanimales: '',
      prodderivado: '',      
      cantidadxanimal: '',
      frecuencia: '',
      cantproducida: '',
      unitotalesventa: '',
      perdida: '',
      preciomin: '',
      precioactual: '',
      preciopromedio: '',
      ingresomes: '',
      mesingreso: '',
      produccion:'',
      noproduccion:'',
      egresos: this.fb.array([this.itemEgresos()]),
      totalEgresos: ''
    })
  }
  removeLotesPecuario(act: number, lote: number) {
    this.lotesPecuario(act).removeAt(lote);
  }
  //--------------------------------------------------------------------

  //---------------------Lotes ---------------------------
  lotes(ti): FormArray {
    return this.actividades().at(ti).get("lotesAgro") as FormArray
  }
  addLotes(ti) {
    this.lotes(ti).push(this.itemLotes());
  }
  itemLotes() {
    return this.fb.group({
      areacult: '',
      aplicadiastancia: '',
      aplicaplantasinformacli: '',
      dsurcos: '',
      dplantas: '',
      diastancia: '',
      planatasinformacli: '',      
      fechafinal: '',
      edadcult: '',
      periodoedad: '',
      rendiemientolote: '',
      unidadestotales: '',
      perdida: '',
      preciomin: '',
      precioactual: '',
      preciopromedio: '',
      totalIngreso: '',
      proxcocecha: '',
      cantmesescocecha: '',
      cantmesesnoproduccion: '',
      rendimientoCos: '',
      unidadesCos: '',
      perdidaCos: '',
      procentageCos: '',
      totalCos: '',
      rendimientoTra: '',
      unidadesTra: '',
      perdidaTra: '',
      procentageTra: '',
      totalTra: '',
      rendimientoPepeo: '',
      unidadesPepeo: '',
      perdidaPepeo: '',
      procentagePepeo: '',
      totalPepeo: '',
      totalUnidades: '',
      totalLoteAunual: '',
      egresosAdecuacion: this.fb.array([this.itemEgresos()]),
      totalEgresosAdecuacion: '',
      egresosSiembra: this.fb.array([this.itemEgresos()]),
      totalEgresosSiembre: '',
      egresosMante: this.fb.array([this.itemEgresos()]),
      totalEgresosMante: '',
      egresosCocecha: this.fb.array([this.itemEgresos()]),
      totalEgresosCosecha: '',
    })
  }
  removeLotes(act: number, lote: number) {
    this.lotes(act).removeAt(lote);
  }
  //--------------------------------------------------------------------

  //-------------------------------Egresos------------------------------

  egresosPecuario(lot, egre): FormArray {
    return this.lotesPecuario(lot).at(egre).get("egresos") as FormArray
  }
  addEgresos(act: number, lot: number) {
    this.egresosPecuario(act, lot).push(this.itemEgresos());
  }
  removeEgresos(ac: number, lot: number, eg: number) {
    this.egresosPecuario(ac, lot).removeAt(eg);
  }
  loadEgresos(egresos: Egresos[]) {
    let egresosArray = this.fb.array([])
    for (let eg = 0; eg < egresos.length; eg++) {

      egresosArray.push(
        this.fb.group({
          descripcion: [egresos[eg].descripcion],
          detalle: [egresos[eg].detalle],
          cantidad: [egresos[eg].cantidad],
          valorunitario: [egresos[eg].valorunitario],
          total: [egresos[eg].total],
          mes: [egresos[eg].mes]
        })
      )
    }
    return egresosArray
  }
  itemEgresos() {
    return this.fb.group({
      descripcion: '',
      detalle: '',
      cantidad: '',
      valorunitario: '',
      total: '',
      mes: ''
    })
  }
  //--------------------------------------------------------------------------------  

  //-------------------------------Egresos Adecuacion------------------------------
  egresadosAdecuacion(lot, egre): FormArray {
    return this.lotes(lot).at(egre).get("egresosAdecuacion") as FormArray
  }
  addEgresosAdecuacion(act: number, lot: number) {
    this.egresadosAdecuacion(act, lot).push(this.itemEgresos());
  }
  removeEgresosAdecuacion(ac: number, lot: number, eg: number) {
    this.egresadosAdecuacion(ac, lot).removeAt(eg);
  }

  //--------------------------------------------------------------------------------

  //-------------------------------Egresos Siembra------------------------------
  egresadosSiembra(lot, egre): FormArray {
    return this.lotes(lot).at(egre).get("egresosSiembra") as FormArray
  }
  addEgresosSiembra(act: number, lot: number) {
    this.egresadosSiembra(act, lot).push(this.itemEgresos());
  }
  removeEgresosSiembra(ac: number, lot: number, eg: number) {
    this.egresadosSiembra(ac, lot).removeAt(eg);
  }

  //-------------------------------------------------------------------

  //-------------------------------Egresos Mantinimiento------------------------------
  egresadosMante(lot, egre): FormArray {
    return this.lotes(lot).at(egre).get("egresosMante") as FormArray
  }
  addEgresosMantenimiento(act: number, lot: number) {
    this.egresadosMante(act, lot).push(this.itemEgresos());
  }
  removeEgresosmantenimiento(ac: number, lot: number, eg: number) {
    this.egresadosMante(ac, lot).removeAt(eg);
  }

  //-------------------------------------------------------------------
  //-------------------------------Egresos Cocecha------------------------------
  egresadosCocecha(lot, egre): FormArray {
    return this.lotes(lot).at(egre).get("egresosCocecha") as FormArray
  }
  addEgresosCocecho(act: number, lot: number) {
    this.egresadosCocecha(act, lot).push(this.itemEgresos());
  }
  removeEgresosCosecha(ac: number, lot: number, eg: number) {
    this.egresadosCocecha(ac, lot).removeAt(eg);
  }
  //-------------------------------------------------------------------



}