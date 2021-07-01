export class CuestionarioNones {
    id:number;
    father:number;
    form:string;
    total:number;
    name: string;
    peso:number;
    multiple:boolean;
    theend:boolean;
    children?: CuestionarioNones[];
  }