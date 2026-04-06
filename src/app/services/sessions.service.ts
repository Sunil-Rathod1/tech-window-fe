import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';

export interface Session {
  id: string;
  courseTitle: string;
  sessionDate: string;
  endDate?: string;
  sessionTime: string;
  durationHours: number;
  sessionType: 'live' | 'recorded' | 'hybrid';
  meetingLink?: string;
  maxStudents: number;
  description?: string;
  topics: string[];
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalSessions?: number;
  modeOfClass?: 'online' | 'offline' | 'both';
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionRequest {
  course: string;
  sessionDate: string;
  endDate?: string;
  sessionTime: string;
  duration: number;
  maxStudents: number;
  sessionType: 'live' | 'recorded' | 'hybrid';
  meetingLink?: string;
  description?: string;
  topics: string[];
  totalSessions?: number;
  modeOfClass?: 'online' | 'offline' | 'both';
}

export interface UpdateSessionRequest extends CreateSessionRequest {
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

@Injectable({
  providedIn: 'root'
})
export class SessionsService {
  constructor(private apiService: ApiService) {}

  createSession(data: CreateSessionRequest): Observable<Session> {
    return this.apiService.postAuth<Session>('/sessions', data).pipe(
      map((response: ApiResponse<Session>) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to create session');
        }
        return response.data;
      })
    );
  }

  getMySessions(): Observable<Session[]> {
    return this.apiService.getAuth<Session[]>('/sessions/my-sessions').pipe(
      map((response: ApiResponse<Session[]>) => response.data || [])
    );
  }

  updateSession(id: string, data: UpdateSessionRequest): Observable<Session> {
    return this.apiService.putAuth<Session>(`/sessions/${id}`, data).pipe(
      map((response: ApiResponse<Session>) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to update session');
        }
        return response.data;
      })
    );
  }
}

