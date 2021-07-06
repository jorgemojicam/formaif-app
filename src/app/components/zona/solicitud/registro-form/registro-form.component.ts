import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-registro-form',
  templateUrl: './registro-form.component.html',
  styleUrls: ['./registro-form.component.scss']
})

export class RegistroFormComponent implements OnInit {
  
  @Input() solicitud:any
  id:any
  datasolicitud:any
  @ViewChild(MatAccordion) accordion: MatAccordion;

  ngOnInit(): void {
    
    if(this.solicitud){
      this.id = this.solicitud.Id
      this.datasolicitud = this.solicitud
      console.log('registro',this.datasolicitud)
    }
  }

}
