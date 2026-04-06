import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Public endpoints that don't require authentication
    const publicEndpoints = [
      '/api/all-courses/trending',
      '/api/courses/public',
      '/api/trainers/public',
      '/api/trainers/featured',
      '/api/mentors/public',
      '/api/mentors/featured',
      '/api/institutes/public',
      '/api/institutes/featured',
      '/api/courses?',  // Public course listing with pagination
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/verify-otp',
      '/api/auth/resend-otp',
      '/api/students/register',
      '/api/students/login',
      '/api/students/verify-otp',
      '/api/students/resend-otp',
      '/api/students/forgot-password',
      '/api/trainers/register',
      '/api/mentors/register',
      '/api/institutes/register'
    ];

    // Check if this is a public endpoint
    const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));

    // Get the auth token from the service
    const token = this.authService.getToken();
    
    // Clone the request and add the authorization header if token exists
    // Only add token to API requests that are NOT public endpoints
    if (token && (req.url.includes('/api/') || req.url.includes('localhost:3000')) && !isPublicEndpoint) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Handle the request and catch errors
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid, logout user
          this.authService.logout();
          // Redirect to login page
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}

