import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public opened: boolean = false
  constructor(
    private router:Router
  ) { }
  ngOnInit(): void {
  } 

  goHome(){
    this.router.navigate(['home'])
  }




}
