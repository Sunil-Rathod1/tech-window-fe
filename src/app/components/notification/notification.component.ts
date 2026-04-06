import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService, Notification, NotificationResponse, NotificationStats } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  @Input() showDropdown = true;
  @Input() showBadge = true;
  @Input() maxNotifications = 10;
  @Input() autoRefresh = true;
  @Input() refreshInterval = 30000; // 30 seconds
  
  @Output() notificationClick = new EventEmitter<Notification>();
  @Output() markAsRead = new EventEmitter<Notification>();
  @Output() markAsUnread = new EventEmitter<Notification>();
  @Output() deleteNotification = new EventEmitter<Notification>();

  // Component state
  isOpen = false;
  isLoading = false;
  errorMessage = '';
  
  // Data
  notifications: Notification[] = [];
  unreadCount = 0;
  stats: NotificationStats | null = null;
  
  // Filters
  currentFilter = 'all';
  currentPage = 1;
  itemsPerPage = 10;
  hasMorePages = false;
  
  // Subscriptions
  private subscriptions: Subscription[] = [];
  private refreshInterval: any;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.loadStats();
    
    if (this.autoRefresh) {
      this.startAutoRefresh();
    }

    // Subscribe to unread count changes
    const unreadCountSub = this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
    this.subscriptions.push(unreadCountSub);

    // Subscribe to notifications changes
    const notificationsSub = this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications.slice(0, this.maxNotifications);
    });
    this.subscriptions.push(notificationsSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  // Data loading methods
  loadNotifications(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const options: any = {
      page: this.currentPage,
      limit: this.itemsPerPage
    };

    // Apply filters
    if (this.currentFilter === 'unread') {
      options.isRead = false;
    } else if (this.currentFilter === 'read') {
      options.isRead = true;
    } else if (this.currentFilter !== 'all') {
      options.type = this.currentFilter;
    }

    const sub = this.notificationService.getNotifications(options).subscribe({
      next: (response: NotificationResponse) => {
        this.notifications = response.notifications;
        this.unreadCount = response.unreadCount;
        this.hasMorePages = response.pagination.hasNextPage;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.errorMessage = 'Failed to load notifications';
        this.isLoading = false;
      }
    });
    this.subscriptions.push(sub);
  }

  loadStats(): void {
    const sub = this.notificationService.getNotificationStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading notification stats:', error);
      }
    });
    this.subscriptions.push(sub);
  }

  // UI methods
  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.loadNotifications();
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  setFilter(filter: string): void {
    this.currentFilter = filter;
    this.currentPage = 1;
    this.loadNotifications();
  }

  loadMore(): void {
    this.currentPage++;
    this.loadNotifications();
  }

  refreshNotifications(): void {
    this.currentPage = 1;
    this.loadNotifications();
    this.loadStats();
  }

  // Notification actions
  onNotificationClick(notification: Notification): void {
    this.notificationClick.emit(notification);
    
    // Mark as read if unread
    if (!notification.isRead) {
      this.markNotificationAsRead(notification);
    }
  }

  markNotificationAsRead(notification: Notification): void {
    const sub = this.notificationService.markAsRead(notification._id).subscribe({
      next: () => {
        this.markAsRead.emit(notification);
        // Update local state
        const index = this.notifications.findIndex(n => n._id === notification._id);
        if (index !== -1) {
          this.notifications[index] = { ...notification, isRead: true, readAt: new Date() };
        }
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
      }
    });
    this.subscriptions.push(sub);
  }

  markNotificationAsUnread(notification: Notification): void {
    const sub = this.notificationService.markAsUnread(notification._id).subscribe({
      next: () => {
        this.markAsUnread.emit(notification);
        // Update local state
        const index = this.notifications.findIndex(n => n._id === notification._id);
        if (index !== -1) {
          this.notifications[index] = { ...notification, isRead: false, readAt: undefined };
        }
      },
      error: (error) => {
        console.error('Error marking notification as unread:', error);
      }
    });
    this.subscriptions.push(sub);
  }

  deleteNotificationAction(notification: Notification): void {
    const sub = this.notificationService.deleteNotification(notification._id).subscribe({
      next: () => {
        this.deleteNotification.emit(notification);
        // Remove from local state
        this.notifications = this.notifications.filter(n => n._id !== notification._id);
      },
      error: (error) => {
        console.error('Error deleting notification:', error);
      }
    });
    this.subscriptions.push(sub);
  }

  markAllAsRead(): void {
    const sub = this.notificationService.markAllAsRead().subscribe({
      next: () => {
        // Update local state
        this.notifications = this.notifications.map(notification => ({
          ...notification,
          isRead: true,
          readAt: new Date()
        }));
        this.unreadCount = 0;
      },
      error: (error) => {
        console.error('Error marking all notifications as read:', error);
      }
    });
    this.subscriptions.push(sub);
  }

  // Utility methods
  getNotificationIcon(type: string): string {
    return this.notificationService.getNotificationIcon(type);
  }

  getNotificationColor(type: string): string {
    return this.notificationService.getNotificationColor(type);
  }

  getPriorityColor(priority: string): string {
    return this.notificationService.getPriorityColor(priority);
  }

  formatTimeAgo(date: Date): string {
    return this.notificationService.formatTimeAgo(date);
  }

  getStatusClass(isRead: boolean): string {
    return isRead ? 'read' : 'unread';
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  getTypeClass(type: string): string {
    return `type-${type}`;
  }

  // Auto-refresh
  private startAutoRefresh(): void {
    this.refreshInterval = setInterval(() => {
      if (this.isOpen) {
        this.refreshNotifications();
      }
    }, this.refreshInterval);
  }

  // Search functionality
  searchQuery = '';
  searchNotifications(): void {
    if (this.searchQuery.trim()) {
      const sub = this.notificationService.searchNotifications(this.searchQuery).subscribe({
        next: (notifications) => {
          this.notifications = notifications;
        },
        error: (error) => {
          console.error('Error searching notifications:', error);
        }
      });
      this.subscriptions.push(sub);
    } else {
      this.loadNotifications();
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.loadNotifications();
  }

  // Filter methods
  getFilterCount(filter: string): number {
    if (!this.stats) return 0;
    
    switch (filter) {
      case 'all':
        return this.stats.total;
      case 'unread':
        return this.stats.unread;
      case 'read':
        return this.stats.read;
      default:
        return this.stats.byType[filter] || 0;
    }
  }

  getFilterLabel(filter: string): string {
    const labels: { [key: string]: string } = {
      'all': 'All',
      'unread': 'Unread',
      'read': 'Read',
      'info': 'Info',
      'success': 'Success',
      'warning': 'Warning',
      'error': 'Error',
      'course': 'Course',
      'enrollment': 'Enrollment',
      'payment': 'Payment',
      'system': 'System',
      'achievement': 'Achievement',
      'reminder': 'Reminder'
    };
    return labels[filter] || filter;
  }
}











