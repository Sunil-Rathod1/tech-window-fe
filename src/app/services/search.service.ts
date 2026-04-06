import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

export interface SearchResult {
  courses?: {
    count: number;
    data: any[];
  };
  institutes?: {
    count: number;
    data: any[];
  };
  trainers?: {
    count: number;
    data: any[];
  };
  mentors?: {
    count: number;
    data: any[];
  };
}

export interface SearchSuggestion {
  text: string;
  type: 'course' | 'institute' | 'trainer' | 'mentor';
  category: string;
}

export interface AdvancedSearchFilters {
  q: string;
  type?: 'courses' | 'institutes' | 'trainers' | 'mentors';
  category?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  location?: string;
  availability?: boolean;
  page?: number;
  limit?: number;
}

export interface SearchFilters {
  categories: {
    courses: string[];
    institutes: string[];
    trainers: string[];
    mentors: string[];
  };
  levels: string[];
  experienceLevels: string[];
  types: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private apiService: ApiService) { }

  // Global search
  globalSearch(query: string, type?: string, limit?: number): Observable<{ query: string; totalResults: number; results: SearchResult }> {
    const params: any = { q: query };
    if (type) params.type = type;
    if (limit) params.limit = limit;

    return this.apiService.get<SearchResult>('/search', params).pipe(
      map((response: ApiResponse<SearchResult>) => ({
        query: response.data?.query || query,
        totalResults: response.data?.totalResults || 0,
        results: response.data || {}
      }))
    );
  }

  // Get search suggestions
  getSearchSuggestions(query: string): Observable<SearchSuggestion[]> {
    return this.apiService.get<SearchSuggestion[]>('/search/suggestions', { q: query }).pipe(
      map((response: ApiResponse<SearchSuggestion[]>) => response.data || [])
    );
  }

  // Advanced search
  advancedSearch(filters: AdvancedSearchFilters): Observable<{ query: string; filters: any; totalResults: number; results: SearchResult }> {
    return this.apiService.get<SearchResult>('/search/advanced', filters).pipe(
      map((response: ApiResponse<SearchResult>) => ({
        query: response.data?.query || filters.q,
        filters: response.data?.filters || filters,
        totalResults: response.data?.totalResults || 0,
        results: response.data || {}
      }))
    );
  }

  // Get search filters
  getSearchFilters(): Observable<SearchFilters> {
    return this.apiService.get<SearchFilters>('/search/filters').pipe(
      map((response: ApiResponse<SearchFilters>) => response.data!)
    );
  }

  // Search courses
  searchCourses(query: string, filters?: any): Observable<any[]> {
    const params = { q: query, ...filters };
    return this.apiService.get<any[]>('/courses/search', params).pipe(
      map((response: ApiResponse<any[]>) => response.data || [])
    );
  }

  // Search institutes
  searchInstitutes(query: string, filters?: any): Observable<any[]> {
    const params = { q: query, ...filters };
    return this.apiService.get<any[]>('/institutes/search', params).pipe(
      map((response: ApiResponse<any[]>) => response.data || [])
    );
  }

  // Search trainers
  searchTrainers(query: string, filters?: any): Observable<any[]> {
    const params = { q: query, ...filters };
    return this.apiService.get<any[]>('/trainers/search', params).pipe(
      map((response: ApiResponse<any[]>) => response.data || [])
    );
  }

  // Search mentors
  searchMentors(query: string, filters?: any): Observable<any[]> {
    const params = { q: query, ...filters };
    return this.apiService.get<any[]>('/mentors/search', params).pipe(
      map((response: ApiResponse<any[]>) => response.data || [])
    );
  }

  // Get search types
  getSearchTypes(): string[] {
    return ['courses', 'institutes', 'trainers', 'mentors'];
  }

  // Get course categories for search
  getCourseCategories(): string[] {
    return [
      'Programming',
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning',
      'DevOps',
      'Testing',
      'UI/UX Design',
      'Database',
      'Cloud Computing',
      'Cybersecurity',
      'Other'
    ];
  }

  // Get institute categories for search
  getInstituteCategories(): string[] {
    return ['Technology', 'Business', 'Arts', 'Science', 'Engineering', 'Medical', 'Law', 'Education', 'Other'];
  }

  // Get trainer specializations for search
  getTrainerSpecializations(): string[] {
    return [
      'Programming',
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning',
      'DevOps',
      'Testing',
      'UI/UX Design',
      'Database',
      'Cloud Computing',
      'Cybersecurity',
      'Other'
    ];
  }

  // Get mentor domains for search
  getMentorDomains(): string[] {
    return [
      'Career Guidance',
      'Technical Mentoring',
      'Leadership Development',
      'Startup Mentoring',
      'Personal Development',
      'Skill Enhancement',
      'Industry Knowledge',
      'Networking',
      'Interview Preparation',
      'Other'
    ];
  }

  // Get levels for search
  getLevels(): string[] {
    return ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  }

  // Get experience levels for search
  getExperienceLevels(): string[] {
    return ['Junior', 'Intermediate', 'Senior', 'Expert', 'Senior Expert'];
  }
}