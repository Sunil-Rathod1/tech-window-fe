import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Institute {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  logo: string;
  banner: string;
  modes: {
    online: boolean;
    offline: boolean;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  contact: {
    email: string;
    phone: string;
    website: string;
    socialMedia: {
      facebook: string;
      twitter: string;
      linkedin: string;
      instagram: string;
    };
  };
  rating: {
    overall: number;
    teaching: number;
    facilities: number;
    placement: number;
    totalReviews: number;
  };
  students: {
    total: number;
    current: number;
    alumni: number;
  };
  faculty: {
    total: number;
    fullTime: number;
    partTime: number;
    industryExperts: number;
  };
  courses: {
    total: number;
    categories: string[];
    featured: string[];
  };
  placement: {
    placementRate: number;
    averagePackage: number;
    topRecruiters: string[];
    highestPackage: number;
  };
  facilities: {
    labs: number;
    classrooms: number;
    library: boolean;
    cafeteria: boolean;
    hostel: boolean;
    parking: boolean;
    wifi: boolean;
    airConditioning: boolean;
  };
  accreditation: {
    certified: boolean;
    certifyingBodies: string[];
    partnerships: string[];
  };
  experience: {
    years: number;
    description: string;
  };
  founded: number;
  isActive: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  // Enhanced fields
  averageRating: number;
  totalStudents: number;
  totalFaculty: number;
  placementRate: number;
  averagePackage: number;
  formattedFounded: number;
  formattedRating: string;
  formattedStudents: string;
  formattedPlacement: string;
  formattedReviews: string;
  formattedExperience: string;
  hasOnlineMode: boolean;
  hasOfflineMode: boolean;
  modeText: string;
  courseCategories: string[];
  quickStats: {
    rating: number;
    students: number;
    courses: number;
    faculty: number;
    placement: number;
    experience: number;
    reviews: number;
  };
  displayData: {
    name: string;
    description: string;
    logo: string;
    banner: string;
    location: string;
    fullAddress: string;
    phone: string;
    website: string;
    rating: number;
    studentsCount: number;
    coursesCount: number;
    experienceYears: number;
    reviewsCount: number;
    placementRate: number;
    averagePackage: number;
    onlineMode: boolean;
    offlineMode: boolean;
    courseCategories: string[];
    topRecruiters: string[];
  };
}

export interface InstitutesResponse {
  success: boolean;
  count: number;
  totalCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  data: Institute[];
  message: string;
}

export interface InstituteFilters {
  page?: number;
  limit?: number;
  type?: string;
  category?: string;
  city?: string;
  country?: string;
  minRating?: number;
  verified?: string;
  search?: string;
  sort?: string;
  order?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InstitutesService {

  constructor(private http: HttpClient, private apiService: ApiService) { }

  /**
   * Get detailed institutes with comprehensive data
   */
  getDetailedInstitutes(filters: InstituteFilters = {}): Observable<InstitutesResponse> {
    let params = new HttpParams();
    
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.type) params = params.set('type', filters.type);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.city) params = params.set('city', filters.city);
    if (filters.country) params = params.set('country', filters.country);
    if (filters.minRating) params = params.set('minRating', filters.minRating.toString());
    if (filters.verified) params = params.set('verified', filters.verified);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.sort) params = params.set('sort', filters.sort);
    if (filters.order) params = params.set('order', filters.order);

    return this.http.get<InstitutesResponse>(`${this.apiService.getBaseUrl()}/institutes/detailed`, { params });
  }

  /**
   * Get all institutes (basic list)
   */
  getInstitutes(filters: InstituteFilters = {}): Observable<InstitutesResponse> {
    let params = new HttpParams();
    
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.type) params = params.set('type', filters.type);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.city) params = params.set('city', filters.city);
    if (filters.country) params = params.set('country', filters.country);
    if (filters.minRating) params = params.set('minRating', filters.minRating.toString());
    if (filters.verified) params = params.set('verified', filters.verified);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.sort) params = params.set('sort', filters.sort);
    if (filters.order) params = params.set('order', filters.order);

    return this.http.get<InstitutesResponse>(`${this.apiService.getBaseUrl()}/institutes`, { params });
  }

  /**
   * Get single institute by ID
   */
  getInstitute(id: string): Observable<{ success: boolean; data: Institute }> {
    return this.http.get<{ success: boolean; data: Institute }>(`${this.apiService.getBaseUrl()}/institutes/${id}`);
  }

  /**
   * Get featured institutes
   */
  getFeaturedInstitutes(): Observable<{ success: boolean; count: number; data: Institute[]; message: string }> {
    return this.http.get<{ success: boolean; count: number; data: Institute[]; message: string }>(`${this.apiService.getBaseUrl()}/institutes/featured`);
  }

  /**
   * Search institutes
   */
  searchInstitutes(query: string): Observable<{ success: boolean; count: number; data: Institute[] }> {
    const params = new HttpParams().set('q', query);
    return this.http.get<{ success: boolean; count: number; data: Institute[] }>(`${this.apiService.getBaseUrl()}/institutes/search`, { params });
  }

  /**
   * Get institutes by type
   */
  getInstitutesByType(type: string): Observable<{ success: boolean; count: number; data: Institute[] }> {
    return this.http.get<{ success: boolean; count: number; data: Institute[] }>(`${this.apiService.getBaseUrl()}/institutes/type/${type}`);
  }

  /**
   * Get institutes by location
   */
  getInstitutesByLocation(city?: string, country?: string): Observable<{ success: boolean; count: number; data: Institute[] }> {
    let params = new HttpParams();
    if (city) params = params.set('city', city);
    if (country) params = params.set('country', country);
    
    return this.http.get<{ success: boolean; count: number; data: Institute[] }>(`${this.apiService.getBaseUrl()}/institutes/location`, { params });
  }

  /**
   * Get base URL for debugging
   */
  getBaseUrl(): string {
    return this.apiService.getBaseUrl();
  }
}