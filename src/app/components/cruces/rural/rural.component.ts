
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CrucesAgro } from 'src/app/model/crucesagro';
import { LoteAgro } from 'src/app/model/loteAgro';
import { Solicitud } from 'src/app/model/solicitud';
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
  edadPeriodo: any = DataSelect.PeriodoEdad;
  unidades: any = DataSelect.Unidades;
  meses: any = DataSelect.Meses;

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

      if (this.datasolicitud.CrucesAgro) {
        this.loadactividad(this.datasolicitud.CrucesAgro)
      } else {

      }

      this.actividadesForm.valueChanges.subscribe(values => {
        this.dataCruces = values.act
        this.datasolicitud.CrucesAgro = this.dataCruces
        this.srvSol.saveSol(this.sol, this.datasolicitud)
      })

      this.actividadesForm.get('act').valueChanges.subscribe(values => {


        const ctrl = <FormArray>this.actividadesForm.controls['act'];
        ctrl.controls.forEach((x, index) => {

          const lotesArr = <FormArray>x.get('lotesAgro')

          lotesArr.controls.forEach((prod, idxprod) => {
            let unidadestotales = this.formatNumber(prod.get("unidadestotales").value)
            let rendiemientolote = this.formatNumber(prod.get("rendiemientolote").value)

            let perdida = (1 - (unidadestotales / rendiemientolote)) * 100
            prod.get("perdida").setValue(perdida, { emitEvent: false });

            let preciomin = this.formatNumber(prod.get("preciomin").value)
            let precioactual = this.formatNumber(prod.get("precioactual").value)
            let preciopromedio = (preciomin + precioactual) / 2

            let totalingreso = unidadestotales * preciopromedio
            prod.get("preciopromedio").setValue(preciopromedio, { emitEvent: false });
            prod.get("totalIngreso").setValue(totalingreso, { emitEvent: false });
          })

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
      nombre: [this.ActRural[0]],
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
          diastancia: lotes[lo].diastancia,
          planatasinformacli: '',
          numplantas: '',
          unidadventa: '',
          edadcult: lotes[lo].edadcult,
          periodoedad: lotes[lo].periodoedad,
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
          egresosAdecuacion: this.fb.array([this.itemEgresosAdecuacion()]),
          egresosSiembra: this.fb.array([this.itemEgresosSiembra()]),
          egresosMante: this.fb.array([this.itemEgresosMante()]),
          egresosCocecha: this.fb.array([this.itemEgresosMante()]),

        })
      )
    }
    return lotesArray
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
      egresos: this.fb.array([this.itemEgresos()])

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
      diastancia: '',
      planatasinformacli: '',
      numplantas: '',
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
      egresosAdecuacion: this.fb.array([this.itemEgresosAdecuacion()]),
      egresosSiembra: this.fb.array([this.itemEgresosSiembra()]),
      egresosMante: this.fb.array([this.itemEgresosMante()]),
      egresosCocecha: this.fb.array([this.itemEgresosMante()]),

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
    console.log(act, lot)
    this.egresosPecuario(act, lot).push(this.itemEgresos());
  }
  removeEgresos(ac: number, lot: number, eg: number) {
    this.egresosPecuario(ac, lot).removeAt(eg);
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
    console.log(act, lot)
    this.egresadosAdecuacion(act, lot).push(this.itemEgresosAdecuacion());
  }
  removeEgresosAdecuacion(ac: number, lot: number, eg: number) {
    this.egresadosAdecuacion(ac, lot).removeAt(eg);
  }

  itemEgresosAdecuacion() {
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

  //-------------------------------Egresos Siembra------------------------------
  egresadosSiembra(lot, egre): FormArray {
    return this.lotes(lot).at(egre).get("egresosSiembra") as FormArray
  }
  addEgresosSiembra(act: number, lot: number) {
    this.egresadosSiembra(act, lot).push(this.itemEgresosAdecuacion());
  }
  removeEgresosSiembra(ac: number, lot: number, eg: number) {
    this.egresadosSiembra(ac, lot).removeAt(eg);
  }
  itemEgresosSiembra() {
    return this.fb.group({
      descripcion: '',
      detalle: '',
      cantidad: '',
      valorunitario: '',
      total: '',
      mes: ''
    })
  }
  //-------------------------------------------------------------------

  //-------------------------------Egresos Mantinimiento------------------------------
  egresadosMante(lot, egre): FormArray {
    return this.lotes(lot).at(egre).get("egresosMante") as FormArray
  }
  addEgresosMantenimiento(act: number, lot: number) {
    this.egresadosMante(act, lot).push(this.itemEgresosMante());
  }
  removeEgresosmantenimiento(ac: number, lot: number, eg: number) {
    this.egresadosMante(ac, lot).removeAt(eg);
  }
  itemEgresosMante() {
    return this.fb.group({
      descripcion: '',
      detalle: '',
      cantidad: '',
      valorunitario: '',
      total: '',
      mes: ''
    })
  }
  //-------------------------------------------------------------------
  //-------------------------------Egresos Cocecha------------------------------
  egresadosCocecha(lot, egre): FormArray {
    return this.lotes(lot).at(egre).get("egresosCocecha") as FormArray
  }
  addEgresosCocecho(act: number, lot: number) {
    this.egresadosCocecha(act, lot).push(this.itemEgresosCocecha());
  }
  itemEgresosCocecha() {
    return this.fb.group({
      descripcion: '',
      detalle: '',
      cantidad: '',
      valorunitario: '',
      total: '',
      mes: ''
    })
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