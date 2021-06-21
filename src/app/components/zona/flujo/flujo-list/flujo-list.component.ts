import { Component, OnInit } from '@angular/core';
import { FlujoService } from 'src/app/services/zona/flujo.service';

@Component({
  selector: 'app-flujo-list',
  templateUrl: './flujo-list.component.html',
  styleUrls: ['./flujo-list.component.scss']
})
export class FlujoListComponent implements OnInit {

  constructor(
    private _srvFlujo:FlujoService
  ) { }
  
  ngOnInit(): void {

  }

}
