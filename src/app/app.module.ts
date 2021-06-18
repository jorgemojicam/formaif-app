import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';import { AppRoutingModule } from './app-routing.module';
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
import { PropuestaComponent } from './components/agil/propuesta/propuesta.component';
import { UbicacionComponent } from './components/agil/ubicacion/ubicacion.component';
import { AnalisisComponent } from './components/agil/analisis/analisis.component';
import { FlujocajaComponent } from './components/agil/flujocaja/flujocaja.component';
import { AnalisisagroComponent} from './components/agil/analisisagro/analisisagro.component';
import { ProfileComponent } from './components/admin/profile/profile.component';
import { ResultadoComponent } from './components/agil/resultado/resultado.component';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
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
import { BalanceComponent } from './components/agil/balance/balance.component';
import { GastosComponent } from './components/agil/gastos/gastos.component';
import { RolComponent } from './components/admin/admin-rol/rol/rol.component';
import { RolFormComponent } from './components/admin/admin-rol/rol-form/rol-form.component';
import { ZonaComponent } from './components/zona/zona.component';
import { ZonaModule } from './components/zona/zona.module';
import { AdjuntosZonaComponent } from './component/zona/adjuntos-zona/adjuntos-zona.component';
import { AdjuntosComponent } from './components/zona/adjuntos/adjuntos.component';

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
    MebaComponent,
    CuestionarioComponent,
    TemasFormComponent,
    PreguntasFormComponent,
    RespuestasFormComponent,
    AgilComponent,
    ProduccionComponent,
    ProduccionFormComponent,
    BalanceComponent,
    GastosComponent,
    RolComponent,
    RolFormComponent,
    ZonaComponent,
    AdjuntosZonaComponent,
    AdjuntosComponent
    
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
    ZonaModule 
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
