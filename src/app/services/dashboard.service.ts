import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

export interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  certificatesEarned: number;
  totalHours: number;
  currentStreak: number;
  points: number;
  weeklyProgress: number;
  monthlyProgress: number;
  achievements: number;
  rank: string;
}

export interface CourseEnrollment {
  id: string;
  courseName: string;
  instructor: string;
  progress: number;
  nextSession: string;
  image: string;
  category: string;
  startDate: string;
  endDate: string;
  totalModules: number;
  completedModules: number;
  grade: string;
  lastAccessed: string;
}

export interface LearningPath {
  id: string;
  name: string;
  progress: number;
  courses: number;
  estimatedTime: string;
  difficulty: string;
  color: string;
  description: string;
  skills: string[];
  completedCourses: number;
  totalHours: number;
  nextMilestone: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'course' | 'assignment' | 'session' | 'achievement' | 'system';
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl: string;
  icon: string;
}

export interface Event {
  id: string;
  day: string;
  month: string;
  title: string;
  description: string;
  time: string;
  location: string;
  type: 'workshop' | 'competition' | 'session';
  attendees: number;
  maxAttendees: number;
  isRegistered: boolean;
  instructor: string;
  category: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: string;
  url: string;
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  color: string;
  points: number;
  certificateUrl?: string;
  grade?: string;
  score?: number;
  mentorName?: string;
}

export interface Analytics {
  weeklyProgress: number[];
  monthlyProgress: number[];
  courseCompletionRate: number;
  averageScore: number;
  studyTime: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  skills: Array<{
    name: string;
    level: number;
  }>;
  achievements: {
    total: number;
    recent: number;
    badges: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apiService: ApiService) { }

  // Get dashboard statistics
  getDashboardStats(): Observable<DashboardStats> {
    return this.apiService.getAuth<DashboardStats>('/dashboard/stats').pipe(
      map((response: ApiResponse<DashboardStats>) => response.data!)
    );
  }

  // Get current enrollments
  getCurrentEnrollments(): Observable<CourseEnrollment[]> {
    return this.apiService.getAuth<CourseEnrollment[]>('/dashboard/enrollments').pipe(
      map((response: ApiResponse<CourseEnrollment[]>) => response.data || [])
    );
  }

  // Get learning paths
  getLearningPaths(): Observable<LearningPath[]> {
    return this.apiService.getAuth<LearningPath[]>('/dashboard/learning-paths').pipe(
      map((response: ApiResponse<LearningPath[]>) => response.data || [])
    );
  }

  // Get notifications
  getNotifications(): Observable<Notification[]> {
    return this.apiService.getAuth<Notification[]>('/dashboard/notifications').pipe(
      map((response: ApiResponse<Notification[]>) => response.data || [])
    );
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: string): Observable<any> {
    return this.apiService.patchAuth<any>(`/dashboard/notifications/${notificationId}/read`, {});
  }

  // Mark all notifications as read
  markAllNotificationsAsRead(): Observable<any> {
    return this.apiService.patchAuth<any>('/dashboard/notifications/read-all', {});
  }

  // Get upcoming events
  getUpcomingEvents(): Observable<Event[]> {
    return this.apiService.getAuth<Event[]>('/dashboard/events').pipe(
      map((response: ApiResponse<Event[]>) => response.data || [])
    );
  }

  // Get quick actions
  getQuickActions(): Observable<QuickAction[]> {
    return this.apiService.getAuth<QuickAction[]>('/dashboard/quick-actions').pipe(
      map((response: ApiResponse<QuickAction[]>) => response.data || [])
    );
  }

  // Get recent activities
  getRecentActivities(): Observable<Activity[]> {
    return this.apiService.getAuth<Activity[]>('/dashboard/activities').pipe(
      map((response: ApiResponse<Activity[]>) => response.data || [])
    );
  }

  // Get analytics data
  getAnalytics(): Observable<Analytics> {
    return this.apiService.getAuth<Analytics>('/dashboard/analytics').pipe(
      map((response: ApiResponse<Analytics>) => response.data!)
    );
  }
}
