import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TrainersService, CreateTrainerRequest } from '../../services/trainers.service';
import { UploadService } from '../../services/upload.service';
import {
  InstitutionDashboardService,
  InstitutionStudent,
  InstitutionAnalytics,
  InstitutionRevenue,
  InstitutionCourse,
  CreateCourseRequest,
  InstitutionBatch,
  CreateBatchRequest,
  UpdateCourseRequest
} from '../../services/institution-dashboard.service';

@Component({
  selector: 'app-institution-dashboard',
  templateUrl: './institution-dashboard.component.html',
  styleUrls: ['./institution-dashboard.component.css']
})
export class InstitutionDashboardComponent implements OnInit {
  
  // Dashboard state
  activeSection: any = 'overview';
  sidebarCollapsed = false;
  
  // Trainer form state
  showTrainerForm = false;
  trainerForm!: FormGroup;
  isSubmitting = false;
  formError = '';
  formSuccess = '';
  
  // Student Management state
  students: InstitutionStudent[] = [];
  filteredStudents: InstitutionStudent[] = [];
  isLoadingStudents = false;
  studentSearchTerm = '';
  studentStatusFilter = 'all';
  studentSortBy = 'name';
  studentSortOrder: 'asc' | 'desc' = 'asc';
  selectedStudent: InstitutionStudent | null = null;
  showStudentDetails = false;
  
  // Computed properties for student stats
  get totalStudentsCount(): number {
    return this.students.length;
  }
  
  get activeStudentsCount(): number {
    return this.students.filter(s => s.status === 'active').length;
  }
  
  get graduatedStudentsCount(): number {
    return this.students.filter(s => s.status === 'graduated').length;
  }
  
  get filteredStudentsCount(): number {
    return this.filteredStudents.length;
  }

  // Course Management state
  institutionCourses: InstitutionCourse[] = [];
  isLoadingCourses = false;
  coursesError = '';
  deletingCourseId: string | null = null;
  courseStatusOptions: Array<{ label: string; value: InstitutionCourse['status'] }> = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' }
  ];
  showCourseForm = false;
  courseForm!: FormGroup;
  isSubmittingCourse = false;
  isEditingCourse = false;
  editingCourseId: string | null = null;
  courseFormError = '';
  courseFormSuccess = '';
  showCourseDetails = false;
  selectedCourse: InstitutionCourse | null = null;
  isLoadingCourseDetails = false;
  courseDetailsError = '';
  
  // Batch Management state
  upcomingBatches: InstitutionBatch[] = [];
  showBatchForm = false;
  batchForm!: FormGroup;
  isSubmittingBatch = false;
  batchFormError = '';
  batchFormSuccess = '';
  isLoadingBatches = false;
  isEditingBatch = false;
  editingBatchId: string | null = null;
  
  // Helper method to get current year
  getCurrentYear(): number {
    return new Date().getFullYear();
  }
  
  // Institution stats
  institutionStats = {
    totalStudents: 1247,
    activeCourses: 45,
    totalTrainers: 23,
    rating: 4.7,
    revenue: 125000,
    upcomingBatches: 18,
    completionRate: 89
  };
  
  // Recent activities
  recentActivities = [
    {
      type: 'enrollment',
      title: 'New Batch Started - Full Stack Development',
      time: '2 hours ago',
      students: 25,
      icon: 'fas fa-user-graduate'
    },
    {
      type: 'course',
      title: 'Course Published - Data Science Advanced',
      time: '1 day ago',
      students: 0,
      icon: 'fas fa-book'
    },
    {
      type: 'trainer',
      title: 'New Trainer Joined',
      time: '2 days ago',
      students: 0,
      icon: 'fas fa-chalkboard-teacher'
    },
    {
      type: 'achievement',
      title: 'Batch Completed Successfully',
      time: '3 days ago',
      students: 30,
      icon: 'fas fa-trophy'
    },
    {
      type: 'review',
      title: 'Received 5-star Institution Review',
      time: '4 days ago',
      students: 0,
      icon: 'fas fa-star'
    }
  ];
  
  
  // Course performance data
  coursePerformance = [
    {
      name: 'Full Stack Development',
      enrolled: 156,
      completed: 142,
      rating: 4.8,
      revenue: 78000,
      duration: '3 months',
      status: 'active'
    },
    {
      name: 'Data Science Bootcamp',
      enrolled: 98,
      completed: 89,
      rating: 4.7,
      revenue: 49000,
      duration: '2 months',
      status: 'active'
    },
    {
      name: 'Cloud Computing',
      enrolled: 87,
      completed: 78,
      rating: 4.6,
      revenue: 43500,
      duration: '3 months',
      status: 'active'
    },
    {
      name: 'DevOps Engineering',
      enrolled: 76,
      completed: 68,
      rating: 4.9,
      revenue: 38000,
      duration: '2 months',
      status: 'completed'
    },
    {
      name: 'Machine Learning',
      enrolled: 65,
      completed: 58,
      rating: 4.5,
      revenue: 32500,
      duration: '4 months',
      status: 'active'
    }
  ];
  
  // Trainer management data
  trainerManagement: any[] = [];
  isLoadingTrainers = false;
  isEditingTrainer = false;
  editingTrainerId: string | null = null;
  showTrainerProfile = false;
  selectedTrainer: any = null;
  isLoadingTrainerDetails = false;
  trainerDetailsError = '';
  expandedModules: { [key: number]: boolean } = {};
  demoVideoFile: File | null = null;
  avatarFile: File | null = null;
  avatarPreview: string | null = null;
  
  // Student analytics
  studentAnalytics = [
    {
      category: 'Placement Success',
      percentage: 92,
      count: 1147,
      trend: 'up'
    },
    {
      category: 'Course Completion',
      percentage: 89,
      count: 1110,
      trend: 'up'
    },
    {
      category: 'Student Satisfaction',
      percentage: 94,
      count: 1172,
      trend: 'up'
    },
    {
      category: 'Industry Partnerships',
      percentage: 78,
      count: 35,
      trend: 'up'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private trainersService: TrainersService,
    private institutionDashboardService: InstitutionDashboardService,
    private uploadService: UploadService
  ) {
    this.initializeTrainerForm();
    this.initializeCourseForm();
    this.initializeBatchForm();
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadBatches();
    if (this.activeSection === 'analytics') {
      this.loadAnalytics();
    }
    if (this.activeSection === 'revenue') {
      this.loadRevenue();
    }
    if (this.activeSection === 'settings') {
      this.loadSettings();
    }
    if (this.activeSection === 'courses') {
      this.loadCourses();
    }
    if (this.activeSection === 'trainers') {
      this.loadTrainers();
    }
    if (this.activeSection === 'batches') {
      this.loadBatches();
    }
  }

  // Load courses for institution
  loadCourses(): void {
    this.isLoadingCourses = true;
    this.institutionDashboardService.getCourses().subscribe({
      next: (courses) => {
        this.institutionCourses = (courses || []).map((course: any) => ({
          ...course,
          id: course?.id || course?._id || ''
        })) as InstitutionCourse[];
        this.updateCoursePerformance();
        this.isLoadingCourses = false;
      },
      error: (error) => {
        this.isLoadingCourses = false;
        console.error('Error loading institution courses:', error);
      }
    });
  }

  private updateCoursePerformance(): void {
    if (!this.institutionCourses || this.institutionCourses.length === 0) {
      this.coursePerformance = [];
      return;
    }

    this.coursePerformance = this.institutionCourses.map(course => ({
      name: course.title,
      enrolled: course.students || 0,
      completed: course.completedStudents || 0,
      rating: course.rating || 0,
      revenue: course.revenue || 0,
      duration: `${course.duration} hours`,
      status: course.status === 'published'
        ? 'active'
        : course.status === 'archived'
          ? 'completed'
          : 'draft'
    }));
  }

  // Load trainers for institution
  loadTrainers(): void {
    this.isLoadingTrainers = true;
    this.trainersService.getTrainers().subscribe({
      next: (response) => {
        this.isLoadingTrainers = false;
        const trainersArray = Array.isArray(response)
          ? response
          : (response?.trainers || []);

        this.trainerManagement = trainersArray.map((trainer: any) => {
          const avatarUrl = trainer.avatar || trainer.profilePicture || trainer.user?.avatar || null;
          return {
            id: trainer.id,
            institutionId: trainer.institutionId,
            name: trainer.name || 'Unknown',
            specialization: trainer.specialization || 'Not specified',
            students: trainer.students || trainer.stats?.totalStudents || 0,
            rating: typeof trainer.rating === 'number' ? trainer.rating : (trainer.rating?.overall || 0),
            courses: trainer.courses || trainer.stats?.totalCourses || 0,
            status: trainer.status || (trainer.isActive ? 'active' : 'inactive'),
            avatar: avatarUrl, // Keep original value for getTrainerAvatarUrl to process
            email: trainer.email || trainer.user?.email || null,
            phone: trainer.phone || trainer.user?.phone || null,
            title: trainer.title || trainer.currentPosition?.title || '',
            location: trainer.location || trainer.user?.location || '',
            experienceYears: trainer.experienceYears || trainer.experience?.years || 0,
            isActive: trainer.isActive ?? true
          };
        });
      },
      error: (error) => {
        this.isLoadingTrainers = false;
        console.error('Error loading trainers:', error);
        // Keep empty array on error, or show error message
        this.trainerManagement = [];
      }
    });
  }

  // Load batches for institution
  loadBatches(): void {
    this.isLoadingBatches = true;
    this.institutionDashboardService.getBatches().subscribe({
      next: (batches) => {
        this.isLoadingBatches = false;
        this.upcomingBatches = (batches || []).map((batch: any) => ({
          ...batch,
          id: batch?.id || batch?._id || ''
        }));
      },
      error: (error) => {
        this.isLoadingBatches = false;
        console.error('Error loading batches:', error);
        this.upcomingBatches = [];
      }
    });
  }

  // Batch form methods
  openBatchForm(): void {
    if (!this.batchForm) {
      this.initializeBatchForm();
    }
    this.showBatchForm = true;
    this.batchFormError = '';
    this.batchFormSuccess = '';
    if (!this.isEditingBatch) {
      this.resetBatchForm();
    }
    // Load courses and trainers for dropdowns
    if (this.institutionCourses.length === 0) {
      this.loadCourses();
    }
    if (this.trainerManagement.length === 0) {
      this.loadTrainers();
    }
  }

  closeBatchForm(): void {
    this.showBatchForm = false;
    this.isEditingBatch = false;
    this.editingBatchId = null;
    if (this.batchForm) {
      this.resetBatchForm();
    }
    this.batchFormError = '';
    this.batchFormSuccess = '';
  }

  onCourseSelect(): void {
    const courseId = this.batchForm.get('courseId')?.value;
    const selectedCourse = this.institutionCourses.find(c => this.getCourseId(c) === courseId);
    if (selectedCourse) {
      this.batchForm.patchValue({
        courseName: selectedCourse.title
      });
    }
  }

  onTrainerSelect(): void {
    const trainerId = this.batchForm.get('trainerId')?.value;
    const selectedTrainer = this.trainerManagement.find(t => t.id === trainerId);
    if (selectedTrainer) {
      this.batchForm.patchValue({
        trainerName: selectedTrainer.name
      });
    }
  }

  submitBatchForm(): void {
    if (this.batchForm.invalid) {
      this.batchForm.markAllAsTouched();
      this.batchFormError = 'Please fill in all required fields correctly.';
      return;
    }

    this.isSubmittingBatch = true;
    this.batchFormError = '';
    this.batchFormSuccess = '';

    const formValue = this.batchForm.value;

    // Validate dates
    const startDate = new Date(formValue.startDate);
    const endDate = new Date(formValue.endDate);
    
    if (endDate <= startDate) {
      this.batchFormError = 'End date must be after start date.';
      this.isSubmittingBatch = false;
      return;
    }

    const batchData: CreateBatchRequest = {
      courseId: formValue.courseId,
      courseName: formValue.courseName,
      trainerId: formValue.trainerId,
      trainerName: formValue.trainerName,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      duration: formValue.duration,
      maxStudents: Number(formValue.maxStudents),
      schedule: formValue.schedule || '',
      description: formValue.description || '',
      meetingLink: formValue.meetingLink || ''
    };

    if (this.isEditingBatch && this.editingBatchId) {
      this.institutionDashboardService.updateBatch(this.editingBatchId, batchData).subscribe({
        next: () => {
          this.isSubmittingBatch = false;
          this.batchFormSuccess = 'Batch updated successfully!';
          this.batchFormError = '';
          this.loadBatches();
          setTimeout(() => {
            this.closeBatchForm();
            this.batchFormSuccess = '';
          }, 1500);
        },
        error: (error) => {
          this.isSubmittingBatch = false;
          this.batchFormError = error.error?.message || 'Failed to update batch. Please try again.';
          console.error('Error updating batch:', error);
        }
      });
      return;
    }

    this.institutionDashboardService.createBatch(batchData).subscribe({
      next: () => {
        this.isSubmittingBatch = false;
        this.batchFormSuccess = 'Batch created successfully!';
        this.batchFormError = '';
        this.resetBatchForm();
        this.loadBatches();
        setTimeout(() => {
          this.closeBatchForm();
          this.batchFormSuccess = '';
        }, 1500);
      },
      error: (error) => {
        this.isSubmittingBatch = false;
        this.batchFormError = error.error?.message || 'Failed to create batch. Please try again.';
        console.error('Error creating batch:', error);
      }
    });
  }
  
  // Load students data
  loadStudents(): void {
    this.isLoadingStudents = true;
    this.institutionDashboardService.getStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.filteredStudents = [...this.students];
        this.applyStudentFilters();
        this.isLoadingStudents = false;
      },
      error: (error) => {
        console.error('Error loading students:', error);
        // Use mock data if API fails
        this.students = [
          {
            id: 's1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            course: 'Full Stack Development',
            status: 'active',
            enrollmentDate: '2025-01-15',
            progress: 75,
            lastActivity: '2025-01-20',
            grade: 'A'
          },
          {
            id: 's2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            course: 'Data Science Bootcamp',
            status: 'active',
            enrollmentDate: '2025-01-20',
            progress: 45,
            lastActivity: '2025-01-22',
            grade: 'B+'
          },
          {
            id: 's3',
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            course: 'Cloud Computing',
            status: 'active',
            enrollmentDate: '2024-12-01',
            progress: 90,
            lastActivity: '2025-01-23',
            grade: 'A+'
          },
          {
            id: 's4',
            name: 'Emily Davis',
            email: 'emily.davis@example.com',
            course: 'Full Stack Development',
            status: 'graduated',
            enrollmentDate: '2024-09-01',
            progress: 100,
            lastActivity: '2024-12-15',
            grade: 'A'
          },
          {
            id: 's5',
            name: 'David Wilson',
            email: 'david.wilson@example.com',
            course: 'DevOps Engineering',
            status: 'active',
            enrollmentDate: '2025-01-10',
            progress: 30,
            lastActivity: '2025-01-21',
            grade: 'B'
          },
          {
            id: 's6',
            name: 'Sarah Brown',
            email: 'sarah.brown@example.com',
            course: 'Machine Learning',
            status: 'suspended',
            enrollmentDate: '2024-11-15',
            progress: 55,
            lastActivity: '2025-01-05',
            grade: 'C+'
          }
        ];
        this.filteredStudents = [...this.students];
        this.applyStudentFilters();
        this.isLoadingStudents = false;
      }
    });
  }
  
  // Filter students
  applyStudentFilters(): void {
    let filtered = [...this.students];
    
    // Search filter
    if (this.studentSearchTerm.trim()) {
      const searchLower = this.studentSearchTerm.toLowerCase();
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower) ||
        student.course.toLowerCase().includes(searchLower)
      );
    }
    
    // Status filter
    if (this.studentStatusFilter !== 'all') {
      filtered = filtered.filter(student => student.status === this.studentStatusFilter);
    }
    
    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (this.studentSortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'course':
          comparison = a.course.localeCompare(b.course);
          break;
        case 'enrollmentDate':
          comparison = new Date(a.enrollmentDate).getTime() - new Date(b.enrollmentDate).getTime();
          break;
        case 'progress':
          comparison = a.progress - b.progress;
          break;
        default:
          comparison = 0;
      }
      return this.studentSortOrder === 'asc' ? comparison : -comparison;
    });
    
    this.filteredStudents = filtered;
  }
  
  // Student search
  onStudentSearch(): void {
    this.applyStudentFilters();
  }
  
  // Status filter change
  onStatusFilterChange(): void {
    this.applyStudentFilters();
  }
  
  // Sort change
  onSortChange(): void {
    this.applyStudentFilters();
  }
  
  // Toggle sort order
  toggleSortOrder(): void {
    this.studentSortOrder = this.studentSortOrder === 'asc' ? 'desc' : 'asc';
    this.applyStudentFilters();
  }
  
  // View student details
  viewStudentDetails(student: InstitutionStudent): void {
    this.selectedStudent = student;
    this.showStudentDetails = true;
  }
  
  // Close student details
  closeStudentDetails(): void {
    this.selectedStudent = null;
    this.showStudentDetails = false;
  }
  
  // Get status badge class
  getStudentStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'graduated': return 'status-completed';
      case 'suspended': return 'status-on-leave';
      case 'dropped': return 'status-cancelled';
      default: return '';
    }
  }
  
  // Get progress color
  getProgressColor(progress: number): string {
    if (progress >= 80) return '#22c55e';
    if (progress >= 50) return '#f59e0b';
    return '#ef4444';
  }
  
  // Format date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  
  // Export student data
  exportStudentData(): void {
    // Implementation for exporting student data
    console.log('Exporting student data...', this.filteredStudents);
  }
  
  // Helper method to get student initial
  getStudentInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }
  
  // Analytics state
  analytics: InstitutionAnalytics | null = null;
  isLoadingAnalytics = false;
  selectedTimeRange = '6months'; // '3months', '6months', '1year', 'all'
  
  // Revenue state
  revenue: InstitutionRevenue | null = null;
  isLoadingRevenue = false;
  selectedRevenuePeriod = 'monthly'; // 'monthly', 'quarterly', 'yearly'
  monthlyRevenueData: Array<{ month: string; revenue: number }> = [];
  
  // Settings state
  settings: any = {
    profile: {
      name: 'TechWindows Institute',
      shortName: 'TechWindows',
      description: 'Premier Technology Education Institution providing world-class training programs.',
      logo: '',
      type: 'Training Center',
      category: 'Technology',
      founded: 2020
    },
    contact: {
      email: 'contact@techwindows.com',
      phone: '+1 234 567 8900',
      website: 'www.techwindows.com'
    },
    address: {
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'California',
      country: 'United States',
      zipCode: '94102'
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    },
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false,
      courseUpdates: true,
      studentEnrollments: true,
      paymentNotifications: true
    },
    security: {
      twoFactorEnabled: false,
      passwordChangeRequired: false
    },
    preferences: {
      timezone: 'UTC-8',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD'
    }
  };
  activeSettingsTab = 'profile';
  isSavingSettings = false;
  settingsSuccessMessage = '';
  settingsErrorMessage = '';
  
  // Load analytics data
  loadAnalytics(): void {
    this.isLoadingAnalytics = true;
    this.institutionDashboardService.getAnalytics().subscribe({
      next: (data) => {
        this.analytics = data;
        this.isLoadingAnalytics = false;
      },
      error: (error) => {
        console.error('Error loading analytics:', error);
        // Use mock data if API fails
        this.analytics = {
          studentEngagement: {
            totalStudents: 450,
            activeStudents: 380,
            completionRate: 85,
            averageProgress: 78,
            engagementChart: [
              { month: 'Jan', students: 120, completions: 15 },
              { month: 'Feb', students: 135, completions: 18 },
              { month: 'Mar', students: 150, completions: 22 },
              { month: 'Apr', students: 165, completions: 25 },
              { month: 'May', students: 180, completions: 28 },
              { month: 'Jun', students: 200, completions: 32 }
            ]
          },
          coursePerformance: {
            totalCourses: 25,
            activeCourses: 18,
            averageRating: 4.6,
            totalEnrollments: 1200,
            performanceChart: [
              { course: 'Full Stack Development', enrollments: 300, rating: 4.7 },
              { course: 'Data Science Bootcamp', enrollments: 250, rating: 4.5 },
              { course: 'Cloud Computing', enrollments: 200, rating: 4.6 },
              { course: 'DevOps Engineering', enrollments: 180, rating: 4.4 },
              { course: 'Machine Learning', enrollments: 150, rating: 4.8 },
              { course: 'Mobile Development', enrollments: 120, rating: 4.3 }
            ]
          },
          revenueAnalytics: {
            totalRevenue: 125000,
            monthlyRevenue: 15000,
            averageRevenuePerStudent: 278,
            revenueChart: [
              { month: 'Jan', revenue: 12000 },
              { month: 'Feb', revenue: 13500 },
              { month: 'Mar', revenue: 14500 },
              { month: 'Apr', revenue: 15000 },
              { month: 'May', revenue: 16000 },
              { month: 'Jun', revenue: 17000 }
            ]
          },
          demographics: {
            ageGroups: [
              { age: '18-25', count: 200, percentage: 44 },
              { age: '26-35', count: 150, percentage: 33 },
              { age: '36-45', count: 80, percentage: 18 },
              { age: '46+', count: 20, percentage: 5 }
            ],
            locations: [
              { location: 'Hyderabad', count: 180, percentage: 40 },
              { location: 'Bangalore', count: 120, percentage: 27 },
              { location: 'Mumbai', count: 90, percentage: 20 },
              { location: 'Delhi', count: 60, percentage: 13 }
            ],
            educationLevels: [
              { level: 'High School', count: 150, percentage: 33 },
              { level: 'Bachelor', count: 200, percentage: 44 },
              { level: 'Master', count: 80, percentage: 18 },
              { level: 'PhD', count: 20, percentage: 5 }
            ]
          }
        };
        this.isLoadingAnalytics = false;
      }
    });
  }
  
  // Get max value from chart data
  getMaxChartValue(data: any[], property: string): number {
    return Math.max(...data.map(item => item[property]), 1);
  }
  
  // Get chart bar width percentage
  getChartBarWidth(value: number, maxValue: number): number {
    return (value / maxValue) * 100;
  }
  
  // Get trend indicator
  getTrend(current: number, previous: number): { value: number; isPositive: boolean } {
    if (!previous) return { value: 0, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return { value: Math.abs(change), isPositive: change >= 0 };
  }
  
  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  // Change time range
  changeTimeRange(range: string): void {
    this.selectedTimeRange = range;
    this.loadAnalytics(); // Reload with new range
  }
  
  // Load revenue data
  loadRevenue(): void {
    this.isLoadingRevenue = true;
    this.institutionDashboardService.getRevenue().subscribe({
      next: (data) => {
        this.revenue = data;
        // Generate monthly revenue chart data
        this.generateMonthlyRevenueData();
        this.isLoadingRevenue = false;
      },
      error: (error) => {
        console.error('Error loading revenue:', error);
        // Use mock data if API fails
        this.revenue = {
          currentMonth: 15000,
          lastMonth: 12000,
          total: 125000,
          breakdown: [
            { course: 'Full Stack Development', amount: 45000 },
            { course: 'Data Science Bootcamp', amount: 35000 },
            { course: 'Cloud Computing', amount: 25000 },
            { course: 'DevOps Engineering', amount: 20000 }
          ],
          growthRate: 25,
          projections: {
            nextMonth: 18000,
            nextQuarter: 55000
          }
        };
        this.generateMonthlyRevenueData();
        this.isLoadingRevenue = false;
      }
    });
  }
  
  // Generate monthly revenue chart data
  generateMonthlyRevenueData(): void {
    if (!this.revenue) return;
    
    // Generate last 6 months of revenue data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const baseRevenue = this.revenue.total / 6;
    this.monthlyRevenueData = months.map((month, index) => ({
      month,
      revenue: Math.floor(baseRevenue * (0.8 + (index * 0.1)))
    }));
  }
  
  // Calculate percentage change
  getPercentageChange(current: number, previous: number): number {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  }
  
  // Get total breakdown amount
  getTotalBreakdown(): number {
    if (!this.revenue) return 0;
    return this.revenue.breakdown.reduce((sum, item) => sum + item.amount, 0);
  }
  
  // Get breakdown percentage
  getBreakdownPercentage(amount: number): number {
    const total = this.getTotalBreakdown();
    if (!total) return 0;
    return (amount / total) * 100;
  }
  
  // Get course color for breakdown
  getCourseColor(index: number): string {
    const colors = [
      'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      'linear-gradient(135deg, #673ab7 0%, #512da8 100%)',
      'linear-gradient(135deg, #3f51b5 0%, #303f9f 100%)',
      'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
      'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
      'linear-gradient(135deg, #009688 0%, #00796B 100%)'
    ];
    return colors[index % colors.length];
  }
  
  // Get average revenue per student
  getAverageRevenuePerStudent(): number {
    if (!this.revenue || this.activeStudentsCount === 0) return 0;
    return this.revenue.currentMonth / this.activeStudentsCount;
  }
  
  // Get demographic color based on percentage
  getDemographicColor(percentage: number): string {
    if (percentage >= 40) return 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)';
    if (percentage >= 25) return 'linear-gradient(135deg, #673ab7 0%, #512da8 100%)';
    if (percentage >= 15) return 'linear-gradient(135deg, #3f51b5 0%, #303f9f 100%)';
    return 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)';
  }
  
  // Settings methods
  setActiveSettingsTab(tab: string): void {
    this.activeSettingsTab = tab;
  }
  
  saveSettings(): void {
    this.isSavingSettings = true;
    this.settingsErrorMessage = '';
    this.settingsSuccessMessage = '';
    
    // Validate required fields
    if (!this.settings.profile.name || !this.settings.profile.name.trim() || this.settings.profile.name.trim().length < 2) {
      this.isSavingSettings = false;
      this.settingsErrorMessage = 'Institution name is required and must be at least 2 characters.';
      return;
    }
    
    if (!this.settings.contact.phone || !this.settings.contact.phone.trim()) {
      this.isSavingSettings = false;
      this.settingsErrorMessage = 'Phone number is required.';
      return;
    }
    
    // Validate email if provided
    if (this.settings.contact.email && this.settings.contact.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.settings.contact.email.trim())) {
        this.isSavingSettings = false;
        this.settingsErrorMessage = 'Please enter a valid email address.';
        return;
      }
    }
    
    // Prepare settings payload matching backend structure
    const settingsPayload: any = {
      profile: {
        name: (this.settings.profile.name || '').trim(),
        email: (this.settings.profile.email || this.settings.contact.email || '').trim(),
        bio: (this.settings.profile.description || '').trim(),
        avatar: (this.settings.profile.logo || '').trim()
      },
      contact: {
        email: (this.settings.contact.email || '').trim(),
        phone: (this.settings.contact.phone || '').trim(),
        website: (this.settings.contact.website || '').trim()
      },
      notifications: {
        emailNotifications: this.settings.notifications?.email !== undefined ? this.settings.notifications.email : (this.settings.notifications?.emailNotifications !== undefined ? this.settings.notifications.emailNotifications : true),
        smsNotifications: this.settings.notifications?.sms !== undefined ? this.settings.notifications.sms : (this.settings.notifications?.smsNotifications !== undefined ? this.settings.notifications.smsNotifications : false),
        courseUpdates: this.settings.notifications?.courseUpdates !== undefined ? this.settings.notifications.courseUpdates : true,
        studentEnrollments: this.settings.notifications?.studentEnrollments !== undefined ? this.settings.notifications.studentEnrollments : true
      },
      security: this.settings.security || {},
      preferences: this.settings.preferences || {}
    };
    
    // Build address string from address object
    if (this.settings.address) {
      const addressParts = [];
      if (this.settings.address.street && this.settings.address.street.trim()) addressParts.push(this.settings.address.street.trim());
      if (this.settings.address.city && this.settings.address.city.trim()) addressParts.push(this.settings.address.city.trim());
      if (this.settings.address.state && this.settings.address.state.trim()) addressParts.push(this.settings.address.state.trim());
      if (this.settings.address.zipCode && this.settings.address.zipCode.trim()) addressParts.push(this.settings.address.zipCode.trim());
      if (this.settings.address.country && this.settings.address.country.trim()) addressParts.push(this.settings.address.country.trim());
      
      if (addressParts.length > 0) {
        settingsPayload.contact.address = addressParts.join(', ');
        // Also add as separate object for backend parsing
        settingsPayload.address = {
          street: (this.settings.address.street || '').trim(),
          city: (this.settings.address.city || '').trim(),
          state: (this.settings.address.state || '').trim(),
          zipCode: (this.settings.address.zipCode || '').trim(),
          country: (this.settings.address.country || '').trim()
        };
      }
    }
    
    console.log('Saving settings with payload:', JSON.stringify(settingsPayload, null, 2));
    
    this.institutionDashboardService.updateInstitutionSettings(settingsPayload).subscribe({
      next: (response) => {
        console.log('Settings saved successfully:', response);
        this.isSavingSettings = false;
        this.settingsSuccessMessage = 'Settings saved successfully!';
        // Reload settings to get updated data
        this.loadSettings();
        setTimeout(() => {
          this.settingsSuccessMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error saving settings:', error);
        this.isSavingSettings = false;
        const errorMessage = error?.error?.message || error?.message || 'Failed to save settings. Please try again.';
        this.settingsErrorMessage = errorMessage;
        console.error('Full error object:', JSON.stringify(error, null, 2));
      }
    });
  }
  
  // Load settings
  loadSettings(): void {
    this.institutionDashboardService.getInstitutionSettings().subscribe({
      next: (data) => {
        if (data) {
          // Merge loaded data with existing settings structure
          if (data.profile) {
            this.settings.profile = {
              ...this.settings.profile,
              name: data.profile.name || this.settings.profile.name,
              email: data.profile.email || this.settings.profile.email,
              description: data.profile.bio || data.profile.description || this.settings.profile.description,
              logo: data.profile.avatar || data.profile.logo || this.settings.profile.logo
            };
          }
          if (data.contact) {
            this.settings.contact = {
              ...this.settings.contact,
              email: data.contact.email || this.settings.contact.email,
              phone: data.contact.phone || this.settings.contact.phone,
              website: data.contact.website || this.settings.contact.website
            };
            // Parse address if it's a string
            if (data.contact.address && typeof data.contact.address === 'string' && data.contact.address.trim()) {
              const addressParts = data.contact.address.split(',').map((part: string) => part.trim());
              if (addressParts.length >= 2) {
                this.settings.address = {
                  ...this.settings.address,
                  street: addressParts[0] || this.settings.address.street,
                  city: addressParts[1] || this.settings.address.city,
                  state: addressParts[2] || this.settings.address.state,
                  zipCode: addressParts[3] || this.settings.address.zipCode,
                  country: addressParts[4] || this.settings.address.country
                };
              }
            }
          }
          if (data.notifications) {
            this.settings.notifications = { 
              ...this.settings.notifications, 
              email: data.notifications.emailNotifications !== undefined ? data.notifications.emailNotifications : this.settings.notifications.email,
              sms: data.notifications.smsNotifications !== undefined ? data.notifications.smsNotifications : this.settings.notifications.sms
            };
          }
          if (data.security) {
            this.settings.security = { ...this.settings.security, ...data.security };
          }
          if (data.preferences) {
            this.settings.preferences = { ...this.settings.preferences, ...data.preferences };
          }
        }
      },
      error: (error) => {
        console.error('Error loading settings:', error);
        // Keep default settings
      }
    });
  }
  
  // Handle logo upload
  onLogoUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // In a real application, upload to server
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.settings.profile.logo = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Get institution types
  getInstitutionTypes(): string[] {
    return ['University', 'College', 'Training Center', 'Online Platform', 'Corporate', 'Other'];
  }
  
  // Get categories
  getCategories(): string[] {
    return ['Technology', 'Business', 'Arts', 'Science', 'Medical', 'Engineering', 'Education', 'Other'];
  }
  
  // Get timezones
  getTimezones(): string[] {
    return ['UTC-12', 'UTC-11', 'UTC-10', 'UTC-9', 'UTC-8', 'UTC-7', 'UTC-6', 'UTC-5', 'UTC-4', 'UTC-3', 'UTC-2', 'UTC-1', 'UTC', 'UTC+1', 'UTC+2', 'UTC+3', 'UTC+4', 'UTC+5', 'UTC+6', 'UTC+7', 'UTC+8', 'UTC+9', 'UTC+10', 'UTC+11', 'UTC+12'];
  }
  
  // Get languages
  getLanguages(): Array<{ code: string; name: string }> {
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'hi', name: 'Hindi' },
      { code: 'zh', name: 'Chinese' }
    ];
  }
  
  // Get tab icon
  getTabIcon(tab: string): string {
    const icons: { [key: string]: string } = {
      'profile': 'fas fa-building',
      'contact': 'fas fa-address-book',
      'notifications': 'fas fa-bell',
      'security': 'fas fa-shield-alt',
      'preferences': 'fas fa-cog'
    };
    return icons[tab] || 'fas fa-cog';
  }
  
  // Get tab label
  getTabLabel(tab: string): string {
    const labels: { [key: string]: string } = {
      'profile': 'Profile',
      'contact': 'Contact',
      'notifications': 'Notifications',
      'security': 'Security',
      'preferences': 'Preferences'
    };
    return labels[tab] || tab;
  }

  // Course form controls & actions
  openCourseForm(): void {
    if (!this.courseForm) {
      this.initializeCourseForm();
    }

    if (!this.isEditingCourse) {
      this.resetCourseForm();
    }

    this.courseFormError = '';
    this.courseFormSuccess = '';
    this.showCourseForm = true;
  }

  closeCourseForm(): void {
    this.showCourseForm = false;
    this.isEditingCourse = false;
    this.editingCourseId = null;
    this.courseFormError = '';
    this.courseFormSuccess = '';
    this.resetCourseForm();
  }

  submitCourseForm(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      this.courseFormError = 'Please fill in all required fields correctly.';
      return;
    }

    this.isSubmittingCourse = true;
    this.courseFormError = '';
    this.courseFormSuccess = '';

    const payload = this.buildCoursePayload(this.courseForm.value);

    if (this.isEditingCourse && this.editingCourseId) {
      this.institutionDashboardService
        .updateCourse(this.editingCourseId, payload as UpdateCourseRequest)
        .subscribe({
          next: () => {
            this.isSubmittingCourse = false;
            this.courseFormSuccess = 'Course updated successfully!';
            this.loadCourses();
            setTimeout(() => {
              this.closeCourseForm();
              this.courseFormSuccess = '';
            }, 1500);
          },
          error: (error) => {
            this.isSubmittingCourse = false;
            this.courseFormError =
              error?.error?.message ||
              error?.error?.error ||
              'Failed to update course. Please try again.';
            console.error('Error updating course:', error);
          }
        });
      return;
    }

    this.institutionDashboardService.createCourse(payload).subscribe({
      next: () => {
        this.isSubmittingCourse = false;
        this.courseFormSuccess = 'Course created successfully!';
        this.loadCourses();
        setTimeout(() => {
          this.closeCourseForm();
          this.courseFormSuccess = '';
        }, 1500);
      },
      error: (error) => {
        this.isSubmittingCourse = false;
        this.courseFormError =
          error?.error?.message ||
          error?.error?.error ||
          'Failed to create course. Please try again.';
        console.error('Error creating course:', error);
      }
    });
  }

  startEditCourse(course: InstitutionCourse): void {
    this.isEditingCourse = true;
    this.editingCourseId = this.getCourseId(course);
    this.openCourseForm();
    this.setCourseFormValues(course);
  }

  viewCourseDetails(course: InstitutionCourse): void {
    this.showCourseDetails = true;
    this.courseDetailsError = '';
    this.selectedCourse = null;
    this.isLoadingCourseDetails = true;

    this.institutionDashboardService.getCourseDetails(this.getCourseId(course)).subscribe({
      next: (details) => {
        this.isLoadingCourseDetails = false;
        this.selectedCourse = details;
      },
      error: (error) => {
        this.isLoadingCourseDetails = false;
        this.courseDetailsError =
          error?.error?.message || 'Failed to load course details.';
        console.error('Error loading course details:', error);
      }
    });
  }

  closeCourseDetails(): void {
    this.showCourseDetails = false;
    this.selectedCourse = null;
    this.courseDetailsError = '';
    this.isLoadingCourseDetails = false;
  }

  private setCourseFormValues(course: InstitutionCourse): void {
    const prerequisites = course.prerequisites?.join(', ') || '';
    const learningOutcomes = course.learningOutcomes?.join('\n') || '';

    this.courseForm.patchValue({
      title: course.title || '',
      category: course.category || '',
      level: course.level || 'Beginner',
      price: course.price ?? 0,
      duration: course.duration ?? 1,
      description: course.description || '',
      prerequisites,
      learningOutcomes,
      status: course.status || 'draft'
    });
  }

  private buildCoursePayload(value: any): CreateCourseRequest {
    const prerequisites = typeof value.prerequisites === 'string'
      ? value.prerequisites
          .split(',')
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0)
      : [];

    const learningOutcomes = typeof value.learningOutcomes === 'string'
      ? value.learningOutcomes
          .split('\n')
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0)
      : [];

    return {
      title: (value.title || '').trim(),
      description: (value.description || '').trim(),
      price: Number(value.price),
      duration: Number(value.duration),
      level: value.level,
      category: (value.category || '').trim(),
      status: (value.status || 'draft') as InstitutionCourse['status'],
      prerequisites,
      learningOutcomes,
      curriculum: []
    };
  }

  // Initialize Course form
  initializeCourseForm(): void {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      category: ['', Validators.required],
      level: ['Beginner', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      duration: [1, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      prerequisites: [''],
      learningOutcomes: [''],
      status: ['draft', Validators.required]
    });

    this.resetCourseForm();
  }

  private resetCourseForm(): void {
    if (!this.courseForm) {
      return;
    }

    this.courseForm.reset({
      title: '',
      category: '',
      level: 'Beginner',
      price: 0,
      duration: 1,
      description: '',
      prerequisites: '',
      learningOutcomes: '',
      status: 'draft'
    });
  }
  
  initializeTrainerForm(): void {
    this.trainerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern(/^[+]?[1-9][\d]{9,14}$/)]],
      email: ['', [Validators.email]],
      specialization: ['', Validators.required],
      experienceYears: ['', [Validators.required, Validators.min(0)]],
      experienceDescription: ['', Validators.maxLength(1000)],
      hourlyRate: ['', [Validators.required, Validators.min(0)]],
      currency: ['USD', Validators.required],
      currentPositionTitle: ['', Validators.required],
      currentPositionCompany: ['', Validators.required],
      education: this.fb.array([]),
      certifications: this.fb.array([]),
      skills: this.fb.array([]),
      demoVideo: [''],
      objectives: [[]],
      syllabus: [[]],
      avatar: ['']
    });
  }

  initializeBatchForm(): void {
    this.batchForm = this.fb.group({
      courseId: ['', Validators.required],
      courseName: ['', Validators.required],
      trainerId: ['', Validators.required],
      trainerName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      duration: ['', Validators.required],
      maxStudents: [25, [Validators.required, Validators.min(1), Validators.max(100)]],
      schedule: [''],
      description: ['', Validators.maxLength(1000)],
      meetingLink: ['']
    });
    this.resetBatchForm();
  }

  private resetBatchForm(): void {
    if (!this.batchForm) {
      return;
    }
    this.batchForm.reset({
      courseId: '',
      courseName: '',
      trainerId: '',
      trainerName: '',
      startDate: '',
      endDate: '',
      duration: '',
      maxStudents: 25,
      schedule: '',
      description: '',
      meetingLink: ''
    });
  }
  
  // Get FormArrays
  get educationFormArray(): FormArray {
    return this.trainerForm.get('education') as FormArray;
  }
  
  get certificationsFormArray(): FormArray {
    return this.trainerForm.get('certifications') as FormArray;
  }
  
  get skillsFormArray(): FormArray {
    return this.trainerForm.get('skills') as FormArray;
  }
  
  // Add education entry
  addEducation(): void {
    const educationGroup = this.fb.group({
      degree: ['', Validators.required],
      institution: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(this.getCurrentYear())]],
      field: ['']
    });
    this.educationFormArray.push(educationGroup);
  }
  
  removeEducation(index: number): void {
    this.educationFormArray.removeAt(index);
  }
  
  // Add certification entry
  addCertification(): void {
    const certificationGroup = this.fb.group({
      name: ['', Validators.required],
      issuer: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(this.getCurrentYear())]]
    });
    this.certificationsFormArray.push(certificationGroup);
  }
  
  removeCertification(index: number): void {
    this.certificationsFormArray.removeAt(index);
  }
  
  // Add skill entry
  addSkill(): void {
    const skillGroup = this.fb.group({
      name: ['', Validators.required],
      level: ['Intermediate', Validators.required],
      yearsOfExperience: ['', [Validators.min(0)]]
    });
    this.skillsFormArray.push(skillGroup);
  }
  
  removeSkill(index: number): void {
    this.skillsFormArray.removeAt(index);
  }

  // Objectives management
  addObjective(): void {
    const objectives = this.trainerForm.get('objectives')?.value || [];
    if (objectives.length < 50) {
      objectives.push('');
      this.trainerForm.patchValue({ objectives });
    }
  }

  removeObjective(index: number): void {
    const objectives = this.trainerForm.get('objectives')?.value || [];
    if (index >= 0 && index < objectives.length) {
      objectives.splice(index, 1);
      this.trainerForm.patchValue({ objectives });
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  // Syllabus/Curriculum management
  addModule(): void {
    const syllabus = this.trainerForm.get('syllabus')?.value || [];
    if (syllabus.length < 50) {
      syllabus.push({
        moduleTitle: '',
        hours: 0,
        lessons: []
      });
      this.trainerForm.patchValue({ syllabus });
      this.expandedModules[syllabus.length - 1] = true;
    }
  }

  removeModule(moduleIndex: number): void {
    const syllabus = this.trainerForm.get('syllabus')?.value || [];
    if (moduleIndex >= 0 && moduleIndex < syllabus.length) {
      syllabus.splice(moduleIndex, 1);
      this.trainerForm.patchValue({ syllabus });
      delete this.expandedModules[moduleIndex];
      const newExpanded: { [key: number]: boolean } = {};
      Object.keys(this.expandedModules).forEach(key => {
        const idx = parseInt(key);
        if (idx < moduleIndex) {
          newExpanded[idx] = this.expandedModules[idx];
        } else if (idx > moduleIndex) {
          newExpanded[idx - 1] = this.expandedModules[idx];
        }
      });
      this.expandedModules = newExpanded;
    }
  }

  addLesson(moduleIndex: number): void {
    const syllabus = this.trainerForm.get('syllabus')?.value || [];
    if (moduleIndex >= 0 && moduleIndex < syllabus.length) {
      if (!syllabus[moduleIndex].lessons) {
        syllabus[moduleIndex].lessons = [];
      }
      if (syllabus[moduleIndex].lessons.length < 100) {
        syllabus[moduleIndex].lessons.push({ title: '' });
        this.trainerForm.patchValue({ syllabus });
      }
    }
  }

  removeLesson(moduleIndex: number, lessonIndex: number): void {
    const syllabus = this.trainerForm.get('syllabus')?.value || [];
    if (moduleIndex >= 0 && moduleIndex < syllabus.length) {
      const module = syllabus[moduleIndex];
      if (module.lessons && lessonIndex >= 0 && lessonIndex < module.lessons.length) {
        module.lessons.splice(lessonIndex, 1);
        this.trainerForm.patchValue({ syllabus });
      }
    }
  }

  toggleModule(moduleIndex: number): void {
    this.expandedModules[moduleIndex] = !this.expandedModules[moduleIndex];
  }

  isModuleExpanded(moduleIndex: number): boolean {
    return this.expandedModules[moduleIndex] === true;
  }

  getModuleLessonsCount(module: any): number {
    return Array.isArray(module?.lessons) ? module.lessons.length : 0;
  }

  getModuleTotalHours(module: any): number {
    return module?.hours || 0;
  }

  onDemoVideoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        this.formError = 'Demo video file size must be less than 50MB';
        return;
      }
      this.demoVideoFile = file;
      // In a real implementation, you would upload the file and get the URL
      // For now, we'll just store the file reference
    }
  }

  onAvatarSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.formError = 'Please upload a valid image file.';
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      this.formError = 'Profile picture must be smaller than 2MB.';
      return;
    }

    this.avatarFile = file;
    this.formError = '';

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
    };
    reader.onerror = () => {
      this.formError = 'Could not read the selected image. Please try again.';
    };
    reader.readAsDataURL(file);
  }

  updateObjective(index: number, event: any): void {
    const objectives = this.trainerForm.get('objectives')?.value || [];
    objectives[index] = event.target.value;
    this.trainerForm.patchValue({ objectives });
  }

  updateModuleTitle(moduleIndex: number, event: any): void {
    const syllabus = this.trainerForm.get('syllabus')?.value || [];
    if (moduleIndex >= 0 && moduleIndex < syllabus.length) {
      syllabus[moduleIndex].moduleTitle = event.target.value;
      this.trainerForm.patchValue({ syllabus });
    }
  }

  updateModuleHours(moduleIndex: number, event: any): void {
    const syllabus = this.trainerForm.get('syllabus')?.value || [];
    if (moduleIndex >= 0 && moduleIndex < syllabus.length) {
      syllabus[moduleIndex].hours = parseFloat(event.target.value) || 0;
      this.trainerForm.patchValue({ syllabus });
    }
  }

  updateLessonTitle(moduleIndex: number, lessonIndex: number, event: any): void {
    const syllabus = this.trainerForm.get('syllabus')?.value || [];
    if (moduleIndex >= 0 && moduleIndex < syllabus.length) {
      const module = syllabus[moduleIndex];
      if (module.lessons && lessonIndex >= 0 && lessonIndex < module.lessons.length) {
        module.lessons[lessonIndex].title = event.target.value;
        this.trainerForm.patchValue({ syllabus });
      }
    }
  }
  
  // Open trainer form
  openTrainerForm(): void {
    this.isEditingTrainer = false;
    this.editingTrainerId = null;
    this.showTrainerForm = true;
    this.formError = '';
    this.formSuccess = '';
    this.trainerForm.reset();
    this.initializeTrainerForm();
  }
  
  // Close trainer form
  closeTrainerForm(): void {
    this.showTrainerForm = false;
    this.isEditingTrainer = false;
    this.editingTrainerId = null;
    this.trainerForm.reset();
    this.initializeTrainerForm();
    this.formError = '';
    this.formSuccess = '';
    this.avatarFile = null;
    this.avatarPreview = null;
  }
  
  // Start editing trainer
  startEditTrainer(trainer: any): void {
    this.isEditingTrainer = true;
    this.editingTrainerId = trainer.id;
    this.showTrainerForm = true;
    this.formError = '';
    this.formSuccess = '';
    
    // Load full trainer details
    this.trainersService.getTrainer(trainer.id).subscribe({
      next: (trainerDetails) => {
        this.populateTrainerForm(trainerDetails);
      },
      error: (error) => {
        console.error('Error loading trainer details:', error);
        this.formError = 'Failed to load trainer details. Please try again.';
      }
    });
  }
  
  // Populate form with trainer data
  populateTrainerForm(trainer: any): void {
    this.trainerForm.patchValue({
      name: trainer.name || trainer.user?.firstName + ' ' + trainer.user?.lastName || '',
      phone: trainer.phone || '',
      email: trainer.email || trainer.user?.email || '',
      specialization: trainer.specialization || '',
      experienceYears: trainer.experienceYears || trainer.experience?.years || 0,
      experienceDescription: trainer.bio || trainer.experience?.description || '',
      hourlyRate: trainer.pricing?.hourlyRate || 0,
      currency: trainer.pricing?.currency || 'USD',
      currentPositionTitle: trainer.title || trainer.currentPosition?.title || '',
      currentPositionCompany: trainer.currentPosition?.company || ''
    });
    
    // Populate education
    this.educationFormArray.clear();
    if (trainer.education && trainer.education.length > 0) {
      trainer.education.forEach((edu: any) => {
        this.educationFormArray.push(this.fb.group({
          degree: [edu.degree || ''],
          institution: [edu.institution || ''],
          year: [edu.year || ''],
          field: [edu.field || '']
        }));
      });
    }
    
    // Populate certifications
    this.certificationsFormArray.clear();
    if (trainer.certifications && trainer.certifications.length > 0) {
      trainer.certifications.forEach((cert: any) => {
        this.certificationsFormArray.push(this.fb.group({
          name: [cert.name || ''],
          issuer: [cert.issuer || ''],
          year: [cert.year || '']
        }));
      });
    }
    
    // Populate skills
    this.skillsFormArray.clear();
    if (trainer.skills && trainer.skills.length > 0) {
      trainer.skills.forEach((skill: any) => {
        this.skillsFormArray.push(this.fb.group({
          name: [skill.name || ''],
          level: [skill.level || 'Intermediate'],
          yearsOfExperience: [skill.years || skill.yearsOfExperience || 0]
        }));
      });
    }

    // Populate demo video
    this.trainerForm.patchValue({
      demoVideo: trainer.demoVideo || ''
    });

    // Populate avatar
    this.trainerForm.patchValue({
      avatar: trainer.avatar || ''
    });
    if (trainer.avatar) {
      this.avatarPreview = trainer.avatar;
    }
    this.avatarFile = null;

    // Populate objectives
    const objectives = Array.isArray(trainer.objectives) ? [...trainer.objectives] : [];
    this.trainerForm.patchValue({
      objectives: objectives
    });

    // Populate syllabus
    let syllabusArray: Array<{moduleTitle: string, hours: number, lessons: Array<{title: string}>}> = [];
    if (trainer.syllabus) {
      if (Array.isArray(trainer.syllabus)) {
        syllabusArray = trainer.syllabus.map((module: any) => ({
          moduleTitle: module.moduleTitle || '',
          hours: module.hours || 0,
          lessons: Array.isArray(module.lessons) 
            ? module.lessons.map((lesson: any) => ({
                title: lesson.title || (typeof lesson === 'string' ? lesson : '')
              }))
            : []
        }));
      }
    }
    this.trainerForm.patchValue({
      syllabus: syllabusArray
    });

    // Expand all modules by default when editing
    syllabusArray.forEach((_, index) => {
      this.expandedModules[index] = true;
    });
  }
  
  // View trainer profile
  viewTrainerProfile(trainer: any): void {
    this.showTrainerProfile = true;
    this.trainerDetailsError = '';
    this.selectedTrainer = null;
    this.isLoadingTrainerDetails = true;
    
    this.trainersService.getTrainer(trainer.id).subscribe({
      next: (trainerDetails) => {
        this.isLoadingTrainerDetails = false;
        this.selectedTrainer = trainerDetails;
      },
      error: (error) => {
        this.isLoadingTrainerDetails = false;
        this.trainerDetailsError = error?.error?.message || 'Failed to load trainer profile.';
        console.error('Error loading trainer profile:', error);
      }
    });
  }
  
  // Close trainer profile modal
  closeTrainerProfile(): void {
    this.showTrainerProfile = false;
    this.selectedTrainer = null;
    this.trainerDetailsError = '';
  }
  
  // Submit trainer form
  submitTrainerForm(): void {
    if (this.trainerForm.invalid) {
      this.trainerForm.markAllAsTouched();
      this.formError = 'Please fill in all required fields correctly.';
      return;
    }
    
    this.isSubmitting = true;
    this.formError = '';
    this.formSuccess = '';
    
    const formValue = this.trainerForm.value;
    
    const trainerData: CreateTrainerRequest = {
      name: formValue.name.trim(),
      phone: formValue.phone.trim(),
      email: formValue.email?.trim() || '',
      specialization: formValue.specialization,
      experience: {
        years: parseInt(formValue.experienceYears),
        description: formValue.experienceDescription || ''
      },
      pricing: {
        hourlyRate: parseFloat(formValue.hourlyRate),
        currency: formValue.currency
      },
      currentPosition: {
        title: formValue.currentPositionTitle,
        company: formValue.currentPositionCompany
      },
      education: formValue.education.map((edu: any) => ({
        degree: edu.degree,
        institution: edu.institution,
        year: parseInt(edu.year),
        field: edu.field || ''
      })),
      certifications: formValue.certifications.map((cert: any) => ({
        name: cert.name,
        issuer: cert.issuer,
        year: parseInt(cert.year)
      })),
      skills: formValue.skills.map((skill: any) => ({
        name: skill.name,
        level: skill.level,
        yearsOfExperience: skill.yearsOfExperience ? parseFloat(skill.yearsOfExperience) : 0
      })),
      demoVideo: formValue.demoVideo || '',
      objectives: formValue.objectives || [],
      syllabus: formValue.syllabus || []
    };

    // Upload avatar first if a new file is selected
    const uploadAvatar = (): Observable<any> => {
      if (this.avatarFile) {
        return this.uploadService.uploadAvatar(this.avatarFile).pipe(
          catchError((error) => {
            console.error('Avatar upload error:', error);
            // If upload fails, continue with empty avatar or existing one
            return new Observable(observer => {
              observer.next({ url: formValue.avatar || '' });
              observer.complete();
            });
          })
        );
      } else {
        // Return observable with existing avatar URL or empty string
        return new Observable(observer => {
          observer.next({ url: formValue.avatar || '' });
          observer.complete();
        });
      }
    };

    uploadAvatar().subscribe({
      next: (uploadResult: any) => {
        const avatarUrl = uploadResult?.url || uploadResult?.data?.url || formValue.avatar || '';
        trainerData.avatar = avatarUrl;
        
        if (this.isEditingTrainer && this.editingTrainerId) {
          // Update existing trainer
          this.trainersService.updateTrainer(this.editingTrainerId, trainerData).subscribe({
            next: (response) => {
              this.isSubmitting = false;
              this.formSuccess = 'Trainer updated successfully!';
              this.formError = '';
              // Refresh trainer list
              this.loadTrainers();
              // Close form after 2 seconds
              setTimeout(() => {
                this.closeTrainerForm();
              }, 2000);
            },
            error: (error) => {
              this.isSubmitting = false;
              this.formError = error.error?.message || 'Failed to update trainer. Please try again.';
            }
          });
        } else {
          // Create new trainer
          this.trainersService.createTrainer(trainerData).subscribe({
            next: (response) => {
              this.isSubmitting = false;
              this.formSuccess = 'Trainer created successfully!';
              this.formError = '';
              // Reset form
              this.trainerForm.reset();
              this.initializeTrainerForm();
              // Refresh trainer list
              this.loadTrainers();
              // Close form after 2 seconds
              setTimeout(() => {
                this.closeTrainerForm();
              }, 2000);
            },
            error: (error) => {
              this.isSubmitting = false;
              this.formError = error.error?.message || 'Failed to create trainer. Please try again.';
            }
          });
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.formError = error.error?.message || 'Failed to upload profile picture. Please try again.';
      }
    });
  }
  
  // Get specialization options
  getSpecializations(): string[] {
    return this.trainersService.getSpecializations();
  }
  
  // Get skill levels
  getSkillLevels(): string[] {
    return this.trainersService.getSkillLevels();
  }
  
  // Navigation methods
  setActiveSection(section: string): void {
    this.activeSection = section;
    if (section === 'analytics' && !this.analytics) {
      this.loadAnalytics();
    }
    if (section === 'revenue' && !this.revenue) {
      this.loadRevenue();
    }
    if (section === 'courses') {
      this.loadCourses();
    }
    if (section === 'trainers') {
      this.loadTrainers();
    }
    if (section === 'settings') {
      this.loadSettings();
    }
    if (section === 'courses') {
      this.loadCourses();
    }
  }
  
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
  
  // Utility methods
  /**
   * Get full avatar URL for trainer
   * Handles both relative paths and full URLs
   */
  getTrainerAvatarUrl(avatar: string | null | undefined): string {
    if (!avatar) {
      return '';
    }
    // If already a full URL, return as is
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
      return avatar;
    }
    // If relative path, prepend backend URL
    const baseUrl = 'http://localhost:3000';
    return avatar.startsWith('/') ? `${baseUrl}${avatar}` : `${baseUrl}/${avatar}`;
  }

  /**
   * Handle image error by setting fallback image
   */
  handleImageError(event: Event, fallbackUrl: string): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = fallbackUrl;
    }
  }

  /**
   * Get placeholder avatar URL for trainer
   * Creates a data URL SVG instead of using external service
   */
  getPlaceholderAvatar(trainerName?: string, size: number = 50): string {
    const initial = trainerName ? trainerName.charAt(0).toUpperCase() : 'T';
    const fontSize = Math.floor(size * 0.5);
    // Create SVG data URL instead of using external placeholder service
    const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" fill="#9C27B0"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fontSize}" fill="#ffffff" text-anchor="middle" dominant-baseline="central" font-weight="bold">${initial}</text></svg>`;
    // Use encodeURIComponent instead of btoa for better compatibility
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'published': return 'status-published';
      case 'draft': return 'status-draft';
      case 'archived': return 'status-archived';
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      case 'active': return 'status-active';
      case 'completed': return 'status-completed';
      case 'ongoing': return 'status-confirmed';
      case 'on-leave': return 'status-on-leave';
      default: return '';
    }
  }
  
  getActivityIcon(type: string): string {
    switch (type) {
      case 'enrollment': return 'fas fa-user-graduate';
      case 'course': return 'fas fa-book';
      case 'trainer': return 'fas fa-chalkboard-teacher';
      case 'achievement': return 'fas fa-trophy';
      case 'review': return 'fas fa-star';
      default: return 'fas fa-info-circle';
    }
  }
  
  getSectionTitle(): string {
    switch (this.activeSection) {
      case 'overview': return 'Institution Dashboard';
      case 'courses': return 'Course Management';
      case 'students': return 'Student Management';
      case 'trainers': return 'Trainer Management';
      case 'batches': return 'Batch Management';
      case 'analytics': return 'Institution Analytics';
      case 'revenue': return 'Revenue & Finance';
      case 'settings': return 'Institution Settings';
      default: return 'Institution Dashboard';
    }
  }
  
  getSectionSubtitle(): string {
    switch (this.activeSection) {
      case 'overview': return 'Welcome back! Here\'s your institution overview and key metrics.';
      case 'courses': return 'Manage your courses, curriculum, and course performance.';
      case 'students': return 'Track student enrollments, progress, and achievements.';
      case 'trainers': return 'Manage your trainers, their performance, and assignments.';
      case 'batches': return 'Schedule and manage training batches and sessions.';
      case 'analytics': return 'Comprehensive analytics and insights for your institution.';
      case 'revenue': return 'Track revenue, payments, and financial performance.';
      case 'settings': return 'Manage your institution profile and preferences.';
      default: return 'Institution Dashboard';
    }
  }
  
  getTrendIcon(trend: string): string {
    return trend === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
  }
  
  getTrendClass(trend: string): string {
    return trend === 'up' ? 'trend-up' : 'trend-down';
  }

  getCourseId(course: Partial<InstitutionCourse> & { _id?: string } | null | undefined): string {
    if (!course) {
      return '';
    }
    return course?.id || course?._id || '';
  }

  private getBatchId(batch: Partial<InstitutionBatch> & { _id?: string }): string {
    return batch?.id || batch?._id || '';
  }

  startEditBatch(batch: InstitutionBatch): void {
    this.isEditingBatch = true;
    this.editingBatchId = this.getBatchId(batch);
    this.openBatchForm();
    const matchedCourse = this.institutionCourses.find(c => this.getCourseId(c) === batch.courseId) ||
      this.institutionCourses.find(c => c.title === batch.course);
    const matchedTrainer = this.trainerManagement.find(t => t.id === batch.trainerId) ||
      this.trainerManagement.find(t => t.name === batch.trainer);
    const resolvedCourseId = batch.courseId || (matchedCourse ? this.getCourseId(matchedCourse) : '');
    const resolvedCourseName = batch.course || matchedCourse?.title || '';
    const resolvedTrainerId = batch.trainerId || matchedTrainer?.id || '';
    const resolvedTrainerName = batch.trainer || matchedTrainer?.name || '';
    this.batchForm.patchValue({
      courseId: resolvedCourseId,
      courseName: resolvedCourseName,
      trainerId: resolvedTrainerId,
      trainerName: resolvedTrainerName,
      startDate: batch.startDate ? batch.startDate.split('T')[0] : '',
      endDate: batch.endDate ? batch.endDate.split('T')[0] : '',
      duration: batch.duration || '',
      maxStudents: batch.maxStudents || 25,
      schedule: batch.schedule || '',
      description: batch.description || '',
      meetingLink: batch.meetingLink || ''
    });
  }
}


