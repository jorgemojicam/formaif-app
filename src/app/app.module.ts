import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { NewPostComponent } from './components/posts/new-post/new-post.component';
import { NewPostModule } from './components/posts/new-post/new-post.module';
import { PostComponent } from './components/posts/post/post.component';
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
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

@NgModule({
  declarations: [
    AppComponent,
    NewPostComponent,
    PostComponent,
    ContainerAppComponent,
    AdminComponent,
    HomeComponent,
    ModalComponent,
    InitComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    NewPostModule,
    ReactiveFormsModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AdminModule,
    FlexLayoutModule,
    HttpClientModule
  ],
  entryComponents:[
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
