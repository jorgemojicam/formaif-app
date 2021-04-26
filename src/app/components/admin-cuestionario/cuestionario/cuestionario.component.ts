import { NestedTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Cuestionario } from 'src/app/model/cuestionario';
import { CuestionarioNones } from 'src/app/model/cuestionnodes';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { RespuestasService } from 'src/app/services/respuestas.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-cuestionario',
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.scss']
})
export class CuestionarioComponent {

  listCuestionario: Cuestionario[]
  selectCuestionario: Cuestionario
  arbolCuestionario: CuestionarioNones[]

  treeControl = new NestedTreeControl<CuestionarioNones>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CuestionarioNones>();


  hasChild = (_: number, node: CuestionarioNones) => !!node.children && node.children.length > 0;

  constructor(
    private _srvCuestionario: CuestionarioService,
    private _srvRespuesta: RespuestasService,
    public dialog: MatDialog,
  ) {
    this.initalize()
  }

  async initalize() {
    await this.getCuestionarios()
  }

  async loadCuestionario(e) {

    let respuestas = await this.getRespuestas(e.value) as any[]
    let cuestion:CuestionarioNones[] = new Array()

    respuestas.forEach(function (a) {
      let objtema = new CuestionarioNones()
      objtema.name = a.Preguntas.Temas.Nombre
      objtema.id = a.Preguntas.Temas.Id
      objtema.father = e.value
      objtema.peso = a.Preguntas.Temas.Peso      
      objtema.form = 'Temas'
      objtema.theend = false
      objtema.children = new Array()

      let objPregunta = new CuestionarioNones()
      objPregunta.name = a.Preguntas.Titulo
      objPregunta.id = a.Preguntas.Id
      objPregunta.peso = a.Preguntas.Peso
      objPregunta.form = 'Preguntas'
      objPregunta.theend = false
      objPregunta.children = new Array()

      let objRespuesta = new CuestionarioNones()
      objRespuesta.name = a.Texto
      objRespuesta.form = 'Respuestas'
      objRespuesta.theend = true
      objRespuesta.id = a.Id
      
      if (cuestion.some(e => e.id === a.Preguntas.Temas.Id)) {
        let ipr = cuestion.findIndex(c => c.id === a.Preguntas.Temas.Id)

        if (cuestion[ipr].children.some(e => e.id === a.Preguntas.Id)) {
          let ire = cuestion[ipr].children.findIndex(c => c.id === a.Preguntas.Id)
          cuestion[ipr].children[ire].children.push(objRespuesta)
        } else {
          cuestion[ipr].children.push(objPregunta)
        }
      } else {
        cuestion.push(objtema)
      }

    });

    this.arbolCuestionario = cuestion
    console.log('agrupado ', this.arbolCuestionario)
    this.dataSource.data = this.arbolCuestionario;

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

  gestionCuestionario(node){
    console.log(node)    
    this.openDialog(node.form,node,node.form)

  }

  openDialog(menssage: string,datos:any,form:string) {
    
    const config = {
      data: {
        mensaje: menssage,
        form: form,
        content: datos
      }
    };
    const dialogRef = this.dialog.open(ModalComponent, config);
    dialogRef.afterClosed().subscribe(result => {
 
    })
  }



}
