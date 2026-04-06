import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = error.error?.message || error.error?.error || 'Bad Request - Please check your input';
              break;
            case 401:
              // Auth interceptor handles 401 redirects
              // Just log the error and don't show popup for public endpoints
              console.warn('Unauthorized: Check if endpoint requires authentication');
              return throwError(() => error);
              break;
            case 403:
              errorMessage = 'Forbidden - You do not have permission to access this resource';
              break;
            case 404:
              errorMessage = error.error?.message || 'Resource not found';
              break;
            case 409:
              errorMessage = error.error?.message || 'Conflict - Resource already exists';
              break;
            case 422:
              errorMessage = error.error?.message || 'Validation Error - Please check your input';
              break;
            case 429:
              errorMessage = 'Too Many Requests - Please try again later';
              break;
            case 500:
              errorMessage = 'Internal server error - Please try again later';
              break;
            case 502:
              errorMessage = 'Bad Gateway - Server is temporarily unavailable';
              break;
            case 503:
              errorMessage = 'Service Unavailable - Server is under maintenance';
              break;
            case 504:
              errorMessage = 'Gateway Timeout - Request took too long';
              break;
            default:
              errorMessage = error.error?.message || error.error?.error || `Error Code: ${error.status}`;
          }
        }
        
        console.error('API Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}

