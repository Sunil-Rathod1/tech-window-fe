import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface TrendingCourse {
  id: string;
  title: string;
  image: string;
  students: number;
  rating: number;
}

export interface Highlight {
  id: string;
  title: string;
  description: string;
  icon: string;
  count: string;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  count: string;
  description: string;
  icon: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface Review {
  id: string;
  studentName: string;
  author: string; // Added for template compatibility
  text: string; // Added for template compatibility
  review: string;
  course: string;
  rating: number;
  avatar: string;
  company: string;
  position: string;
  date: string;
}

export interface HomeStats {
  totalStudents: number;
  totalCourses: number;
  totalInstructors: number;
  totalReviews: number;
  averageRating: number;
  successRate: number;
}

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private apiService: ApiService) { }

  // Get trending courses
  getTrendingCourses(): Observable<TrendingCourse[]> {
    return this.apiService.get<TrendingCourse[]>('/all-courses/trending').pipe(
      map((response: any) => response.data || [])
    );
  }

  // Get highlights
  getHighlights(): Observable<Highlight[]> {
    return this.apiService.get<Highlight[]>('/home/highlights').pipe(
      map((response: any) => response.data || [])
    );
  }

  // Get achievements
  getAchievements(): Observable<Achievement[]> {
    return this.apiService.get<Achievement[]>('/home/achievements').pipe(
      map((response: any) => response.data || [])
    );
  }

  // Get services
  getServices(): Observable<Service[]> {
    return this.apiService.get<Service[]>('/home/services').pipe(
      map((response: any) => response.data || [])
    );
  }

  // Get reviews with pagination
  getReviews(page: number = 1, limit: number = 10): Observable<{data: Review[], pagination: any}> {
    return this.apiService.get<Review[]>(`/home/reviews?page=${page}&limit=${limit}`).pipe(
      map((response: any) => ({
        data: response.data || [],
        pagination: response.pagination || {}
      }))
    );
  }

  // Get home page statistics
  getHomeStats(): Observable<HomeStats> {
    return this.apiService.get<HomeStats>('/home/stats').pipe(
      map((response: any) => response.data || {})
    );
  }

  // Send contact message
  sendMessage(message: ContactMessage): Observable<any> {
    return this.apiService.post('/home/send-message', message);
  }
}
