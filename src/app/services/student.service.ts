import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

export interface StudentProfile {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email?: string;
  avatar?: string;
  bio?: string;
  dateOfBirth?: string | Date;
  gender?: string;
  city?: string;
  country?: string;
  alternatePhone?: string;
  maritalStatus?: string;
  nationality?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  occupation?: string;
  company?: string;
  experience?: string;
  highestQualification?: string;
  fieldOfStudy?: string;
  institutionName?: string;
  graduationYear?: string;
  cgpa?: number;
  skills?: string[];
  portfolio?: string;
  resumeLink?: string;
  linkedin?: string;
  github?: string;
  careerGoalStatement?: string;
  desiredRoles?: string[];
  learningMode?: string;
  availability?: string;
  preferredStartDate?: string | Date;
  mentorSupport?: boolean;
  needPlacementSupport?: boolean;
  aboutYou?: string;
  accomplishments?: string;
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
    email?: string;
  };
  accountSettings?: AccountSettings;
  enrollmentCompleted?: boolean;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  twoFactorAuth: boolean;
  privacyLevel: 'Public' | 'Standard' | 'Private' | string;
  language: string;
  timezone: string;
  currency: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private apiService: ApiService) {}

  /**
   * Get current student profile
   */
  getStudentProfile(): Observable<StudentProfile> {
    return this.apiService.getAuth<StudentProfile>('/students/me').pipe(
      map((response: ApiResponse<StudentProfile>) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to load student profile');
        }
        return response.data;
      })
    );
  }

  /**
   * Update student profile
   */
  updateStudentProfile(data: Partial<StudentProfile>): Observable<StudentProfile> {
    return this.apiService.putAuth<StudentProfile>('/students/me', data).pipe(
      map((response: ApiResponse<StudentProfile>) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to update student profile');
        }
        return response.data;
      })
    );
  }

  /**
   * Create course enrollments (after payment)
   */
  createEnrollments(courses: any[], paymentDetails: any): Observable<any> {
    return this.apiService.postAuth('/students/enrollments', {
      courses,
      paymentDetails
    }).pipe(
      map((response: ApiResponse<any>) => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to create enrollments');
        }
        return response.data;
      })
    );
  }

  /**
   * Get student account settings
   */
  getAccountSettings(): Observable<AccountSettings> {
    return this.apiService.getAuth<AccountSettings>('/students/account-settings').pipe(
      map((response: ApiResponse<AccountSettings>) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to load account settings');
        }
        return response.data;
      })
    );
  }

  /**
   * Update student account settings
   */
  updateAccountSettings(settings: AccountSettings): Observable<AccountSettings> {
    return this.apiService.putAuth<AccountSettings>('/students/account-settings', settings).pipe(
      map((response: ApiResponse<AccountSettings>) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to update account settings');
        }
        return response.data;
      })
    );
  }

  /**
   * Get student enrollments
   */
  getEnrollments(status?: string, courseType?: string): Observable<any[]> {
    let url = '/students/enrollments';
    const params: string[] = [];
    if (status) params.push(`status=${status}`);
    if (courseType) params.push(`courseType=${courseType}`);
    // if (params.length > 0) url += `?${params.join('&')}`;
    
    return this.apiService.getAuth<any[]>(url).pipe(
      map((response: ApiResponse<any[]>) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to load enrollments');
        }
        return response.data;
      })
    );
  }

  /**
   * Update enrollment progress
   */
  updateEnrollment(enrollmentId: string, data: any): Observable<any> {
    return this.apiService.putAuth(`/students/enrollment`, data).pipe(
      map((response: ApiResponse<any>) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to update enrollment');
        }
        return response.data;
      })
    );
  }
}

