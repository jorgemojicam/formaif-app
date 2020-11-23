import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cruces',
  templateUrl: './cruces.component.html',
  styleUrls: ['./cruces.component.scss']
})
export class CrucesComponent implements OnInit {

  actividadesForm: FormGroup
  ventasHisForm: FormGroup
  produccionForm: FormGroup
  selected = new FormControl(0);

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.actividadesForm = this.fb.group({
      act: this.fb.array([this.itemactividad()])
    })

    this.produccionForm = this.fb.group({
      produccionRow: this.fb.array([this.itemprod()])
    })

  }

  itemactividad() {
    return this.fb.group({
      nombre: [''],
      tipo: [''],
      diasB: '',
      diasR: '',
      diasM: '',
      valorB: '',
      valorR: '',
      valorM: '',
      totalB: '',
      ventasHis: this.fb.array([this.itemventas()])
    })
  }

  actividades() {
    return this.actividadesForm.get('act') as FormArray;
  }
  ventashistoricas(ti): FormArray {
    return this.actividades().at(ti).get("ventasHis") as FormArray
  }
  ventashis(ti){
    this.ventashistoricas(ti).push(this.itemventas());
  }

  itemventas() {
    return this.fb.group({
      dia: '',
      valor: ''
    })
  }
  itemprod() {
    return this.fb.group({
      nombre: '',
      cantidad: '',
      valor: '',
      fecuencia: ''
    })
  }

  newActividad(): FormGroup {
    return this.fb.group({
      nombre: [''],
      tipo: [''],
      diasB: '',
      diasR: '',
      diasM: '',
      valorB: '',
      valorR: '',
      valorM: '',
      totalB: ''
    })
  }

  addActividad() {
    this.actividades().push(this.newActividad());
    this.selected.setValue(this.actividades().length - 1);
  }


}
