import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-flujo-form',
  templateUrl: './flujo-form.component.html',
  styleUrls: ['./flujo-form.component.scss']
})
export class FlujoFormComponent implements OnInit {

  @Input() datos:any
  constructor() { }

  ngOnInit(): void {
  }

}
