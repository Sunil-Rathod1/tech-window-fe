import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  price: number;
  originalPrice?: number;
  duration: string;
  totalHours: number;
  modules: number;
  lessons: number;
  image: string;
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  institute?: {
    id: string;
    name: string;
    logo?: string;
  };
  technologies: string[];
  features: string[];
  requirements: string[];
  whatYouWillLearn: string[];
  syllabus: Array<{
    module: string;
    topics: string[];
    duration: string;
  }>;
  rating: number;
  totalReviews: number;
  enrolledStudents: number;
  isPublished: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseFilters {
  page?: number;
  limit?: number;
  category?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  sort?: 'price' | 'rating' | 'enrolledStudents' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface CreateCourseRequest {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  price: number;
  duration: string;
  totalHours: number;
  modules: number;
  image: string;
  technologies: string[];
  features: string[];
  requirements: string[];
  whatYouWillLearn: string[];
  syllabus: Array<{
    module: string;
    topics: string[];
    duration: string;
  }>;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {}

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  constructor(private apiService: ApiService) { }

  // Get all courses with filters
  getCourses(filters?: CourseFilters): Observable<{ courses: Course[]; count: number; pagination: any }> {
    // Use detailed courses endpoint as primary source since it has mock data
    return this.getDetailedCourses(filters?.page || 1, filters?.limit || 10).pipe(
      map((response: any) => ({
        courses: response.data || [],
        count: response.data?.length || 0,
        pagination: response.pagination
      }))
    );
  }

  // Get single course by ID
  getCourse(id: string): Observable<Course> {
    return this.apiService.get<Course>(`/courses/${id}`).pipe(
      map((response: ApiResponse<Course>) => response.data!)
    );
  }

  // Get featured courses - using public endpoint
  getFeaturedCourses(): Observable<Course[]> {
    // Use public courses overview endpoint (no featured filter needed, just display top courses)
    return this.getDetailedCourses(1, 50).pipe(
      map((response: any) => {
        // Return all courses from the endpoint
        return response.data || [];
      })
    );
  }

  // Get popular courses
  getPopularCourses(): Observable<Course[]> {
    // Use detailed courses endpoint and filter for popular courses
    return this.getDetailedCourses(1, 50).pipe(
      map((response: any) => {
        const popularCourses = response.data?.filter((course: any) => course.isPopular) || [];
        return popularCourses;
      })
    );
  }

  // Get courses by category
  getCoursesByCategory(category: string): Observable<Course[]> {
    return this.apiService.get<Course[]>(`/courses/category/${category}`).pipe(
      map((response: ApiResponse<Course[]>) => response.data || [])
    );
  }

  // Get courses by instructor
  getCoursesByInstructor(instructorId: string): Observable<Course[]> {
    return this.apiService.get<Course[]>(`/courses/instructor/${instructorId}`).pipe(
      map((response: ApiResponse<Course[]>) => response.data || [])
    );
  }

  // Get courses by institute
  getCoursesByInstitute(instituteId: string): Observable<Course[]> {
    return this.apiService.get<Course[]>(`/courses/institute/${instituteId}`).pipe(
      map((response: ApiResponse<Course[]>) => response.data || [])
    );
  }

  // Search courses
  searchCourses(query: string): Observable<Course[]> {
    return this.apiService.get<Course[]>('/courses/search', { q: query }).pipe(
      map((response: ApiResponse<Course[]>) => response.data || [])
    );
  }

  // Create new course (Trainers/Admins only)
  createCourse(data: CreateCourseRequest): Observable<Course> {
    return this.apiService.postAuth<Course>('/courses', data).pipe(
      map((response: ApiResponse<Course>) => response.data!)
    );
  }

  // Update course (Course owner/Admins only)
  updateCourse(id: string, data: UpdateCourseRequest): Observable<Course> {
    return this.apiService.putAuth<Course>(`/courses/${id}`, data).pipe(
      map((response: ApiResponse<Course>) => response.data!)
    );
  }

  // Delete course (Course owner/Admins only)
  deleteCourse(id: string): Observable<any> {
    return this.apiService.deleteAuth<any>(`/courses/${id}`);
  }

  // Update course rating
  updateCourseRating(id: string, rating: number): Observable<any> {
    return this.apiService.putAuth<any>(`/courses/${id}/rating`, { rating });
  }

  // Get course statistics (Course owner/Admins only)
  getCourseStats(id: string): Observable<any> {
    return this.apiService.getAuth<any>(`/courses/${id}/stats`).pipe(
      map((response: ApiResponse<any>) => response.data!)
    );
  }

  // Get course categories
  getCategories(): string[] {
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

  // Get course levels
  getLevels(): string[] {
    return ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  }

  // Get sort options
  getSortOptions(): Array<{ value: string; label: string }> {
    return [
      { value: 'price', label: 'Price' },
      { value: 'rating', label: 'Rating' },
      { value: 'enrolledStudents', label: 'Students' },
      { value: 'createdAt', label: 'Date Created' }
    ];
  }

  // Get detailed courses with all information - using public endpoint
  getDetailedCourses(page: number = 1, limit: number = 10): Observable<{data: Course[], pagination: any}> {
    return this.apiService.get<Course[]>(`/courses/overview?page=${page}&limit=${limit}`).pipe(
      map((response: any) => ({
        data: response.data || [],
        pagination: response.pagination || {}
      }))
    );
  }

  // Filter and search courses with advanced filters
  filterCourses(filters: any): Observable<{data: Course[], filters: any, pagination: any}> {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key].toString());
      }
    });

    return this.apiService.get<Course[]>(`/courses/filter?${queryParams.toString()}`).pipe(
      map((response: any) => ({
        data: response.data || [],
        filters: response.filters || {},
        pagination: response.pagination || {}
      }))
    );
  }

  // Get course demo video
  getCourseDemo(courseId: string): Observable<any> {
    return this.apiService.get(`/courses/${courseId}/demo`);
  }

  // ========== Trainer Course Management Methods ==========

  /**
   * Create a new course (Trainer only)
   * Matches the backend API structure
   */
  createTrainerCourse(data: {
    title: string;
    subtitle?: string;
    category: string;
    level: string;
    language?: string;
    price: number;
    discountedPrice?: number;
    durationHours?: number;
    totalLectures?: number;
    prerequisites?: string;
    objectives?: string;
    description: string;
    syllabus?: string;
    tags?: string | string[];
    thumbnail?: string;
    demoVideo?: string;
    publishStatus?: 'draft' | 'private' | 'public';
  }): Observable<any> {
    return this.apiService.postAuth<any>('/courses', data).pipe(
      map((response: ApiResponse<any>) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to create course');
      })
    );
  }

  /**
   * Get all courses for the authenticated trainer
   */
  getMyCourses(): Observable<any[]> {
    return this.apiService.getAuth<any[]>('/courses/my-courses').pipe(
      map((response: ApiResponse<any[]>) => {
        if (response.success && response.data) {
          return response.data;
        }
        return [];
      })
    );
  }

  /**
   * Get single course by ID (Trainer can only access own courses)
   */
  getTrainerCourse(id: string): Observable<any> {
    return this.apiService.getAuth<any>(`/courses/${id}`).pipe(
      map((response: ApiResponse<any>) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Course not found');
      })
    );
  }

  /**
   * Update course (Trainer can only update own courses)
   */
  updateTrainerCourse(id: string, data: Partial<{
    title: string;
    subtitle: string;
    category: string;
    level: string;
    language: string;
    price: number;
    discountedPrice: number;
    durationHours: number;
    totalLectures: number;
    prerequisites: string;
    objectives: string;
    description: string;
    syllabus: string;
    tags: string | string[];
    thumbnail: string;
    demoVideo: string;
    publishStatus: 'draft' | 'private' | 'public';
  }>): Observable<any> {
    return this.apiService.putAuth<any>(`/courses/${id}`, data).pipe(
      map((response: ApiResponse<any>) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to update course');
      })
    );
  }

  /**
   * Delete course (Trainer can only delete own courses)
   */
  deleteTrainerCourse(id: string): Observable<any> {
    return this.apiService.deleteAuth<any>(`/courses/${id}`).pipe(
      map((response: ApiResponse<any>) => {
        if (response.success) {
          return { success: true };
        }
        throw new Error(response.message || 'Failed to delete course');
      })
    );
  }
}
