import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

export interface ApiIntegrationStatus {
  service: string;
  endpoint: string;
  status: 'connected' | 'disconnected' | 'error';
  lastChecked: Date;
  errorMessage?: string;
}

export interface ComponentApiMapping {
  component: string;
  apis: Array<{
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    description: string;
    integrated: boolean;
    service: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ApiIntegrationService {
  private integrationStatus = new BehaviorSubject<ApiIntegrationStatus[]>([]);
  public integrationStatus$ = this.integrationStatus.asObservable();

  constructor(private apiService: ApiService) {
    this.initializeIntegrationStatus();
  }

  // Initialize integration status for all APIs
  private initializeIntegrationStatus(): void {
    const statuses: ApiIntegrationStatus[] = [
      // Home APIs
      { service: 'Home', endpoint: '/api/home/trending-courses', status: 'disconnected', lastChecked: new Date() },
      { service: 'Home', endpoint: '/api/home/highlights', status: 'disconnected', lastChecked: new Date() },
      { service: 'Home', endpoint: '/api/home/achievements', status: 'disconnected', lastChecked: new Date() },
      { service: 'Home', endpoint: '/api/home/services', status: 'disconnected', lastChecked: new Date() },
      { service: 'Home', endpoint: '/api/home/reviews', status: 'disconnected', lastChecked: new Date() },
      { service: 'Home', endpoint: '/api/home/stats', status: 'disconnected', lastChecked: new Date() },
      { service: 'Home', endpoint: '/api/home/send-message', status: 'disconnected', lastChecked: new Date() },

      // Authentication APIs
      { service: 'Auth', endpoint: '/api/auth/register', status: 'disconnected', lastChecked: new Date() },
      { service: 'Auth', endpoint: '/api/auth/login', status: 'disconnected', lastChecked: new Date() },
      { service: 'Auth', endpoint: '/api/auth/verify-otp', status: 'disconnected', lastChecked: new Date() },
      { service: 'Auth', endpoint: '/api/auth/resend-otp', status: 'disconnected', lastChecked: new Date() },
      { service: 'Auth', endpoint: '/api/auth/me', status: 'disconnected', lastChecked: new Date() },
      { service: 'Auth', endpoint: '/api/auth/update-profile', status: 'disconnected', lastChecked: new Date() },
      { service: 'Auth', endpoint: '/api/auth/change-password', status: 'disconnected', lastChecked: new Date() },
      { service: 'Auth', endpoint: '/api/auth/forgot-password', status: 'disconnected', lastChecked: new Date() },
      { service: 'Auth', endpoint: '/api/auth/reset-password', status: 'disconnected', lastChecked: new Date() },
      { service: 'Auth', endpoint: '/api/auth/logout', status: 'disconnected', lastChecked: new Date() },

      // Courses APIs
      { service: 'Courses', endpoint: '/api/courses', status: 'disconnected', lastChecked: new Date() },
      { service: 'Courses', endpoint: '/api/courses/featured', status: 'disconnected', lastChecked: new Date() },
      { service: 'Courses', endpoint: '/api/courses/popular', status: 'disconnected', lastChecked: new Date() },
      { service: 'Courses', endpoint: '/api/courses/detailed', status: 'disconnected', lastChecked: new Date() },
      { service: 'Courses', endpoint: '/api/courses/filter', status: 'disconnected', lastChecked: new Date() },
      { service: 'Courses', endpoint: '/api/courses/category', status: 'disconnected', lastChecked: new Date() },
      { service: 'Courses', endpoint: '/api/courses/search', status: 'disconnected', lastChecked: new Date() },
      { service: 'Courses', endpoint: '/api/courses/instructor', status: 'disconnected', lastChecked: new Date() },
      { service: 'Courses', endpoint: '/api/courses/institute', status: 'disconnected', lastChecked: new Date() },

      // Institutes APIs
      { service: 'Institutes', endpoint: '/api/institutes', status: 'disconnected', lastChecked: new Date() },
      { service: 'Institutes', endpoint: '/api/institutes/featured', status: 'disconnected', lastChecked: new Date() },
      { service: 'Institutes', endpoint: '/api/institutes/location', status: 'disconnected', lastChecked: new Date() },
      { service: 'Institutes', endpoint: '/api/institutes/type', status: 'disconnected', lastChecked: new Date() },
      { service: 'Institutes', endpoint: '/api/institutes/search', status: 'disconnected', lastChecked: new Date() },

      // Trainers APIs
      { service: 'Trainers', endpoint: '/api/trainers', status: 'disconnected', lastChecked: new Date() },
      { service: 'Trainers', endpoint: '/api/trainers/featured', status: 'disconnected', lastChecked: new Date() },
      { service: 'Trainers', endpoint: '/api/trainers/specialization', status: 'disconnected', lastChecked: new Date() },
      { service: 'Trainers', endpoint: '/api/trainers/available', status: 'disconnected', lastChecked: new Date() },
      { service: 'Trainers', endpoint: '/api/trainers/search', status: 'disconnected', lastChecked: new Date() },

      // Mentors APIs
      { service: 'Mentors', endpoint: '/api/mentors', status: 'disconnected', lastChecked: new Date() },
      { service: 'Mentors', endpoint: '/api/mentors/featured', status: 'disconnected', lastChecked: new Date() },
      { service: 'Mentors', endpoint: '/api/mentors/domain', status: 'disconnected', lastChecked: new Date() },
      { service: 'Mentors', endpoint: '/api/mentors/available', status: 'disconnected', lastChecked: new Date() },
      { service: 'Mentors', endpoint: '/api/mentors/search', status: 'disconnected', lastChecked: new Date() },

      // News APIs
      { service: 'News', endpoint: '/api/news', status: 'disconnected', lastChecked: new Date() },
      { service: 'News', endpoint: '/api/news/featured', status: 'disconnected', lastChecked: new Date() },
      { service: 'News', endpoint: '/api/news/categories/list', status: 'disconnected', lastChecked: new Date() },
      { service: 'News', endpoint: '/api/news/category', status: 'disconnected', lastChecked: new Date() },

      // Search APIs
      { service: 'Search', endpoint: '/api/search', status: 'disconnected', lastChecked: new Date() },
      { service: 'Search', endpoint: '/api/search/suggestions', status: 'disconnected', lastChecked: new Date() },
      { service: 'Search', endpoint: '/api/search/advanced', status: 'disconnected', lastChecked: new Date() },
      { service: 'Search', endpoint: '/api/search/filters', status: 'disconnected', lastChecked: new Date() },

      // Upload APIs
      { service: 'Upload', endpoint: '/api/upload/single', status: 'disconnected', lastChecked: new Date() },
      { service: 'Upload', endpoint: '/api/upload/multiple', status: 'disconnected', lastChecked: new Date() },
      { service: 'Upload', endpoint: '/api/upload/avatar', status: 'disconnected', lastChecked: new Date() },
      { service: 'Upload', endpoint: '/api/upload/course-image', status: 'disconnected', lastChecked: new Date() },
      { service: 'Upload', endpoint: '/api/upload/institute-files', status: 'disconnected', lastChecked: new Date() },
      { service: 'Upload', endpoint: '/api/upload/certificate', status: 'disconnected', lastChecked: new Date() },
      { service: 'Upload', endpoint: '/api/upload/gallery', status: 'disconnected', lastChecked: new Date() },

      // Dashboard APIs
      { service: 'Dashboard', endpoint: '/api/dashboard/stats', status: 'disconnected', lastChecked: new Date() },
      { service: 'Dashboard', endpoint: '/api/dashboard/enrollments', status: 'disconnected', lastChecked: new Date() },
      { service: 'Dashboard', endpoint: '/api/dashboard/learning-paths', status: 'disconnected', lastChecked: new Date() },
      { service: 'Dashboard', endpoint: '/api/dashboard/notifications', status: 'disconnected', lastChecked: new Date() },
      { service: 'Dashboard', endpoint: '/api/dashboard/events', status: 'disconnected', lastChecked: new Date() },
      { service: 'Dashboard', endpoint: '/api/dashboard/quick-actions', status: 'disconnected', lastChecked: new Date() },
      { service: 'Dashboard', endpoint: '/api/dashboard/activities', status: 'disconnected', lastChecked: new Date() },
      { service: 'Dashboard', endpoint: '/api/dashboard/analytics', status: 'disconnected', lastChecked: new Date() },

      // Import APIs
      { service: 'Import', endpoint: '/api/import', status: 'disconnected', lastChecked: new Date() },
      { service: 'Import', endpoint: '/api/import/template', status: 'disconnected', lastChecked: new Date() },
      { service: 'Import', endpoint: '/api/import/download-template', status: 'disconnected', lastChecked: new Date() },
      { service: 'Import', endpoint: '/api/import/history', status: 'disconnected', lastChecked: new Date() },

      // Wishlist APIs
      { service: 'Wishlist', endpoint: '/api/wishlist', status: 'disconnected', lastChecked: new Date() },
      { service: 'Wishlist', endpoint: '/api/wishlist/stats', status: 'disconnected', lastChecked: new Date() },

      // Cart APIs
      { service: 'Cart', endpoint: '/api/cart', status: 'disconnected', lastChecked: new Date() },
      { service: 'Cart', endpoint: '/api/cart/items', status: 'disconnected', lastChecked: new Date() },
      { service: 'Cart', endpoint: '/api/cart/summary', status: 'disconnected', lastChecked: new Date() },
      { service: 'Cart', endpoint: '/api/cart/checkout', status: 'disconnected', lastChecked: new Date() },

      // Orders APIs
      { service: 'Orders', endpoint: '/api/orders', status: 'disconnected', lastChecked: new Date() },
      { service: 'Orders', endpoint: '/api/orders/stats/summary', status: 'disconnected', lastChecked: new Date() },

      // Users APIs
      { service: 'Users', endpoint: '/api/users', status: 'disconnected', lastChecked: new Date() },
      { service: 'Users', endpoint: '/api/users/stats', status: 'disconnected', lastChecked: new Date() },
      { service: 'Users', endpoint: '/api/users/search', status: 'disconnected', lastChecked: new Date() },
      { service: 'Users', endpoint: '/api/users/role', status: 'disconnected', lastChecked: new Date() }
    ];

    this.integrationStatus.next(statuses);
  }

  // Check API connectivity
  checkApiConnectivity(endpoint: string): Observable<ApiIntegrationStatus> {
    return this.apiService.get<any>(endpoint).pipe(
      map(() => ({
        service: this.getServiceFromEndpoint(endpoint),
        endpoint,
        status: 'connected' as const,
        lastChecked: new Date()
      })),
      catchError(error => of({
        service: this.getServiceFromEndpoint(endpoint),
        endpoint,
        status: 'error' as const,
        lastChecked: new Date(),
        errorMessage: error.message || 'Connection failed'
      })),
      tap(status => this.updateIntegrationStatus(status))
    );
  }

  // Check all APIs connectivity
  checkAllApisConnectivity(): Observable<ApiIntegrationStatus[]> {
    const statuses = this.integrationStatus.value;
    const checks = statuses.map(status => this.checkApiConnectivity(status.endpoint));
    
    return new Observable(observer => {
      let completed = 0;
      const results: ApiIntegrationStatus[] = [];
      
      checks.forEach(check => {
        check.subscribe(result => {
          results.push(result);
          completed++;
          
          if (completed === checks.length) {
            observer.next(results);
            observer.complete();
          }
        });
      });
    });
  }

  // Update integration status
  private updateIntegrationStatus(newStatus: ApiIntegrationStatus): void {
    const currentStatuses = this.integrationStatus.value;
    const updatedStatuses = currentStatuses.map(status => 
      status.endpoint === newStatus.endpoint ? newStatus : status
    );
    this.integrationStatus.next(updatedStatuses);
  }

  // Get service name from endpoint
  private getServiceFromEndpoint(endpoint: string): string {
    const serviceMap: { [key: string]: string } = {
      '/api/home': 'Home',
      '/api/auth': 'Auth',
      '/api/courses': 'Courses',
      '/api/institutes': 'Institutes',
      '/api/trainers': 'Trainers',
      '/api/mentors': 'Mentors',
      '/api/news': 'News',
      '/api/search': 'Search',
      '/api/upload': 'Upload',
      '/api/dashboard': 'Dashboard',
      '/api/import': 'Import',
      '/api/wishlist': 'Wishlist',
      '/api/cart': 'Cart',
      '/api/orders': 'Orders',
      '/api/users': 'Users'
    };

    for (const [prefix, service] of Object.entries(serviceMap)) {
      if (endpoint.startsWith(prefix)) {
        return service;
      }
    }
    return 'Unknown';
  }

  // Get component API mapping
  getComponentApiMapping(): ComponentApiMapping[] {
    return [
      {
        component: 'HomeComponent',
        apis: [
          { endpoint: '/api/home/trending-courses', method: 'GET', description: 'Get trending courses', integrated: true, service: 'HomeService' },
          { endpoint: '/api/home/highlights', method: 'GET', description: 'Get home highlights', integrated: true, service: 'HomeService' },
          { endpoint: '/api/home/achievements', method: 'GET', description: 'Get achievements', integrated: true, service: 'HomeService' },
          { endpoint: '/api/home/services', method: 'GET', description: 'Get services', integrated: true, service: 'HomeService' },
          { endpoint: '/api/home/reviews', method: 'GET', description: 'Get reviews', integrated: true, service: 'HomeService' },
          { endpoint: '/api/home/stats', method: 'GET', description: 'Get home stats', integrated: true, service: 'HomeService' },
          { endpoint: '/api/home/send-message', method: 'POST', description: 'Send contact message', integrated: true, service: 'HomeService' }
        ]
      },
      {
        component: 'CoursesComponent',
        apis: [
          { endpoint: '/api/courses', method: 'GET', description: 'Get all courses', integrated: true, service: 'CoursesService' },
          { endpoint: '/api/courses/featured', method: 'GET', description: 'Get featured courses', integrated: true, service: 'CoursesService' },
          { endpoint: '/api/courses/popular', method: 'GET', description: 'Get popular courses', integrated: true, service: 'CoursesService' },
          { endpoint: '/api/courses/filter', method: 'GET', description: 'Filter courses', integrated: true, service: 'CoursesService' },
          { endpoint: '/api/courses/search', method: 'GET', description: 'Search courses', integrated: true, service: 'CoursesService' },
          { endpoint: '/api/courses', method: 'POST', description: 'Create course', integrated: true, service: 'CoursesService' },
          { endpoint: '/api/courses/:id', method: 'PUT', description: 'Update course', integrated: true, service: 'CoursesService' },
          { endpoint: '/api/courses/:id', method: 'DELETE', description: 'Delete course', integrated: true, service: 'CoursesService' }
        ]
      },
      {
        component: 'InstitutesComponent',
        apis: [
          { endpoint: '/api/institutes', method: 'GET', description: 'Get all institutes', integrated: true, service: 'InstitutesService' },
          { endpoint: '/api/institutes/featured', method: 'GET', description: 'Get featured institutes', integrated: true, service: 'InstitutesService' },
          { endpoint: '/api/institutes/search', method: 'GET', description: 'Search institutes', integrated: true, service: 'InstitutesService' },
          { endpoint: '/api/institutes', method: 'POST', description: 'Create institute', integrated: true, service: 'InstitutesService' },
          { endpoint: '/api/institutes/:id', method: 'PUT', description: 'Update institute', integrated: true, service: 'InstitutesService' },
          { endpoint: '/api/institutes/:id', method: 'DELETE', description: 'Delete institute', integrated: true, service: 'InstitutesService' }
        ]
      },
      {
        component: 'TrainersComponent',
        apis: [
          { endpoint: '/api/trainers', method: 'GET', description: 'Get all trainers', integrated: true, service: 'TrainersService' },
          { endpoint: '/api/trainers/featured', method: 'GET', description: 'Get featured trainers', integrated: true, service: 'TrainersService' },
          { endpoint: '/api/trainers/search', method: 'GET', description: 'Search trainers', integrated: true, service: 'TrainersService' },
          { endpoint: '/api/trainers', method: 'POST', description: 'Create trainer', integrated: true, service: 'TrainersService' },
          { endpoint: '/api/trainers/:id', method: 'PUT', description: 'Update trainer', integrated: true, service: 'TrainersService' },
          { endpoint: '/api/trainers/:id', method: 'DELETE', description: 'Delete trainer', integrated: true, service: 'TrainersService' }
        ]
      },
      {
        component: 'MentorsComponent',
        apis: [
          { endpoint: '/api/mentors', method: 'GET', description: 'Get all mentors', integrated: true, service: 'MentorsService' },
          { endpoint: '/api/mentors/featured', method: 'GET', description: 'Get featured mentors', integrated: true, service: 'MentorsService' },
          { endpoint: '/api/mentors/search', method: 'GET', description: 'Search mentors', integrated: true, service: 'MentorsService' },
          { endpoint: '/api/mentors', method: 'POST', description: 'Create mentor', integrated: true, service: 'MentorsService' },
          { endpoint: '/api/mentors/:id', method: 'PUT', description: 'Update mentor', integrated: true, service: 'MentorsService' },
          { endpoint: '/api/mentors/:id', method: 'DELETE', description: 'Delete mentor', integrated: true, service: 'MentorsService' }
        ]
      },
      {
        component: 'NewsComponent',
        apis: [
          { endpoint: '/api/news', method: 'GET', description: 'Get all news', integrated: true, service: 'NewsService' },
          { endpoint: '/api/news/featured', method: 'GET', description: 'Get featured news', integrated: true, service: 'NewsService' },
          { endpoint: '/api/news/categories/list', method: 'GET', description: 'Get news categories', integrated: true, service: 'NewsService' },
          { endpoint: '/api/news/category/:category', method: 'GET', description: 'Get news by category', integrated: true, service: 'NewsService' }
        ]
      },
      {
        component: 'SearchComponent',
        apis: [
          { endpoint: '/api/search', method: 'GET', description: 'Global search', integrated: true, service: 'SearchService' },
          { endpoint: '/api/search/suggestions', method: 'GET', description: 'Get search suggestions', integrated: true, service: 'SearchService' },
          { endpoint: '/api/search/advanced', method: 'GET', description: 'Advanced search', integrated: true, service: 'SearchService' },
          { endpoint: '/api/search/filters', method: 'GET', description: 'Get search filters', integrated: true, service: 'SearchService' }
        ]
      },
      {
        component: 'DashboardComponent',
        apis: [
          { endpoint: '/api/dashboard/stats', method: 'GET', description: 'Get dashboard stats', integrated: true, service: 'DashboardService' },
          { endpoint: '/api/dashboard/enrollments', method: 'GET', description: 'Get enrollments', integrated: true, service: 'DashboardService' },
          { endpoint: '/api/dashboard/notifications', method: 'GET', description: 'Get notifications', integrated: true, service: 'DashboardService' },
          { endpoint: '/api/dashboard/activities', method: 'GET', description: 'Get activities', integrated: true, service: 'DashboardService' }
        ]
      },
      {
        component: 'ImportComponent',
        apis: [
          { endpoint: '/api/import/:entityType', method: 'POST', description: 'Import data', integrated: false, service: 'ImportService' },
          { endpoint: '/api/import/template/:entityType', method: 'GET', description: 'Get import template', integrated: false, service: 'ImportService' },
          { endpoint: '/api/import/download-template/:entityType', method: 'GET', description: 'Download template', integrated: false, service: 'ImportService' },
          { endpoint: '/api/import/history', method: 'GET', description: 'Get import history', integrated: false, service: 'ImportService' }
        ]
      },
      {
        component: 'WishlistComponent',
        apis: [
          { endpoint: '/api/wishlist', method: 'GET', description: 'Get wishlist', integrated: false, service: 'WishlistService' },
          { endpoint: '/api/wishlist', method: 'POST', description: 'Add to wishlist', integrated: false, service: 'WishlistService' },
          { endpoint: '/api/wishlist/:id', method: 'DELETE', description: 'Remove from wishlist', integrated: false, service: 'WishlistService' },
          { endpoint: '/api/wishlist/stats', method: 'GET', description: 'Get wishlist stats', integrated: false, service: 'WishlistService' }
        ]
      }
    ];
  }

  // Get integration summary
  getIntegrationSummary(): Observable<{
    totalApis: number;
    integratedApis: number;
    pendingApis: number;
    errorApis: number;
    services: { [key: string]: { total: number; integrated: number; pending: number; errors: number } };
  }> {
    return this.integrationStatus$.pipe(
      map(statuses => {
        const totalApis = statuses.length;
        const integratedApis = statuses.filter(s => s.status === 'connected').length;
        const pendingApis = statuses.filter(s => s.status === 'disconnected').length;
        const errorApis = statuses.filter(s => s.status === 'error').length;

        const services: { [key: string]: { total: number; integrated: number; pending: number; errors: number } } = {};
        
        statuses.forEach(status => {
          if (!services[status.service]) {
            services[status.service] = { total: 0, integrated: 0, pending: 0, errors: 0 };
          }
          services[status.service].total++;
          if (status.status === 'connected') services[status.service].integrated++;
          else if (status.status === 'disconnected') services[status.service].pending++;
          else if (status.status === 'error') services[status.service].errors++;
        });

        return {
          totalApis,
          integratedApis,
          pendingApis,
          errorApis,
          services
        };
      })
    );
  }

  // Test specific API endpoint
  testApiEndpoint(endpoint: string): Observable<{ success: boolean; response?: any; error?: string }> {
    return this.apiService.get<any>(endpoint).pipe(
      map(response => ({ success: true, response })),
      catchError(error => of({ success: false, error: error.message || 'API test failed' }))
    );
  }

  // Get API documentation
  getApiDocumentation(): Observable<any> {
    return this.apiService.get<any>('/api/docs').pipe(
      catchError(() => of({
        message: 'API documentation not available',
        endpoints: this.getComponentApiMapping()
      }))
    );
  }
}











