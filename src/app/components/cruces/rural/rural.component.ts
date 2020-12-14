
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CrucesAgro } from 'src/app/model/crucesagro';
import { Egresos } from 'src/app/model/egresos';
import { LoteAgro } from 'src/app/model/loteAgro';
import { Solicitud } from 'src/app/model/solicitud';
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
    private ref: ChangeDetectorRef,
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

  diasSema: any = [];
  sol: string;

  datasolicitud: Solicitud = new Solicitud()
  dataCruces: [] = []

  diasSemana = DataSelect.DiasSemana;
  quincena = DataSelect.Quince;
  semanas = DataSelect.Semanas;

  datosAuto: any[] = [DataSelect.ActividadRural]

  ngOnInit(): void {

    this.activeRoute.queryParamMap
      .subscribe((params) => {
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

      this.actividadesForm.valueChanges.subscribe(values => {
        this.dataCruces = values.act
        this.datasolicitud.CrucesAgro = this.dataCruces
        this.srvSol.saveSol(this.sol, this.datasolicitud)
      })

      this.actividadesForm.get('act').valueChanges.subscribe(values => {

        const ctrl = <FormArray>this.actividadesForm.controls['act'];
        ctrl.controls.forEach((x, index) => {

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
          let cantB = x.get('diasB').value.length
          let valorB = this.formatNumber(x.get('valorB').value)
          let totalB = cantB * valorB * cantperiodo
          let cantR = x.get('diasR').value.length
          let valorR = this.formatNumber(x.get('valorR').value)
          let totalR = cantR * valorR * cantperiodo
          let cantM = x.get('diasM').value.length
          let valorM = this.formatNumber(x.get('valorM').value)
          let totaldias = this.formatNumber(x.get('totalDias').value)
          let totalM = cantM * valorM * cantperiodo
          let promedio = (valorB + valorR + valorM) / valorpromedio
          let totalpromedio = promedio * totaldias

          x.patchValue({
            valorB: isFinite(valorB) ? valorB.toLocaleString() : 0,
            valorR: isFinite(valorR) ? valorR.toLocaleString() : 0,
            valorM: isFinite(valorM) ? valorM.toLocaleString() : 0,
            totalB: isFinite(totalB) ? totalB.toLocaleString() : 0,
            totalR: isFinite(totalR) ? totalR.toLocaleString() : 0,
            totalM: isFinite(totalM) ? totalM.toLocaleString() : 0,
            promedio: isFinite(promedio) ? promedio.toLocaleString() : 0,
            totalPromedio: isFinite(totalpromedio) ? totalpromedio.toLocaleString() : 0,
          }, { emitEvent: false })
          //---------------------------------------------------------

          //-------------Pecuario--------------------------------
          const lotesPecuArr = <FormArray>x.get('lotesPecuario')
          lotesPecuArr.controls.forEach((lot, idxlot) => {
            let totalEg = 0
            const egresoAdecua = <FormArray>lot.get('egresos')
            egresoAdecua.controls.forEach((egr, idxegr) => {

              let valor = this.formatNumber(egr.get("valorunitario").value)
              let cantidad = this.formatNumber(egr.get("cantidad").value)
              let total = valor * cantidad
              totalEg += total
              egr.patchValue({
                valorunitario: isFinite(valor) ? valor.toLocaleString() : 0,
                total: isFinite(total) ? total.toLocaleString() : 0
              }, { emitEvent: false })
            })

            let numanimales = this.formatNumber(lot.get("numanimales").value)
            let cantidadxanimal = this.formatNumber(lot.get("cantidadxanimal").value)
            let frecuencia = this.formatNumber(lot.get("frecuencia").value != null ? lot.get("frecuencia").value.dias : 0)
            let cantidadtotal = numanimales * cantidadxanimal * frecuencia

            let unitotalesventa = this.formatNumber(lot.get("unitotalesventa").value)
            let perdida = (1 - (unitotalesventa / cantidadtotal)) * 100

            let preciomin = this.formatNumber(lot.get("preciomin").value)
            let precioactual = this.formatNumber(lot.get("precioactual").value)
            let preciopromedio = (preciomin + precioactual) / 2

            let totalmes = preciopromedio * unitotalesventa

            lot.patchValue({
              cantproducida: isFinite(cantidadtotal) ? cantidadtotal.toLocaleString() : 0,
              perdida: isFinite(perdida) ? perdida.toFixed(2) : 0,
              preciopromedio: isFinite(preciopromedio) ? preciopromedio.toLocaleString() : 0,
              ingresomes: isFinite(totalmes) ? totalmes.toLocaleString() : 0,
              totalEgresos: isFinite(totalEg) ? totalEg.toLocaleString() : 0,
            }, { emitEvent: false })

          })
          //---------------------------------------------------------------------

          //-------------------------Agricola---------------------------------------
          const lotesArr = <FormArray>x.get('lotesAgro')
          lotesArr.controls.forEach((lot, idxlot) => {
            let unidadestotales = this.formatNumber(lot.get("unidadestotales").value)
            let rendiemientolote = this.formatNumber(lot.get("rendiemientolote").value)

            if (unidadestotales > rendiemientolote) {
              unidadestotales = 0
              this._snackBar.open("Unidades de venta totales no pueden ser superior al rendimiento por lote", "Ok!", {
                duration: 3000,
              });
            }

            let area = this.formatNumber(lot.get("areacult").value)
            let dsurco = this.formatNumber(lot.get("dsurcos").value)
            let dpanta = this.formatNumber(lot.get("dplantas").value)
            let distancia = area / (dsurco * dpanta)
            let perdida = (1 - (unidadestotales / rendiemientolote)) * 100

            let preciomin = this.formatNumber(lot.get("preciomin").value)
            let precioactual = this.formatNumber(lot.get("precioactual").value)
            let preciopromedio = (preciomin + precioactual) / 2
            let totalingreso = unidadestotales * preciopromedio

            //--------------------------Permanente---------------------------
            let rendimientoCos = this.formatNumber(lot.get("rendimientoCos").value)
            let unidadesCos = this.formatNumber(lot.get("unidadesCos").value)
            let perdidaCos = (1 - (unidadesCos / rendimientoCos)) * 100
            let totalCos = unidadesCos * preciopromedio
            if (unidadesCos > rendimientoCos) {
              unidadesCos = 0
              this._snackBar.open("Unidades de venta totales no pueden ser superior al rendimiento por lote", "Ok!", {
                duration: 3000,
              });
            }

            let rendimientoTra = this.formatNumber(lot.get("rendimientoTra").value)
            let unidadesTra = this.formatNumber(lot.get("unidadesTra").value)
            let perdidaTra = (1 - (unidadesTra / rendimientoTra)) * 100
            let totalTra = unidadesTra * preciopromedio
            if (unidadesTra > rendimientoTra) {
              unidadesTra = 0
              this._snackBar.open("Unidades de venta totales no pueden ser superior al rendimiento por lote", "Ok!", {
                duration: 3000,
              });
            }

            let rendimientoPepeo = this.formatNumber(lot.get("rendimientoPepeo").value)
            let unidadesPepeo = this.formatNumber(lot.get("unidadesPepeo").value)
            let perdidaPepeo = (1 - (unidadesPepeo / rendimientoPepeo)) * 100
            let totalPepeo = unidadesPepeo * preciopromedio
            if (unidadesPepeo > rendimientoPepeo) {
              unidadesPepeo = 0
              this._snackBar.open("Unidades de venta totales no pueden ser superior al rendimiento por lote", "Ok!", {
                duration: 3000,
              });
            }

            let unidadtotal = unidadesCos + unidadesTra + unidadesPepeo

            let procentageCos = unidadesCos / unidadtotal
            let procentageTra = unidadesTra / unidadtotal
            let procentagePepeo = unidadesPepeo / unidadtotal
            let totalanual = totalCos + totalTra + totalPepeo

            //----------------------------------------------------------------------------
            let totalEgAdecuacion = 0
            const egresoAdecua = <FormArray>lot.get('egresosAdecuacion')
            egresoAdecua.controls.forEach((lot, idxlot) => {
              let valor = this.formatNumber(lot.get("valorunitario").value)
              let cantidad = this.formatNumber(lot.get("cantidad").value)
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
              let valor = this.formatNumber(eg.get("valorunitario").value)
              let cantidad = this.formatNumber(eg.get("cantidad").value)
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
              let valor = this.formatNumber(eg.get("valorunitario").value)
              let cantidad = this.formatNumber(eg.get("cantidad").value)
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
              let valor = this.formatNumber(eg.get("valorunitario").value)
              let cantidad = this.formatNumber(eg.get("cantidad").value)
              let total = valor * cantidad
              totalEgCosecha += total
              eg.patchValue({
                valorunitario: isFinite(valor) ? valor.toLocaleString() : 0,
                total: isFinite(total) ? total.toLocaleString() : 0
              }, { emitEvent: false })
            })

            lot.patchValue({
              unidadestotales: unidadestotales,
              unidadesCos: unidadesCos,
              unidadesTra: unidadesTra,
              unidadesPepeo: unidadesPepeo,
              perdida: isFinite(perdida) ? perdida.toLocaleString('es-CO') : 0,
              preciomin: isFinite(preciomin) ? preciomin.toLocaleString('es-CO') : 0,
              precioactual: isFinite(precioactual) ? precioactual.toLocaleString('es-CO') : 0,
              preciopromedio: isFinite(preciopromedio) ? preciopromedio.toLocaleString('es-CO') : 0,
              totalIngreso: isFinite(totalingreso) ? totalingreso.toLocaleString('es-CO') : 0,
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
              totalEgresosAdecuacion: isFinite(totalEgAdecuacion) ? totalEgAdecuacion.toLocaleString('es-CO') : 0,
              totalEgresosSiembre: isFinite(totalEgSiembra) ? totalEgSiembra.toLocaleString('es-CO') : 0,
              totalEgresosCosecha: isFinite(totalEgCosecha) ? totalEgCosecha.toLocaleString('es-CO') : 0,
              totalEgresosMante: isFinite(totalEgMante) ? totalEgMante.toLocaleString('es-CO') : 0
            }, { emitEvent: false })
          })

        });
      })
    })
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
      totalPromedio: '',
      lotesAgro: this.fb.array([this.itemLotes()]),
      lotesPecuario: this.fb.array([this.itemLotesPecuario()]),

    })
  }
  loadactividad(cruces: CrucesAgro[]): FormGroup {

    let crucesArray = this.fb.array([])
    for (let cru = 0; cru < cruces.length; cru++) {

      crucesArray.push(
        this.fb.group({
          nombre: [cruces[cru].nombre],
          tipo: [cruces[cru].tipo],
          periodoventas: [cruces[cru].periodoventas],
          tipoproduccion: [cruces[cru].nombre.tipoproducto],
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
          lotesAgro: this.loaditemLotes(cruces[cru].lotesAgro),
          lotesPecuario: this.fb.array([this.itemLotesPecuario()]),
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
          areacult: lotes[lo].areacult,
          aplicadiastancia: lotes[lo].aplicadiastancia,
          aplicaplantasinformacli: '',
          dsurcos: lotes[lo].dsurcos,
          dplantas: lotes[lo].dplantas,
          diastancia: lotes[lo].diastancia,
          planatasinformacli: lotes[lo].planatasinformacli,
          unidadventa: lotes[lo].unidadventa,
          edadcult: lotes[lo].edadcult,
          periodoedad: lotes[lo].periodoedad,
          rendiemientolote: lotes[lo].rendiemientolote,
          unidadestotales: lotes[lo].unidadestotales,
          perdida: lotes[lo].perdida,
          preciomin: lotes[lo].preciomin,
          precioactual: lotes[lo].precioactual,
          preciopromedio: lotes[lo].preciopromedio,
          totalIngreso: lotes[lo].totalIngreso,
          cocecha: lotes[lo].cocecha,
          mesCos: lotes[lo].mesCos,
          rendimientoCos: lotes[lo].rendimientoCos,
          unidadesCos: lotes[lo].unidadesCos,
          perdidaCos: lotes[lo].perdidaCos,
          procentageCos: lotes[lo].procentageCos,
          totalCos: lotes[lo].totalCos,
          mesTra: lotes[lo].mesTra,
          rendimientoTra: lotes[lo].rendimientoTra,
          unidadesTra: lotes[lo].unidadesTra,
          perdidaTra: lotes[lo].perdidaTra,
          procentageTra: lotes[lo].procentageTra,
          totalTra: lotes[lo].totalTra,
          mesPepeo: lotes[lo].mesPepeo,
          rendimientoPepeo: lotes[lo].rendimientoPepeo,
          unidadesPepeo: lotes[lo].unidadesPepeo,
          perdidaPepeo: lotes[lo].perdidaPepeo,
          procentagePepeo: lotes[lo].procentagePepeo,
          totalPepeo: lotes[lo].totalPepeo,
          totalUnidades: lotes[lo].totalUnidades,
          totalLoteAunual: lotes[lo].totalLoteAunual,
          egresosAdecuacion: this.loadEgresos(lotes[lo].egresosAdecuacion),
          totalEgresosAdecuacion: lotes[lo].totalEgresosAdecuacion,
          egresosSiembra: this.loadEgresos(lotes[lo].egresosSiembra),
          totalEgresosSiembre: lotes[lo].totalEgresosSiembre,
          egresosMante: this.loadEgresos(lotes[lo].egresosMante),
          totalEgresosMante: lotes[lo].totalEgresosMante,
          egresosCocecha: this.loadEgresos(lotes[lo].egresosCocecha),
          totalEgresosCosecha:lotes[lo].totalEgresosCosecha,

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
      unidadventa: '',
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
      unidadventa: '',
      edadcult: '',
      periodoedad: '',
      rendiemientolote: '',
      unidadestotales: '',
      perdida: '',
      preciomin: '',
      precioactual: '',
      preciopromedio: '',
      totalIngreso: '',
      cocecha: '',

      mesCos: '',
      rendimientoCos: '',
      unidadesCos: '',
      perdidaCos: '',
      procentageCos: '',
      totalCos: '',

      mesTra: '',
      rendimientoTra: '',
      unidadesTra: '',
      perdidaTra: '',
      procentageTra: '',
      totalTra: '',

      mesPepeo: '',
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
          descripcion: egresos[eg].descripcion,
          detalle: egresos[eg].detalle,
          cantidad: egresos[eg].cantidad,
          valorunitario: egresos[eg].valorunitario,
          total: egresos[eg].total,
          mes: egresos[eg].mes
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

  formatNumber(num: string) {
    if (typeof (num) == "number") {
      return parseInt(num)
    } else {
      return parseInt(num == "" || num == null ? "0" : num.replace(/\D/g, '').replace(/^0+/, ''))
    }
  }

}