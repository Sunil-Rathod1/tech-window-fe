import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

export interface InstitutionOverview {
  institution: {
    id: string;
    name: string;
    shortName: string;
    logo: string;
    type: string;
    category: string;
    status: string;
  };
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  totalRevenue: number;
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    time: string;
    attendees: number;
  }>;
  recentApplications: Array<{
    id: string;
    studentName: string;
    course: string;
    status: string;
    date: string;
  }>;
  averageRating: number;
  profileCompletion: number;
  monthlyGrowth: number;
  studentSatisfaction: number;
}

export interface InstitutionCourse {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  status: 'draft' | 'published' | 'archived';
  students: number;
  completedStudents?: number;
  rating: number;
  revenue: number;
  instructor: string;
  createdAt: string;
  updatedAt: string;
  prerequisites?: string[];
  learningOutcomes?: string[];
  curriculum?: Array<{
    module: string;
    topics: string[];
    duration?: number;
  }>;
}

export interface InstitutionStudent {
  id: string;
  name: string;
  email: string;
  course: string;
  status: 'active' | 'graduated' | 'suspended' | 'dropped';
  enrollmentDate: string;
  progress: number;
  lastActivity: string;
  grade?: string;
}

export interface InstitutionRevenue {
  currentMonth: number;
  lastMonth: number;
  total: number;
  breakdown: Array<{
    course: string;
    amount: number;
  }>;
  growthRate: number;
  projections: {
    nextMonth: number;
    nextQuarter: number;
  };
}

export interface InstitutionAnalytics {
  studentEngagement: {
    totalStudents: number;
    activeStudents: number;
    completionRate: number;
    averageProgress: number;
    engagementChart: Array<{
      month: string;
      students: number;
      completions: number;
    }>;
  };
  coursePerformance: {
    totalCourses: number;
    activeCourses: number;
    averageRating: number;
    totalEnrollments: number;
    performanceChart: Array<{
      course: string;
      enrollments: number;
      rating: number;
    }>;
  };
  revenueAnalytics: {
    totalRevenue: number;
    monthlyRevenue: number;
    averageRevenuePerStudent: number;
    revenueChart: Array<{
      month: string;
      revenue: number;
    }>;
  };
  demographics: {
    ageGroups: Array<{
      age: string;
      count: number;
      percentage: number;
    }>;
    locations: Array<{
      location: string;
      count: number;
      percentage: number;
    }>;
    educationLevels: Array<{
      level: string;
      count: number;
      percentage: number;
    }>;
  };
}

export interface InstitutionEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  type: 'open-house' | 'career-fair' | 'workshop' | 'seminar' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionApplication {
  id: string;
  studentName: string;
  studentEmail: string;
  course: string;
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  priority: 'low' | 'medium' | 'high';
  date: string;
  documents: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  notes?: string;
}

export interface InstitutionProfile {
  id: string;
  name: string;
  shortName: string;
  description: string;
  logo: string;
  type: 'University' | 'College' | 'Training Center' | 'Online Platform' | 'Corporate' | 'Other';
  category: 'Technology' | 'Business' | 'Arts' | 'Science' | 'Medical' | 'Engineering' | 'Education' | 'Other';
  founded: number;
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  socialMedia: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  isVerified: boolean;
  isFeatured: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  price: number;
  duration: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  status?: 'draft' | 'published' | 'archived';
  prerequisites?: string[];
  learningOutcomes?: string[];
  curriculum?: Array<{
    module: string;
    topics: string[];
    duration: number;
  }>;
}

export interface InstitutionBatch {
  id: string;
  course: string;
  courseId: string;
  startDate: string;
  endDate: string;
  students: number;
  trainer: string;
  trainerId: string;
  status: 'pending' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled';
  duration: string;
  maxStudents: number;
  schedule?: string;
  description?: string;
  meetingLink?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBatchRequest {
  courseId: string;
  courseName: string;
  trainerId: string;
  trainerName: string;
  startDate: string;
  endDate: string;
  duration: string;
  maxStudents: number;
  schedule?: string;
  description?: string;
  meetingLink?: string;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  price?: number;
  duration?: number;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  category?: string;
  status?: 'draft' | 'published' | 'archived';
  prerequisites?: string[];
  learningOutcomes?: string[];
  curriculum?: Array<{
    module: string;
    topics: string[];
    duration: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class InstitutionDashboardService {
  private apiUrl = '/institution-dashboard';
  
  constructor(private apiService: ApiService) {}

  // Get institution dashboard overview
  getOverview(): Observable<InstitutionOverview> {
    return this.apiService.get<InstitutionOverview>(`${this.apiUrl}/summary`)
      .pipe(map(response => (response.data || response) as InstitutionOverview));
  }

  // Get institution courses
  getCourses(): Observable<InstitutionCourse[]> {
    // Authenticated call to real backend: /api/institution-courses/my-courses
    return this.apiService.getAuth<InstitutionCourse[]>('/institution-courses/my-courses')
      .pipe(map(response => (response.data || []) as InstitutionCourse[]));
  }

  // Get institution students
  getStudents(): Observable<InstitutionStudent[]> {
    return this.apiService.get<{count: number, data: InstitutionStudent[]}>(`${this.apiUrl}/students`)
      .pipe(map(response => (response.data || []) as InstitutionStudent[]));
  }

  // Get institution revenue
  getRevenue(): Observable<InstitutionRevenue> {
    return this.apiService.get<InstitutionRevenue>(`${this.apiUrl}/revenue`)
      .pipe(map(response => (response.data || response) as InstitutionRevenue));
  }

  // Get institution analytics
  getAnalytics(): Observable<InstitutionAnalytics> {
    return this.apiService.get<InstitutionAnalytics>(`${this.apiUrl}/analytics`)
      .pipe(map(response => (response.data || response) as InstitutionAnalytics));
  }

  // Get institution events
  getEvents(): Observable<InstitutionEvent[]> {
    return this.apiService.get<{count: number, data: InstitutionEvent[]}>(`${this.apiUrl}/events`)
      .pipe(map(response => (response.data || []) as InstitutionEvent[]));
  }

  // Get institution applications
  getApplications(): Observable<InstitutionApplication[]> {
    return this.apiService.get<{count: number, data: InstitutionApplication[]}>(`${this.apiUrl}/applications`)
      .pipe(map(response => (response.data || []) as InstitutionApplication[]));
  }

  // Get institution profile
  getProfile(): Observable<InstitutionProfile> {
    return this.apiService.get<InstitutionProfile>(`${this.apiUrl}/profile`)
      .pipe(map(response => (response.data || response) as InstitutionProfile));
  }

  // Update institution profile
  updateProfile(profileData: Partial<InstitutionProfile>): Observable<InstitutionProfile> {
    return this.apiService.put<InstitutionProfile>(`${this.apiUrl}/profile`, profileData)
      .pipe(map(response => (response.data || response) as InstitutionProfile));
  }

  // Create course
  createCourse(courseData: CreateCourseRequest): Observable<InstitutionCourse> {
    // Authenticated call to institution-courses API
    return this.apiService.postAuth<InstitutionCourse>('/institution-courses', courseData)
      .pipe(map((response: ApiResponse<InstitutionCourse>) => {
        if (response.success && response.data) {
          return response.data as InstitutionCourse;
        }
        throw new Error(response.message || 'Failed to create course');
      }));
  }

  // Update course
  updateCourse(courseId: string, courseData: UpdateCourseRequest): Observable<InstitutionCourse> {
    return this.apiService.putAuth<InstitutionCourse>(`/institution-courses/${courseId}`, courseData)
      .pipe(map((response: ApiResponse<InstitutionCourse>) => {
        if (response.success && response.data) {
          return response.data as InstitutionCourse;
        }
        throw new Error(response.message || 'Failed to update course');
      }));
  }

  // Delete course
  deleteCourse(courseId: string): Observable<{success: boolean, message: string}> {
    return this.apiService.deleteAuth<{success: boolean, message: string}>(`/institution-courses/${courseId}`)
      .pipe(map((response: ApiResponse<{success: boolean, message: string}>) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to delete course');
      }));
  }

  // Get course details
  getCourseDetails(courseId: string): Observable<InstitutionCourse> {
    return this.apiService.getAuth<InstitutionCourse>(`/institution-courses/${courseId}`)
      .pipe(map((response: ApiResponse<InstitutionCourse>) => {
        if (response.success && response.data) {
          return response.data as InstitutionCourse;
        }
        throw new Error(response.message || 'Course not found');
      }));
  }

  // Get student details
  getStudentDetails(studentId: string): Observable<InstitutionStudent> {
    return this.apiService.get<InstitutionStudent>(`${this.apiUrl}/students/${studentId}`)
      .pipe(map(response => (response.data || response) as InstitutionStudent));
  }

  // Get revenue by period
  getRevenueByPeriod(period: 'monthly' | 'yearly' | 'weekly'): Observable<InstitutionRevenue> {
    return this.apiService.get<InstitutionRevenue>(`${this.apiUrl}/revenue?period=${period}`)
      .pipe(map(response => (response.data || response) as InstitutionRevenue));
  }

  // Get analytics by period
  getAnalyticsByPeriod(period: 'monthly' | 'yearly' | 'weekly'): Observable<InstitutionAnalytics> {
    return this.apiService.get<InstitutionAnalytics>(`${this.apiUrl}/analytics?period=${period}`)
      .pipe(map(response => (response.data || response) as InstitutionAnalytics));
  }

  // Get courses by status
  getCoursesByStatus(status: 'draft' | 'published' | 'archived'): Observable<InstitutionCourse[]> {
    return this.apiService.get<{count: number, data: InstitutionCourse[]}>(`${this.apiUrl}/courses?status=${status}`)
      .pipe(map(response => (response.data || []) as InstitutionCourse[]));
  }

  // Get students by status
  getStudentsByStatus(status: 'active' | 'graduated' | 'suspended' | 'dropped'): Observable<InstitutionStudent[]> {
    return this.apiService.get<{count: number, data: InstitutionStudent[]}>(`${this.apiUrl}/students?status=${status}`)
      .pipe(map(response => (response.data || []) as InstitutionStudent[]));
  }

  // Get events by status
  getEventsByStatus(status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'): Observable<InstitutionEvent[]> {
    return this.apiService.get<{count: number, data: InstitutionEvent[]}>(`${this.apiUrl}/events?status=${status}`)
      .pipe(map(response => (response.data || []) as InstitutionEvent[]));
  }

  // Get applications by status
  getApplicationsByStatus(status: 'pending' | 'approved' | 'rejected' | 'waitlisted'): Observable<InstitutionApplication[]> {
    return this.apiService.get<{count: number, data: InstitutionApplication[]}>(`${this.apiUrl}/applications?status=${status}`)
      .pipe(map(response => (response.data || []) as InstitutionApplication[]));
  }

  // Search courses
  searchCourses(query: string): Observable<InstitutionCourse[]> {
    return this.apiService.get<{count: number, data: InstitutionCourse[]}>(`${this.apiUrl}/courses?search=${query}`)
      .pipe(map(response => (response.data || []) as InstitutionCourse[]));
  }

  // Get all institution courses (Public API - no authentication required)
  getInstitutionCourses(): Observable<any[]> {
    return this.apiService.get<any[]>('/institution-courses').pipe(
      map((response: ApiResponse<any[]>) => {
        if (!response.success || !response.data) {
          return [];
        }
        return response.data;
      })
    );
  }

  // Search students
  searchStudents(query: string): Observable<InstitutionStudent[]> {
    return this.apiService.get<{count: number, data: InstitutionStudent[]}>(`${this.apiUrl}/students?search=${query}`)
      .pipe(map(response => (response.data || []) as InstitutionStudent[]));
  }

  // Search applications
  searchApplications(query: string): Observable<InstitutionApplication[]> {
    return this.apiService.get<{count: number, data: InstitutionApplication[]}>(`${this.apiUrl}/applications?search=${query}`)
      .pipe(map(response => (response.data || []) as InstitutionApplication[]));
  }

  // Get student progress
  getStudentProgress(studentId: string): Observable<any> {
    return this.apiService.get<any>(`${this.apiUrl}/students/${studentId}/progress`)
      .pipe(map(response => (response.data || response) as any));
  }

  // Update student progress
  updateStudentProgress(studentId: string, progressData: any): Observable<any> {
    return this.apiService.put<any>(`${this.apiUrl}/students/${studentId}/progress`, progressData)
      .pipe(map(response => (response.data || response) as any));
  }

  // Get course analytics
  getCourseAnalytics(courseId: string): Observable<any> {
    return this.apiService.get<any>(`${this.apiUrl}/courses/${courseId}/analytics`)
      .pipe(map(response => (response.data || response) as any));
  }

  // Get revenue summary
  getRevenueSummary(): Observable<any> {
    return this.apiService.get<any>(`${this.apiUrl}/revenue/summary`)
      .pipe(map(response => (response.data || response) as any));
  }

  // Get performance metrics
  getPerformanceMetrics(): Observable<any> {
    return this.apiService.get<any>(`${this.apiUrl}/analytics/metrics`)
      .pipe(map(response => (response.data || response) as any));
  }

  // Get institution achievements
  getInstitutionAchievements(): Observable<any> {
    return this.apiService.get<any>(`${this.apiUrl}/achievements`)
      .pipe(map(response => (response.data || response) as any));
  }

  // Get institution goals
  getInstitutionGoals(): Observable<any> {
    return this.apiService.get<any>(`${this.apiUrl}/goals`)
      .pipe(map(response => (response.data || response) as any));
  }

  // Update institution goals
  updateInstitutionGoals(goals: any): Observable<any> {
    return this.apiService.put<any>(`${this.apiUrl}/goals`, goals)
      .pipe(map(response => (response.data || response) as any));
  }

  // Get institution resources
  getInstitutionResources(): Observable<any> {
    return this.apiService.get<any>(`${this.apiUrl}/resources`)
      .pipe(map(response => (response.data || response) as any));
  }

  // Get institution settings
  getInstitutionSettings(): Observable<any> {
    return this.apiService.getAuth<any>('/institutions/settings')
      .pipe(map(response => (response.data || response) as any));
  }

  // Update institution settings
  updateInstitutionSettings(settings: any): Observable<any> {
    return this.apiService.putAuth<any>('/institutions/settings', settings)
      .pipe(map(response => (response.data || response) as any));
  }

  // Batch Management Methods
  // Get all batches
  getBatches(): Observable<InstitutionBatch[]> {
    return this.apiService.getAuth<InstitutionBatch[]>('/batches')
      .pipe(map((response: ApiResponse<InstitutionBatch[]>) => {
        if (response.success && response.data) {
          return response.data as InstitutionBatch[];
        }
        return [];
      }));
  }

  // Create batch
  createBatch(batchData: CreateBatchRequest): Observable<InstitutionBatch> {
    return this.apiService.postAuth<InstitutionBatch>('/batches', batchData)
      .pipe(map((response: ApiResponse<InstitutionBatch>) => {
        if (response.success && response.data) {
          return response.data as InstitutionBatch;
        }
        throw new Error(response.message || 'Failed to create batch');
      }));
  }

  // Get batch by ID
  getBatchById(batchId: string): Observable<InstitutionBatch> {
    return this.apiService.getAuth<InstitutionBatch>(`/batches/${batchId}`)
      .pipe(map((response: ApiResponse<InstitutionBatch>) => {
        if (response.success && response.data) {
          return response.data as InstitutionBatch;
        }
        throw new Error(response.message || 'Batch not found');
      }));
  }

  // Update batch
  updateBatch(batchId: string, batchData: Partial<CreateBatchRequest>): Observable<InstitutionBatch> {
    return this.apiService.putAuth<InstitutionBatch>(`/batches/${batchId}`, batchData)
      .pipe(map((response: ApiResponse<InstitutionBatch>) => {
        if (response.success && response.data) {
          return response.data as InstitutionBatch;
        }
        throw new Error(response.message || 'Failed to update batch');
      }));
  }

  // Delete batch
  deleteBatch(batchId: string): Observable<{success: boolean, message: string}> {
    return this.apiService.deleteAuth<{success: boolean, message: string}>(`/batches/${batchId}`)
      .pipe(map((response: ApiResponse<{success: boolean, message: string}>) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to delete batch');
      }));
  }
}
