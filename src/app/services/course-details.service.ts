import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

export interface CourseDetail {
  trainerId: string;
  trainerName: string;
  trainerDesignation: string;
  trainerExp: string;
  trainerRating: number;
  experience: string;
  totalStudents: number;
  totalCourses: number;
  hourlyRate: number;
  languagesKnown: string[];
  expertiseSkills: string[];
  education: string;
  location: string;
  bio: string;
  achievements: string[];
  courseId: string;
  courseName: string;
  courseTitle: string;
  CourseCategory: string;
  courseDuration: string;
  courseStudents: number;
  courseRating: number;
  courseReviews: number;
  languages: string;
  institutesName: string;
  insRating: number;
  startDate: string;
  scheduleTime: string;
  availableSeats: number;
  price: number;
  discountPrice: number;
  discount: string;
  videoUrl?: string;
  courseOverview: string[];
  courseCurriculum: Array<{
    module: string;
    title: string;
    lessons: number;
    duration: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class CourseDetailsService {
  constructor(private apiService: ApiService) {}

  getCourseDetails(identifier: string, params?: { 
    trainerId?: string; 
    courseId?: string; 
    courseName?: string;
    instituteId?: string;
    instituteName?: string;
    from?: string;
  }): Observable<CourseDetail> {
    return this.apiService.get<CourseDetail>(`/course-details/${identifier}`, params).pipe(
      map((response: ApiResponse<CourseDetail>) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to load course details');
        }
        return response.data;
      })
    );
  }
}


