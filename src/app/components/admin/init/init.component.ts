import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Solicitud } from 'src/app/model/solicitud';
import { IdbSolicitudService } from '../idb-solicitud.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss']
})
export class InitComponent implements OnInit {

  public initForm = new FormGroup({
    solicitud: new FormControl('', Validators.required),
    cedula: new FormControl('',Validators.required),
    asesor: new FormControl("1",Validators.required)
  });

  constructor(
    public srvSol: IdbSolicitudService
  ) { }

  ngOnInit(): void {
  
  }

  onSave(data:Solicitud){

    const sol = []
    this.srvSol.get()
      .subscribe((sol) => {
        console.log(sol)
      });
    
    sol.push(data)
    console.log(sol)
    this.srvSol.save(sol)
  }

}
