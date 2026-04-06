import { Component, OnInit } from '@angular/core';
import { JobsService, Job, JobStats, JobFilters } from '../../services/jobs.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  jobStats: JobStats = {
    totalJobs: 0,
    activeJobs: 0,
    peoplePlaced: 0,
    companies: 0,
    successRate: 0
  };

  // Filter properties
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedType: string = '';
  selectedLocation: string = '';

  // Categories and filters
  categories: string[] = [];
  jobTypes: string[] = [];
  locations: string[] = [];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  pagination: any = {};

  // Loading and error states
  loading: boolean = false;
  error: string = '';

  constructor(private jobsService: JobsService) { }

  ngOnInit(): void {
    // Initialize filter options
    this.categories = this.jobsService.getCategories();
    this.jobTypes = this.jobsService.getJobTypes();
    this.locations = this.jobsService.getLocations();
    
    // Load data
    this.loadJobs();
    this.loadJobStats();
  }

  loadJobs(): void {
    this.loading = true;
    this.error = '';

    const filters: JobFilters = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      category: this.selectedCategory === 'All' ? undefined : this.selectedCategory,
      type: this.selectedType === 'All' ? undefined : this.selectedType,
      location: this.selectedLocation === 'All' ? undefined : this.selectedLocation,
      search: this.searchTerm || undefined
    };

    this.jobsService.getJobs(filters).subscribe({
      next: (response) => {
        this.jobs = response.data || [];
        this.pagination = response.pagination || {};
        this.loading = false;
        
        // Update filtered jobs for display
    this.filteredJobs = [...this.jobs];
    this.calculatePagination();
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.error = 'Failed to load jobs. Please try again later.';
        this.loading = false;
        this.jobs = [];
        this.filteredJobs = [];
      }
    });
  }

  loadJobStats(): void {
    this.jobsService.getJobStats().subscribe({
      next: (stats) => {
        this.jobStats = stats;
      },
      error: (error) => {
        console.error('Error loading job stats:', error);
        // Use default stats if API fails
    this.jobStats = {
      totalJobs: 1250,
      activeJobs: 89,
      peoplePlaced: 3420,
      companies: 156,
      successRate: 94.5
    };
      }
    });
  }

  applyFilters(): void {
    // Reset to first page when applying filters
    this.currentPage = 1;
    this.loadJobs();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedType = '';
    this.selectedLocation = '';
    this.applyFilters();
  }

  calculatePagination(): void {
    // Use API pagination if available, otherwise calculate from filtered jobs
    if (this.pagination && this.pagination.totalPages) {
      this.totalPages = this.pagination.totalPages;
    } else {
    this.totalPages = Math.ceil(this.filteredJobs.length / this.itemsPerPage);
    }
  }

  getPaginatedJobs(): Job[] {
    // If we have API pagination, return the current page data
    if (this.pagination && this.pagination.data) {
      return this.jobs;
    }
    
    // Otherwise, use client-side pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredJobs.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadJobs(); // Reload data for new page
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  applyForJob(jobId: string): void {
    console.log(`Applying for job: ${jobId}`);
    
    this.jobsService.applyForJob(jobId).subscribe({
      next: (response) => {
        console.log('Application submitted successfully:', response);
        // You can show a success message or navigate to application form
        alert('Application submitted successfully!');
      },
      error: (error) => {
        console.error('Error applying for job:', error);
        alert('Failed to submit application. Please try again.');
      }
    });
  }

  saveJob(jobId: string): void {
    // In real app, this would save job to user's saved jobs
    console.log(`Saving job: ${jobId}`);
  }

  shareJob(jobId: string): void {
    // In real app, this would open share dialog
    console.log(`Sharing job: ${jobId}`);
  }
}

