import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Propuesta } from 'src/app/model/propuesta';
import { Solicitud } from 'src/app/model/solicitud';
import { IdbSolicitudService } from '../admin/idb-solicitud.service';

@Component({
  selector: 'app-propuesta',
  templateUrl: './propuesta.component.html',
  styleUrls: ['./propuesta.component.scss']
})
export class PropuestaComponent implements OnInit {

  sol: string;
  tipoSol: number;
  dataSolicitud: Solicitud;
  dataPropuesta:Propuesta;

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
    mescre: '',
    aplicacfija: '',
    montofija: '',
    plazofija: '',
    formapgo: '',
    fechadesc: '',
    calendariopago: '',
    cuota: '',
    fechapago1: '',
    valorcuota1: '',
    aplicacirregular: '',
  })

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.sol = params.get('solicitud')
    });

    this.srvSol.getSol(this.sol).subscribe((datasol) => {

      if (this.sol) {
        this.tipoSol = datasol.asesor
        this.dataSolicitud = datasol as Solicitud
        if (this.dataSolicitud.Balance) {

        }
      }

      this.propuestaForm.valueChanges.subscribe(form => {

        this.dataPropuesta = this.propuestaForm.value
        this.dataSolicitud.Propuesta = this.dataPropuesta
        this.srvSol.saveSol(this.sol, this.dataSolicitud)
      })
    })
  }

}
