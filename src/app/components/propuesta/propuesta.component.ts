import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { IdbSolicitudService } from '../admin/idb-solicitud.service';

@Component({
  selector: 'app-propuesta',
  templateUrl: './propuesta.component.html',
  styleUrls: ['./propuesta.component.scss']
})
export class PropuestaComponent implements OnInit {

  constructor(
    public srvSol: IdbSolicitudService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  propuestaForm: FormGroup = this.fb.group({
    monto: '',
    destino: '',
    detalle: '',
    valor: '',
    mes: '',
    destinocre: '',
    detallecre: '',
    valorcre: '',
    mescre:'',
    aplicacfija:'',    
    montofija:'',
    plazofija:'',
    formapgo:'',
    fechadesc:'',
    calendariopago:'',
    cuota:'',
    fechapago1:'',
    valorcuota1:'',
    aplicacirregular:'',
  })

  ngOnInit(): void {
  }

}
