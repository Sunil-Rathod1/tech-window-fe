import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CourseTrainerService {

  constructor(private apiService: ApiService) { }

  getCourseTrainers(params?: {
    courseId?: string;
    category?: string;
    search?: string;
  }): Observable<any[]> {
    return this.apiService.get<any[]>('/trainers/public').pipe(
      map((response: ApiResponse<any[]>) => response.data || [])
    );
  }

}
