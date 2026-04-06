import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';

export interface UploadedFile {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  path: string;
}

export interface UploadedFileInfo {
  filename: string;
  size: number;
  created: string;
  modified: string;
  url: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private apiService: ApiService) { }

  // Upload single file
  uploadSingle(file: File): Observable<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file);

    return this.apiService.uploadAuth<UploadedFile>('/upload/single', formData).pipe(
      map((response: ApiResponse<UploadedFile>) => response.data!)
    );
  }

  // Upload multiple files
  uploadMultiple(files: File[]): Observable<UploadedFile[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    return this.apiService.uploadAuth<UploadedFile[]>('/upload/multiple', formData).pipe(
      map((response: ApiResponse<UploadedFile[]>) => response.data!)
    );
  }

  // Upload avatar
  uploadAvatar(file: File): Observable<UploadedFile> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.apiService.uploadAuth<UploadedFile>('/upload/avatar', formData).pipe(
      map((response: ApiResponse<UploadedFile>) => response.data!)
    );
  }

  // Upload course image
  uploadCourseImage(file: File): Observable<UploadedFile> {
    const formData = new FormData();
    formData.append('courseImage', file);

    return this.apiService.uploadAuth<UploadedFile>('/upload/course-image', formData).pipe(
      map((response: ApiResponse<UploadedFile>) => response.data!)
    );
  }

  // Upload institute files
  uploadInstituteFiles(logo?: File, banner?: File): Observable<UploadedFile[]> {
    const formData = new FormData();
    if (logo) formData.append('instituteLogo', logo);
    if (banner) formData.append('instituteBanner', banner);

    return this.apiService.uploadAuth<UploadedFile[]>('/upload/institute-files', formData).pipe(
      map((response: ApiResponse<UploadedFile[]>) => response.data!)
    );
  }

  // Upload certificate
  uploadCertificate(file: File): Observable<UploadedFile> {
    const formData = new FormData();
    formData.append('certificate', file);

    return this.apiService.uploadAuth<UploadedFile>('/upload/certificate', formData).pipe(
      map((response: ApiResponse<UploadedFile>) => response.data!)
    );
  }

  // Upload gallery images
  uploadGallery(files: File[]): Observable<UploadedFile[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('gallery', file);
    });

    return this.apiService.uploadAuth<UploadedFile[]>('/upload/gallery', formData).pipe(
      map((response: ApiResponse<UploadedFile[]>) => response.data!)
    );
  }

  // Delete file
  deleteFile(filename: string): Observable<any> {
    return this.apiService.deleteAuth<any>(`/upload/${filename}`);
  }

  // Get file info
  getFileInfo(filename: string): Observable<UploadedFileInfo> {
    return this.apiService.getAuth<UploadedFileInfo>(`/upload/${filename}`).pipe(
      map((response: ApiResponse<UploadedFileInfo>) => response.data!)
    );
  }

  // Validate file type
  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  // Validate file size
  validateFileSize(file: File, maxSize: number): boolean {
    return file.size <= maxSize;
  }

  // Get allowed image types
  getAllowedImageTypes(): string[] {
    return ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  }

  // Get allowed document types
  getAllowedDocumentTypes(): string[] {
    return ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  }

  // Get allowed video types
  getAllowedVideoTypes(): string[] {
    return ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
  }

  // Get all allowed types
  getAllAllowedTypes(): string[] {
    return [
      ...this.getAllowedImageTypes(),
      ...this.getAllowedDocumentTypes(),
      ...this.getAllowedVideoTypes()
    ];
  }

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get file extension
  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  // Check if file is image
  isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  // Check if file is document
  isDocumentFile(file: File): boolean {
    return file.type.includes('application/pdf') || file.type.includes('application/msword') || file.type.includes('application/vnd.openxmlformats-officedocument');
  }

  // Check if file is video
  isVideoFile(file: File): boolean {
    return file.type.startsWith('video/');
  }
}