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
import { AdminModule } from './components/admin/admin.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AdminComponent } from "./components/admin/admin.component";
import { AuthGuard } from './helpers/auth.guard';
import { AuthInterceptor } from "./helpers/auth.interceptor";
import { HomeComponent } from './components/agil/home/home.component';
import { ModalComponent } from './shared/modal/modal.component';
import { InitComponent } from './components/agil/init/init.component';
import { NotfoundComponent } from './shared/notfound/notfound.component';
import { PropuestaComponent } from './components/propuesta/propuesta.component';
import { UbicacionComponent } from './components/ubicacion/ubicacion.component';
import { AnalisisComponent } from './components/analisis/analisis.component';
import { FlujocajaComponent } from './components/flujocaja/flujocaja.component';
import { AnalisisagroComponent} from './components/analisisagro/analisisagro.component';
import { ProfileComponent } from './components/admin/profile/profile.component';
import { ResultadoComponent } from './components/resultado/resultado.component';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { MebaModule } from './components/meba/meba.module';
import { MebaComponent } from './components/meba/meba.component';

import { CuestionarioComponent } from './components/admin/admin-cuestionario/cuestionario/cuestionario.component';
import { TemasFormComponent } from './components/admin/admin-cuestionario/temas-form/temas-form.component';
import { PreguntasFormComponent } from './components/admin/admin-cuestionario/preguntas-form/preguntas-form.component';
import { RespuestasFormComponent } from './components/admin/admin-cuestionario/respuestas-form/respuestas-form.component';
import { AgilModule } from './components/agil/agil.module';
import { AgilComponent } from "./components/agil/agil.component";  
import { ProduccionComponent } from './components/admin/admin-produccion/produccion/produccion.component';
import { ProduccionFormComponent } from './components/admin/admin-produccion/produccion-form/produccion-form.component';


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    HomeComponent,
    ModalComponent,
    InitComponent,
    NotfoundComponent,
    PropuestaComponent,
    UbicacionComponent,
    AnalisisComponent,
    FlujocajaComponent,
    AnalisisagroComponent,
    ProfileComponent,
    ResultadoComponent,
    ToolbarComponent,
    LobbyComponent,
    MebaComponent,
    CuestionarioComponent,
    TemasFormComponent,
    PreguntasFormComponent,
    RespuestasFormComponent,
    AgilComponent,
    ProduccionComponent,
    ProduccionFormComponent
    
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
    MebaModule,
    AgilModule,    
  ],
  entryComponents: [
    ModalComponent,
    ProfileComponent
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
