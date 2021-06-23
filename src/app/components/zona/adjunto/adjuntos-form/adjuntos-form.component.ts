import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-adjuntos-form',
  templateUrl: './adjuntos-form.component.html',
  styleUrls: ['./adjuntos-form.component.scss']
})
export class AdjuntosFormComponent implements OnInit {

  @Input() datos:any
  constructor() { }

  ngOnInit(): void {
  }

}
