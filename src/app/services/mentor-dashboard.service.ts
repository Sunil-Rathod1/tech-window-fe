import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

export interface MentorOverview {
  totalMentees: number;
  activeMentees: number;
  completedMentorships: number;
  totalSessions: number;
  totalHours: number;
  averageRating: number;
  totalReviews: number;
  monthlyEarnings: number;
  completionRate: number;
  upcomingSessions: number;
  recentMentees: number;
  topDomains: Array<{
    domain: string;
    mentees: number;
    rating: number;
  }>;
  recentReviews: Array<{
    id: string;
    menteeName: string;
    domain: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  earningsChart: Array<{
    month: string;
    amount: number;
  }>;
  menteesChart: Array<{
    month: string;
    mentees: number;
  }>;
}

export interface Mentee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  domain: string;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  lastSession: string;
  totalSessions: number;
  completedSessions: number;
  progress: number;
  goals: string[];
  achievements: string[];
  nextSession: string;
  rating: number;
  feedback: string;
}

export interface MentorSession {
  id: string;
  menteeName: string;
  menteeId: string;
  domain: string;
  type: 'one-on-one' | 'group' | 'workshop';
  status: 'scheduled' | 'completed' | 'cancelled';
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  meetingLink: string;
  agenda: string[];
  notes: string;
  feedback: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface MentorEarnings {
  totalEarnings: number;
  monthlyEarnings: number;
  yearlyEarnings: number;
  pendingPayments: number;
  paidAmount: number;
  earningsChart: Array<{
    month: string;
    amount: number;
  }>;
  recentTransactions: Array<{
    id: string;
    type: string;
    amount: number;
    description: string;
    date: string;
    status: string;
  }>;
  paymentMethods: Array<{
    id: string;
    type: string;
    accountNumber?: string;
    bankName?: string;
    upiId?: string;
    isDefault: boolean;
  }>;
}

export interface MentorAnalytics {
  menteeEngagement: {
    totalMentees: number;
    activeMentees: number;
    completionRate: number;
    averageProgress: number;
    engagementChart: Array<{
      month: string;
      mentees: number;
      sessions: number;
    }>;
  };
  domainPerformance: {
    totalDomains: number;
    activeDomains: number;
    averageRating: number;
    totalSessions: number;
    performanceChart: Array<{
      domain: string;
      mentees: number;
      sessions: number;
      rating: number;
    }>;
  };
  revenueAnalytics: {
    totalRevenue: number;
    monthlyRevenue: number;
    averageRevenuePerMentee: number;
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
    experienceLevels: Array<{
      level: string;
      count: number;
      percentage: number;
    }>;
  };
}

export interface MentorNotification {
  id: string;
  type: 'session_request' | 'review' | 'completion' | 'payment' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data: any;
}

export interface MentorProfile {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
    bio: string;
    location: string;
    website: string;
    socialMedia: {
      twitter: string;
      linkedin: string;
      github: string;
    };
  };
  domain: string;
  expertise: Array<{
    area: string;
    level: string;
    yearsOfExperience: number;
  }>;
  experience: {
    years: number;
    description: string;
    industries: string[];
    roles: string[];
  };
  education: Array<{
    degree: string;
    institution: string;
    year: number;
    field: string;
    grade: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    year: number;
    expiryDate: string;
    certificateId: string;
    image: string;
  }>;
  currentPosition: {
    title: string;
    company: string;
    industry: string;
    yearsInRole: number;
  };
  previousExperience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
    achievements: string[];
  }>;
  mentoringStyle: {
    approach: string;
    communication: string;
    availability: string;
    specialties: string[];
  };
  availability: {
    isAvailable: boolean;
    schedule: Array<{
      day: string;
      startTime: string;
      endTime: string;
    }>;
    timezone: string;
    maxMentees: number;
    sessionDuration: number;
  };
  pricing: {
    hourlyRate: number;
    sessionRate: number;
    packageRate: number;
    currency: string;
  };
  rating: {
    overall: number;
    expertise: number;
    communication: number;
    availability: number;
    totalReviews: number;
  };
  stats: {
    totalMentees: number;
    activeMentees: number;
    completedMentorships: number;
    totalSessions: number;
    totalHours: number;
    completionRate: number;
    averageRating: number;
  };
  isVerified: boolean;
  isActive: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionRequest {
  mentee: string;
  domain: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  type: 'one-on-one' | 'group' | 'workshop';
  agenda: string[];
  meetingLink?: string;
}

export interface UpdateSessionRequest {
  scheduledDate?: string;
  scheduledTime?: string;
  duration?: number;
  agenda?: string[];
  notes?: string;
  feedback?: string;
  rating?: number;
  status?: 'scheduled' | 'completed' | 'cancelled';
}

@Injectable({
  providedIn: 'root'
})
export class MentorDashboardService {
  private apiUrl = 'http://localhost:3000/api/mentor-dashboard';
  
  constructor(private apiService: ApiService) {}

  // Get mentor dashboard overview
  getOverview(): Observable<MentorOverview> {
    return this.apiService.get<MentorOverview>(`${this.apiUrl}/overview`)
      .pipe(map(response => response.data || (response as unknown as MentorOverview)));
  }

  // Get mentor mentees
  getMentees(): Observable<Mentee[]> {
    return this.apiService.get<{count: number, data: Mentee[]}>(`${this.apiUrl}/mentees`)
      .pipe(map(response => (response.data || []) as Mentee[]));
  }

  // Get mentor sessions
  getSessions(): Observable<MentorSession[]> {
    return this.apiService.get<{count: number, data: MentorSession[]}>(`${this.apiUrl}/sessions`)
      .pipe(map(response => (response.data || []) as MentorSession[]));
  }

  // Get mentor earnings
  getEarnings(): Observable<MentorEarnings> {
    return this.apiService.get<MentorEarnings>(`${this.apiUrl}/earnings`)
      .pipe(map(response => response.data || (response as unknown as MentorEarnings)));
  }

  // Get mentor analytics
  getAnalytics(): Observable<MentorAnalytics> {
    return this.apiService.get<MentorAnalytics>(`${this.apiUrl}/analytics`)
      .pipe(map(response => response.data || (response as unknown as MentorAnalytics)));
  }

  // Get mentor notifications
  getNotifications(): Observable<{count: number, unreadCount: number, data: MentorNotification[]}> {
    return this.apiService.get<{count: number, unreadCount: number, data: MentorNotification[]}>(`${this.apiUrl}/notifications`)
      .pipe(map(response => response.data || (response as unknown as {count: number, unreadCount: number, data: MentorNotification[]})));
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: string): Observable<{success: boolean, message: string}> {
    return this.apiService.put<{success: boolean, message: string}>(`${this.apiUrl}/notifications/${notificationId}/read`, {})
      .pipe(map(response => response.data || (response as unknown as {success: boolean, message: string})));
  }

  // Mark all notifications as read
  markAllNotificationsAsRead(): Observable<{success: boolean, message: string}> {
    return this.apiService.put<{success: boolean, message: string}>(`${this.apiUrl}/notifications/read-all`, {})
      .pipe(map(response => response.data || (response as unknown as {success: boolean, message: string})));
  }

  // Get mentor profile
  getProfile(): Observable<MentorProfile> {
    return this.apiService.get<MentorProfile>(`${this.apiUrl}/profile`)
      .pipe(map(response => response.data || (response as unknown as MentorProfile)));
  }

  // Update mentor profile
  updateProfile(profileData: Partial<MentorProfile>): Observable<MentorProfile> {
    return this.apiService.put<MentorProfile>(`${this.apiUrl}/profile`, profileData)
      .pipe(map(response => response.data || (response as unknown as MentorProfile)));
  }

  // Create session
  createSession(sessionData: CreateSessionRequest): Observable<MentorSession> {
    return this.apiService.post<MentorSession>(`${this.apiUrl}/sessions`, sessionData)
      .pipe(map(response => response.data || (response as unknown as MentorSession)));
  }

  // Update session
  updateSession(sessionId: string, sessionData: UpdateSessionRequest): Observable<MentorSession> {
    return this.apiService.put<MentorSession>(`${this.apiUrl}/sessions/${sessionId}`, sessionData)
      .pipe(map(response => response.data || (response as unknown as MentorSession)));
  }

  // Get mentee details
  getMenteeDetails(menteeId: string): Observable<Mentee> {
    return this.apiService.get<Mentee>(`${this.apiUrl}/mentees/${menteeId}`)
      .pipe(map(response => response.data || (response as unknown as Mentee)));
  }

  // Get session details
  getSessionDetails(sessionId: string): Observable<MentorSession> {
    return this.apiService.get<MentorSession>(`${this.apiUrl}/sessions/${sessionId}`)
      .pipe(map(response => response.data || (response as unknown as MentorSession)));
  }

  // Get earnings by period
  getEarningsByPeriod(period: 'monthly' | 'yearly' | 'weekly'): Observable<MentorEarnings> {
    return this.apiService.get<MentorEarnings>(`${this.apiUrl}/earnings?period=${period}`)
      .pipe(map(response => response.data || (response as unknown as MentorEarnings)));
  }

  // Get analytics by period
  getAnalyticsByPeriod(period: 'monthly' | 'yearly' | 'weekly'): Observable<MentorAnalytics> {
    return this.apiService.get<MentorAnalytics>(`${this.apiUrl}/analytics?period=${period}`)
      .pipe(map(response => response.data || (response as unknown as MentorAnalytics)));
  }

  // Get mentees by domain
  getMenteesByDomain(domain: string): Observable<Mentee[]> {
    return this.apiService.get<{count: number, data: Mentee[]}>(`${this.apiUrl}/mentees?domain=${domain}`)
      .pipe(map(response => (response.data || []) as Mentee[]));
  }

  // Get sessions by status
  getSessionsByStatus(status: 'scheduled' | 'completed' | 'cancelled'): Observable<MentorSession[]> {
    return this.apiService.get<{count: number, data: MentorSession[]}>(`${this.apiUrl}/sessions?status=${status}`)
      .pipe(map(response => (response.data || []) as MentorSession[]));
  }

  // Get upcoming sessions
  getUpcomingSessions(): Observable<MentorSession[]> {
    return this.apiService.get<{count: number, data: MentorSession[]}>(`${this.apiUrl}/sessions?upcoming=true`)
      .pipe(map(response => (response.data || []) as MentorSession[]));
  }

  // Get completed sessions
  getCompletedSessions(): Observable<MentorSession[]> {
    return this.apiService.get<{count: number, data: MentorSession[]}>(`${this.apiUrl}/sessions?completed=true`)
      .pipe(map(response => (response.data || []) as MentorSession[]));
  }

  // Get notifications by type
  getNotificationsByType(type: 'session_request' | 'review' | 'completion' | 'payment' | 'system'): Observable<MentorNotification[]> {
    return this.apiService.get<{count: number, data: MentorNotification[]}>(`${this.apiUrl}/notifications?type=${type}`)
      .pipe(map(response => (response.data || []) as MentorNotification[]));
  }

  // Get unread notifications
  getUnreadNotifications(): Observable<MentorNotification[]> {
    return this.apiService.get<{count: number, data: MentorNotification[]}>(`${this.apiUrl}/notifications?unread=true`)
      .pipe(map(response => (response.data || []) as MentorNotification[]));
  }

  // Search mentees
  searchMentees(query: string): Observable<Mentee[]> {
    return this.apiService.get<{count: number, data: Mentee[]}>(`${this.apiUrl}/mentees?search=${query}`)
      .pipe(map(response => (response.data || []) as Mentee[]));
  }

  // Search sessions
  searchSessions(query: string): Observable<MentorSession[]> {
    return this.apiService.get<{count: number, data: MentorSession[]}>(`${this.apiUrl}/sessions?search=${query}`)
      .pipe(map(response => (response.data || []) as MentorSession[]));
  }

  // Get mentee progress
  getMenteeProgress(menteeId: string): Observable<any> {
    return this.apiService.get<any>(`${this.apiUrl}/mentees/${menteeId}/progress`)
      .pipe(map(response => response.data || (response as unknown as any)));
  }

  // Update mentee progress
  updateMenteeProgress(menteeId: string, progressData: any): Observable<any> {
    return this.apiService.put<any>(`${this.apiUrl}/mentees/${menteeId}/progress`, progressData)
      .pipe(map(response => response.data || (response as unknown as any)));
  }

  // Get session feedback
  getSessionFeedback(sessionId: string): Observable<any> {
    return this.apiService.get<any>(`${this.apiUrl}/sessions/${sessionId}/feedback`)
      .pipe(map(response => response.data || (response as unknown as any)));
  }

  // Submit session feedback
  submitSessionFeedback(sessionId: string, feedback: any): Observable<any> {
    return this.apiService.post<any>(`${this.apiUrl}/sessions/${sessionId}/feedback`, feedback)
      .pipe(map(response => response.data || (response as unknown as any)));
  }

  // Get earnings summary
  getEarningsSummary(): Observable<any> {
    return this.apiService.get<any>(`${this.apiUrl}/earnings/summary`)
      .pipe(map(response => response.data || (response as unknown as any)));
  }

  // Get performance metrics
  getPerformanceMetrics(): Observable<any> {
    return this.apiService.get<any>(`${this.apiUrl}/analytics/metrics`)
      .pipe(map(response => response.data || (response as unknown as any)));
  }

  // Get mentor achievements
  getMentorAchievements(): Observable<any> {
    return this.apiService.get<any>(`${this.apiUrl}/achievements`)
      .pipe(map(response => response.data || (response as unknown as any)));
  }

  // Get mentor goals
  getMentorGoals(): Observable<any> {
    return this.apiService.get<any>(`${this.apiUrl}/goals`)
      .pipe(map(response => response.data || (response as unknown as any)));
  }

  // Update mentor goals
  updateMentorGoals(goals: any): Observable<any> {
    return this.apiService.put<any>(`${this.apiUrl}/goals`, goals)
      .pipe(map(response => response.data || (response as unknown as any)));
  }

  // Get mentor resources
  getMentorResources(): Observable<any> {
    return this.apiService.get<any>(`${this.apiUrl}/resources`)
      .pipe(map(response => response.data || (response as unknown as any)));
  }

  // Get mentor settings
  getMentorSettings(): Observable<any> {
    return this.apiService.get<any>(`${this.apiUrl}/settings`)
      .pipe(map(response => response.data || (response as unknown as any)));
  }

  // Update mentor settings
  updateMentorSettings(settings: any): Observable<any> {
    return this.apiService.put<any>(`${this.apiUrl}/settings`, settings)
      .pipe(map(response => response.data || (response as unknown as any)));
  }
}
