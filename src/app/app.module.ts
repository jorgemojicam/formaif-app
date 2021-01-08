import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ContainerAppComponent } from './components/pages/container-app/container-app.component';
import { AdminModule } from './components/admin/admin.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AdminComponent } from "./components/admin/admin.component";

import { AuthGuard } from './helpers/auth.guard';
import { AuthInterceptor } from "./helpers/auth.interceptor";
import { HomeComponent } from './components/admin/home/home.component';
import { ModalComponent } from './shared/modal/modal.component';
import { InitComponent } from './components/admin/init/init.component';
import { LogoutComponent } from './shared/logout/logout.component';
import { NotfoundComponent } from './components/admin/notfound/notfound.component';
import { PropuestaComponent } from './components/propuesta/propuesta.component';
import { UbicacionComponent } from './components/ubicacion/ubicacion.component';
import { AnalisisComponent } from './components/analisis/analisis.component';
import { FlujocajaComponent } from './components/flujocaja/flujocaja.component';


@NgModule({
  declarations: [
    AppComponent,
    ContainerAppComponent,
    AdminComponent,
    HomeComponent,
    ModalComponent,
    InitComponent,
    LogoutComponent,
    NotfoundComponent,
    PropuestaComponent,
    UbicacionComponent,
    AnalisisComponent,
    FlujocajaComponent
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
    HttpClientModule
  ],
  entryComponents: [
    ModalComponent
  ],
   providers: [
     AuthGuard,
     {
       provide: HTTP_INTERCEPTORS,
       useClass:AuthInterceptor,
       multi:true
     }
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
