import { Component, OnInit } from '@angular/core';
import { ImportService, ImportResult, ImportTemplate } from '../../services/import.service';

interface ImportSummary {
  total: number;
  imported: number;
  skipped: number;
  errors: number;
}

@Component({
  selector: 'app-excel-import',
  templateUrl: './excel-import.component.html',
  styleUrls: ['./excel-import.component.css']
})
export class ExcelImportComponent implements OnInit {

  // Entity types
  entityTypes = [
    { value: 'courses', label: 'Courses', icon: 'fas fa-graduation-cap' },
    { value: 'institutes', label: 'Institutes', icon: 'fas fa-building' },
    { value: 'trainers', label: 'Trainers', icon: 'fas fa-chalkboard-teacher' },
    { value: 'mentors', label: 'Mentors', icon: 'fas fa-user-graduate' }
  ];

  // Form data
  selectedEntityType = 'courses';
  selectedFile: File | null = null;
  skipDuplicates = true;
  overwrite = false;

  // UI states
  isUploading = false;
  showResults = false;
  showTemplate = false;
  showInstructions = false;

  // Results
  importResults: ImportResult | null = null;
  importSummary: ImportSummary | null = null;
  errorMessage = '';
  successMessage = '';

  // Template data
  templateData: ImportTemplate | null = null;
  importHistory: any[] = [];

  constructor(private importService: ImportService) { }

  ngOnInit(): void {
    this.loadTemplate();
    this.loadImportHistory();
  }

  // File selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Use ImportService validation
      const validation = this.importService.validateFile(file);
      
      if (!validation.valid) {
        this.errorMessage = validation.errors.join(', ');
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  // Load template data
  loadTemplate(): void {
    this.importService.getImportTemplate(this.selectedEntityType).subscribe({
      next: (template) => {
        this.templateData = template;
      },
      error: (error) => {
        console.error('Error loading template:', error);
        this.errorMessage = 'Failed to load template';
      }
    });
  }

  // Download template
  downloadTemplate(): void {
    this.importService.downloadTemplate(this.selectedEntityType).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.selectedEntityType}-template.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading template:', error);
        this.errorMessage = 'Failed to download template';
      }
    });
  }

  // Import data
  importData(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file to import';
      return;
    }

    this.isUploading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.showResults = false;

    const options = {
      skipDuplicates: this.skipDuplicates,
      overwrite: this.overwrite,
      validateData: true
    };

    this.importService.importData(this.selectedEntityType, this.selectedFile, options).subscribe({
      next: (result) => {
        this.isUploading = false;
        if (result.success) {
          this.importResults = result;
          this.importSummary = {
            total: result.totalRecords,
            imported: result.successfulRecords,
            skipped: result.failedRecords,
            errors: result.errors.length
          };
          this.successMessage = result.message;
          this.showResults = true;
          
          // Reset form
          this.selectedFile = null;
          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
          
          // Load import history
          this.loadImportHistory();
        } else {
          this.errorMessage = result.message || 'Import failed';
        }
      },
      error: (error) => {
        this.isUploading = false;
        console.error('Import error:', error);
        this.errorMessage = error.message || 'Import failed';
      }
    });
  }

  // Entity type change
  onEntityTypeChange(): void {
    this.loadTemplate();
    this.showResults = false;
    this.showTemplate = false;
    this.showInstructions = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Toggle template view
  toggleTemplate(): void {
    this.showTemplate = !this.showTemplate;
  }

  // Toggle instructions
  toggleInstructions(): void {
    this.showInstructions = !this.showInstructions;
  }

  // Clear results
  clearResults(): void {
    this.showResults = false;
    this.importResults = null;
    this.importSummary = null;
  }

  // Load import history
  loadImportHistory(): void {
    this.importService.getImportHistory({ entityType: this.selectedEntityType }).subscribe({
      next: (response) => {
        this.importHistory = response.data;
      },
      error: (error) => {
        console.error('Error loading import history:', error);
      }
    });
  }

  // Get entity type display name
  getEntityTypeDisplayName(): string {
    return this.importService.getEntityTypeDisplayName(this.selectedEntityType);
  }

  // Get entity type icon
  getEntityTypeIcon(): string {
    const entity = this.entityTypes.find(e => e.value === this.selectedEntityType);
    return entity ? entity.icon : 'fas fa-file-excel';
  }

  // Format file size
  formatFileSize(bytes: number): string {
    return this.importService.formatFileSize(bytes);
  }

  // Get error count
  getErrorCount(): number {
    return this.importResults?.errors.length || 0;
  }

  // Get success rate
  getSuccessRate(): number {
    if (!this.importSummary) return 0;
    return Math.round((this.importSummary.imported / this.importSummary.total) * 100);
  }

  // Get status color
  getStatusColor(): string {
    const successRate = this.getSuccessRate();
    if (successRate >= 90) return 'success';
    if (successRate >= 70) return 'warning';
    return 'danger';
  }

  // Drag and drop handlers
  isDragover = false;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragover = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragover = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragover = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      const validation = this.importService.validateFile(file);
      
      if (!validation.valid) {
        this.errorMessage = validation.errors.join(', ');
        return;
      }

      this.selectedFile = file;
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  // Remove selected file
  removeFile(): void {
    this.selectedFile = null;
    this.errorMessage = '';
    this.successMessage = '';
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Format date for display
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
