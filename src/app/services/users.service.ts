import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { User } from './auth.service';

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: 'user' | 'trainer' | 'mentor' | 'admin';
  status?: 'active' | 'inactive';
  verified?: boolean;
  search?: string;
  sort?: 'name' | 'email' | 'role' | 'createdAt' | 'lastLogin';
  order?: 'asc' | 'desc';
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: 'user' | 'trainer' | 'mentor' | 'admin';
  bio?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  trainers: number;
  mentors: number;
  admins: number;
  regularUsers: number;
  recentUsers: number;
  verificationRate: string;
  activationRate: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private apiService: ApiService) { }

  // Get all users (Admins only)
  getUsers(filters?: UserFilters): Observable<{ users: User[]; count: number; pagination: any }> {
    return this.apiService.getAuth<User[]>('/users', filters).pipe(
      map((response: ApiResponse<User[]>) => ({
        users: response.data || [],
        count: response.count || 0,
        pagination: response.pagination
      }))
    );
  }

  // Get single user by ID
  getUser(id: string): Observable<User> {
    return this.apiService.getAuth<User>(`/users/${id}`).pipe(
      map((response: ApiResponse<User>) => response.data!)
    );
  }

  // Update user (User owner/Admins only)
  updateUser(id: string, data: UpdateUserRequest): Observable<User> {
    return this.apiService.putAuth<User>(`/users/${id}`, data).pipe(
      map((response: ApiResponse<User>) => response.data!)
    );
  }

  // Delete user (Admins only)
  deleteUser(id: string): Observable<any> {
    return this.apiService.deleteAuth<any>(`/users/${id}`);
  }

  // Toggle user status (Admins only)
  toggleUserStatus(id: string): Observable<any> {
    return this.apiService.putAuth<any>(`/users/${id}/toggle-status`, {}).pipe(
      map((response: ApiResponse<any>) => response.data!)
    );
  }

  // Verify user email (Admins only)
  verifyUserEmail(id: string): Observable<any> {
    return this.apiService.putAuth<any>(`/users/${id}/verify-email`, {}).pipe(
      map((response: ApiResponse<any>) => response.data!)
    );
  }

  // Get user statistics (Admins only)
  getUserStats(): Observable<UserStats> {
    return this.apiService.getAuth<UserStats>('/users/stats').pipe(
      map((response: ApiResponse<UserStats>) => response.data!)
    );
  }

  // Search users (Admins only)
  searchUsers(query: string): Observable<User[]> {
    return this.apiService.getAuth<User[]>('/users/search', { q: query }).pipe(
      map((response: ApiResponse<User[]>) => response.data || [])
    );
  }

  // Get users by role (Admins only)
  getUsersByRole(role: string, filters?: { page?: number; limit?: number }): Observable<{ users: User[]; count: number; pagination: any }> {
    return this.apiService.getAuth<User[]>(`/users/role/${role}`, filters).pipe(
      map((response: ApiResponse<User[]>) => ({
        users: response.data || [],
        count: response.count || 0,
        pagination: response.pagination
      }))
    );
  }

  // Get user roles
  getUserRoles(): string[] {
    return ['user', 'trainer', 'mentor', 'admin'];
  }

  // Get user statuses
  getUserStatuses(): string[] {
    return ['active', 'inactive'];
  }

  // Get sort options
  getSortOptions(): Array<{ value: string; label: string }> {
    return [
      { value: 'name', label: 'Name' },
      { value: 'email', label: 'Email' },
      { value: 'role', label: 'Role' },
      { value: 'createdAt', label: 'Date Created' },
      { value: 'lastLogin', label: 'Last Login' }
    ];
  }
}

