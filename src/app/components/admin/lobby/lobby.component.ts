import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  constructor(
    private _bottomSheet: MatBottomSheet,
    private route:Router
  ) { }

  ngOnInit(): void {
  }

  onRouter(){    
    this.route.navigate(['admin/home'], { queryParams: { solicitud: 0 } })
  }

}
