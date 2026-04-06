import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalStudents: number;
  activeStudents: number;
  totalTrainers: number;
  activeTrainers: number;
  totalInstitutions: number;
  activeInstitutions: number;
  totalCourses: number;
  activeCourses: number;
  totalEnrollments: number;
  activeEnrollments: number;
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingVerifications: number;
  growthRate: number;
  conversionRate: number;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  permissions: any;
  lastLogin?: Date;
}

export interface AdminLoginResponse {
  token: string;
  admin: AdminUser;
}

export interface UserManagement {
  students: any[];
  trainers: any[];
  institutions: any[];
}

export interface CourseData {
  id: string;
  title: string;
  category: string;
  status: string;
  enrollments: number;
  revenue: number;
  rating: number;
  createdAt: string;
  type?: string; // 'trainer' or 'institution'
  isFeatured?: boolean;
}

export interface TrendingCourse {
  id: string;
  courseId?: string;
  title: string;
  category: string;
  level?: string;
  publishStatus?: string;
  status?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  type?: string;
  source?: string;
  instructor?: { name?: string };
  institution?: { name?: string };
}

export interface OrderData {
  id: string;
  userId: string;
  userName: string;
  course: string;
  amount: number;
  status: string;
  date: string;
}

export interface PaymentData {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: string;
  status: string;
  date: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  description: string;
  student?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  } | null;
  messagesCount?: number;
  messages?: any[];
  lastMessageAt?: string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string | null;
  resolution?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly ADMIN_TOKEN_KEY = 'admin_token';
  private readonly ADMIN_USER_KEY = 'admin_user';

  constructor(private apiService: ApiService) {}

  // Admin Login
  login(username: string, password: string): Observable<AdminLoginResponse> {
    return this.apiService.post<AdminLoginResponse>('/admin/login', { username, password }).pipe(
      map((response: ApiResponse<AdminLoginResponse>) => {
        if (response.success && response.data) {
          this.setAdminData(response.data.admin, response.data.token);
        }
        return response.data!;
      })
    );
  }

  // Get Admin Profile
  getProfile(): Observable<AdminUser> {
    return this.apiService.getAuth<AdminUser>('/admin/profile').pipe(
      map((response: ApiResponse<AdminUser>) => response.data!)
    );
  }

  // Get Dashboard Stats
  getStats(): Observable<AdminStats> {
    return this.apiService.getAuth<AdminStats>('/admin/stats').pipe(
      map((response: ApiResponse<AdminStats>) => response.data!)
    );
  }

  // Get All Users
  getAllUsers(params?: any): Observable<{ users: UserManagement; pagination: any }> {
    return this.apiService.getAuth<any>('/admin/users', params).pipe(
      map((response: ApiResponse<any>) => ({
        users: response.data!,
        pagination: response.pagination || {}
      }))
    );
  }

  // Get All Courses
  getAllCourses(params?: any): Observable<{ courses: any; pagination: any }> {
    return this.apiService.getAuth<any>('/admin/courses', params).pipe(
      map((response: ApiResponse<any>) => ({
        courses: response.data!,
        pagination: response.pagination || {}
      }))
    );
  }

  // Get All Orders
  getAllOrders(params?: any): Observable<{ orders: OrderData[]; pagination: any }> {
    return this.apiService.getAuth<any>('/admin/orders', params).pipe(
      map((response: ApiResponse<any>) => ({
        orders: response.data || [],
        pagination: response.pagination || {}
      }))
    );
  }

  // Get All Payments
  getAllPayments(params?: any): Observable<{ payments: PaymentData[]; pagination: any }> {
    return this.apiService.getAuth<any>('/admin/payments', params).pipe(
      map((response: ApiResponse<any>) => ({
        payments: response.data || [],
        pagination: response.pagination || {}
      }))
    );
  }

  // Update User Status
  updateUserStatus(userId: string, type: string, status: string): Observable<any> {
    return this.apiService.putAuth('/admin/users/status', { userId, type, status });
  }

  // Verify User
  verifyUser(userId: string, type: string, status: string): Observable<any> {
    return this.apiService.putAuth('/admin/users/verify', { userId, type, status });
  }

  // Update User Details
  updateUserDetails(type: string, userId: string, payload: any): Observable<any> {
    return this.apiService.putAuth(`/admin/users/${type}/${userId}`, payload);
  }

  // Update Course Details
  updateCourseDetails(type: string, courseId: string, payload: any): Observable<any> {
    return this.apiService.putAuth(`/admin/courses/${type}/${courseId}`, payload);
  }

  // Approve/Reject Course
  updateCourseStatus(courseId: string, type: string, status: string): Observable<any> {
    return this.apiService.putAuth('/admin/courses/status', { courseId, type, status });
  }

  // Delete User
  deleteUser(userId: string, type: string): Observable<any> {
    return this.apiService.deleteAuth(`/admin/users/${type}/${userId}`);
  }

  // Delete Course
  deleteCourse(courseId: string, type: string): Observable<any> {
    return this.apiService.deleteAuth(`/admin/courses/${type}/${courseId}`);
  }

  // ========== INSTITUTE MANAGEMENT APIs ==========

  // Get All Institutions
  getAllInstitutions(params?: any): Observable<{ institutions: any[]; pagination: any }> {
    return this.apiService.getAuth<any>('/admin/institutions', params).pipe(
      map((response: ApiResponse<any>) => ({
        institutions: response.data || [],
        pagination: response.pagination || {}
      }))
    );
  }

  // Get Institution by ID
  getInstitutionById(id: string): Observable<any> {
    return this.apiService.getAuth<any>(`/admin/institutions/${id}`).pipe(
      map((response: ApiResponse<any>) => response.data!)
    );
  }

  // Get Institution Courses
  getInstitutionCourses(id: string, params?: any): Observable<{ courses: any[]; pagination: any }> {
    return this.apiService.getAuth<any>(`/admin/institutions/${id}/courses`, params).pipe(
      map((response: ApiResponse<any>) => ({
        courses: response.data || [],
        pagination: response.pagination || {}
      }))
    );
  }

  // Get Institution Students
  getInstitutionStudents(id: string, params?: any): Observable<{ students: any[]; pagination: any }> {
    return this.apiService.getAuth<any>(`/admin/institutions/${id}/students`, params).pipe(
      map((response: ApiResponse<any>) => ({
        students: response.data || [],
        pagination: response.pagination || {}
      }))
    );
  }

  // Get Institution Stats
  getInstitutionStats(id: string): Observable<any> {
    return this.apiService.getAuth<any>(`/admin/institutions/${id}/stats`).pipe(
      map((response: ApiResponse<any>) => response.data!)
    );
  }

  // Update Institution Status
  updateInstitutionStatus(institutionId: string, status: string): Observable<any> {
    return this.apiService.putAuth('/admin/institutions/status', { institutionId, status });
  }

  // Update Institution Details
  updateInstitutionDetails(id: string, payload: any): Observable<any> {
    return this.apiService.putAuth(`/admin/institutions/${id}`, payload);
  }

  // Delete Institution
  deleteInstitution(id: string): Observable<any> {
    return this.apiService.deleteAuth(`/admin/institutions/${id}`);
  }

  // ========== SUPPORT TICKET MANAGEMENT ==========

  getSupportTickets(params?: any): Observable<{ tickets: SupportTicket[]; pagination: any }> {
    return this.apiService.getAuth<any>('/admin/support-tickets', params).pipe(
      map((response: ApiResponse<any>) => ({
        tickets: response.data || [],
        pagination: response.pagination || {}
      }))
    );
  }

  getSupportTicketById(id: string): Observable<SupportTicket> {
    return this.apiService.getAuth<any>(`/admin/support-tickets/${id}`).pipe(
      map((response: ApiResponse<any>) => response.data!)
    );
  }

  resolveSupportTicket(id: string, payload: { resolution?: string; status?: string }): Observable<any> {
    return this.apiService.putAuth(`/admin/support-tickets/${id}/resolve`, payload);
  }

  // ========== TRENDING COURSES ==========

  getTrendingCourses(params?: any): Observable<{ courses: TrendingCourse[]; stats: any }> {
    return this.apiService.get<any>('/all-courses/trending', params).pipe(
      map((response: ApiResponse<any>) => ({
        courses: response.data || [],
        stats: response.stats || {}
      }))
    );
  }

  // Auth Helpers
  setAdminData(admin: AdminUser, token: string): void {
    localStorage.setItem(this.ADMIN_TOKEN_KEY, token);
    localStorage.setItem(this.ADMIN_USER_KEY, JSON.stringify(admin));
  }

  getAdminToken(): string | null {
    return localStorage.getItem(this.ADMIN_TOKEN_KEY);
  }

  getAdminUser(): AdminUser | null {
    const userStr = localStorage.getItem(this.ADMIN_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getAdminToken();
  }

  logout(): void {
    localStorage.removeItem(this.ADMIN_TOKEN_KEY);
    localStorage.removeItem(this.ADMIN_USER_KEY);
  }
}
