import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';

// Interfaces for Analytics Data
export interface DashboardAnalytics {
  overview: {
    totalUsers: number;
    totalCourses: number;
    totalRevenue: number;
    totalSessions: number;
    growthRate: number;
    conversionRate: number;
    retentionRate: number;
    satisfactionScore: number;
  };
  trends: {
    userGrowth: { date: string; users: number; }[];
    revenueGrowth: { date: string; revenue: number; }[];
    courseEnrollments: { date: string; enrollments: number; }[];
  };
  topPerformers: {
    courses: { id: string; name: string; enrollments: number; revenue: number; rating: number; }[];
    trainers: { id: string; name: string; students: number; rating: number; courses: number; }[];
    institutes: { id: string; name: string; students: number; courses: number; rating: number; }[];
  };
  demographics: {
    ageGroups: { range: string; percentage: number; count: number; }[];
    locations: { city: string; percentage: number; count: number; }[];
    educationLevels: { level: string; percentage: number; count: number; }[];
  };
  engagement: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionDuration: number;
    bounceRate: number;
    pageViews: number;
    uniqueVisitors: number;
  };
}

export interface CourseAnalytics {
  courseInfo: {
    id: string;
    title: string;
    instructor: string;
    duration: string;
    price: number;
    category: string;
    level: string;
  };
  enrollment: {
    total: number;
    completed: number;
    active: number;
    dropped: number;
    completionRate: number;
    averageTimeToComplete: number;
  };
  performance: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
    averageScore: number;
    passRate: number;
  };
  engagement: {
    averageSessionDuration: number;
    totalVideoWatchTime: number;
    averageProgress: number;
    forumPosts: number;
    assignmentSubmissions: number;
  };
  revenue: {
    total: number;
    monthly: number;
    averagePerStudent: number;
    refunds: number;
    netRevenue: number;
  };
  trends: {
    enrollments: { date: string; count: number; }[];
    completions: { date: string; count: number; }[];
    ratings: { date: string; rating: number; }[];
  };
}

export interface UserAnalytics {
  overview: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    churnedUsers: number;
    retentionRate: number;
    averageLifetime: number;
  };
  userTypes: {
    students: { total: number; active: number; new: number };
    trainers: { total: number; active: number; new: number };
    mentors: { total: number; active: number; new: number };
    institutions: { total: number; active: number; new: number };
  };
  behavior: {
    averageSessionDuration: number;
    averageSessionsPerWeek: number;
    averageCoursesPerUser: number;
    averageCompletionRate: number;
    averageRatingGiven: number;
  };
  acquisition: {
    sources: { source: string; percentage: number; count: number; }[];
    conversionFunnel: {
      visitors: number;
      registered: number;
      enrolled: number;
      completed: number;
      converted: number;
    };
  };
  engagement: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageTimeOnPlatform: number;
    mostActiveHours: string[];
    mostActiveDays: string[];
  };
  satisfaction: {
    averageRating: number;
    npsScore: number;
    csatScore: number;
    supportTickets: number;
    averageResolutionTime: number;
  };
}

export interface RevenueAnalytics {
  overview: {
    totalRevenue: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
    averageOrderValue: number;
    totalOrders: number;
    refunds: number;
    netRevenue: number;
    growthRate: number;
  };
  trends: {
    daily: { date: string; revenue: number; }[];
    monthly: { month: string; revenue: number; }[];
    yearly: { year: string; revenue: number; }[];
  };
  sources: {
    courseEnrollments: { revenue: number; percentage: number };
    certifications: { revenue: number; percentage: number };
    mentorship: { revenue: number; percentage: number };
    consulting: { revenue: number; percentage: number };
  };
  paymentMethods: {
    creditCard: { revenue: number; percentage: number };
    debitCard: { revenue: number; percentage: number };
    upi: { revenue: number; percentage: number };
    netBanking: { revenue: number; percentage: number };
  };
  geographic: {
    hyderabad: { revenue: number; percentage: number };
    bangalore: { revenue: number; percentage: number };
    mumbai: { revenue: number; percentage: number };
    delhi: { revenue: number; percentage: number };
    chennai: { revenue: number; percentage: number };
  };
  forecasts: {
    nextMonth: number;
    nextQuarter: number;
    nextYear: number;
    confidence: number;
  };
}

export interface PerformanceAnalytics {
  systemPerformance: {
    averageResponseTime: number;
    uptime: number;
    errorRate: number;
    throughput: number;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
  };
  apiPerformance: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    slowestEndpoints: { endpoint: string; avgTime: number; }[];
  };
  databasePerformance: {
    totalQueries: number;
    slowQueries: number;
    averageQueryTime: number;
    connectionPool: {
      active: number;
      idle: number;
      total: number;
    };
    indexUsage: number;
  };
  cachePerformance: {
    hitRate: number;
    missRate: number;
    averageRetrievalTime: number;
    cacheSize: number;
    evictionRate: number;
  };
  cdnPerformance: {
    bandwidth: number;
    requests: number;
    cacheHitRate: number;
    averageLatency: number;
    geographicDistribution: { [key: string]: number };
  };
}

export interface CustomReport {
  id: string;
  type: string;
  parameters: any;
  status: string;
  generatedAt: Date;
  data: any;
  downloadUrl: string;
  expiresAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:3000/api/analytics';

  constructor(private apiService: ApiService) { }

  getDashboardAnalytics(period: string = '30d', entityType?: string): Observable<DashboardAnalytics> {
    const params: any = { period };
    if (entityType) params.entityType = entityType;
    
    return this.apiService.get<DashboardAnalytics>(`${this.apiUrl}/dashboard`, params)
      .pipe(map(response => response.data || (response as unknown as DashboardAnalytics)));
  }

  getCourseAnalytics(courseId?: string, period: string = '30d', metrics?: string[]): Observable<CourseAnalytics> {
    const params: any = { period };
    if (courseId) params.courseId = courseId;
    if (metrics) params.metrics = metrics.join(',');
    
    return this.apiService.get<CourseAnalytics>(`${this.apiUrl}/courses`, params)
      .pipe(map(response => response.data || (response as unknown as CourseAnalytics)));
  }

  getUserAnalytics(userType?: string, period: string = '30d', location?: string, ageGroup?: string): Observable<UserAnalytics> {
    const params: any = { period };
    if (userType) params.userType = userType;
    if (location) params.location = location;
    if (ageGroup) params.ageGroup = ageGroup;
    
    return this.apiService.get<UserAnalytics>(`${this.apiUrl}/users`, params)
      .pipe(map(response => response.data || (response as unknown as UserAnalytics)));
  }

  getRevenueAnalytics(period: string = '30d', currency: string = 'INR', breakdown?: string): Observable<RevenueAnalytics> {
    const params: any = { period, currency };
    if (breakdown) params.breakdown = breakdown;
    
    return this.apiService.get<RevenueAnalytics>(`${this.apiUrl}/revenue`, params)
      .pipe(map(response => response.data || (response as unknown as RevenueAnalytics)));
  }

  getPerformanceAnalytics(entityType?: string, entityId?: string, period: string = '30d'): Observable<PerformanceAnalytics> {
    const params: any = { period };
    if (entityType) params.entityType = entityType;
    if (entityId) params.entityId = entityId;
    
    return this.apiService.get<PerformanceAnalytics>(`${this.apiUrl}/performance`, params)
      .pipe(map(response => response.data || (response as unknown as PerformanceAnalytics)));
  }

  generateCustomReport(reportType: string, parameters: any, format: string = 'json', email?: string): Observable<CustomReport> {
    const body = {
      reportType,
      parameters,
      format,
      email
    };
    
    return this.apiService.post<CustomReport>(`${this.apiUrl}/reports`, body)
      .pipe(map(response => response.data || (response as unknown as CustomReport)));
  }

  getReport(reportId: string): Observable<CustomReport> {
    return this.apiService.get<CustomReport>(`${this.apiUrl}/reports/${reportId}`)
      .pipe(map(response => response.data || (response as unknown as CustomReport)));
  }

  downloadReport(reportId: string, format: string = 'json'): Observable<Blob> {
    return this.apiService.getBlob(`${this.apiUrl}/reports/${reportId}/download?format=${format}`);
  }
}











