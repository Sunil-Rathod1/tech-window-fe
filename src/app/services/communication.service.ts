import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';

// Interfaces for Communication Data
export interface EmailNotification {
  id: string;
  to: string[];
  subject: string;
  body: string;
  template: string;
  variables: { [key: string]: any };
  priority: 'low' | 'normal' | 'high';
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  sentAt: Date;
  scheduledAt: Date;
  sender: string;
  metadata: any;
}

export interface SMSNotification {
  id: string;
  to: string[];
  message: string;
  template: string;
  variables: { [key: string]: any };
  priority: 'low' | 'normal' | 'high';
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  sentAt: Date;
  scheduledAt: Date;
  sender: string;
  metadata: any;
}

export interface PushNotification {
  id: string;
  to: string[];
  title: string;
  body: string;
  data: { [key: string]: any };
  priority: 'low' | 'normal' | 'high';
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  sentAt: Date;
  scheduledAt: Date;
  sender: string;
  metadata: any;
}

export interface BulkNotification {
  id: string;
  type: 'email' | 'sms' | 'push';
  recipients: number;
  message: string;
  template: string;
  variables: { [key: string]: any };
  priority: 'low' | 'normal' | 'high';
  status: 'processing' | 'completed' | 'failed';
  createdAt: Date;
  scheduledAt: Date;
  sender: string;
  progress: {
    total: number;
    sent: number;
    failed: number;
    pending: number;
  };
  results: any[];
}

export interface NotificationTemplate {
  id: string;
  name: string;
  category: string;
  subject?: string;
  body: string;
  variables: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NotificationHistory {
  id: string;
  type: 'email' | 'sms' | 'push';
  to: string;
  subject?: string;
  message?: string;
  title?: string;
  body?: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  sentAt: Date;
  template?: string;
}

export interface NotificationStatus {
  id: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  sentAt: Date;
  deliveredAt?: Date;
  readAt?: Date;
  events: {
    event: string;
    timestamp: Date;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private apiUrl = 'http://localhost:3000/api/communication';

  constructor(private apiService: ApiService) { }

  // Email Methods
  sendEmail(to: string | string[], subject: string, body: string, template?: string, variables?: any, priority: 'low' | 'normal' | 'high' = 'normal', scheduledAt?: Date): Observable<EmailNotification> {
    const emailData = {
      to: Array.isArray(to) ? to : [to],
      subject,
      body,
      template,
      variables,
      priority,
      scheduledAt
    };
    
    return this.apiService.post<EmailNotification>(`${this.apiUrl}/email`, emailData)
      .pipe(map(response => response.data || (response as unknown as EmailNotification)));
  }

  // SMS Methods
  sendSMS(to: string | string[], message: string, template?: string, variables?: any, priority: 'low' | 'normal' | 'high' = 'normal', scheduledAt?: Date): Observable<SMSNotification> {
    const smsData = {
      to: Array.isArray(to) ? to : [to],
      message,
      template,
      variables,
      priority,
      scheduledAt
    };
    
    return this.apiService.post<SMSNotification>(`${this.apiUrl}/sms`, smsData)
      .pipe(map(response => response.data || (response as unknown as SMSNotification)));
  }

  // Push Notification Methods
  sendPushNotification(to: string | string[], title: string, body: string, data?: any, priority: 'low' | 'normal' | 'high' = 'normal', scheduledAt?: Date): Observable<PushNotification> {
    const pushData = {
      to: Array.isArray(to) ? to : [to],
      title,
      body,
      data,
      priority,
      scheduledAt
    };
    
    return this.apiService.post<PushNotification>(`${this.apiUrl}/push`, pushData)
      .pipe(map(response => response.data || (response as unknown as PushNotification)));
  }

  // Bulk Notification Methods
  sendBulkNotifications(type: 'email' | 'sms' | 'push', recipients: string[], message: string, template?: string, variables?: any, priority: 'low' | 'normal' | 'high' = 'normal', scheduledAt?: Date): Observable<BulkNotification> {
    const bulkData = {
      type,
      recipients,
      message,
      template,
      variables,
      priority,
      scheduledAt
    };
    
    return this.apiService.post<BulkNotification>(`${this.apiUrl}/bulk`, bulkData)
      .pipe(map(response => response.data || (response as unknown as BulkNotification)));
  }

  // Template Methods
  getTemplates(type?: string, category?: string): Observable<{ [key: string]: NotificationTemplate[] }> {
    const params: any = {};
    if (type) params.type = type;
    if (category) params.category = category;
    
    return this.apiService.get<{ [key: string]: NotificationTemplate[] }>(`${this.apiUrl}/templates`, params)
      .pipe(map(response => response.data || (response as unknown as { [key: string]: NotificationTemplate[] })));
  }

  createTemplate(type: 'email' | 'sms' | 'push', name: string, category: string, subject: string, body: string, variables: string[], isActive: boolean = true): Observable<NotificationTemplate> {
    const templateData = {
      type,
      name,
      category,
      subject,
      body,
      variables,
      isActive
    };
    
    return this.apiService.post<NotificationTemplate>(`${this.apiUrl}/templates`, templateData)
      .pipe(map(response => response.data || (response as unknown as NotificationTemplate)));
  }

  // History Methods
  getNotificationHistory(type?: string, status?: string, page: number = 1, limit: number = 20, startDate?: Date, endDate?: Date): Observable<{ notifications: NotificationHistory[], pagination: any }> {
    const params: any = { page, limit };
    if (type) params.type = type;
    if (status) params.status = status;
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    
    return this.apiService.get<{ notifications: NotificationHistory[], pagination: any }>(`${this.apiUrl}/history`, params)
      .pipe(map(response => response.data || (response as unknown as { notifications: NotificationHistory[], pagination: any })));
  }

  getNotificationStatus(notificationId: string): Observable<NotificationStatus> {
    return this.apiService.get<NotificationStatus>(`${this.apiUrl}/status/${notificationId}`)
      .pipe(map(response => response.data || (response as unknown as NotificationStatus)));
  }

  // Utility Methods
  sendWelcomeEmail(userEmail: string, userName: string): Observable<EmailNotification> {
    return this.sendEmail(
      userEmail,
      'Welcome to TechWindows!',
      `Welcome ${userName}! We're excited to have you join our learning community.`,
      'welcome-email',
      { userName, userEmail }
    );
  }

  sendOTP(phoneNumber: string, otp: string): Observable<SMSNotification> {
    return this.sendSMS(
      phoneNumber,
      `Your OTP for TechWindows is ${otp}. Valid for 5 minutes.`,
      'otp-sms',
      { otp }
    );
  }

  sendCourseEnrollmentConfirmation(userEmail: string, userName: string, courseName: string, startDate: string): Observable<EmailNotification> {
    return this.sendEmail(
      userEmail,
      `You're enrolled in ${courseName}`,
      `Congratulations ${userName}! You're now enrolled in ${courseName}. Course starts on ${startDate}.`,
      'course-enrollment',
      { userName, courseName, startDate }
    );
  }

  sendCourseReminder(phoneNumber: string, courseName: string): Observable<SMSNotification> {
    return this.sendSMS(
      phoneNumber,
      `Reminder: Your ${courseName} session starts in 30 minutes.`,
      'course-reminder',
      { courseName }
    );
  }

  sendNewCourseNotification(deviceToken: string, courseName: string): Observable<PushNotification> {
    return this.sendPushNotification(
      deviceToken,
      'New Course Available!',
      `Check out the new ${courseName} course.`,
      { courseName },
      'normal'
    );
  }

  sendAssignmentDueReminder(deviceToken: string, assignmentName: string, timeLeft: string): Observable<PushNotification> {
    return this.sendPushNotification(
      deviceToken,
      'Assignment Due Soon',
      `Your ${assignmentName} assignment is due in ${timeLeft}.`,
      { assignmentName, timeLeft },
      'high'
    );
  }
}











