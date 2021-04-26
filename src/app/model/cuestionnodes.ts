export class CuestionarioNones {
    id:number;
    father:number;
    form:string;
    name: string;
    peso:number;
    multiple:boolean;
    theend:boolean;
    children?: CuestionarioNones[];
  }