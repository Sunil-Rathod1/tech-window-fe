import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

export interface Trainer {
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
  specialization: string;
  experience: {
    years: number;
    description: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    year: number;
    field: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    year: number;
  }>;
  skills: Array<{
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    yearsOfExperience: number;
  }>;
  pricing: {
    hourlyRate: number;
    currency: string;
  };
  currentPosition: {
    title: string;
    company: string;
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
    teaching: number;
    communication: number;
    punctuality: number;
    totalReviews: number;
  };
  stats: {
    totalStudents: number;
    totalSessions: number;
    totalHours: number;
    completionRate: number;
  };
  isVerified: boolean;
  isFeatured: boolean;
  isActive: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// Enhanced trainer profile interface based on the image
export interface TrainerProfile {
  id: string;
  name: string;
  title: string;
  specialization: string;
  price: string;
  profilePicture: string;
  isOnline: boolean;
  stats: {
    totalClicks: number;
    totalImpressions: number;
    averageCTR: number;
    averagePosition: number;
    totalStudents: number;
    totalLikes: number;
  };
  biography: string;
  expertiseAreas: string[];
  courseDetails: {
    duration: string;
    modules: number;
    certification: boolean;
  };
  certifications: Array<{
    name: string;
    issuer: string;
    year: number;
    icon: string;
    badge: string;
  }>;
  rating: {
    overall: number;
    totalReviews: number;
    stars: number;
  };
  contact: {
    email: string;
    phone: string;
    linkedin: string;
  };
  socialMedia: {
    github?: string;
    portfolio?: string;
    youtube?: string;
    twitter?: string;
  };
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface for detailed trainers API response
export interface DetailedTrainer {
  id: string;
  courseName: string;
  title: string;
  studentsCount: number;
  likes: number;
  description: string;
  technologies: string[];
  duration: string;
  modules: number;
  certifications: string[];
  rating: number;
  reviews: number;
  contact: {
    email: string;
    phone: string;
    linkedin: string;
  };
  profile: {
    name: string;
    avatar: string;
    experience: string;
    specialization: string;
    company: string;
    location: string;
    bio: string;
    achievements: string[];
    socialMedia: {
      twitter: string;
      github: string;
      website: string;
    };
  };
  courses: Array<{
    id: string;
    name: string;
    students: number;
    rating: number;
  }>;
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TrainerFilters {
  page?: number;
  limit?: number;
  specialization?: string;
  experienceLevel?: string;
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  verified?: boolean;
  search?: string;
  sort?: 'rating' | 'experience' | 'price' | 'students' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface CreateTrainerRequest {
  name?: string;
  phone?: string;
  email?: string;
  specialization: string;
  experience: {
    years: number;
    description: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    year: number;
    field: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    year: number;
  }>;
  skills: Array<{
    name: string;
    level: string;
    yearsOfExperience: number;
  }>;
  pricing: {
    hourlyRate: number;
    currency: string;
  };
  currentPosition: {
    title: string;
    company: string;
  };
  demoVideo?: string;
  objectives?: string[];
  syllabus?: Array<{
    moduleTitle: string;
    hours: number;
    lessons: Array<{
      title: string;
    }>;
  }>;
  avatar?: string;
}

export interface UpdateTrainerRequest extends Partial<CreateTrainerRequest> {}

@Injectable({
  providedIn: 'root'
})
export class TrainersService {
  constructor(private apiService: ApiService) { }

  // Get all trainers with filters - using public endpoint
  getTrainers(filters?: TrainerFilters): Observable<{ trainers: Trainer[]; count: number; pagination: any }> {
    return this.apiService.get<Trainer[]>('/trainers/public', filters).pipe(
      map((response: any) => ({
        trainers: response.data || [],
        count: response.count || 0,
        pagination: response.pagination
      }))
    );
  }

  // Get single trainer by ID
  getTrainer(id: string): Observable<Trainer> {
    return this.apiService.get<Trainer>(`/trainers/${id}`).pipe(
      map((response: ApiResponse<Trainer>) => response.data!)
    );
  }

  // Get featured trainers
  getFeaturedTrainers(): Observable<Trainer[]> {
    return this.apiService.get<Trainer[]>('/trainers/featured').pipe(
      map((response: ApiResponse<Trainer[]>) => response.data || [])
    );
  }

  // Get trainers by specialization
  getTrainersBySpecialization(specialization: string): Observable<Trainer[]> {
    return this.apiService.get<Trainer[]>(`/trainers/specialization/${specialization}`).pipe(
      map((response: ApiResponse<Trainer[]>) => response.data || [])
    );
  }

  // Get available trainers
  getAvailableTrainers(): Observable<Trainer[]> {
    return this.apiService.get<Trainer[]>('/trainers/available').pipe(
      map((response: ApiResponse<Trainer[]>) => response.data || [])
    );
  }

  // Search trainers
  searchTrainers(query: string): Observable<Trainer[]> {
    return this.apiService.get<Trainer[]>('/trainers/search', { q: query }).pipe(
      map((response: ApiResponse<Trainer[]>) => response.data || [])
    );
  }

  // Create trainer profile
  createTrainer(data: CreateTrainerRequest): Observable<Trainer> {
    return this.apiService.postAuth<Trainer>('/trainers', data).pipe(
      map((response: ApiResponse<Trainer>) => response.data!)
    );
  }

  // Update trainer profile
  updateTrainer(id: string, data: UpdateTrainerRequest): Observable<Trainer> {
    return this.apiService.putAuth<Trainer>(`/trainers/${id}`, data).pipe(
      map((response: ApiResponse<Trainer>) => response.data!)
    );
  }

  // Delete trainer profile
  deleteTrainer(id: string): Observable<any> {
    return this.apiService.deleteAuth<any>(`/trainers/${id}`);
  }

  // Update trainer rating
  updateTrainerRating(id: string, teaching: number, communication: number, punctuality: number): Observable<any> {
    return this.apiService.putAuth<any>(`/trainers/${id}/rating`, {
      teaching,
      communication,
      punctuality
    });
  }

  // Get trainer statistics
  getTrainerStats(id: string): Observable<any> {
    return this.apiService.getAuth<any>(`/trainers/${id}/stats`).pipe(
      map((response: ApiResponse<any>) => response.data!)
    );
  }

  // Approve trainer (Admins only)
  approveTrainer(id: string): Observable<Trainer> {
    return this.apiService.putAuth<Trainer>(`/trainers/${id}/approve`, {}).pipe(
      map((response: ApiResponse<Trainer>) => response.data!)
    );
  }

  // Reject trainer (Admins only)
  rejectTrainer(id: string, reason?: string): Observable<any> {
    return this.apiService.putAuth<any>(`/trainers/${id}/reject`, { reason });
  }

  // Get trainer specializations
  getSpecializations(): string[] {
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

  // Get experience levels
  getExperienceLevels(): string[] {
    return ['Junior', 'Intermediate', 'Senior', 'Expert'];
  }

  // Get skill levels
  getSkillLevels(): string[] {
    return ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  }

  // Get sort options
  getSortOptions(): Array<{ value: string; label: string }> {
    return [
      { value: 'rating', label: 'Rating' },
      { value: 'experience', label: 'Experience' },
      { value: 'price', label: 'Price' },
      { value: 'students', label: 'Students' },
      { value: 'createdAt', label: 'Date Created' }
    ];
  }

  // Get detailed trainers with all information
  getDetailedTrainers(page: number = 1, limit: number = 10): Observable<{data: DetailedTrainer[], pagination: any}> {
    return this.apiService.get<DetailedTrainer[]>(`/trainers/detailed?page=${page}&limit=${limit}`).pipe(
      map((response: any) => ({
        data: response.data || [],
        pagination: response.pagination || {}
      }))
    );
  }

  // Filter and search trainers with advanced filters
  filterTrainers(filters: any): Observable<{data: Trainer[], filters: any, pagination: any}> {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key].toString());
      }
    });

    return this.apiService.get<Trainer[]>(`/trainers/filter?${queryParams.toString()}`).pipe(
      map((response: any) => ({
        data: response.data || [],
        filters: response.filters || {},
        pagination: response.pagination || {}
      }))
    );
  }

  /**
   * Get enrolled students for authenticated trainer
   */
  getMyStudents(filters?: {
    status?: string;
    courseId?: string;
    paymentStatus?: string;
    search?: string;
  }): Observable<{
    students: any[];
    stats: {
      totalStudents: number;
      activeStudents: number;
      paidStudents: number;
      totalRevenue: number;
    };
  }> {
    let queryParams = '';
    if (filters) {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] !== null && 
            filters[key as keyof typeof filters] !== undefined && 
            filters[key as keyof typeof filters] !== '') {
          params.append(key, filters[key as keyof typeof filters]!.toString());
        }
      });
      queryParams = params.toString() ? `?${params.toString()}` : '';
    }

    return this.apiService.getAuth<any>(`/trainers/my-students${queryParams}`).pipe(
      map((response: any) => {
        // Backend returns: { success: true, stats: {...}, data: [...] }
        const students = response.data || [];
        const stats = response.stats || {
          totalStudents: 0,
          activeStudents: 0,
          paidStudents: 0,
          totalRevenue: 0
        };
        
        return {
          students: students,
          stats: stats
        };
      })
    );
  }
}
