import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  deadline: string;
  isActive: boolean;
  isFeatured?: boolean;
  category: string;
  skills: string[];
  logo?: string;
}

export interface JobStats {
  totalJobs: number;
  activeJobs: number;
  peoplePlaced: number;
  companies: number;
  successRate: number;
}

export interface JobFilters {
  page?: number;
  limit?: number;
  category?: string;
  type?: string;
  location?: string;
  experience?: string;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  constructor(private http: HttpClient, private apiService: ApiService) { }

  // Get all jobs with filters and pagination
  getJobs(filters: JobFilters = {}): Observable<{data: Job[], pagination: any}> {
    let params = new HttpParams();
    
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.category) params = params.set('category', filters.category);
    if (filters.type) params = params.set('type', filters.type);
    if (filters.location) params = params.set('location', filters.location);
    if (filters.experience) params = params.set('experience', filters.experience);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.sort) params = params.set('sort', filters.sort);
    if (filters.order) params = params.set('order', filters.order);

    return this.http.get<{success: boolean, data: Job[], pagination: any}>(`${this.apiService.getBaseUrl()}/jobs`, { params }).pipe(
      map((response: any) => ({
        data: response.data || [],
        pagination: response.pagination || {}
      })),
      catchError(error => {
        console.error('Error fetching jobs:', error);
        throw error;
      })
    );
  }

  // Get single job by ID
  getJobById(id: string): Observable<Job> {
    return this.http.get<{success: boolean, data: Job}>(`${this.apiService.getBaseUrl()}/jobs/${id}`).pipe(
      map((response: any) => response.data),
      catchError(error => {
        console.error('Error fetching job:', error);
        throw error;
      })
    );
  }

  // Get featured jobs
  getFeaturedJobs(): Observable<Job[]> {
    return this.http.get<{success: boolean, data: Job[]}>(`${this.apiService.getBaseUrl()}/jobs/featured`).pipe(
      map((response: any) => response.data || []),
      catchError(error => {
        console.error('Error fetching featured jobs:', error);
        throw error;
      })
    );
  }

  // Apply for a job
  applyForJob(jobId: string): Observable<any> {
    return this.http.post<{success: boolean, message: string}>(`${this.apiService.getBaseUrl()}/jobs/${jobId}/apply`, {}).pipe(
      map((response: any) => response),
      catchError(error => {
        console.error('Error applying for job:', error);
        throw error;
      })
    );
  }

  // Create job (for employers)
  createJob(jobData: Partial<Job>): Observable<Job> {
    return this.http.post<{success: boolean, data: Job}>(`${this.apiService.getBaseUrl()}/jobs`, jobData).pipe(
      map((response: any) => response.data),
      catchError(error => {
        console.error('Error creating job:', error);
        throw error;
      })
    );
  }

  // Update job (for employers)
  updateJob(jobId: string, jobData: Partial<Job>): Observable<Job> {
    return this.http.put<{success: boolean, data: Job}>(`${this.apiService.getBaseUrl()}/jobs/${jobId}`, jobData).pipe(
      map((response: any) => response.data),
      catchError(error => {
        console.error('Error updating job:', error);
        throw error;
      })
    );
  }

  // Delete job (for employers)
  deleteJob(jobId: string): Observable<any> {
    return this.http.delete<{success: boolean, message: string}>(`${this.apiService.getBaseUrl()}/jobs/${jobId}`).pipe(
      map((response: any) => response),
      catchError(error => {
        console.error('Error deleting job:', error);
        throw error;
      })
    );
  }

  // Get job statistics
  getJobStats(): Observable<JobStats> {
    // For now, return mock stats since we don't have a stats endpoint
    return new Observable(observer => {
      observer.next({
        totalJobs: 1250,
        activeJobs: 89,
        peoplePlaced: 3420,
        companies: 156,
        successRate: 94.5
      });
      observer.complete();
    });
  }

  // Get available categories
  getCategories(): string[] {
    return ['All', 'Technology', 'Marketing', 'Sales', 'Design', 'Engineering', 'Management', 'Finance', 'Healthcare', 'Education'];
  }

  // Get available job types
  getJobTypes(): string[] {
    return ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  }

  // Get available locations
  getLocations(): string[] {
    return ['All', 'New York', 'San Francisco', 'London', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Remote'];
  }
}




