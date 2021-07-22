import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AdminModule } from './components/admin/admin.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AdminComponent } from "./components/admin/admin.component";
import { AuthGuard } from './helpers/auth.guard';
import { AuthInterceptor } from "./helpers/auth.interceptor";
import { ModalComponent } from './shared/modal/modal.component';
import { NotfoundComponent } from './shared/notfound/notfound.component';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { RolComponent } from './components/admin/admin-rol/rol/rol.component';
import { RolFormComponent } from './components/admin/admin-rol/rol-form/rol-form.component';
import { AgmCoreModule } from '@agm/core';
import { FileComponent } from './shared/file/file.component';


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,    
    ModalComponent,    
    NotfoundComponent,
    ToolbarComponent,   
    RolComponent,
    RolFormComponent,    
    FileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AdminModule,
    FlexLayoutModule,
    HttpClientModule,
    
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD3ByELSiEJB-XjYDI0h7JEkOKSAHyqbzA',
      libraries: ['places', 'drawing', 'geometry']
    })
  ],
  entryComponents: [
    ModalComponent    
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
