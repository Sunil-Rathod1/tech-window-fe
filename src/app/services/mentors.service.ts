import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

export interface Mentor {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    phone?: string;
    bio?: string;
    location?: string;
  };
  domain: string;
  experience: {
    years: number;
    description: string;
  };
  expertise: Array<{
    area: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    yearsOfExperience: number;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: number;
    field: string;
  }>;
  currentPosition: {
    title: string;
    company: string;
  };
  pricing: {
    hourlyRate: number;
    currency: string;
  };
  availability: {
    isAvailable: boolean;
    schedule: Array<{
      day: string;
      startTime: string;
      endTime: string;
    }>;
  };
  rating: {
    overall: number;
    guidance: number;
    communication: number;
    availability: number;
    totalReviews: number;
  };
  stats: {
    totalMentees: number;
    totalSessions: number;
    totalHours: number;
    successRate: number;
  };
  isVerified: boolean;
  isFeatured: boolean;
  isActive: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface MentorFilters {
  page?: number;
  limit?: number;
  domain?: string;
  experienceLevel?: string;
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  verified?: boolean;
  search?: string;
  sort?: 'rating' | 'experience' | 'price' | 'mentees' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface CreateMentorRequest {
  domain: string;
  experience: {
    years: number;
    description: string;
  };
  expertise: Array<{
    area: string;
    level: string;
    yearsOfExperience: number;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: number;
    field: string;
  }>;
  currentPosition: {
    title: string;
    company: string;
  };
  pricing: {
    hourlyRate: number;
    currency: string;
  };
}

export interface UpdateMentorRequest extends Partial<CreateMentorRequest> {}

@Injectable({
  providedIn: 'root'
})
export class MentorsService {
  constructor(private apiService: ApiService) { }

  // Get all mentors with filters
  getMentors(filters?: MentorFilters): Observable<{ mentors: Mentor[]; count: number; pagination: any }> {
    return this.apiService.get<Mentor[]>('/mentors', filters).pipe(
      map((response: ApiResponse<Mentor[]>) => ({
        mentors: response.data || [],
        count: response.count || 0,
        pagination: response.pagination
      }))
    );
  }

  // Get single mentor by ID
  getMentor(id: string): Observable<Mentor> {
    return this.apiService.get<Mentor>(`/mentors/${id}`).pipe(
      map((response: ApiResponse<Mentor>) => response.data!)
    );
  }

  // Get featured mentors
  getFeaturedMentors(): Observable<Mentor[]> {
    return this.apiService.get<Mentor[]>('/mentors/featured').pipe(
      map((response: ApiResponse<Mentor[]>) => response.data || [])
    );
  }

  // Get mentors by domain
  getMentorsByDomain(domain: string): Observable<Mentor[]> {
    return this.apiService.get<Mentor[]>(`/mentors/domain/${domain}`).pipe(
      map((response: ApiResponse<Mentor[]>) => response.data || [])
    );
  }

  // Get available mentors
  getAvailableMentors(): Observable<Mentor[]> {
    return this.apiService.get<Mentor[]>('/mentors/available').pipe(
      map((response: ApiResponse<Mentor[]>) => response.data || [])
    );
  }

  // Search mentors
  searchMentors(query: string): Observable<Mentor[]> {
    return this.apiService.get<Mentor[]>('/mentors/search', { q: query }).pipe(
      map((response: ApiResponse<Mentor[]>) => response.data || [])
    );
  }

  // Create mentor profile
  createMentor(data: CreateMentorRequest): Observable<Mentor> {
    return this.apiService.postAuth<Mentor>('/mentors', data).pipe(
      map((response: ApiResponse<Mentor>) => response.data!)
    );
  }

  // Update mentor profile
  updateMentor(id: string, data: UpdateMentorRequest): Observable<Mentor> {
    return this.apiService.putAuth<Mentor>(`/mentors/${id}`, data).pipe(
      map((response: ApiResponse<Mentor>) => response.data!)
    );
  }

  // Delete mentor profile
  deleteMentor(id: string): Observable<any> {
    return this.apiService.deleteAuth<any>(`/mentors/${id}`);
  }

  // Update mentor rating
  updateMentorRating(id: string, guidance: number, communication: number, availability: number): Observable<any> {
    return this.apiService.putAuth<any>(`/mentors/${id}/rating`, {
      guidance,
      communication,
      availability
    });
  }

  // Get mentor statistics
  getMentorStats(id: string): Observable<any> {
    return this.apiService.getAuth<any>(`/mentors/${id}/stats`).pipe(
      map((response: ApiResponse<any>) => response.data!)
    );
  }

  // Approve mentor (Admins only)
  approveMentor(id: string): Observable<Mentor> {
    return this.apiService.putAuth<Mentor>(`/mentors/${id}/approve`, {}).pipe(
      map((response: ApiResponse<Mentor>) => response.data!)
    );
  }

  // Reject mentor (Admins only)
  rejectMentor(id: string, reason?: string): Observable<any> {
    return this.apiService.putAuth<any>(`/mentors/${id}/reject`, { reason });
  }

  // Get mentor domains
  getDomains(): string[] {
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

  // Get experience levels
  getExperienceLevels(): string[] {
    return ['Junior', 'Intermediate', 'Senior', 'Expert', 'Senior Expert'];
  }

  // Get expertise levels
  getExpertiseLevels(): string[] {
    return ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  }

  // Get sort options
  getSortOptions(): Array<{ value: string; label: string }> {
    return [
      { value: 'rating', label: 'Rating' },
      { value: 'experience', label: 'Experience' },
      { value: 'price', label: 'Price' },
      { value: 'mentees', label: 'Mentees' },
      { value: 'createdAt', label: 'Date Created' }
    ];
  }

  // Get detailed mentors with all information
  getDetailedMentors(page: number = 1, limit: number = 10): Observable<{data: Mentor[], pagination: any}> {
    return this.apiService.get<Mentor[]>(`/mentors/detailed?page=${page}&limit=${limit}`).pipe(
      map((response: any) => ({
        data: response.data || [],
        pagination: response.pagination || {}
      }))
    );
  }

  // Filter and search mentors with advanced filters
  filterMentors(filters: any): Observable<{data: Mentor[], filters: any, pagination: any}> {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key].toString());
      }
    });

    return this.apiService.get<Mentor[]>(`/mentors/filter?${queryParams.toString()}`).pipe(
      map((response: any) => ({
        data: response.data || [],
        filters: response.filters || {},
        pagination: response.pagination || {}
      }))
    );
  }
}
