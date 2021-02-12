import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HTTP_INTERCEPTORS,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TokenStorageService } from '../services/token-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { CarpetadigitalService } from '../services/carpetadigital.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private token: TokenStorageService,
    private carpetaSrv: CarpetadigitalService,
    private route: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) { }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.url.indexOf(environment.API_CP) >= 0) {
      console.log("entro")
    } else {
      const token = this.token.getToken();
      if (token != null) {
        request = request.clone({
          url: request.url.replace('http://', 'https://'),
          headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token)
        });
      }
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        let data = {};
        data = {
          reason: error && error.error && error.error.reason ? error.error.reason : '',
          status: error.status
        };
        if (error.status == 401) {
          this.token.signOut()
          this.route.navigate(['auth'])
          this._snackBar.open("Epa! Debe volver a iniciar sesion para enviar el analisis", "Ok!", {
            duration: 10000,
          });
        }
        return throwError(data);
      }));
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
