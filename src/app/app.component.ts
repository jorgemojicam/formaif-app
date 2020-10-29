import { Component } from '@angular/core';
import {MaterialModule} from './material.module';
import {ToolbarComponent } from "./components/shared/toolbar/toolbar.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'formaif-app';
}
