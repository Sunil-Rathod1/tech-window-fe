import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

export interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'course' | 'enrollment' | 'payment' | 'system' | 'achievement' | 'reminder';
  category: 'general' | 'course' | 'student' | 'trainer' | 'mentor' | 'institution' | 'payment' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  readAt?: Date;
  actionUrl?: string;
  actionText?: string;
  metadata?: any;
  expiresAt?: Date;
  scheduledFor?: Date;
  isScheduled: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  timeAgo?: string;
}

export interface NotificationPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface NotificationResponse {
  notifications: Notification[];
  pagination: NotificationPagination;
  unreadCount: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  byType: { [key: string]: number };
  byCategory: { [key: string]: number };
  byPriority: { [key: string]: number };
  recentActivity?: Array<{ date: string; count: number }>;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'course' | 'enrollment' | 'payment' | 'system' | 'achievement' | 'reminder';
  category?: 'general' | 'course' | 'student' | 'trainer' | 'mentor' | 'institution' | 'payment' | 'system';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionText?: string;
  metadata?: any;
  expiresAt?: Date;
  scheduledFor?: Date;
  isScheduled?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:3000/api/notifications';
  private unreadCountSubject = new BehaviorSubject<number>(0);
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  
  public unreadCount$ = this.unreadCountSubject.asObservable();
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(private apiService: ApiService) {
    // Auto-refresh unread count every 30 seconds
    interval(30000).pipe(
      switchMap(() => this.getUnreadCount())
    ).subscribe();
  }

  // Get user notifications with pagination and filters
  getNotifications(options: {
    page?: number;
    limit?: number;
    type?: string;
    category?: string;
    priority?: string;
    isRead?: boolean;
    sortBy?: string;
    sortOrder?: number;
  } = {}): Observable<NotificationResponse> {
    const params = new URLSearchParams();
    
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.type) params.append('type', options.type);
    if (options.category) params.append('category', options.category);
    if (options.priority) params.append('priority', options.priority);
    if (options.isRead !== undefined) params.append('isRead', options.isRead.toString());
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder.toString());

    const queryString = params.toString();
    const url = queryString ? `${this.apiUrl}?${queryString}` : this.apiUrl;

    return this.apiService.get<NotificationResponse>(url)
      .pipe(
        map(response => (response.data || response) as NotificationResponse),
        tap(data => {
          this.notificationsSubject.next(data.notifications);
          this.unreadCountSubject.next(data.unreadCount);
        })
      );
  }

  // Get unread notification count
  getUnreadCount(): Observable<number> {
    return this.apiService.get<{ unreadCount: number }>(`${this.apiUrl}/unread-count`)
      .pipe(
        map(response => (response.data || response).unreadCount),
        tap(count => this.unreadCountSubject.next(count))
      );
  }

  // Mark notification as read
  markAsRead(notificationId: string): Observable<Notification> {
    return this.apiService.put<Notification>(`${this.apiUrl}/${notificationId}/read`, {})
      .pipe(
        map(response => (response.data || response) as Notification),
        tap(() => {
          // Update local state
          const currentNotifications = this.notificationsSubject.value;
          const updatedNotifications = currentNotifications.map(notification => 
            notification._id === notificationId 
              ? { ...notification, isRead: true, readAt: new Date() }
              : notification
          );
          this.notificationsSubject.next(updatedNotifications);
          
          // Update unread count
          const currentUnreadCount = this.unreadCountSubject.value;
          this.unreadCountSubject.next(Math.max(0, currentUnreadCount - 1));
        })
      );
  }

  // Mark notification as unread
  markAsUnread(notificationId: string): Observable<Notification> {
    return this.apiService.put<Notification>(`${this.apiUrl}/${notificationId}/unread`, {})
      .pipe(
        map(response => (response.data || response) as Notification),
        tap(() => {
          // Update local state
          const currentNotifications = this.notificationsSubject.value;
          const updatedNotifications = currentNotifications.map(notification => 
            notification._id === notificationId 
              ? { ...notification, isRead: false, readAt: undefined }
              : notification
          );
          this.notificationsSubject.next(updatedNotifications);
          
          // Update unread count
          const currentUnreadCount = this.unreadCountSubject.value;
          this.unreadCountSubject.next(currentUnreadCount + 1);
        })
      );
  }

  // Mark all notifications as read
  markAllAsRead(): Observable<{ markedCount: number }> {
    return this.apiService.put<{ markedCount: number }>(`${this.apiUrl}/mark-all-read`, {})
      .pipe(
        map(response => (response.data || response) as { markedCount: number }),
        tap(() => {
          // Update local state
          const currentNotifications = this.notificationsSubject.value;
          const updatedNotifications = currentNotifications.map(notification => ({
            ...notification,
            isRead: true,
            readAt: new Date()
          }));
          this.notificationsSubject.next(updatedNotifications);
          
          // Reset unread count
          this.unreadCountSubject.next(0);
        })
      );
  }

  // Delete notification
  deleteNotification(notificationId: string): Observable<{ success: boolean; message: string }> {
    return this.apiService.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${notificationId}`)
      .pipe(
        map(response => (response.data || response) as { success: boolean; message: string }),
        tap(() => {
          // Update local state
          const currentNotifications = this.notificationsSubject.value;
          const deletedNotification = currentNotifications.find(n => n._id === notificationId);
          const updatedNotifications = currentNotifications.filter(n => n._id !== notificationId);
          this.notificationsSubject.next(updatedNotifications);
          
          // Update unread count if deleted notification was unread
          if (deletedNotification && !deletedNotification.isRead) {
            const currentUnreadCount = this.unreadCountSubject.value;
            this.unreadCountSubject.next(Math.max(0, currentUnreadCount - 1));
          }
        })
      );
  }

  // Get notification statistics
  getNotificationStats(): Observable<NotificationStats> {
    return this.apiService.get<NotificationStats>(`${this.apiUrl}/stats`)
      .pipe(map(response => (response.data || response) as NotificationStats));
  }

  // Create notification (admin/system only)
  createNotification(notificationData: CreateNotificationRequest): Observable<Notification> {
    return this.apiService.post<Notification>(this.apiUrl, notificationData)
      .pipe(
        map(response => (response.data || response) as Notification),
        tap(newNotification => {
          // Add to local state
          const currentNotifications = this.notificationsSubject.value;
          this.notificationsSubject.next([newNotification, ...currentNotifications]);
          
          // Update unread count if notification is unread
          if (!newNotification.isRead) {
            const currentUnreadCount = this.unreadCountSubject.value;
            this.unreadCountSubject.next(currentUnreadCount + 1);
          }
        })
      );
  }

  // Get notifications by type
  getNotificationsByType(type: string): Observable<Notification[]> {
    return this.getNotifications({ type }).pipe(
      map(response => response.notifications)
    );
  }

  // Get notifications by category
  getNotificationsByCategory(category: string): Observable<Notification[]> {
    return this.getNotifications({ category }).pipe(
      map(response => response.notifications)
    );
  }

  // Get unread notifications only
  getUnreadNotifications(): Observable<Notification[]> {
    return this.getNotifications({ isRead: false }).pipe(
      map(response => response.notifications)
    );
  }

  // Get read notifications only
  getReadNotifications(): Observable<Notification[]> {
    return this.getNotifications({ isRead: true }).pipe(
      map(response => response.notifications)
    );
  }

  // Get high priority notifications
  getHighPriorityNotifications(): Observable<Notification[]> {
    return this.getNotifications({ priority: 'high' }).pipe(
      map(response => response.notifications)
    );
  }

  // Get urgent notifications
  getUrgentNotifications(): Observable<Notification[]> {
    return this.getNotifications({ priority: 'urgent' }).pipe(
      map(response => response.notifications)
    );
  }

  // Search notifications
  searchNotifications(query: string): Observable<Notification[]> {
    // This would typically be implemented on the backend
    // For now, we'll filter locally
    const currentNotifications = this.notificationsSubject.value;
    const filtered = currentNotifications.filter(notification => 
      notification.title.toLowerCase().includes(query.toLowerCase()) ||
      notification.message.toLowerCase().includes(query.toLowerCase())
    );
    return new Observable(observer => {
      observer.next(filtered);
      observer.complete();
    });
  }

  // Get notification by ID
  getNotificationById(notificationId: string): Observable<Notification | undefined> {
    const currentNotifications = this.notificationsSubject.value;
    const notification = currentNotifications.find(n => n._id === notificationId);
    return new Observable(observer => {
      observer.next(notification);
      observer.complete();
    });
  }

  // Utility methods
  getNotificationIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'info': 'fas fa-info-circle',
      'success': 'fas fa-check-circle',
      'warning': 'fas fa-exclamation-triangle',
      'error': 'fas fa-times-circle',
      'course': 'fas fa-book',
      'enrollment': 'fas fa-user-plus',
      'payment': 'fas fa-credit-card',
      'system': 'fas fa-cog',
      'achievement': 'fas fa-trophy',
      'reminder': 'fas fa-bell'
    };
    return iconMap[type] || 'fas fa-bell';
  }

  getNotificationColor(type: string): string {
    const colorMap: { [key: string]: string } = {
      'info': '#2196F3',
      'success': '#4CAF50',
      'warning': '#FF9800',
      'error': '#F44336',
      'course': '#9C27B0',
      'enrollment': '#00BCD4',
      'payment': '#795548',
      'system': '#607D8B',
      'achievement': '#FFC107',
      'reminder': '#E91E63'
    };
    return colorMap[type] || '#2196F3';
  }

  getPriorityColor(priority: string): string {
    const priorityColorMap: { [key: string]: string } = {
      'low': '#4CAF50',
      'medium': '#FF9800',
      'high': '#F44336',
      'urgent': '#9C27B0'
    };
    return priorityColorMap[priority] || '#FF9800';
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  }

  // Initialize notifications (call this when the app starts)
  initializeNotifications(): void {
    this.getNotifications({ limit: 20 }).subscribe();
  }

  // Refresh notifications
  refreshNotifications(): void {
    this.getNotifications({ limit: 20 }).subscribe();
  }
}











