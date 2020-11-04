import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public posts:{
    id:string;
    titlePost:string;
    contentPost:string;
    imagePost:string;
  }[]=[
    {
      id:'1',
      titlePost:'Title one',
      contentPost:'content One esto es un contenido asi que venga el mensaje',
      imagePost:'https://static.boredpanda.com/blog/wp-content/uploads/2020/01/fluffy-new-grumpy-cat-5e2e9496e8352__700.jpg'
    },
    {
      id:'2',
      titlePost:'Title twoo',
      contentPost:'content twoo esto es un contenido asi que venga el mensaje',
      imagePost:'https://static.boredpanda.com/blog/wp-content/uploads/2020/01/fluffy-new-grumpy-cat-5e2e9496e8352__700.jpg'
    },
    {
      id:'3',
      titlePost:'Title three',
      contentPost:'content three esto es un contenido asi que venga el mensaje',
      imagePost:'https://static.boredpanda.com/blog/wp-content/uploads/2020/01/fluffy-new-grumpy-cat-5e2e9496e8352__700.jpg'
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
