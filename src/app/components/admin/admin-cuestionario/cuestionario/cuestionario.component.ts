import { NestedTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Cuestionario } from 'src/app/model/cuestionario';
import { CuestionarioNones } from 'src/app/model/cuestionnodes';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { PreguntasService } from 'src/app/services/preguntas.service';
import { RespuestasService } from 'src/app/services/respuestas.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cuestionario',
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.scss']
})
export class CuestionarioComponent {

  listCuestionario: Cuestionario[]
  selectCuestionario
  arbolCuestionario: CuestionarioNones[]

  treeControl = new NestedTreeControl<CuestionarioNones>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CuestionarioNones>();
  hasChild = (_: number, node: CuestionarioNones) => !!node.children && node.children.length > 0;

  constructor(
    private _srvCuestionario: CuestionarioService,
    private _srvRespuesta: RespuestasService,
    private _srvPreguntas: PreguntasService,
    public dialog: MatDialog,
  ) {
    this.initalize()
  }

  async initalize() {
    await this.getCuestionarios()
  }

  async loadCuestionario(id) {
    this.arbolCuestionario = await this.buildCuestionario(id)
    this.dataSource.data = this.arbolCuestionario;
  }

  async buildCuestionario(id) {

    let respuestas = await this.getRespuestas(id) as any[]
    let cuestion: CuestionarioNones[] = new Array()

    respuestas.forEach(function (a) {
      let objtema = new CuestionarioNones()
      objtema.name = a.Preguntas.Temas.Nombre
      objtema.id = a.Preguntas.Temas.Id
      objtema.father = id
      objtema.peso = a.Preguntas.Temas.Peso
      objtema.form = 'Temas'
      objtema.theend = false
      objtema.children = new Array()

      let objPregunta = new CuestionarioNones()
      objPregunta.name = a.Preguntas.Titulo
      objPregunta.id = a.Preguntas.Id
      objPregunta.peso = a.Preguntas.Peso
      objPregunta.multiple = a.Preguntas.Multiple
      objPregunta.father = a.Preguntas.Temas.Id
      objPregunta.form = 'Preguntas'
      objPregunta.theend = false
      objPregunta.children = new Array()

      let objRespuesta = new CuestionarioNones()
      objRespuesta.name = a.Texto
      objRespuesta.id = a.Id
      objRespuesta.form = 'Respuestas'
      objPregunta.multiple = a.Multiple
      objRespuesta.theend = true
      objRespuesta.peso = a.Puntaje
      objRespuesta.father = a.Preguntas.Id

      if (cuestion.some(e => e.id === a.Preguntas.Temas.Id)) {
        let ipr = cuestion.findIndex(c => c.id === a.Preguntas.Temas.Id)
        if (cuestion[ipr].children.some(e => e.id === a.Preguntas.Id)) {
          let ire = cuestion[ipr].children.findIndex(c => c.id === a.Preguntas.Id)
          cuestion[ipr].children[ire].children.push(objRespuesta)
        } else {
          if (objRespuesta.id > 0) {
            objPregunta.children.push(objRespuesta)
          }
          cuestion[ipr].children.push(objPregunta)
        }
      } else {

        if (objPregunta.id > 0) {
          if (objRespuesta.id > 0) {
            objPregunta.children.push(objRespuesta)
          }
          objtema.children.push(objPregunta)
        }
        cuestion.push(objtema)
      }
    });
    return cuestion

  }

  async getCuestionarios() {
    new Promise((resolve, reject) => {
      this._srvCuestionario.get().subscribe(
        (a) => {
          resolve(a)
          this.listCuestionario = a as Cuestionario[]
          return a as Cuestionario
        },
        (err) => {
          reject([])
        }
      )
    });
  }

  getRespuestas(cuestionario) {
    return new Promise((resolve, reject) => {
      this._srvRespuesta.getByCuestionario(cuestionario).subscribe(
        (a) => {
          resolve(a)
          return a
        },
        (err) => {
          reject([])
        }
      )
    });
  }

  onEdit(node) {
    console.log(node)
    this.openDialog(node.form, node, node.form)
  }

  onCreate(node) {

    let form = ''
    if (node.form == 'Temas') {
      form = 'Preguntas'
    } else if (node.form === 'Preguntas') {
      form = 'Respuestas'
    }
    let datos = {
      father: node.id
    }
    this.openDialog(`Crear ${form}`, datos, form)
  }

  onDelete(node) {

    if (node.children) {
      if (node.children.length > 0) {
        Swal.fire(`No es posible eliminar, contiene ${node.children.length} ${node.children[0].form}`, '', 'error')
        return
      }
    }

    Swal.fire({
      title: 'Se eliminara permanentemente la informacion ¿Esta seguro de eliminarla?',
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        if (node.form == 'Respuestas') {
          this._srvRespuesta.delete(node.id).subscribe((suc) => {
            Swal.fire('Información eliminada!', '', 'success')
          }, (err) => {
            Swal.fire('No se pudo eliminar registro', '', 'error')
            console.log(err)
          })
        } else if (node.form == 'Preguntas') {
          console.log(node.id)
          this._srvPreguntas.delete(node.id).subscribe((suc) => {
            Swal.fire('Información eliminada!', '', 'success')
          }, (err) => {
            Swal.fire('No se pudo eliminar registro', '', 'error')
            console.log(err)
          })
        }

      }
    })
  }

  openDialog(menssage: string, datos: any, form: string) {

    const config = {
      data: {
        mensaje: menssage,
        form: form,
        content: datos
      }
    };
    const dialogRef = this.dialog.open(ModalComponent, config);
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        if (form == "Respuestas") {
          console.log('lo que returno ', form)
          let cuestion = new CuestionarioNones()
          cuestion.id = result.Id
          cuestion.name = result.Texto
          cuestion.form = form
          cuestion.peso = result.Puntaje
          cuestion.theend = true
          cuestion.father = result.Preguntas.Id

          for (let i = 0; i < this.arbolCuestionario.length; i++) {
            const ele = this.arbolCuestionario[i];
            for (let p = 0; p < ele.children.length; p++) {
              const element = ele.children[p];
              if (element.id == result.Preguntas.Id) {
                this.arbolCuestionario[i].children[p].children.push(cuestion)
                break
              }
            }
          }

          this.dataSource.data = null;
          this.dataSource.data = this.arbolCuestionario
        }
      }

    })
  }



}
