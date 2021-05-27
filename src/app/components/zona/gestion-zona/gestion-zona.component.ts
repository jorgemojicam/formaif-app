import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gestion-zona',
  templateUrl: './gestion-zona.component.html',
  styleUrls: ['./gestion-zona.component.scss']
})
export class GestionZonaComponent implements OnInit {

  registroForm: FormGroup;
  secondFormGroup: FormGroup;

  niveles: any[] = [
    {
      Nombre: "Nivel 1",
      Orden: 1,
      Rol: 1,
      Editable:true
    }, {
      Nombre: "Nivel 2",
      Orden: 2,
      Rol: 1,
      Editable:true
    }, {
      Nombre: "Nivel 3",
      Orden: 3,
      Rol: 1,
      Editable:true
    }, {
      Nombre: "Nivel 4",
      Orden: 4,
      Rol: 1,
      Editable:true
    },
  ]

  formNiveles: FormGroup = this._formBuilder.group({
    niveles: this._formBuilder.array([])
  })

  constructor(
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    const that = this
    let arrayNiveles = that._formBuilder.array([])
    this.niveles.forEach(niv => {
      arrayNiveles.push(that._formBuilder.group({
        Nombre: [niv.Nombre],
        Estado: ['', Validators.required],
        isEditable:[niv.Editable]
      }))
    });
    this.formNiveles = this._formBuilder.group({
      niveles: arrayNiveles
    })

    this.registroForm = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
        /*
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    */
  }

  nivel() {
    return this.formNiveles.get('niveles') as FormArray;
  }

}
