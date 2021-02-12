import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Solicitud } from 'src/app/model/solicitud';
import { Ubicacion } from 'src/app/model/ubicacion';
import { IdbSolicitudService } from '../admin/idb-solicitud.service';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.scss']
})

export class UbicacionComponent implements OnInit {

  @ViewChild('UploadFileInput') uploadFileInput: ElementRef;
  @ViewChild('UploadFileInput1') uploadFileInput1: ElementRef;
  myfilename2 = 'Seleccione Imagen';
  myfilename1 = 'Seleccione Imagen';
  sol: string;

  dataSolicitud: Solicitud = new Solicitud();
  dataUbicacion: Ubicacion = new Ubicacion();

  ubicacionForm: FormGroup = this.fb.group({
    tiempohora: [''],
    tiempomin: [''],
    tiemposeg: [''],
    puntopartida: [''],
    descripcionppartida: [''],
    fotoppartida: '',
    puntollegada: '',
    descripcionpllegada: '',
    fotopllegada: '',
  })

  constructor(
    private fb: FormBuilder,
    public srvSol: IdbSolicitudService,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {

    this.activeRoute.queryParamMap.subscribe((params) => {
      this.sol = params.get('solicitud')
    });

    this.srvSol.getSol(this.sol).subscribe((datasol) => {
      if (this.sol) {

        this.dataSolicitud = datasol as Solicitud
        if (this.dataSolicitud.Ubicacion) {
          this.loadUbicacion(this.dataSolicitud.Ubicacion)
        }
      }

      this.ubicacionForm.valueChanges.subscribe(form => {

        let hora = this.formatNumber(this.ubicacionForm.controls.tiempohora.value)
        let minuto = this.formatNumber(this.ubicacionForm.controls.tiempomin.value)
        let segundo = this.formatNumber(this.ubicacionForm.controls.tiemposeg.value)

        if (hora >= 12) {
          hora = 0
          this._snackBar.open("Muchas horas de recorrido", "Ok!", {
            duration: 3000,
          });
        }
        if (minuto >= 60) {
          minuto = 0
          this._snackBar.open("No puede superar 60 minutos", "Ok!", {
            duration: 3000,
          });
        }
        if (segundo >= 60) {
          segundo = 0
          this._snackBar.open("No puede superar 60 segundos", "Ok!", {
            duration: 3000,
          });
        }

        this.ubicacionForm.patchValue({
          tiempohora: hora,
          tiempomin: minuto,
          tiemposeg: segundo
        }, { emitEvent: false })

        this.dataUbicacion = this.ubicacionForm.value
        this.dataSolicitud.Ubicacion = this.dataUbicacion
        this.srvSol.saveSol(this.sol, this.dataSolicitud)

      })
    })
  }

  loadUbicacion(ubicaciones: Ubicacion) {

    return this.ubicacionForm = this.fb.group({
      tiempohora: ubicaciones.tiempohora,
      tiempomin: ubicaciones.tiempomin,
      tiemposeg: ubicaciones.tiemposeg,
      puntopartida: ubicaciones.puntopartida,
      descripcionppartida: ubicaciones.descripcionppartida,
      fotoppartida: ubicaciones.fotoppartida,
      puntollegada: ubicaciones.puntollegada,
      descripcionpllegada: ubicaciones.descripcionpllegada,
      fotopllegada: ubicaciones.fotopllegada,
    })

  }

  transform(base) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(base);
  }

  fileChangeEvent1(fileInput: any) {

    this.dataUbicacion = this.ubicacionForm.value
    this.dataSolicitud.Ubicacion = this.dataUbicacion

    if (fileInput.target.files && fileInput.target.files[0]) {
      this.myfilename1 = '';
      Array.from(fileInput.target.files).forEach((file: File) => {
        this.myfilename1 += file.name;
      });
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const imgBase64Path = e.target.result;
          this.ubicacionForm.patchValue({
            fotoppartida: imgBase64Path
          }, { emitEvent: false })

          this.dataUbicacion.fotoppartida = imgBase64Path
          this.dataSolicitud.Ubicacion.fotoppartida = this.dataUbicacion.fotoppartida
          this.srvSol.saveSol(this.sol, this.dataSolicitud)
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
      this.uploadFileInput1.nativeElement.value = "";
    } else {
      this.myfilename1 = 'Seleccione Imagen';
    }
  }

  fileChangeEvent2(fileInput: any) {
    this.dataUbicacion = this.ubicacionForm.value
    this.dataSolicitud.Ubicacion = this.dataUbicacion

    if (fileInput.target.files && fileInput.target.files[0]) {
      this.myfilename2 = '';
      Array.from(fileInput.target.files).forEach((file: File) => {
        this.myfilename2 += file.name;
      });
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const imgBase64Path = e.target.result;
          this.ubicacionForm.patchValue({
            fotopllegada: imgBase64Path
          }, { emitEvent: false })

          this.dataUbicacion.fotopllegada = imgBase64Path
          this.dataSolicitud.Ubicacion.fotopllegada = this.dataUbicacion.fotopllegada
          this.srvSol.saveSol(this.sol, this.dataSolicitud)
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
      this.uploadFileInput.nativeElement.value = "";
    } else {
      this.myfilename2 = 'Seleccione Imagen';
    }
  }

  quitar1() {
    this.myfilename1 = 'Seleccione Imagen';
    this.ubicacionForm.patchValue({
      fotoppartida: ""
    }, { emitEvent: false })
    this.dataUbicacion.fotoppartida = ""
    this.dataSolicitud.Ubicacion.fotoppartida = this.dataUbicacion.fotoppartida
    this.srvSol.saveSol(this.sol, this.dataSolicitud)
  }
  quitar2() {
    this.myfilename2 = 'Seleccione Imagen';
    this.ubicacionForm.patchValue({
      fotopllegada: ""
    }, { emitEvent: false })
    this.dataUbicacion.fotopllegada = ""
    this.dataSolicitud.Ubicacion.fotopllegada = this.dataUbicacion.fotopllegada
    this.srvSol.saveSol(this.sol, this.dataSolicitud)
  }

  formatNumber(num) {
    if (typeof (num) == "number") {
      return num
    } else {
      return parseInt(num == "0" || num == "" || num == null ? "0" : num.replace(/\D/g, '').replace(/^0+/, ''))
    }
  }

}
