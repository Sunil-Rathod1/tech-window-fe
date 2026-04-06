import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

export interface ImportTemplate {
  entityType: string;
  fields: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    example?: string;
  }>;
  sampleData: any[];
}

export interface ImportHistory {
  id: string;
  entityType: string;
  fileName: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
  importedAt: string;
  importedBy: string;
}

export interface ImportResult {
  success: boolean;
  message: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
  importedData?: any[];
}

export interface ImportRequest {
  entityType: string;
  file: File;
  options?: {
    skipHeader?: boolean;
    validateData?: boolean;
    updateExisting?: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  constructor(private apiService: ApiService) { }

  // Import data from Excel file
  importData(entityType: string, file: File, options?: any): Observable<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }

    return this.apiService.uploadAuth<ImportResult>(`/import/${entityType}`, formData).pipe(
      map((response: ApiResponse<ImportResult>) => response.data!)
    );
  }

  // Get import template for entity type
  getImportTemplate(entityType: string): Observable<ImportTemplate> {
    return this.apiService.getAuth<ImportTemplate>(`/import/template/${entityType}`).pipe(
      map((response: ApiResponse<ImportTemplate>) => response.data!)
    );
  }

  // Download import template
  downloadTemplate(entityType: string): Observable<Blob> {
    return this.apiService.get<Blob>(`/import/download-template/${entityType}`).pipe(
      map((response: any) => response)
    );
  }

  // Get import history
  getImportHistory(filters?: { entityType?: string; page?: number; limit?: number }): Observable<{ data: ImportHistory[]; pagination: any }> {
    return this.apiService.getAuth<ImportHistory[]>('/import/history', filters).pipe(
      map((response: ApiResponse<ImportHistory[]>) => ({
        data: response.data || [],
        pagination: response.pagination || {}
      }))
    );
  }

  // Get supported entity types
  getSupportedEntityTypes(): string[] {
    return [
      'courses',
      'institutes',
      'trainers',
      'mentors',
      'users',
      'news'
    ];
  }

  // Validate file before import
  validateFile(file: File): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];
    
    if (!allowedTypes.includes(file.type)) {
      errors.push('File must be an Excel (.xlsx, .xls) or CSV file');
    }
    
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      errors.push('File size must be less than 10MB');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Format import errors for display
  formatImportErrors(errors: Array<{ row: number; field: string; message: string }>): string {
    if (!errors || errors.length === 0) {
      return 'No errors found';
    }
    
    return errors.map(error => 
      `Row ${error.row}, Field "${error.field}": ${error.message}`
    ).join('\n');
  }

  // Get import statistics
  getImportStats(): Observable<{
    totalImports: number;
    successfulImports: number;
    failedImports: number;
    totalRecordsImported: number;
    lastImportDate: string;
  }> {
    return this.apiService.getAuth<any>('/import/stats').pipe(
      map((response: ApiResponse<any>) => response.data!)
    );
  }

  // Retry failed import
  retryImport(importId: string): Observable<ImportResult> {
    return this.apiService.postAuth<ImportResult>(`/import/${importId}/retry`, {}).pipe(
      map((response: ApiResponse<ImportResult>) => response.data!)
    );
  }

  // Delete import record
  deleteImportRecord(importId: string): Observable<any> {
    return this.apiService.deleteAuth<any>(`/import/${importId}`);
  }

  // Get import progress
  getImportProgress(importId: string): Observable<{
    status: string;
    progress: number;
    message: string;
  }> {
    return this.apiService.getAuth<any>(`/import/${importId}/progress`).pipe(
      map((response: ApiResponse<any>) => response.data!)
    );
  }

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Format date
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Get entity type display name
  getEntityTypeDisplayName(entityType: string): string {
    const displayNames: { [key: string]: string } = {
      'courses': 'Courses',
      'institutes': 'Institutes',
      'trainers': 'Trainers',
      'mentors': 'Mentors',
      'users': 'Users',
      'news': 'News Articles'
    };
    return displayNames[entityType] || entityType;
  }

  // Get status display name
  getStatusDisplayName(status: string): string {
    const statusNames: { [key: string]: string } = {
      'pending': 'Pending',
      'processing': 'Processing',
      'completed': 'Completed',
      'failed': 'Failed'
    };
    return statusNames[status] || status;
  }

  // Get status color
  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'pending': '#ffc107',
      'processing': '#17a2b8',
      'completed': '#28a745',
      'failed': '#dc3545'
    };
    return statusColors[status] || '#6c757d';
  }
}

