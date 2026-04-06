import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService, AdminStats, UserManagement, CourseData, OrderData, PaymentData, AdminUser, SupportTicket, TrendingCourse } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  // Dashboard State
  public activeSection: string = 'overview';
  public sidebarCollapsed: boolean = false;
  public showUserDropdown: boolean = false;
  public isLoading: boolean = false;

  // Admin Profile
  public adminProfile: AdminUser | null = null;

  // Dashboard Stats
  public stats: AdminStats = {
    totalUsers: 0,
    activeUsers: 0,
    totalStudents: 0,
    activeStudents: 0,
    totalTrainers: 0,
    activeTrainers: 0,
    totalInstitutions: 0,
    activeInstitutions: 0,
    totalCourses: 0,
    activeCourses: 0,
    totalEnrollments: 0,
    activeEnrollments: 0,
    totalOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingVerifications: 0,
    growthRate: 0,
    conversionRate: 0
  };

  // User Management
  public userManagement: UserManagement = {
    students: [],
    trainers: [],
    institutions: []
  };
  public activeUserTab: string = 'students'; // 'students', 'trainers', 'mentors', 'institutions'

  // Courses
  public courses: CourseData[] = [];
  public allCourses: CourseData[] = [];
  public selectedCourse: any = null;
  public showCourseDetails: boolean = false;
  public showCourseEdit: boolean = false;
  public editCourseForm: any = {};
  public editCourseType: string = '';
  public isSavingCourse: boolean = false;
  public isUpdatingTrendingCourseId: string | null = null;
  public trendingCourses: TrendingCourse[] = [];

  // Orders
  public orders: OrderData[] = [];
  public allOrders: OrderData[] = [];

  // Payments
  public payments: PaymentData[] = [];
  public allPayments: PaymentData[] = [];
  public selectedPayment: any = null;
  public showPaymentDetails: boolean = false;

  // Support Tickets
  public supportTickets: SupportTicket[] = [];
  public allSupportTickets: SupportTicket[] = [];
  public selectedSupportTicket: SupportTicket | null = null;
  public showSupportDetails: boolean = false;
  public supportPriorityFilter: string = 'all';
  public supportResolution: string = '';
  public supportStatusUpdate: string = 'Resolved';
  public isSavingSupportTicket: boolean = false;

  // Institutes
  public institutions: any[] = [];
  public allInstitutions: any[] = [];
  public selectedInstitution: any = null;
  public institutionStats: any = null;
  public institutionCourses: any[] = [];
  public institutionStudents: any[] = [];
  public showInstitutionDetails: boolean = false;
  public activeInstitutionTab: string = 'overview'; // 'overview', 'courses', 'students'
  public showInstitutionEdit: boolean = false;
  public editInstitutionForm: any = {};
  public isSavingInstitution: boolean = false;

  // User Details Modal
  public selectedUser: any = null;
  public showUserDetails: boolean = false;
  public userDetailType: string = ''; // 'student', 'trainer', 'institution'

  // User Edit Modal
  public showUserEdit: boolean = false;
  public editUserType: string = '';
  public editUserForm: any = {};
  public isSavingUser: boolean = false;

  // Filters
  public searchTerm: string = '';
  public selectedCategory: string = 'all';
  public selectedStatus: string = 'all';
  public selectedDateRange: string = 'all';

  // Pagination
  public currentPage: number = 1;
  public itemsPerPage: number = 10;

  // User Dropdown
  public showDropdown: boolean = false;
  public showNotificationDropdown: boolean = false;

  // Chart Data (sample data for charts)
  public chartData = {
    revenue: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [12000, 19000, 15000, 25000, 22000, 30000]
    },
    users: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [100, 150, 180, 220, 250, 300]
    }
  };

  // Notifications
  public notifications = [
    { id: 1, message: 'New course verification pending', type: 'warning', time: '5 min ago' },
    { id: 2, message: 'New trainer registration', type: 'info', time: '1 hour ago' },
    { id: 3, message: 'Payment received', type: 'success', time: '2 hours ago' }
  ];

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check authentication
    if (!this.adminService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { role: 'admin' } });
      return;
    }

    // Load admin profile
    this.loadAdminProfile();
    this.loadDashboardData();
  }

  loadAdminProfile(): void {
    const admin = this.adminService.getAdminUser();
    if (admin) {
      this.adminProfile = admin;
    } else {
      this.adminService.getProfile().subscribe({
        next: (profile) => {
          this.adminProfile = profile;
        },
        error: () => {
          this.router.navigate(['/login'], { queryParams: { role: 'admin' } });
        }
      });
    }
  }

  loadDashboardData(): void {
    this.loadStats();
    if (this.activeSection === 'users' || this.activeSection === 'overview') {
      this.loadUsers();
    } else if (this.activeSection === 'courses') {
      this.loadCourses();
    } else if (this.activeSection === 'trending') {
      this.loadTrendingCourses();
    } else if (this.activeSection === 'orders') {
      this.loadOrders();
    } else if (this.activeSection === 'payments') {
      this.loadPayments();
    } else if (this.activeSection === 'support') {
      this.loadSupportTickets();
    } else if (this.activeSection === 'institutes') {
      this.loadInstitutions();
    }
  }

  loadStats(): void {
    this.isLoading = true;
    this.adminService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.isLoading = false;
      }
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    const params: any = {
      page: this.currentPage,
      limit: this.itemsPerPage
    };
    
    // Pass the active tab as type parameter to filter users
    if (this.activeUserTab && this.activeUserTab !== 'all') {
      params.type = this.activeUserTab;
    }
    
    if (this.selectedStatus !== 'all') {
      params.status = this.selectedStatus;
    }
    
    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    this.adminService.getAllUsers(params).subscribe({
      next: (response) => {
        this.userManagement = response.users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
  }

  getRecentUsers(): any[] {
    const allUsers = [
      ...(this.userManagement.students || []).map(u => ({...u, _role: 'Student'})),
      ...(this.userManagement.trainers || []).map(u => ({...u, _role: 'Trainer'})),
      ...(this.userManagement.institutions || []).map(u => ({...u, _role: 'Institution'}))
    ];
    return allUsers.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    }).slice(0, 5);
  }

  // Set active user tab
  setActiveUserTab(tab: string): void {
    this.activeUserTab = tab;
    this.currentPage = 1;
    this.loadUsers();
  }

  loadCourses(): void {
    this.isLoading = true;
    const params: any = {
      page: this.currentPage,
      limit: this.itemsPerPage
    };
    
    if (this.selectedStatus !== 'all') {
      params.status = this.selectedStatus;
    }
    
    if (this.selectedCategory !== 'all') {
      params.category = this.selectedCategory;
    }
    
    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    this.adminService.getAllCourses(params).subscribe({
      next: (response) => {
        const trainerCourses = (response.courses.trainerCourses || []).map((c: any) => ({
          id: c._id,
          title: c.title,
          category: c.category,
          status: c.publishStatus || (c.isActive ? 'active' : 'inactive'),
          enrollments: c.totalEnrollments || 0,
          revenue: 0, // Calculate from enrollments if needed
          rating: c.rating || 0,
          createdAt: c.createdAt,
          type: 'trainer',
          isFeatured: c.isFeatured ?? false
        }));
        
        const institutionCourses = (response.courses.institutionCourses || []).map((c: any) => ({
          id: c._id,
          title: c.title,
          category: c.category,
          status: c.isActive ? 'active' : 'inactive',
          enrollments: c.students || 0,
          revenue: 0,
          rating: c.rating || 0,
          createdAt: c.createdAt,
          type: 'institution',
          isFeatured: c.isFeatured ?? false
        }));
        
        this.allCourses = [...trainerCourses, ...institutionCourses];
        this.courses = [...this.allCourses];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.isLoading = false;
      }
    });
  }

  loadTrendingCourses(): void {
    this.isLoading = true;
    const params: any = {
      limit: 50
    };

    if (this.selectedCategory !== 'all') {
      params.category = this.selectedCategory;
    }

    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    this.adminService.getTrendingCourses(params).subscribe({
      next: (response) => {
        const rawCourses = response.courses || [];
        const normalized = rawCourses.map((course: any) => ({
          ...course,
          id: course.id || course.courseId,
          type: course.type || course.source || 'trainer',
          status: course.publishStatus || (course.isActive ? 'active' : 'inactive')
        }));

        const filtered = this.selectedStatus !== 'all'
          ? normalized.filter((course: any) => course.status === this.selectedStatus)
          : normalized;

        this.trendingCourses = filtered;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading trending courses:', error);
        this.trendingCourses = [];
        this.isLoading = false;
      }
    });
  }

  loadOrders(): void {
    this.isLoading = true;
    const params: any = {
      page: this.currentPage,
      limit: this.itemsPerPage
    };
    
    if (this.selectedStatus !== 'all') {
      params.status = this.selectedStatus;
    }
    
    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    this.adminService.getAllOrders(params).subscribe({
      next: (response) => {
        this.allOrders = (response.orders || []).map((o: any) => ({
          id: o._id,
          userId: o.userId?._id || o.userId,
          userName: o.userId?.name || 'Unknown',
          course: o.courseName || 'N/A',
          amount: o.totalAmount || 0,
          status: o.status,
          date: o.createdAt
        }));
        this.orders = [...this.allOrders];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
      }
    });
  }

  loadPayments(): void {
    this.isLoading = true;
    const params: any = {
      page: this.currentPage,
      limit: this.itemsPerPage
    };
    
    if (this.selectedStatus !== 'all') {
      params.status = this.selectedStatus;
    }
    
    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    this.adminService.getAllPayments(params).subscribe({
      next: (response) => {
        this.allPayments = (response.payments || []).map((p: any) => ({
          id: p._id,
          userId: p.studentId?._id || p.studentId,
          userName: p.studentId?.name || 'Unknown',
          amount: p.amountPaid || 0,
          method: p.paymentMethod || 'N/A',
          status: p.paymentStatus,
          date: p.enrollmentDate
        }));
        this.payments = [...this.allPayments];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.isLoading = false;
      }
    });
  }

  loadSupportTickets(): void {
    this.isLoading = true;
    const params: any = {
      page: this.currentPage,
      limit: this.itemsPerPage
    };

    if (this.selectedStatus !== 'all') {
      params.status = this.selectedStatus;
    }

    if (this.selectedCategory !== 'all') {
      params.category = this.selectedCategory;
    }

    if (this.supportPriorityFilter !== 'all') {
      params.priority = this.supportPriorityFilter;
    }

    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    this.adminService.getSupportTickets(params).subscribe({
      next: (response) => {
        this.allSupportTickets = response.tickets || [];
        this.supportTickets = [...this.allSupportTickets];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading support tickets:', error);
        this.isLoading = false;
      }
    });
  }

  // Section Navigation
  setActiveSection(section: string): void {
    this.activeSection = section;
    this.currentPage = 1;
    this.showInstitutionDetails = false;
    this.selectedInstitution = null;
    // Reset user tab when switching to users section
    if (section === 'users') {
      this.activeUserTab = 'students';
    }
    if (section === 'trending') {
      this.searchTerm = '';
      this.selectedCategory = 'all';
      this.selectedStatus = 'all';
    }
    if (section === 'support') {
      this.selectedStatus = 'all';
      this.selectedCategory = 'all';
      this.supportPriorityFilter = 'all';
      this.searchTerm = '';
    }
    this.loadDashboardData();
  }

  // Search and Filter
  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    // Apply filters based on active section
    switch (this.activeSection) {
      case 'users':
        this.loadUsers();
        break;
      case 'courses':
        this.filterCourses();
        break;
      case 'trending':
        this.loadTrendingCourses();
        break;
      case 'orders':
        this.filterOrders();
        break;
      case 'payments':
        this.filterPayments();
        break;
      case 'support':
        this.loadSupportTickets();
        break;
      case 'institutes':
        this.loadInstitutions();
        break;
    }
  }

  filterCourses(): void {
    let filtered = [...this.allCourses];

    if (this.searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === this.selectedCategory);
    }

    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(course => course.status === this.selectedStatus);
    }

    this.courses = filtered;
  }

  filterOrders(): void {
    let filtered = [...this.allOrders];

    if (this.searchTerm) {
      filtered = filtered.filter(order =>
        order.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.course.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === this.selectedStatus);
    }

    this.orders = filtered;
  }

  filterPayments(): void {
    let filtered = [...this.allPayments];

    if (this.searchTerm) {
      filtered = filtered.filter(payment =>
        payment.userName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(payment => payment.status === this.selectedStatus);
    }

    this.payments = filtered;
  }

  // User Management Actions
  verifyUser(userId: string, type: string, status: string): void {
    this.adminService.verifyUser(userId, type, status).subscribe({
      next: () => {
        alert('User verification status updated successfully');
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error verifying user:', err);
        alert('Error updating verification status');
      }
    });
  }

  updateUserStatus(userId: string, type: string, status: string): void {
    this.adminService.updateUserStatus(userId, type, status).subscribe({
      next: () => {
        alert('User status updated successfully');
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error updating user status:', err);
        alert('Error updating user status');
      }
    });
  }

  deleteUser(userId: string, type: string): void {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.adminService.deleteUser(userId, type).subscribe({
        next: () => {
          alert('User deleted successfully');
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Error deleting user');
        }
      });
    }
  }

  // Course Actions
  approveCourse(courseId: string, type: string): void {
    this.adminService.updateCourseStatus(courseId, type, 'public').subscribe({
      next: () => {
        alert('Course approved successfully');
        this.loadCourses();
      },
      error: (err) => {
        console.error('Error approving course:', err);
        alert('Error approving course');
      }
    });
  }

  rejectCourse(courseId: string, type: string): void {
    const reason = prompt('Enter reason for rejection:');
    if (reason) {
      this.adminService.updateCourseStatus(courseId, type, 'rejected').subscribe({
        next: () => {
          alert('Course rejected successfully');
          this.loadCourses();
        },
        error: (err) => {
          console.error('Error rejecting course:', err);
          alert('Error rejecting course');
        }
      });
    }
  }

  deleteCourse(courseId: string, type: string): void {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      this.adminService.deleteCourse(courseId, type).subscribe({
        next: () => {
          alert('Course deleted successfully');
          this.loadCourses();
        },
        error: (err) => {
          console.error('Error deleting course:', err);
          alert('Error deleting course');
        }
      });
    }
  }

  // Update Course Status (generic method for activate/deactivate)
  updateCourseStatus(courseId: string, type: string, status: string): void {
    this.adminService.updateCourseStatus(courseId, type, status).subscribe({
      next: () => {
        alert('Course status updated successfully');
        if (this.activeSection === 'courses') {
          this.loadCourses();
        } else if (this.activeSection === 'institutes' && this.showInstitutionDetails) {
          this.loadInstitutionCourses();
        }
      },
      error: (err) => {
        console.error('Error updating course status:', err);
        alert('Error updating course status');
      }
    });
  }

  setCourseTrending(course: any, isFeatured: boolean): void {
    const courseId = this.getCourseId(course);
    const courseType = this.getCourseType(course);
    if (!courseId || !courseType || this.isUpdatingTrendingCourseId) {
      return;
    }
    this.isUpdatingTrendingCourseId = courseId;
    this.adminService.updateCourseDetails(courseType, courseId, { isFeatured }).subscribe({
      next: () => {
        course.isFeatured = isFeatured;
        this.isUpdatingTrendingCourseId = null;
        if (this.activeSection === 'trending') {
          this.loadTrendingCourses();
        }
      },
      error: (err) => {
        console.error('Error updating trending status:', err);
        this.isUpdatingTrendingCourseId = null;
        alert('Error updating trending status');
      }
    });
  }

  canToggleTrending(course: any): boolean {
    const type = this.getCourseType(course);
    return type === 'trainer' || type === 'institution';
  }

  private getCourseId(course: any): string | null {
    return course?.id || course?.courseId || null;
  }

  private getCourseType(course: any): string | null {
    return course?.type || course?.source || null;
  }

  // User Dropdown
  toggleUserDropdown(): void {
    this.showDropdown = !this.showDropdown;
    this.showNotificationDropdown = false; // Close notification dropdown when opening user dropdown
  }

  toggleNotificationDropdown(): void {
    this.showNotificationDropdown = !this.showNotificationDropdown;
    this.showDropdown = false; // Close user dropdown when opening notification dropdown
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown')) {
      this.showDropdown = false;
    }
    if (!target.closest('.notifications-icon') && !target.closest('.notification-dropdown')) {
      this.showNotificationDropdown = false;
    }
  }

  onLogout(): void {
    this.adminService.logout();
    this.router.navigate(['/login'], { queryParams: { role: 'admin' } });
  }

  // Export Functions
  exportData(): void {
    // Implement export logic
    console.log('Exporting data...');
  }

  // Clear Filters
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.selectedStatus = 'all';
    this.selectedDateRange = 'all';
    this.applyFilters();
  }

  // Utility Functions
  getStatusClass(status: string): string {
    const normalized = (status || '').toString().toLowerCase().replace(/\s+/g, '-');
    const statusClasses: any = {
      'active': 'status-active',
      'pending': 'status-pending',
      'completed': 'status-completed',
      'rejected': 'status-rejected',
      'inactive': 'status-inactive',
      'verified': 'status-verified',
      'open': 'status-open',
      'in-progress': 'status-in-progress',
      'resolved': 'status-resolved',
      'closed': 'status-closed',
      'success': 'status-completed',
      'paid': 'status-completed',
      'failed': 'status-rejected'
    };
    return statusClasses[normalized] || '';
  }

  formatCurrency(amount: number): string {
    return `₹${amount.toLocaleString('en-IN')}`;
  }

  formatDate(date: string | Date | null | undefined): string {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-IN');
    } catch (e) {
      return 'Invalid Date';
    }
  }

  getPriorityClass(priority: string): string {
    const normalized = (priority || '').toString().toLowerCase();
    const map: any = {
      urgent: 'badge-danger',
      high: 'badge-warning',
      medium: 'badge-info',
      low: 'badge-success'
    };
    return map[normalized] || 'badge-info';
  }

  getPageTitle(): string {
    const titles: any = {
      'overview': 'Overview',
      'users': 'User Management',
      'courses': 'Course Management',
      'trending': 'Trending Courses',
      'institutes': 'Institute Management',
      'orders': 'Order Management',
      'payments': 'Payment Management',
      'support': 'Help & Support',
      'analytics': 'Analytics & Reports',
      'notifications': 'Notifications',
      'settings': 'Settings'
    };
    return titles[this.activeSection] || 'Admin Dashboard';
  }

  // ========== INSTITUTE MANAGEMENT METHODS ==========

  loadInstitutions(): void {
    this.isLoading = true;
    const params: any = {
      page: this.currentPage,
      limit: this.itemsPerPage
    };
    
    if (this.selectedStatus !== 'all') {
      params.status = this.selectedStatus;
    }
    
    if (this.selectedCategory !== 'all') {
      params.verificationStatus = this.selectedCategory;
    }
    
    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    this.adminService.getAllInstitutions(params).subscribe({
      next: (response) => {
        this.allInstitutions = response.institutions || [];
        this.institutions = [...this.allInstitutions];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading institutions:', error);
        this.isLoading = false;
      }
    });
  }

  viewInstitutionDetails(institution: any): void {
    this.selectedInstitution = institution;
    this.showInstitutionDetails = true;
    this.activeInstitutionTab = 'overview';
    this.loadInstitutionDetails();
  }

  openEditInstitution(institution: any): void {
    this.editInstitutionForm = {
      id: institution.id || institution._id,
      name: institution.name || '',
      email: institution.email || '',
      phone: institution.phone || '',
      website: institution.website || '',
      address: institution.address || '',
      city: institution.city || '',
      state: institution.state || '',
      country: institution.country || '',
      bio: institution.bio || '',
      logo: institution.logo || '',
      verificationStatus: institution.verificationStatus || 'pending',
      isActive: Boolean(institution.isActive)
    };
    this.showInstitutionEdit = true;
  }

  closeInstitutionEdit(): void {
    this.showInstitutionEdit = false;
    this.editInstitutionForm = {};
  }

  saveInstitutionEdits(): void {
    if (!this.editInstitutionForm?.id) {
      return;
    }

    this.isSavingInstitution = true;
    const payload = this.buildInstitutionUpdatePayload(this.editInstitutionForm);

    this.adminService.updateInstitutionDetails(this.editInstitutionForm.id, payload).subscribe({
      next: (response) => {
        this.isSavingInstitution = false;
        this.closeInstitutionEdit();
        this.loadInstitutions();

        if (this.selectedInstitution && (this.selectedInstitution.id === this.editInstitutionForm.id || this.selectedInstitution._id === this.editInstitutionForm.id)) {
          this.selectedInstitution = response.data || response.institution || this.selectedInstitution;
          this.loadInstitutionDetails();
        }
      },
      error: (err) => {
        console.error('Error updating institution:', err);
        this.isSavingInstitution = false;
        alert('Error updating institution details');
      }
    });
  }

  private buildInstitutionUpdatePayload(form: any): any {
    return {
      name: form.name,
      email: form.email,
      phone: form.phone,
      website: form.website,
      address: form.address,
      city: form.city,
      state: form.state,
      country: form.country,
      bio: form.bio,
      logo: form.logo,
      verificationStatus: form.verificationStatus,
      isActive: form.isActive
    };
  }

  // View User Details
  viewUserDetails(user: any, type: string): void {
    this.selectedUser = user;
    this.userDetailType = type;
    this.showUserDetails = true;
  }

  // Close User Details Modal
  closeUserDetails(): void {
    this.showUserDetails = false;
    this.selectedUser = null;
    this.userDetailType = '';
  }

  // Open User Edit Modal
  openEditUser(user: any, type: string): void {
    this.editUserType = type;
    this.editUserForm = {
      id: user._id || user.id,
      name: user.name || user.studentName || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || '',
      city: user.city || '',
      country: user.country || '',
      isActive: Boolean(user.isActive),
      verificationStatus: user.verificationStatus || 'pending',
      title: user.title || '',
      specialization: user.specialization || '',
      location: user.location || '',
      experienceYears: user.experienceYears ?? 0,
      website: user.website || '',
      address: user.address || '',
      state: user.state || ''
    };
    this.showUserEdit = true;
  }

  // Close User Edit Modal
  closeUserEdit(): void {
    this.showUserEdit = false;
    this.editUserType = '';
    this.editUserForm = {};
  }

  // Save User Edits
  saveUserEdits(): void {
    if (!this.editUserForm?.id || !this.editUserType) {
      return;
    }

    this.isSavingUser = true;
    const payload = this.buildUserUpdatePayload(this.editUserType, this.editUserForm);

    this.adminService.updateUserDetails(this.editUserType, this.editUserForm.id, payload).subscribe({
      next: () => {
        this.isSavingUser = false;
        this.closeUserEdit();
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.isSavingUser = false;
        alert('Error updating user details');
      }
    });
  }

  private buildUserUpdatePayload(type: string, form: any): any {
    const basePayload: any = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      bio: form.bio,
      city: form.city,
      country: form.country,
      isActive: form.isActive
    };

    if (type === 'trainer') {
      return {
        ...basePayload,
        title: form.title,
        specialization: form.specialization,
        location: form.location,
        experienceYears: Number(form.experienceYears || 0),
        verificationStatus: form.verificationStatus
      };
    }

    if (type === 'institution') {
      return {
        ...basePayload,
        website: form.website,
        address: form.address,
        state: form.state,
        verificationStatus: form.verificationStatus
      };
    }

    return basePayload;
  }

  // View Course Details
  viewCourseDetails(course: any): void {
    this.selectedCourse = course;
    this.showCourseDetails = true;
  }

  // Close Course Details Modal
  closeCourseDetails(): void {
    this.showCourseDetails = false;
    this.selectedCourse = null;
  }

  openEditCourse(course: any): void {
    this.editCourseType = course.type || 'trainer';
    this.editCourseForm = {
      id: course.id,
      title: course.title || '',
      category: course.category || '',
      level: course.level || '',
      price: course.price ?? 0,
      description: course.description || '',
      subtitle: course.subtitle || '',
      language: course.language || 'English',
      durationHours: course.durationHours ?? course.duration ?? 0,
      status: course.status || 'draft',
      isActive: course.isActive ?? (course.status === 'active')
    };
    this.showCourseEdit = true;
  }

  closeCourseEdit(): void {
    this.showCourseEdit = false;
    this.editCourseType = '';
    this.editCourseForm = {};
  }

  saveCourseEdits(): void {
    if (!this.editCourseForm?.id || !this.editCourseType) {
      return;
    }

    this.isSavingCourse = true;
    const payload = this.buildCourseUpdatePayload(this.editCourseType, this.editCourseForm);

    this.adminService.updateCourseDetails(this.editCourseType, this.editCourseForm.id, payload).subscribe({
      next: () => {
        this.isSavingCourse = false;
        this.closeCourseEdit();
        this.loadCourses();
      },
      error: (err) => {
        console.error('Error updating course:', err);
        this.isSavingCourse = false;
        alert('Error updating course details');
      }
    });
  }

  private buildCourseUpdatePayload(type: string, form: any): any {
    if (type === 'trainer') {
      const publishStatus = form.status;
      return {
        title: form.title,
        subtitle: form.subtitle,
        category: form.category,
        level: form.level,
        language: form.language,
        price: Number(form.price || 0),
        description: form.description,
        durationHours: Number(form.durationHours || 0),
        publishStatus,
        isActive: publishStatus === 'public'
      };
    }

    return {
      title: form.title,
      category: form.category,
      level: form.level,
      price: Number(form.price || 0),
      description: form.description,
      duration: Number(form.durationHours || 0),
      isActive: form.status === 'active'
    };
  }

  // View Payment Details
  viewPaymentDetails(payment: any): void {
    this.selectedPayment = payment;
    this.showPaymentDetails = true;
  }

  // Close Payment Details Modal
  closePaymentDetails(): void {
    this.showPaymentDetails = false;
    this.selectedPayment = null;
  }

  // ========== SUPPORT TICKET METHODS ==========

  viewSupportTicket(ticket: SupportTicket): void {
    if (!ticket?.id) {
      return;
    }
    this.showSupportDetails = true;
    this.selectedSupportTicket = null;
    this.supportResolution = '';
    this.supportStatusUpdate = ticket.status || 'Resolved';

    this.adminService.getSupportTicketById(ticket.id).subscribe({
      next: (response) => {
        this.selectedSupportTicket = response;
        this.supportResolution = response.resolution || '';
        this.supportStatusUpdate = response.status || 'Resolved';
      },
      error: (error) => {
        console.error('Error loading support ticket:', error);
        this.showSupportDetails = false;
      }
    });
  }

  closeSupportTicketDetails(): void {
    this.showSupportDetails = false;
    this.selectedSupportTicket = null;
    this.supportResolution = '';
    this.supportStatusUpdate = 'Resolved';
  }

  resolveSupportTicket(): void {
    if (!this.selectedSupportTicket?.id || this.isSavingSupportTicket) {
      return;
    }

    this.isSavingSupportTicket = true;
    const payload = {
      resolution: this.supportResolution,
      status: this.supportStatusUpdate
    };

    this.adminService.resolveSupportTicket(this.selectedSupportTicket.id, payload).subscribe({
      next: () => {
        this.isSavingSupportTicket = false;
        this.closeSupportTicketDetails();
        this.loadSupportTickets();
      },
      error: (error) => {
        console.error('Error resolving support ticket:', error);
        this.isSavingSupportTicket = false;
        alert('Error updating support ticket');
      }
    });
  }

  loadInstitutionDetails(): void {
    if (!this.selectedInstitution || !this.selectedInstitution.id) return;

    this.isLoading = true;
    const institutionId = this.selectedInstitution.id || this.selectedInstitution._id;

    // Load institution details, stats, courses, and students
    this.adminService.getInstitutionById(institutionId).subscribe({
      next: (response) => {
        this.selectedInstitution = response.institution;
        this.institutionStats = response.stats;
        this.institutionCourses = response.courses || [];
        this.institutionStudents = response.enrollments || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading institution details:', error);
        this.isLoading = false;
      }
    });
  }

  loadInstitutionCourses(): void {
    if (!this.selectedInstitution) return;

    this.isLoading = true;
    const institutionId = this.selectedInstitution.id || this.selectedInstitution._id;
    const params: any = {
      page: this.currentPage,
      limit: this.itemsPerPage
    };

    if (this.selectedStatus !== 'all') {
      params.status = this.selectedStatus;
    }

    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    this.adminService.getInstitutionCourses(institutionId, params).subscribe({
      next: (response) => {
        this.institutionCourses = response.courses || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading institution courses:', error);
        this.isLoading = false;
      }
    });
  }

  loadInstitutionStudents(): void {
    if (!this.selectedInstitution) return;

    this.isLoading = true;
    const institutionId = this.selectedInstitution.id || this.selectedInstitution._id;
    const params: any = {
      page: this.currentPage,
      limit: this.itemsPerPage
    };

    if (this.selectedStatus !== 'all') {
      params.status = this.selectedStatus;
    }

    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    this.adminService.getInstitutionStudents(institutionId, params).subscribe({
      next: (response) => {
        this.institutionStudents = response.students || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading institution students:', error);
        this.isLoading = false;
      }
    });
  }

  setInstitutionTab(tab: string): void {
    this.activeInstitutionTab = tab;
    if (tab === 'courses') {
      this.loadInstitutionCourses();
    } else if (tab === 'students') {
      this.loadInstitutionStudents();
    }
  }

  updateInstitutionStatus(institutionId: string, status: string): void {
    this.adminService.updateInstitutionStatus(institutionId, status).subscribe({
      next: () => {
        alert('Institution status updated successfully');
        this.loadInstitutions();
        if (this.selectedInstitution && (this.selectedInstitution.id === institutionId || this.selectedInstitution._id === institutionId)) {
          this.loadInstitutionDetails();
        }
      },
      error: (err) => {
        console.error('Error updating institution status:', err);
        alert('Error updating institution status');
      }
    });
  }

  deleteInstitution(institutionId: string): void {
    if (confirm('Are you sure you want to delete this institution? This action cannot be undone and will delete all associated courses and data.')) {
      this.adminService.deleteInstitution(institutionId).subscribe({
        next: () => {
          alert('Institution deleted successfully');
          this.showInstitutionDetails = false;
          this.selectedInstitution = null;
          this.loadInstitutions();
        },
        error: (err) => {
          console.error('Error deleting institution:', err);
          alert('Error deleting institution');
        }
      });
    }
  }

  backToInstitutionsList(): void {
    this.showInstitutionDetails = false;
    this.selectedInstitution = null;
    this.activeInstitutionTab = 'overview';
  }
}

