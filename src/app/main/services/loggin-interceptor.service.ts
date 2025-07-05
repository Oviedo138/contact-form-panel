import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor(
    private firebaseAuth: AngularFireAuth
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.firebaseAuth.idTokenResult.pipe(
      take(1),
      switchMap((token: any) => {
        if (token) {
          request = request.clone({
            setHeaders: { Authorization: `Bearer ${token.token}` }
          });
        }
        return next.handle(request);
      })
    )
  }
}