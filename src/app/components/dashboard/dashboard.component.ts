import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardStats, CourseEnrollment, LearningPath, Notification } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // User Profile Data
  userProfile = {
    name: 'John Doe',
    email: 'john.doe@techwindows.com',
    avatar: 'https://via.placeholder.com/60x60/007bff/ffffff?text=JD',
    memberSince: 'January 2024',
    subscription: 'Premium Plan',
    lastLogin: '2 hours ago'
  };

  // Dashboard Data
  dashboardStats: DashboardStats | null = null;
  currentEnrollments: CourseEnrollment[] = [];
  learningPaths: LearningPath[] = [];
  notifications: Notification[] = [];
  upcomingEvents: any[] = [];
  quickActions: any[] = [];
  recentActivities: any[] = [];

  // Loading States
  loading = {
    stats: true,
    enrollments: true,
    paths: true,
    notifications: true,
    events: true,
    actions: true,
    activities: true
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  // Load all dashboard data
  loadDashboardData(): void {
    this.loadDashboardStats();
    this.loadCurrentEnrollments();
    this.loadLearningPaths();
    this.loadNotifications();
    this.loadUpcomingEvents();
    this.loadQuickActions();
    this.loadRecentActivities();
  }

  // Load dashboard statistics
  loadDashboardStats(): void {
    this.loading.stats = true;
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
        this.loading.stats = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.loading.stats = false;
      }
    });
  }

  // Load current enrollments
  loadCurrentEnrollments(): void {
    this.loading.enrollments = true;
    this.dashboardService.getCurrentEnrollments().subscribe({
      next: (enrollments) => {
        this.currentEnrollments = enrollments;
        this.loading.enrollments = false;
      },
      error: (error) => {
        console.error('Error loading enrollments:', error);
        this.loading.enrollments = false;
      }
    });
  }

  // Load learning paths
  loadLearningPaths(): void {
    this.loading.paths = true;
    this.dashboardService.getLearningPaths().subscribe({
      next: (paths) => {
        this.learningPaths = paths;
        this.loading.paths = false;
      },
      error: (error) => {
        console.error('Error loading learning paths:', error);
        this.loading.paths = false;
      }
    });
  }

  // Load notifications
  loadNotifications(): void {
    this.loading.notifications = true;
    this.dashboardService.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.loading.notifications = false;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.loading.notifications = false;
      }
    });
  }

  // Load upcoming events
  loadUpcomingEvents(): void {
    this.loading.events = true;
    this.dashboardService.getUpcomingEvents().subscribe({
      next: (events) => {
        this.upcomingEvents = events;
        this.loading.events = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.loading.events = false;
      }
    });
  }

  // Load quick actions
  loadQuickActions(): void {
    this.loading.actions = true;
    this.dashboardService.getQuickActions().subscribe({
      next: (actions) => {
        this.quickActions = actions;
        this.loading.actions = false;
      },
      error: (error) => {
        console.error('Error loading quick actions:', error);
        this.loading.actions = false;
      }
    });
  }

  // Load recent activities
  loadRecentActivities(): void {
    this.loading.activities = true;
    this.dashboardService.getRecentActivities().subscribe({
      next: (activities) => {
        this.recentActivities = activities;
        this.loading.activities = false;
      },
      error: (error) => {
        console.error('Error loading activities:', error);
        this.loading.activities = false;
      }
    });
  }

  // Action Methods
  onQuickAction(action: string): void {
    console.log('Quick action clicked:', action);
    
    switch (action) {
      case 'browse':
        // Navigate to courses page
        console.log('Navigating to courses...');
        break;
      case 'join':
        // Open study group modal
        console.log('Opening study group modal...');
        break;
      case 'schedule':
        // Open mentor session scheduler
        console.log('Opening mentor session scheduler...');
        break;
      case 'download':
        // Download certificates
        console.log('Downloading certificates...');
        break;
      default:
        console.log('Unknown action:', action);
    }
  }

  // Mark notification as read
  markNotificationAsRead(notification: Notification): void {
    if (!notification.read) {
      this.dashboardService.markNotificationAsRead(notification.id).subscribe({
        next: (success) => {
          if (success) {
            notification.read = true;
          }
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
        }
      });
    }
  }

  // Get unread notifications count
  getUnreadNotificationsCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Get progress color based on percentage
  getProgressColor(progress: number): string {
    if (progress >= 80) return 'success';
    if (progress >= 60) return 'info';
    if (progress >= 40) return 'warning';
    return 'danger';
  }

  // Get priority badge color
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  }

  // Refresh dashboard data
  refreshDashboard(): void {
    this.loadDashboardData();
  }

  // Get loading skeleton class
  getLoadingClass(section: string): string {
    return this.loading[section as keyof typeof this.loading] ? 'loading-skeleton' : '';
  }
}
