import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../services/courses.service';
import { SessionsService, Session, CreateSessionRequest } from '../../services/sessions.service';
import { AuthService } from '../../services/auth.service';
import { TrainersService } from '../../services/trainers.service';

@Component({
  selector: 'app-trainer-dashboard',
  templateUrl: './trainer-dashboard.component.html',
  styleUrls: ['./trainer-dashboard.component.css']
})
export class TrainerDashboardComponent implements OnInit {
  public courseName:any=null;
  isSubmittingCourse = false;
  courseSubmitError = '';
  courseSubmitSuccess = '';
  thumbnailFile: File | null = null;
  demoVideoFile: File | null = null;
  profilePhotoFile: File | null = null;
  profileSaveSuccess = '';
  profileSaveError = '';
  isSavingProfile = false;
  profilePhotoError = '';
  isSavingAccount = false;
  accountSaveSuccess = '';
  accountSaveError = '';
  isLoadingAccount = false;
  skillLevels: Array<'beginner' | 'intermediate' | 'advanced' | 'expert'> = ['beginner', 'intermediate', 'advanced', 'expert'];
  newSkill = { name: '', level: 'intermediate' as 'beginner' | 'intermediate' | 'advanced' | 'expert', years: 0 };
  newAchievement = { title: '', organization: '', year: new Date().getFullYear().toString(), description: '', link: '' };
  newLanguage = '';
  readonly maxSkills = 15;
  readonly maxAchievements = 15;
  readonly maxLanguages = 10;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private sessionsService: SessionsService,
    private authService: AuthService,
    private trainersService: TrainersService
  ) {
    this.initializeSessionForm();
    let courseDetails:any = sessionStorage.getItem("course-details");
    if (courseDetails) {
      try {
      this.courseName = JSON.parse(courseDetails);
      } catch (e) {
        console.error('Error parsing course details:', e);
      }
    }
  }

  private getInitialCourseForm() {
    return {
      title: '',
      subtitle: '',
      category: '',
      level: 'Beginner',
      language: 'English',
      price: 0,
      discountedPrice: '',
      durationHours: 0,
      totalLectures: 0,
      prerequisites: '',
      objectives: [] as string[],
      description: '',
      syllabus: [] as Array<{moduleTitle: string, hours: number, lessons: Array<{title: string}>}>,
      tags: '',
      thumbnail: '',
      demoVideo: '',
      publishStatus: 'draft'
    };
  }

  private buildCoursePayload(form: any) {
    // Process objectives - ensure it's an array
    let objectivesArray: string[] = [];
    if (form.objectives) {
      if (Array.isArray(form.objectives)) {
        objectivesArray = form.objectives
          .map((obj: any) => typeof obj === 'string' ? obj.trim() : String(obj).trim())
          .filter((obj: string) => obj.length > 0);
      } else if (typeof form.objectives === 'string') {
        const trimmed = form.objectives.trim();
        if (trimmed.length > 0) {
          objectivesArray = trimmed.split(/\n|,/).map((obj: string) => obj.trim()).filter((obj: string) => obj.length > 0);
        }
      }
    }

    const payload: any = {
      title: form.title?.trim(),
      subtitle: form.subtitle?.trim() || '',
      category: form.category,
      level: form.level,
      language: form.language || 'English',
      price: this.parseNumber(form.price),
      durationHours: this.parseNumber(form.durationHours),
      totalLectures: this.parseNumber(form.totalLectures),
      prerequisites: form.prerequisites?.trim() || '',
      objectives: objectivesArray,
      description: form.description?.trim(),
      syllabus: this.processSyllabus(form.syllabus),
      tags: form.tags || '',
      thumbnail: form.thumbnail || '',
      demoVideo: form.demoVideo || '',
      publishStatus: form.publishStatus || 'draft'
    };

    const discountValue = this.parseNumber(form.discountedPrice, NaN);
    if (!Number.isNaN(discountValue) && form.discountedPrice !== '' && form.discountedPrice !== null && form.discountedPrice !== undefined) {
      payload.discountedPrice = discountValue;
    }

    return payload;
  }

  private parseNumber(value: any, fallback = 0): number {
    if (value === '' || value === null || value === undefined) {
      return fallback;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  private processSyllabus(syllabus: any): Array<{moduleTitle: string, hours: number, lessons: Array<{title: string}>}> {
    if (!syllabus) {
      return [];
    }

    if (Array.isArray(syllabus)) {
      return syllabus
        .filter((module: any) => module && module.moduleTitle && module.moduleTitle.trim().length > 0)
        .map((module: any) => ({
          moduleTitle: module.moduleTitle.trim(),
          hours: this.parseNumber(module.hours, 0),
          lessons: Array.isArray(module.lessons)
            ? module.lessons
                .filter((lesson: any) => lesson && lesson.title && lesson.title.trim().length > 0)
                .map((lesson: any) => ({
                  title: lesson.title.trim()
                }))
            : []
        }));
    }

    // Backward compatibility: if it's a string, return empty array
    return [];
  }

  private formatTagsForForm(tags: any): string {
    if (Array.isArray(tags)) {
      return tags.join(', ');
    }
    return tags || '';
  }
  
  // Dashboard state
  activeSection = 'overview';
  sidebarCollapsed = false;
  showUserDropdown = false;
  isEditingProfile = false;
  private profileBackup: any = null;
  
  // Trainer profile
  trainerProfile: any = {
    name: 'John Doe',
    title: 'Senior Software Engineer',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    bio: 'Experienced software developer with 10+ years of expertise in web development.',
    avatar: 'https://via.placeholder.com/150',
    location: 'San Francisco, CA',
    specialization: 'Full Stack Development',
    experienceYears: 10,
    website: '',
    linkedin: '',
    twitter: '',
    skills: [],
    achievements: [],
    languages: [],
    rating: 4.8,
    totalStudents: 156,
    totalCourses: 8,
    joinDate: '2020-01-15'
  };
  
  // Trainer stats
  trainerStats = {
    totalStudents: 156,
    activeCourses: 8,
    completedSessions: 234,
    rating: 4.8,
    earnings: 12500,
    upcomingSessions: 12
  };
  
  // Recent activities
  recentActivities = [
    {
      type: 'session',
      title: 'Completed Python Basics Session',
      time: '2 hours ago',
      students: 15,
      icon: 'fas fa-chalkboard-teacher'
    },
    {
      type: 'course',
      title: 'New Course: Advanced React',
      time: '1 day ago',
      students: 0,
      icon: 'fas fa-book'
    },
    {
      type: 'student',
      title: 'New Student Enrolled',
      time: '2 days ago',
      students: 1,
      icon: 'fas fa-user-plus'
    },
    {
      type: 'review',
      title: 'Received 5-star Review',
      time: '3 days ago',
      students: 0,
      icon: 'fas fa-star'
    }
  ];
  
  // Upcoming sessions
  upcomingSessions: any[] = [];
  isLoadingSessions = false;
  
  // Session form state
  showSessionForm = false;
  sessionForm!: FormGroup;
  isSubmittingSession = false;
  
  // Syllabus/Curriculum state
  expandedModules: { [key: number]: boolean } = {};
  isEditingSession = false;
  editingSessionId: string | null = null;
  sessionFormError = '';
  sessionFormSuccess = '';
  
  // Course performance data
  coursePerformance: Array<{
    name: string;
    enrolled: number;
    completed: number;
    rating: number;
    revenue: number;
  }> = [];

  // My courses
  myCourses: any[] = [];

  // Course management
  isCreatingCourse = false;
  isEditingCourse = false;
  isLoadingCourses = false;
  coursesError = '';
  deletingCourseId: string | null = null;
  editingCourseId: string | null = null;
  isSubmittingCourseUpdate = false;
  viewingCourseDetails: any = null;
  isViewingCourseDetails = false;

  createCourseForm = this.getInitialCourseForm();
  editCourseForm = this.getInitialCourseForm();

  // Students
  students: any[] = [];
  isLoadingStudents = false;
  studentsError = '';
  studentSearchTerm = '';
  studentStatusFilter = 'all';
  studentCourseFilter = 'all';
  studentRatingFilter = 'all';
  studentLocationFilter = 'all';
  studentSortBy = 'id';
  studentSortOrder: 'asc' | 'desc' = 'asc';
  selectedStudents: number[] = [];
  showStudentDetails = false;
  selectedStudent: any = null;
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  paginationStart = 1;
  paginationEnd = 10;
  studentsStats = {
    totalStudents: 0,
    activeStudents: 0,
    paidStudents: 0,
    totalRevenue: 0
  };

  // Analytics
  analyticsDateRange = 'last30days';
  chartType = 'line';
  performanceView = 'overall';
  reportType = 'detailed';
  analyticsData = {
    studentEngagement: { totalStudents: 156, activePercentage: 78 },
    coursePerformance: { totalCourses: 8, averageRating: 4.7 },
    sessionAnalytics: { totalSessions: 234, averageAttendance: 85 },
    topCourses: [
      { name: 'JavaScript Fundamentals', performance: 85, value: '85%' },
      { name: 'React Advanced', performance: 92, value: '92%' },
      { name: 'Node.js Backend', performance: 78, value: '78%' },
      { name: 'Python Basics', performance: 88, value: '88%' }
    ]
  };

  // Earnings
  earningsDateRange = 'last30days';
  earningsData = {
    totalEarnings: 12500,
    availableBalance: 11500,
    pendingPayments: 1000,
    growthPercentage: 15,
    monthlyEarnings: 4200,
    lastMonthEarnings: 3900,
    nextPayoutDate: '2024-01-31',
    pendingCount: 3
  };
  recentTransactions = [
    {
      id: 'TXN001',
      date: '2024-01-15',
      time: '10:30 AM',
      description: 'Course Sale',
      course: 'JavaScript Fundamentals',
      amount: 49.00,
      type: 'earning',
      status: 'completed'
    },
    {
      id: 'TXN002',
      date: '2024-01-14',
      time: '2:15 PM',
      description: 'Payout',
      course: 'Multiple',
      amount: 1250.00,
      type: 'withdrawal',
      status: 'completed'
    },
    {
      id: 'TXN003',
      date: '2024-01-13',
      time: '9:45 AM',
      description: 'Course Sale',
      course: 'React Advanced',
      amount: 79.00,
      type: 'earning',
      status: 'pending'
    }
  ];
  paymentMethods = [
    {
      type: 'bank',
      details: '****1234',
      name: 'Main Bank Account',
      status: 'verified',
      default: true
    },
    {
      type: 'paypal',
      details: 'john@example.com',
      name: 'PayPal Account',
      status: 'verified',
      default: false
    }
  ];

  // Account
  accountDetails = {
    type: 'bank',
    holderName: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
    upiId: '',
    paypalEmail: '',
    stripeAccountId: '',
    address: '',
    country: 'US',
    payoutCycle: 'monthly',
    taxId: '',
    gst: '',
    notes: ''
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['highlight']) {
        console.log("test",params)
        // this.highlightedInstituteId = params['highlight'];
        // Scroll to highlighted institute after data loads
        // setTimeout(() => this.scrollToHighlightedInstitute(), 500);
      }
      if (params['search']) {
        // this.searchQuery = params['search'];
      }
    });

    // Load trainer profile from backend
    this.loadTrainerProfile();

    // Load trainer's courses when component initializes
    this.loadMyCourses();
    this.loadTrainerSessions();

    // Load payout account details
    this.loadPayoutAccount();

    // Load dashboard stats
    this.loadDashboardStats();
  }

  // Load trainer profile from API
  loadTrainerProfile(): void {
    this.authService.getTrainerProfile().subscribe({
      next: (trainer: any) => {
        this.trainerProfile = {
          ...this.trainerProfile,
          name: trainer.name,
          email: trainer.email || '',
          phone: trainer.phone,
          bio: trainer.bio || '',
          title: trainer.title || this.trainerProfile.title,
          location: trainer.location || '',
          specialization: trainer.specialization || '',
          experienceYears: trainer.experienceYears ?? this.trainerProfile.experienceYears,
          website: trainer.website || '',
          linkedin: trainer.linkedin || '',
          twitter: trainer.twitter || '',
          skills: Array.isArray(trainer.skills) ? trainer.skills : [],
          achievements: Array.isArray(trainer.achievements) ? trainer.achievements : [],
          languages: Array.isArray(trainer.languages) ? trainer.languages : [],
        };
        if (trainer.avatar) {
          this.trainerProfile.avatar = trainer.avatar;
        }
        if (trainer.createdAt) {
          this.trainerProfile.joinDate = trainer.createdAt.split('T')[0];
        }
      },
      error: (error) => {
        console.error('Error loading trainer profile:', error);
      }
    });
  }

  // Load courses for the trainer
  loadMyCourses(): void {
    this.isLoadingCourses = true;
    this.coursesError = '';

    this.coursesService.getMyCourses().subscribe({
      next: (courses) => {
        this.myCourses = courses;
        this.isLoadingCourses = false;
        this.coursePerformance = courses.map((course: any) => ({
          name: course.title,
          enrolled: course.totalEnrollments || 0,
          completed: course.totalCompleted || 0,
          rating: course.rating || 0,
          revenue: course.revenue || 0
        }));
      },
      error: (error) => {
        this.isLoadingCourses = false;
        this.coursesError = error.error?.message || error.message || 'Failed to load courses.';
        console.error('Error loading courses:', error);
      }
    });
  }

  loadTrainerSessions(): void {
    this.isLoadingSessions = true;
    this.sessionsService.getMySessions().subscribe({
      next: (sessions: Session[]) => {
        this.upcomingSessions = sessions.map(session => this.mapSessionToView(session));
        this.isLoadingSessions = false;
      },
      error: (error) => {
        console.error('Error loading sessions:', error);
        this.isLoadingSessions = false;
      }
    });
  }

  private mapSessionToView(session: Session): any {
    const dateInputValue = this.formatDateForInput(session.sessionDate);
    const endDateInputValue = session.endDate ? this.formatDateForInput(session.endDate) : '';
    return {
      id: session.id,
      course: session.courseTitle,
      courseTitle: session.courseTitle,
      date: this.formatSessionDate(session.sessionDate),
      dateInputValue,
      sessionDate: session.sessionDate,
      endDate: session.endDate || '',
      endDateInputValue,
      endDateFormatted: session.endDate ? this.formatSessionDate(session.endDate) : '',
      time: session.sessionTime,
      sessionTime: session.sessionTime,
      students: (session as any).enrolledStudents || 0,
      maxStudents: session.maxStudents,
      duration: `${session.durationHours} hours`,
      durationHours: session.durationHours,
      status: session.status,
      sessionType: session.sessionType,
      meetingLink: session.meetingLink || '',
      description: session.description || '',
      topics: session.topics || [],
      totalSessions: session.totalSessions || 1,
      modeOfClass: session.modeOfClass || 'online'
    };
  }

  private replaceSessionInList(session: Session): void {
    const mapped = this.mapSessionToView(session);
    const index = this.upcomingSessions.findIndex(existing => existing.id === mapped.id);
    if (index > -1) {
      this.upcomingSessions[index] = mapped;
    } else {
      this.upcomingSessions.unshift(mapped);
    }
  }

  private formatDateForInput(dateValue: string): string {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      return '';
    }
    return date.toISOString().split('T')[0];
  }

  private formatSessionDate(dateValue: string): string {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      return dateValue;
    }
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
  
  // Navigation methods
  setActiveSection(section: string): void {
    this.activeSection = section;
    // Load data when switching to specific sections
    if (section === 'students') {
      this.loadEnrolledStudents();
    } else if (section === 'overview') {
      this.loadDashboardStats();
    }
  }

  // Load enrolled students from backend
  loadEnrolledStudents(): void {
    if (this.isLoadingStudents) return;
    
    this.isLoadingStudents = true;
    this.studentsError = '';

    const filters: any = {};
    if (this.studentStatusFilter !== 'all') {
      filters.status = this.studentStatusFilter;
    }
    if (this.studentCourseFilter !== 'all') {
      filters.courseId = this.studentCourseFilter;
    }
    if (this.studentSearchTerm) {
      filters.search = this.studentSearchTerm;
    }

    this.trainersService.getMyStudents(filters).subscribe({
      next: (response) => {
        this.students = response.students || [];
        this.studentsStats = response.stats || {
          totalStudents: 0,
          activeStudents: 0,
          paidStudents: 0,
          totalRevenue: 0
        };
        
        // Update trainer stats with real data
        this.trainerStats.totalStudents = this.studentsStats.totalStudents;
        this.trainerStats.earnings = this.studentsStats.totalRevenue;
        
        // Update pagination
        this.updatePagination();
        this.isLoadingStudents = false;
      },
      error: (error) => {
        console.error('Error loading enrolled students:', error);
        this.studentsError = error.message || 'Failed to load students';
        this.isLoadingStudents = false;
      }
    });
  }

  // Load dashboard stats
  loadDashboardStats(): void {
    // Load students stats for overview
    this.trainersService.getMyStudents().subscribe({
      next: (response) => {
        this.studentsStats = response.stats || {
          totalStudents: 0,
          activeStudents: 0,
          paidStudents: 0,
          totalRevenue: 0
        };
        this.trainerStats.totalStudents = this.studentsStats.totalStudents;
        this.trainerStats.earnings = this.studentsStats.totalRevenue;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });
  }
  
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
  
  // Utility methods
  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }
  
  getActivityIcon(type: string): string {
    switch (type) {
      case 'session': return 'fas fa-chalkboard-teacher';
      case 'course': return 'fas fa-book';
      case 'student': return 'fas fa-user-plus';
      case 'review': return 'fas fa-star';
      default: return 'fas fa-info-circle';
    }
  }
  
  getSectionTitle(): string {
    switch (this.activeSection) {
      case 'overview': return 'Dashboard Overview';
      case 'profile': return 'Profile';
      case 'courses': return 'My Courses';
      case 'students': return 'My Students';
      case 'sessions': return 'Training Batches';
      case 'analytics': return 'Analytics & Reports';
      case 'earnings': return 'Earnings & Payments';
      case 'settings': return 'Account Settings';
      default: return 'Dashboard';
    }
  }
  
  getSectionSubtitle(): string {
    switch (this.activeSection) {
      case 'overview': return 'Welcome back! Here\'s what\'s happening with your training programs.';
      case 'profile': return 'Manage your personal trainer information.';
      case 'courses': return 'Manage your courses and track their performance.';
      case 'students': return 'View and manage your student enrollments.';
      case 'sessions': return 'Schedule and manage your training batches.';
      case 'analytics': return 'Detailed insights into your training performance.';
      case 'earnings': return 'Track your earnings and payment history.';
      case 'settings': return 'Manage your account and preferences.';
      default: return 'Trainer Dashboard';
    }
  }

  // Profile edit helpers
  startEditProfile(): void {
    this.profileBackup = { ...this.trainerProfile };
    this.isEditingProfile = true;
  }

  saveProfileFromSection(): void {
    this.saveProfile(true);
  }

  cancelEditProfile(): void {
    if (this.profileBackup) {
      this.trainerProfile = { ...this.profileBackup };
    }
    this.isEditingProfile = false;
  }

  // Save profile (used from both Profile section & Settings)
  saveProfile(exitEdit: boolean = false): void {
    this.isSavingProfile = true;
    this.profileSaveSuccess = '';
    this.profileSaveError = '';

    const payload = {
      name: this.trainerProfile.name,
      email: this.trainerProfile.email,
      phone: this.trainerProfile.phone,
      avatar: this.trainerProfile.avatar,
      bio: this.trainerProfile.bio,
      title: this.trainerProfile.title,
      location: this.trainerProfile.location,
      specialization: this.trainerProfile.specialization,
      experienceYears: this.trainerProfile.experienceYears,
      website: this.trainerProfile.website,
      linkedin: this.trainerProfile.linkedin,
      twitter: this.trainerProfile.twitter,
      skills: this.trainerProfile.skills || [],
      achievements: this.trainerProfile.achievements || [],
      languages: this.trainerProfile.languages || []
    };

    this.authService.updateTrainerProfile(payload).subscribe({
      next: () => {
        this.isSavingProfile = false;
        this.profileSaveSuccess = 'Profile updated successfully';
        if (exitEdit) {
          this.isEditingProfile = false;
          this.profileBackup = null;
        }
      },
      error: (error) => {
        this.isSavingProfile = false;
        this.profileSaveError = error.error?.message || error.message || 'Failed to update profile. Please try again.';
        console.error('Error updating profile:', error);
      }
    });
  }

  addSkill(): void {
    const trimmedName = this.newSkill.name.trim();
    if (!trimmedName) {
      this.profileSaveError = 'Please provide a skill name before adding.';
      return;
    }

    if ((this.trainerProfile.skills || []).length >= this.maxSkills) {
      this.profileSaveError = `You can add up to ${this.maxSkills} skills.`;
      return;
    }

    const yearsValue = Number(this.newSkill.years);
    const years = Number.isNaN(yearsValue) ? 0 : Math.min(Math.max(yearsValue, 0), 60);

    this.trainerProfile.skills = [
      ...(this.trainerProfile.skills || []),
      {
        name: trimmedName,
        level: this.newSkill.level,
        years
      }
    ];

    this.newSkill = { name: '', level: 'intermediate', years: 0 };
    this.profileSaveError = '';
  }

  removeSkill(index: number): void {
    if (!this.trainerProfile.skills) {
      return;
    }
    this.trainerProfile.skills = this.trainerProfile.skills.filter((_: any, i: number) => i !== index);
  }

  addAchievement(): void {
    const trimmedTitle = this.newAchievement.title.trim();
    if (!trimmedTitle) {
      this.profileSaveError = 'Achievement title is required.';
      return;
    }

    if ((this.trainerProfile.achievements || []).length >= this.maxAchievements) {
      this.profileSaveError = `You can add up to ${this.maxAchievements} achievements.`;
      return;
    }

    this.trainerProfile.achievements = [
      ...(this.trainerProfile.achievements || []),
      {
        title: trimmedTitle,
        organization: this.newAchievement.organization?.trim(),
        description: this.newAchievement.description?.trim(),
        year: this.newAchievement.year?.trim(),
        link: this.newAchievement.link?.trim()
      }
    ];

    this.newAchievement = { title: '', organization: '', year: new Date().getFullYear().toString(), description: '', link: '' };
    this.profileSaveError = '';
  }

  removeAchievement(index: number): void {
    if (!this.trainerProfile.achievements) {
      return;
    }
    this.trainerProfile.achievements = this.trainerProfile.achievements.filter((_: any, i: number) => i !== index);
  }

  addLanguage(): void {
    const trimmedLanguage = this.newLanguage.trim();
    if (!trimmedLanguage) {
      this.profileSaveError = 'Please provide a language name before adding.';
      return;
    }

    if ((this.trainerProfile.languages || []).length >= this.maxLanguages) {
      this.profileSaveError = `You can add up to ${this.maxLanguages} languages.`;
      return;
    }

    // Check if language already exists (case-insensitive)
    const existingLanguages = (this.trainerProfile.languages || []).map((lang: string) => lang.toLowerCase());
    if (existingLanguages.includes(trimmedLanguage.toLowerCase())) {
      this.profileSaveError = 'This language is already added.';
      return;
    }

    this.trainerProfile.languages = [
      ...(this.trainerProfile.languages || []),
      trimmedLanguage
    ];
    this.newLanguage = '';
    this.profileSaveError = '';
  }

  removeLanguage(index: number): void {
    if (!this.trainerProfile.languages) {
      return;
    }
    this.trainerProfile.languages = this.trainerProfile.languages.filter((_: any, i: number) => i !== index);
  }

  trackByIndex(index: number): number {
    return index;
  }

  // Settings properties
  settings = {
    notifications: {
      email: true,
      sms: false,
      app: true,
      marketing: false
    },
    preferences: {
      timezone: 'UTC-5',
      language: 'en',
      theme: 'light'
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactor: false
    }
  };

  // User dropdown methods
  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
  }

  closeUserDropdown(): void {
    this.showUserDropdown = false;
  }

  onProfileClick(): void {
    this.setActiveSection('settings');
    this.closeUserDropdown();
  }

  onLogoutClick(): void {
    console.log('Logout clicked');
    this.closeUserDropdown();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu') && this.showUserDropdown) {
      this.closeUserDropdown();
    }
  }

  // Course management methods
  startCreateCourse(): void {
    this.isCreatingCourse = true;
    this.isEditingCourse = false;
    this.editingCourseId = null;
    this.createCourseForm = this.getInitialCourseForm();
    this.courseSubmitError = '';
    this.courseSubmitSuccess = '';
  }

  cancelCreateCourse(): void {
    this.isCreatingCourse = false;
    this.createCourseForm = this.getInitialCourseForm();
    this.courseSubmitError = '';
  }

  addObjective(formType: 'create' | 'edit' = 'create'): void {
    const form = formType === 'create' ? this.createCourseForm : this.editCourseForm;
    if (!Array.isArray(form.objectives)) {
      form.objectives = [];
    }
    form.objectives.push('');
  }

  removeObjective(index: number, formType: 'create' | 'edit' = 'create'): void {
    const form = formType === 'create' ? this.createCourseForm : this.editCourseForm;
    if (Array.isArray(form.objectives) && index >= 0 && index < form.objectives.length) {
      form.objectives.splice(index, 1);
    }
  }

  // Syllabus/Curriculum management methods
  addModule(formType: 'create' | 'edit' = 'create'): void {
    const form = formType === 'create' ? this.createCourseForm : this.editCourseForm;
    if (!Array.isArray(form.syllabus)) {
      form.syllabus = [];
    }
    if (form.syllabus.length < 50) {
      form.syllabus.push({
        moduleTitle: '',
        hours: 0,
        lessons: []
      });
      // Expand the newly added module
      const moduleIndex = form.syllabus.length - 1;
      this.expandedModules[moduleIndex] = true;
    }
  }

  removeModule(moduleIndex: number, formType: 'create' | 'edit' = 'create'): void {
    const form = formType === 'create' ? this.createCourseForm : this.editCourseForm;
    if (Array.isArray(form.syllabus) && moduleIndex >= 0 && moduleIndex < form.syllabus.length) {
      form.syllabus.splice(moduleIndex, 1);
      // Clean up expanded state
      delete this.expandedModules[moduleIndex];
      // Reindex expanded modules
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

  addLesson(moduleIndex: number, formType: 'create' | 'edit' = 'create'): void {
    const form = formType === 'create' ? this.createCourseForm : this.editCourseForm;
    if (Array.isArray(form.syllabus) && moduleIndex >= 0 && moduleIndex < form.syllabus.length) {
      const module = form.syllabus[moduleIndex];
      if (!Array.isArray(module.lessons)) {
        module.lessons = [];
      }
      if (module.lessons.length < 100) {
        module.lessons.push({ title: '' });
      }
    }
  }

  removeLesson(moduleIndex: number, lessonIndex: number, formType: 'create' | 'edit' = 'create'): void {
    const form = formType === 'create' ? this.createCourseForm : this.editCourseForm;
    if (Array.isArray(form.syllabus) && moduleIndex >= 0 && moduleIndex < form.syllabus.length) {
      const module = form.syllabus[moduleIndex];
      if (Array.isArray(module.lessons) && lessonIndex >= 0 && lessonIndex < module.lessons.length) {
        module.lessons.splice(lessonIndex, 1);
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
    return Array.isArray(module.lessons) ? module.lessons.length : 0;
  }

  getModuleTotalHours(module: any): number {
    return module.hours || 0;
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  getTagsArray(tags: any): string[] {
    if (Array.isArray(tags)) {
      return tags;
    }
    if (tags && typeof tags === 'string') {
      return tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    }
    return [];
  }

  submitCreateCourse(): void {
    // Validation
    if (!this.createCourseForm.title || !this.createCourseForm.description) {
      this.courseSubmitError = 'Title and description are required';
      return;
    }

    if (!this.createCourseForm.category || !this.createCourseForm.level) {
      this.courseSubmitError = 'Category and level are required';
      return;
    }

    this.isSubmittingCourse = true;
    this.courseSubmitError = '';
    this.courseSubmitSuccess = '';

    const courseData = this.buildCoursePayload(this.createCourseForm);

    // Call API to create course
    this.coursesService.createTrainerCourse(courseData).subscribe({
      next: (course) => {
        this.isSubmittingCourse = false;
        this.courseSubmitSuccess = 'Course created successfully!';
        
        // Add to myCourses list
        this.myCourses.unshift(course);
        
        // Reset form
        this.createCourseForm = this.getInitialCourseForm();
        
        // Hide form after 2 seconds
        setTimeout(() => {
          this.isCreatingCourse = false;
          this.courseSubmitSuccess = '';
          this.loadMyCourses(); // Reload courses to get updated list
        }, 2000);
      },
      error: (error) => {
        this.isSubmittingCourse = false;
        this.courseSubmitError = error.error?.message || error.message || 'Failed to create course. Please try again.';
        console.error('Error creating course:', error);
      }
    });
  }

  editCourse(course: any): void {
    if (!course) {
      return;
    }
    this.isEditingCourse = true;
    this.isCreatingCourse = false;
    this.editingCourseId = course.id;
    this.courseSubmitError = '';
    this.courseSubmitSuccess = '';
    // Process syllabus - ensure it's an array
    let syllabusArray: Array<{moduleTitle: string, hours: number, lessons: Array<{title: string}>}> = [];
    if (course.syllabus) {
      if (Array.isArray(course.syllabus)) {
        syllabusArray = course.syllabus.map((module: any) => ({
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

    this.editCourseForm = {
      title: course.title || '',
      subtitle: course.subtitle || '',
      category: course.category || '',
      level: course.level || 'Beginner',
      language: course.language || 'English',
      price: course.price ?? 0,
      discountedPrice: course.discountedPrice ?? '',
      durationHours: course.durationHours ?? 0,
      totalLectures: course.totalLectures ?? 0,
      prerequisites: course.prerequisites || '',
      objectives: Array.isArray(course.objectives) 
        ? [...course.objectives] 
        : (course.objectives && typeof course.objectives === 'string' && course.objectives.trim() 
          ? course.objectives.split(/\n|,/).map((obj: string) => obj.trim()).filter((obj: string) => obj.length > 0)
          : []),
      description: course.description || '',
      syllabus: syllabusArray,
      tags: this.formatTagsForForm(course.tags),
      thumbnail: course.thumbnail || '',
      demoVideo: course.demoVideo || '',
      publishStatus: course.publishStatus || 'draft'
    };

    // Expand all modules by default when editing
    syllabusArray.forEach((_, index) => {
      this.expandedModules[index] = true;
    });
  }

  cancelEditCourse(): void {
    this.isEditingCourse = false;
    this.editingCourseId = null;
    this.editCourseForm = this.getInitialCourseForm();
    this.courseSubmitError = '';
  }

  submitEditCourse(): void {
    if (!this.editingCourseId) {
      return;
    }

    if (!this.editCourseForm.title || !this.editCourseForm.description) {
      this.courseSubmitError = 'Title and description are required for updates.';
      return;
    }

    this.isSubmittingCourseUpdate = true;
    this.courseSubmitError = '';
    this.courseSubmitSuccess = '';

    const payload = this.buildCoursePayload(this.editCourseForm);

    this.coursesService.updateTrainerCourse(this.editingCourseId, payload).subscribe({
      next: () => {
        this.isSubmittingCourseUpdate = false;
        this.courseSubmitSuccess = 'Course updated successfully!';
        this.isEditingCourse = false;
        this.editingCourseId = null;
        this.editCourseForm = this.getInitialCourseForm();
        this.loadMyCourses();
        setTimeout(() => (this.courseSubmitSuccess = ''), 2000);
      },
      error: (error) => {
        this.isSubmittingCourseUpdate = false;
        this.courseSubmitError = error.error?.message || error.message || 'Failed to update course. Please try again.';
        console.error('Error updating course:', error);
      }
    });
  }

  deleteCourse(courseId: string): void {
    if (!courseId) {
      return;
    }

    const confirmed = confirm('Are you sure you want to delete this course? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    this.deletingCourseId = courseId.toString();
    this.courseSubmitError = '';
    this.courseSubmitSuccess = '';

    this.coursesService.deleteTrainerCourse(this.deletingCourseId).subscribe({
      next: () => {
        this.courseSubmitSuccess = 'Course deleted successfully.';
        this.deletingCourseId = null;
        this.loadMyCourses();
        setTimeout(() => (this.courseSubmitSuccess = ''), 2000);
      },
      error: (error) => {
        this.courseSubmitError = error.error?.message || error.message || 'Failed to delete course.';
        this.deletingCourseId = null;
        console.error('Error deleting course:', error);
      }
    });
  }

  viewCourseDetails(course: any): void {
    this.viewingCourseDetails = course;
    this.isViewingCourseDetails = true;
    this.isCreatingCourse = false;
    this.isEditingCourse = false;
  }

  closeCourseDetails(): void {
    this.isViewingCourseDetails = false;
    this.viewingCourseDetails = null;
  }

  onThumbnailSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.courseSubmitError = 'Please select an image file for thumbnail';
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.courseSubmitError = 'Thumbnail image must be less than 5MB';
        return;
      }

      this.thumbnailFile = file;
      
      // For now, we'll just store the file name
      // In a real implementation, you'd upload the file first and get the URL
      this.createCourseForm.thumbnail = file.name;
      
      console.log('Thumbnail selected:', file.name);
    }
  }

  onDemoVideoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        this.courseSubmitError = 'Please select a video file for demo';
        return;
      }
      
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        this.courseSubmitError = 'Demo video must be less than 50MB';
        return;
      }

      this.demoVideoFile = file;
      
      // For now, we'll just store the file name
      // In a real implementation, you'd upload the file first and get the URL
      this.createCourseForm.demoVideo = file.name;
      
      console.log('Demo video selected:', file.name);
    }
  }

  onProfilePhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.profilePhotoError = 'Please upload a valid image file.';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.profilePhotoError = 'Profile photo must be smaller than 2MB.';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.trainerProfile.avatar = reader.result as string;
      this.profilePhotoFile = file;
      this.profilePhotoError = '';
    };
    reader.onerror = () => {
      this.profilePhotoError = 'Could not read the selected image. Please try again.';
    };

    reader.readAsDataURL(file);
  }

  // Student management methods
  filterStudents(filter: string): void {
    this.studentStatusFilter = filter;
    this.currentPage = 1;
    this.loadEnrolledStudents();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadEnrolledStudents();
  }

  updatePagination(): void {
    const total = this.getTotalFilteredStudents();
    this.totalPages = Math.ceil(total / this.itemsPerPage);
    this.paginationStart = (this.currentPage - 1) * this.itemsPerPage + 1;
    this.paginationEnd = Math.min(this.currentPage * this.itemsPerPage, total);
  }

  filterByCourseStatus(filter: string): void {
    this.studentCourseFilter = filter;
  }

  filterByRating(filter: string): void {
    this.studentRatingFilter = filter;
  }

  filterByLocation(filter: string): void {
    this.studentLocationFilter = filter;
  }

  sortStudents(sortBy: string): void {
    if (this.studentSortBy === sortBy) {
      this.studentSortOrder = this.studentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.studentSortBy = sortBy;
      this.studentSortOrder = 'asc';
    }
  }

  getFilteredStudents(): any[] {
    let filtered = [...this.students];

    // Apply search filter
    if (this.studentSearchTerm) {
      const searchLower = this.studentSearchTerm.toLowerCase();
      filtered = filtered.filter(student => {
        return (
          (student.fullName && student.fullName.toLowerCase().includes(searchLower)) ||
          (student.email && student.email.toLowerCase().includes(searchLower)) ||
          (student.phone && student.phone.includes(this.studentSearchTerm)) ||
          (student.courseName && student.courseName.toLowerCase().includes(searchLower)) ||
          (student.city && student.city.toLowerCase().includes(searchLower)) ||
          (student.country && student.country.toLowerCase().includes(searchLower))
        );
      });
    }

    // Apply status filter
    if (this.studentStatusFilter !== 'all') {
      filtered = filtered.filter(student => student.status === this.studentStatusFilter);
    }

    // Apply course filter
    if (this.studentCourseFilter !== 'all') {
      filtered = filtered.filter(student => student.courseId === this.studentCourseFilter);
    }

    // Apply rating filter
    if (this.studentRatingFilter !== 'all') {
      const rating = parseFloat(this.studentRatingFilter);
      filtered = filtered.filter(student => {
        const studentRating = student.rating || 0;
        return studentRating >= rating && studentRating < rating + 1;
      });
    }

    // Apply location filter
    if (this.studentLocationFilter !== 'all') {
      filtered = filtered.filter(student => {
        const location = `${student.city || ''} ${student.country || ''}`.trim().toLowerCase();
        return location.includes(this.studentLocationFilter.toLowerCase());
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[this.studentSortBy];
      let bValue: any = b[this.studentSortBy];

      if (this.studentSortBy === 'joinDate' || this.studentSortBy === 'enrollmentDate' || this.studentSortBy === 'createdAt') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }

      // Handle amountPaid sorting
      if (this.studentSortBy === 'amountPaid' || this.studentSortBy === 'totalPaid') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return this.studentSortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.studentSortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }

  getTotalFilteredStudents(): number {
    return this.getFilteredStudents().length;
  }

  getPaginatedStudents(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.getFilteredStudents().slice(start, end);
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  goToFirstPage(): void {
    this.currentPage = 1;
  }

  goToLastPage(): void {
    this.currentPage = this.totalPages;
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  changeItemsPerPage(items: number): void {
    this.itemsPerPage = items;
    this.currentPage = 1;
  }

  onPageInputChange(event: any): void {
    const page = parseInt(event.target.value, 10);
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  selectStudent(studentId: number): void {
    const index = this.selectedStudents.indexOf(studentId);
    if (index > -1) {
      this.selectedStudents.splice(index, 1);
    } else {
      this.selectedStudents.push(studentId);
    }
  }

  selectAllStudents(): void {
    this.selectedStudents = this.getFilteredStudents().map(s => s.id);
  }

  clearSelection(): void {
    this.selectedStudents = [];
  }

  viewStudentDetails(student: any): void {
    this.selectedStudent = student;
    this.showStudentDetails = true;
  }

  closeStudentDetails(): void {
    this.showStudentDetails = false;
    this.selectedStudent = null;
  }

  sendMessageToStudent(student: any): void {
    console.log('Sending message to:', student);
  }

  scheduleSessionWithStudent(student: any): void {
    console.log('Scheduling session with:', student);
  }

  addStudentNote(student: any): void {
    console.log('Adding note for:', student);
  }

  exportStudentData(): void {
    console.log('Exporting student data');
  }

  clearAllFilters(): void {
    this.studentSearchTerm = '';
    this.studentStatusFilter = 'all';
    this.studentCourseFilter = 'all';
    this.studentRatingFilter = 'all';
    this.studentLocationFilter = 'all';
  }


  getRatingStars(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push('fas fa-star');
      } else if (i - rating < 1) {
        stars.push('fas fa-star-half-alt');
      } else {
        stars.push('far fa-star');
      }
    }
    return stars;
  }

  getCourseStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      default: return '';
    }
  }

  getProgressClass(progress: number): string {
    if (progress >= 75) return 'progress-high';
    if (progress >= 50) return 'progress-medium';
    return 'progress-low';
  }

  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'paid': return 'status-paid';
      case 'pending': return 'status-pending';
      case 'overdue': return 'status-overdue';
      default: return '';
    }
  }

  // Analytics methods
  updateAnalytics(): void {
    console.log('Updating analytics');
  }

  exportReport(): void {
    console.log('Exporting report');
  }

  // Earnings methods
  updateEarnings(): void {
    console.log('Updating earnings');
  }

  viewPaymentHistory(): void {
    console.log('Viewing payment history');
  }

  requestPayout(): void {
    console.log('Requesting payout');
  }

  addPaymentMethod(): void {
    console.log('Adding payment method');
  }

  editPaymentMethod(method: any): void {
    console.log('Editing payment method:', method);
  }

  setDefaultMethod(method: any): void {
    console.log('Setting default method:', method);
  }

  removePaymentMethod(method: any): void {
    console.log('Removing payment method:', method);
  }

  viewAllTransactions(): void {
    console.log('Viewing all transactions');
  }

  getTransactionAmountClass(type: string): string {
    return type === 'credit' ? 'positive' : 'negative';
  }

  getTransactionStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      default: return '';
    }
  }

  getPaymentMethodIcon(type: string): string {
    switch (type) {
      case 'bank': return 'fas fa-university';
      case 'paypal': return 'fab fa-paypal';
      case 'stripe': return 'fab fa-stripe';
      case 'upi': return 'fas fa-mobile-alt';
      default: return 'fas fa-credit-card';
    }
  }

  getMethodStatusClass(status: string): string {
    switch (status) {
      case 'verified': return 'status-verified';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      default: return '';
    }
  }

  // Account methods
  resetAccountForm(): void {
    this.accountDetails = {
      type: 'bank',
      holderName: '',
      bankName: '',
      accountNumber: '',
      ifsc: '',
      upiId: '',
      paypalEmail: '',
      stripeAccountId: '',
      address: '',
      country: 'US',
      payoutCycle: 'monthly',
      taxId: '',
      gst: '',
      notes: ''
    };
  }

  // Load payout account details from API
  loadPayoutAccount(): void {
    this.isLoadingAccount = true;
    this.accountSaveError = '';
    this.authService.getPayoutAccount().subscribe({
      next: (payoutAccount: any) => {
        this.isLoadingAccount = false;
        if (payoutAccount) {
          this.accountDetails = {
            type: payoutAccount.type || 'bank',
            holderName: payoutAccount.holderName || '',
            bankName: payoutAccount.bankName || '',
            accountNumber: payoutAccount.accountNumber || '',
            ifsc: payoutAccount.ifsc || '',
            upiId: payoutAccount.upiId || '',
            paypalEmail: payoutAccount.paypalEmail || '',
            stripeAccountId: payoutAccount.stripeAccountId || '',
            address: payoutAccount.address || '',
            country: payoutAccount.country || 'India',
            payoutCycle: payoutAccount.payoutCycle || 'monthly',
            taxId: payoutAccount.taxId || '',
            gst: payoutAccount.gst || '',
            notes: payoutAccount.notes || ''
          };
        }
      },
      error: (error) => {
        this.isLoadingAccount = false;
        console.error('Error loading payout account:', error);
        // Don't show error if account doesn't exist yet (first time setup)
        if (error.status !== 404) {
          this.accountSaveError = 'Failed to load payout account details. Please try again.';
        }
      }
    });
  }

  saveAccountDetails(): void {
    this.isSavingAccount = true;
    this.accountSaveSuccess = '';
    this.accountSaveError = '';

    // Prepare payload
    const payload: any = {
      type: this.accountDetails.type,
      holderName: this.accountDetails.holderName?.trim() || '',
      bankName: this.accountDetails.bankName?.trim() || '',
      accountNumber: this.accountDetails.accountNumber?.trim() || '',
      ifsc: this.accountDetails.ifsc?.trim() || '',
      upiId: this.accountDetails.upiId?.trim() || '',
      paypalEmail: this.accountDetails.paypalEmail?.trim() || '',
      stripeAccountId: this.accountDetails.stripeAccountId?.trim() || '',
      address: this.accountDetails.address?.trim() || '',
      country: this.accountDetails.country?.trim() || 'India',
      payoutCycle: this.accountDetails.payoutCycle || 'monthly',
      taxId: this.accountDetails.taxId?.trim() || '',
      gst: this.accountDetails.gst?.trim() || '',
      notes: this.accountDetails.notes?.trim() || ''
    };

    this.authService.updatePayoutAccount(payload).subscribe({
      next: (response: any) => {
        this.isSavingAccount = false;
        this.accountSaveSuccess = 'Payout account details saved successfully!';
        // Update local accountDetails with response
        if (response) {
          this.accountDetails = {
            type: response.type || this.accountDetails.type,
            holderName: response.holderName || this.accountDetails.holderName,
            bankName: response.bankName || this.accountDetails.bankName,
            accountNumber: response.accountNumber || this.accountDetails.accountNumber,
            ifsc: response.ifsc || this.accountDetails.ifsc,
            upiId: response.upiId || this.accountDetails.upiId,
            paypalEmail: response.paypalEmail || this.accountDetails.paypalEmail,
            stripeAccountId: response.stripeAccountId || this.accountDetails.stripeAccountId,
            address: response.address || this.accountDetails.address,
            country: response.country || this.accountDetails.country,
            payoutCycle: response.payoutCycle || this.accountDetails.payoutCycle,
            taxId: response.taxId || this.accountDetails.taxId,
            gst: response.gst || this.accountDetails.gst,
            notes: response.notes || this.accountDetails.notes
          };
        }
        setTimeout(() => {
          this.accountSaveSuccess = '';
        }, 3000);
      },
      error: (error) => {
        this.isSavingAccount = false;
        this.accountSaveError = error.error?.message || error.message || 'Failed to save payout account details. Please try again.';
        console.error('Error saving payout account:', error);
      }
    });
  }

  // Settings methods
  updatePassword(): void {
    console.log('Updating password');
  }

  saveNotifications(): void {
    console.log('Saving notification settings:', this.settings.notifications);
  }

  savePreferences(): void {
    console.log('Saving preferences:', this.settings.preferences);
  }
  
  // Session form methods
  initializeSessionForm(): void {
    this.sessionForm = this.fb.group({
      course: ['', Validators.required],
      sessionDate: ['', Validators.required],
      endDate: [''],
      sessionTime: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(0.5), Validators.max(8)]],
      maxStudents: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      sessionType: ['live', Validators.required],
      meetingLink: [''],
      description: ['', Validators.maxLength(500)],
      topics: this.fb.array([]),
      totalSessions: [1, [Validators.required, Validators.min(1)]],
      modeOfClass: ['online', Validators.required]
    });
  }
  
  get topicsFormArray(): FormArray {
    return this.sessionForm.get('topics') as FormArray;
  }
  
  addTopic(): void {
    const topicGroup = this.fb.group({
      topic: ['', Validators.required]
    });
    this.topicsFormArray.push(topicGroup);
  }
  
  removeTopic(index: number): void {
    this.topicsFormArray.removeAt(index);
  }

  private resetSessionFormFields(): void {
    this.sessionForm.reset();
    this.topicsFormArray.clear();
    this.addTopic();
    this.sessionForm.patchValue({
      sessionType: 'live',
      meetingLink: '',
      description: '',
      totalSessions: 1,
      modeOfClass: 'online',
      endDate: ''
    });
  }

  private populateTopics(topics: string[]): void {
    this.topicsFormArray.clear();
    if (!topics || topics.length === 0) {
      this.addTopic();
      return;
    }
    topics.forEach(topic => {
      const topicGroup = this.fb.group({
        topic: [topic, Validators.required]
      });
      this.topicsFormArray.push(topicGroup);
    });
  }
  
  openSessionForm(): void {
    this.isEditingSession = false;
    this.editingSessionId = null;
    this.showSessionForm = true;
    this.sessionFormError = '';
    this.sessionFormSuccess = '';
    this.resetSessionFormFields();
  }
  
  closeSessionForm(): void {
    this.showSessionForm = false;
    this.isEditingSession = false;
    this.editingSessionId = null;
    this.sessionFormError = '';
    this.sessionFormSuccess = '';
    this.resetSessionFormFields();
  }
  
  submitSessionForm(): void {

    // if (this.sessionForm.invalid) {
    //   this.markFormGroupTouched(this.sessionForm);
    //   this.sessionFormError = 'Please fill in all required fields correctly.';
    //   return;
    // }
    this.isSubmittingSession = true;
    this.sessionFormError = '';
    this.sessionFormSuccess = '';
    
    const formValue = this.sessionForm.value;
    const topicsArray = (formValue.topics || []).map((t: any) => t.topic).filter((t: string) => t);
    const sessionData: CreateSessionRequest = {
      course: formValue.course,
      sessionDate: formValue.sessionDate,
      endDate: formValue.endDate || undefined,
      sessionTime: formValue.sessionTime,
      duration: Number(formValue.duration),
      maxStudents: Number(formValue.maxStudents),
      sessionType: formValue.sessionType,
      meetingLink: formValue.meetingLink || '',
      description: formValue.description || '',
      topics: topicsArray,
      totalSessions: Number(formValue.totalSessions) || 1,
      modeOfClass: formValue.modeOfClass || 'online'
    };
    
    if (this.isEditingSession && this.editingSessionId) {
      this.sessionsService.updateSession(this.editingSessionId, sessionData).subscribe({
        next: (session: Session) => {
          this.isSubmittingSession = false;
          this.sessionFormSuccess = 'Session updated successfully!';
          this.replaceSessionInList(session);
          setTimeout(() => {
            this.closeSessionForm();
            this.sessionFormSuccess = '';
          }, 1500);
        },
        error: (error) => {
          this.isSubmittingSession = false;
          this.sessionFormError = error.error?.message || error.message || 'Failed to update session. Please try again.';
          console.error('Error updating session:', error);
        }
      });
      return;
    }
    
    this.sessionsService.createSession(sessionData).subscribe({
      next: (session: Session) => {
        this.isSubmittingSession = false;
        this.sessionFormSuccess = 'Session scheduled successfully!';
        this.upcomingSessions.unshift(this.mapSessionToView(session));
        setTimeout(() => {
          this.closeSessionForm();
          this.sessionFormSuccess = '';
        }, 1500);
      },
      error: (error) => {
        this.isSubmittingSession = false;
        this.sessionFormError = error.error?.message || error.message || 'Failed to schedule session. Please try again.';
        console.error('Error scheduling session:', error);
      }
    });
  }
  
  startEditSession(session: any): void {
    if (!session) {
      return;
    }
    this.isEditingSession = true;
    this.editingSessionId = session.id;
    this.showSessionForm = true;
    this.sessionFormError = '';
    this.sessionFormSuccess = '';
    
    this.sessionForm.patchValue({
      course: session.courseTitle || session.course,
      sessionType: session.sessionType,
      sessionDate: session.dateInputValue || this.formatDateForInput(session.sessionDate),
      endDate: session.endDateInputValue || (session.endDate ? this.formatDateForInput(session.endDate) : ''),
      sessionTime: session.sessionTime || session.time,
      duration: session.durationHours,
      maxStudents: session.maxStudents,
      meetingLink: session.meetingLink || '',
      description: session.description || '',
      totalSessions: session.totalSessions || 1,
      modeOfClass: session.modeOfClass || 'online'
    });
    
    this.populateTopics(session.topics || []);
  }
  
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          } else {
            arrayControl.markAsTouched();
          }
        });
      }
    });
  }
  
  getMyCourses(): string[] {
    return this.myCourses.map(course => course.title);
  }
  
  getSessionTypes(): string[] {
    return ['live', 'recorded', 'hybrid'];
  }
  
  getModeOfClassOptions(): string[] {
    return ['online', 'offline', 'both'];
  }
  
  getDurationOptions(): number[] {
    return [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8];
  }
  
  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
