import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolution?: string;
  messagesCount?: number;
  lastMessage?: string;
  attachments?: Array<{
    url: string;
    fileName: string;
    fileType: string;
    uploadedAt: string;
  }>;
  messages?: Array<{
    sender: string;
    senderId: string;
    message: string;
    attachments?: Array<{
      url: string;
      fileName: string;
      fileType: string;
    }>;
    createdAt: string;
  }>;
  tags?: string[];
  relatedOrderId?: string;
  relatedEnrollmentId?: string;
}

export interface CreateTicketRequest {
  subject: string;
  category?: string;
  priority?: string;
  description: string;
  attachments?: Array<{
    url: string;
    fileName: string;
    fileType: string;
  }>;
  relatedOrderId?: string;
  relatedEnrollmentId?: string;
  tags?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SupportTicketService {
  constructor(private apiService: ApiService) {}

  /**
   * Create a new support ticket
   */
  createTicket(data: CreateTicketRequest): Observable<SupportTicket> {
    return this.apiService.postAuth<SupportTicket>('/support-tickets', data).pipe(
      map((response: ApiResponse<SupportTicket>) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to create ticket');
        }
        return response.data;
      })
    );
  }

  /**
   * Get all tickets for current user
   */
  getMyTickets(status?: string, category?: string, priority?: string): Observable<SupportTicket[]> {
    let url = '/support-tickets';
    const params: any = {};
    if (status) params.status = status;
    if (category) params.category = category;
    if (priority) params.priority = priority;

    return this.apiService.getAuth<SupportTicket[]>(url, params).pipe(
      map((response: ApiResponse<SupportTicket[]>) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to load tickets');
        }
        return response.data;
      })
    );
  }

  /**
   * Get ticket by ID
   */
  getTicketById(id: string): Observable<SupportTicket> {
    return this.apiService.getAuth<SupportTicket>(`/support-tickets/${id}`).pipe(
      map((response: ApiResponse<SupportTicket>) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to load ticket');
        }
        return response.data;
      })
    );
  }

  /**
   * Add message to ticket
   */
  addMessage(ticketId: string, message: string, attachments?: Array<{ url: string; fileName: string; fileType: string }>): Observable<SupportTicket> {
    return this.apiService.postAuth<SupportTicket>(`/support-tickets/${ticketId}/messages`, {
      message,
      attachments: attachments || []
    }).pipe(
      map((response: ApiResponse<SupportTicket>) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to add message');
        }
        return response.data;
      })
    );
  }
}




