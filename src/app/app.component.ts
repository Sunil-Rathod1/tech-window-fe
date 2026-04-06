import { Component, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { Router, NavigationExtras, NavigationEnd } from '@angular/router';
import { AuthService, User } from './services/auth.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthPopupComponent, AuthMode } from './components/auth-popup/auth-popup.component';
import { UserTypePopupComponent, UserType } from './components/user-type-popup/user-type-popup.component';
import { CoursesService } from './services/courses.service';
import { TrainersService } from './services/trainers.service';
import { InstitutesService } from './services/institutes.service';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'techwindows';
  currentUser: User | null = null;
  private userSubscription: Subscription | undefined;
  private routerSubscription: Subscription | undefined;
  public currentRoute: string = '';
  
  // Auth popup state
  showAuthPopup = false;
  authMode: AuthMode = 'signin';
  
  // User type popup state
  showUserTypePopup = false;
  userTypePopupMode: 'signin' | 'signup' = 'signup';

  isUserMenuOpen = false;

  // Search functionality
  public searchQuery: string = '';
  public filteredCourses: any[] = [];
  public filteredTrainers: any[] = [];
  public filteredInstitutes: any[] = [];
  public showSearchDropdown: boolean = false;
  private allCoursesList: any[] = [];
  private allTrainersList: any[] = [];
  private allInstitutesList: any[] = [];
  
  // Course popup state
  public showCoursePopup: boolean = false;
  public selectedCourse: any = null;
  public popupInstitutes: any[] = [];
  public popupTrainers: any[] = [];
  public popupMentors: any[] = [];
  public isLoadingPopupData: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private elementRef: ElementRef,
    private coursesService: CoursesService,
    private trainersService: TrainersService,
    private institutesService: InstitutesService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Clean up invalid tokens on app startup
    this.cleanupInvalidTokens();
    
    this.userSubscription = this.authService.currentUser$.subscribe(
      user => {
        this.currentUser = user;
      }
    );
    this.currentRoute = this.router.url || '';
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentRoute = (event as NavigationEnd).urlAfterRedirects || '';
      });
    // Load data for search
    this.loadSearchData();
  }

  // Load data for search functionality
  loadSearchData(): void {
    // Load courses from all-courses API
    this.apiService.get<any[]>('/all-courses').subscribe({
      next: (response: any) => {
        // Handle different response formats
        if (Array.isArray(response)) {
          this.allCoursesList = response;
        } else if (response?.data && Array.isArray(response.data)) {
          this.allCoursesList = response.data;
        } else if (response?.courses && Array.isArray(response.courses)) {
          this.allCoursesList = response.courses;
        } else if (response?.success && response?.data) {
          this.allCoursesList = Array.isArray(response.data) ? response.data : [];
        } else {
          this.allCoursesList = [];
        }
        console.log('Loaded courses for search:', this.allCoursesList.length);
      },
      error: (error) => {
        console.error('Error loading courses for search:', error);
        this.allCoursesList = [];
      }
    });

    // Load trainers
    this.trainersService.getTrainers().subscribe({
      next: (response: any) => {
        this.allTrainersList = Array.isArray(response) ? response : (response?.data || response?.trainers || []);
      },
      error: (error) => {
        console.error('Error loading trainers for search:', error);
      }
    });

    // Load institutes
    this.institutesService.getInstitutes().subscribe({
      next: (response: any) => {
        this.allInstitutesList = Array.isArray(response) ? response : (response?.data || response?.institutes || []);
      },
      error: (error) => {
        console.error('Error loading institutes for search:', error);
      }
    });
  }

  // Search functionality methods
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    
    // Debounce search for better performance
    if (this.searchQuery.trim().length > 0) {
      this.updateSearchResults();
      this.showSearchDropdown = true;
    } else {
      this.filteredCourses = [];
      this.filteredTrainers = [];
      this.filteredInstitutes = [];
      this.showSearchDropdown = false;
    }
  }

  onSearchFocus(): void {
    if (this.searchQuery.trim()) {
      this.updateSearchResults();
    }
    // Show dropdown if there are results
    if (this.filteredCourses.length > 0 || this.filteredTrainers.length > 0 || this.filteredInstitutes.length > 0) {
      this.showSearchDropdown = true;
    }
  }

  onSearchBlur(): void {
    // Delay hiding to allow clicking on results
    // setTimeout(() => {
    //   this.showSearchDropdown = false;
    // }, 200);
  }

  navigateToInstitutes(){
    this.showSearchDropdown = false;
    this.showCoursePopup=false;
    this.router.navigate(['/Course-institutes'], {
      queryParams: {
        courseName: this.selectedCourse.title
      }
    });
  }
  navigateToTrainers(){
    this.showSearchDropdown = false;
    this.showCoursePopup=false;
    this.router.navigate(['/Course-trainers'], {
      queryParams: {
        courseName: this.selectedCourse.title
      }
    });
  }
  navigateToMentors(){
    this.showSearchDropdown = false;
    this.showCoursePopup=false;
    this.router.navigate(['/Course-trainers'], {
      queryParams: {
        courseName: this.selectedCourse.title
      }
    });
  }

  onSearchSubmit(): void {
    if (this.searchQuery.trim()) {
      // Navigate to courses page with search query
      this.router.navigate(['/Courses'], {
        queryParams: { search: this.searchQuery }
      });
      this.showSearchDropdown = false;
    }
  }
  gotoCourseDetails(course: any): void {
    this.showSearchDropdown = false;
    this.selectedCourse = course;
    this.showCoursePopup = true;
    this.isLoadingPopupData = true;
    
    // Load related data for the course
    this.loadCourseRelatedData(course);
  }

  loadCourseRelatedData(course: any): void {
    const courseName = course.courseName || course.title || course.courseTitle || '';
    const courseCategory = course.category || '';
    
    // Reset arrays
    this.popupInstitutes = [];
    this.popupTrainers = [];
    this.popupMentors = [];
    
    // Load institutes that offer this course
    this.institutesService.getInstitutes().subscribe({
      next: (response: any) => {
        const institutes = Array.isArray(response) ? response : (response?.data || response?.institutes || []);
        this.popupInstitutes = institutes
          .filter((inst: any) => {
            const instCourses = inst.courses || [];
            return instCourses.some((c: any) => 
              (c.title || c.courseName || '').toLowerCase().includes(courseName.toLowerCase()) ||
              (c.category || '').toLowerCase() === courseCategory.toLowerCase()
            );
          })
          .slice(0, 6); // Limit to 6 institutes
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading institutes:', error);
        this.checkLoadingComplete();
      }
    });
    
    // Load trainers for this course
    this.trainersService.getTrainers().subscribe({
      next: (response: any) => {
        const trainers = Array.isArray(response) ? response : (response?.data || response?.trainers || []);
        this.popupTrainers = trainers
          .filter((trainer: any) => {
            const specialization = String(trainer.specialization || '').toLowerCase();
            const skills = trainer.skills || [];
            const skillNames = skills.map((s: any) => String(s.name || s).toLowerCase()).join(' ');
            
            return specialization.includes(courseCategory.toLowerCase()) ||
                   specialization.includes(courseName.toLowerCase()) ||
                   skillNames.includes(courseName.toLowerCase()) ||
                   skillNames.includes(courseCategory.toLowerCase());
          })
          .slice(0, 6); // Limit to 6 trainers
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading trainers:', error);
        this.checkLoadingComplete();
      }
    });
    
    // Load mentors (using trainers service as mentors might be similar)
    // You can replace this with a mentors service if available
    this.trainersService.getTrainers().subscribe({
      next: (response: any) => {
        const mentors = Array.isArray(response) ? response : (response?.data || response?.mentors || []);
        this.popupMentors = mentors
          .filter((mentor: any) => {
            const specialization = String(mentor.specialization || '').toLowerCase();
            return specialization.includes(courseCategory.toLowerCase()) ||
                   specialization.includes(courseName.toLowerCase());
          })
          .slice(0, 6); // Limit to 6 mentors
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading mentors:', error);
        this.checkLoadingComplete();
      }
    });
  }

  checkLoadingComplete(): void {
    // Simple check - you might want to use a counter for more accurate loading state
    this.isLoadingPopupData = false;
  }

  closeCoursePopup(): void {
    this.showCoursePopup = false;
    this.selectedCourse = null;
    this.popupInstitutes = [];
    this.popupTrainers = [];
    this.popupMentors = [];
  }

  navigateToInstituteFromPopup(institute: any): void {
    this.closeCoursePopup();
    this.navigateToInstitute(institute);
  }

  navigateToTrainerFromPopup(trainer: any): void {
    this.closeCoursePopup();
    this.navigateToTrainer(trainer);
  }

  navigateToMentorFromPopup(mentor: any): void {
    this.closeCoursePopup();
    // Navigate to mentors page or trainer page
    this.router.navigate(['/Mentors'], {
      queryParams: { mentorId: mentor.id || mentor._id }
    });
  }
  updateSearchResults(): void {
    const query = this.searchQuery.toLowerCase().trim();

    if (query.length > 0) {
      // Filter courses - search in multiple fields
      console.log('Searching for: this.allCoursesList ========', this.allCoursesList);
      this.filteredCourses = this.allCoursesList
        .filter((course: any) => {
          // Safely convert to string and handle null/undefined/object values
          const courseName = String(course.courseName || course.title || course.courseTitle || '').toLowerCase();
          const category = String(course.category || '').toLowerCase();
          const description = String(course.description || course.desc || '').toLowerCase();
          
          // Handle instructor - could be string, object, or null
          let instructor = '';
          if (course.instructor) {
            instructor = typeof course.instructor === 'string' 
              ? course.instructor 
              : (course.instructor.name || course.instructor.fullName || '');
          } else if (course.trainerName) {
            instructor = typeof course.trainerName === 'string'
              ? course.trainerName
              : (course.trainerName.name || course.trainerName.fullName || '');
          }
          instructor = String(instructor).toLowerCase();
          
          return courseName.includes(query) || 
                 category.includes(query) || 
                 description.includes(query) ||
                 instructor.includes(query);
        })
        .slice(0, 10); // Limit to 10 results for courses

      // Filter trainers
      this.filteredTrainers = this.allTrainersList
        .filter((trainer: any) =>
          (trainer.name || '').toLowerCase().includes(query) ||
          (trainer.specialization || '').toLowerCase().includes(query)
        )
        .slice(0, 5); // Limit to 5 results

      // Filter institutes
      this.filteredInstitutes = this.allInstitutesList
        .filter((institute: any) =>
          (institute.name || '').toLowerCase().includes(query) ||
          (institute.location || '').toLowerCase().includes(query)
        )
        .slice(0, 5); // Limit to 5 results

      this.showSearchDropdown = this.filteredCourses.length > 0 || 
                                 this.filteredTrainers.length > 0 || 
                                 this.filteredInstitutes.length > 0;
    } else {
      this.filteredCourses = [];
      this.filteredTrainers = [];
      this.filteredInstitutes = [];
      this.showSearchDropdown = false;
    }
  }

  // Helper method to safely get instructor name
  getInstructorName(course: any): string {
    if (!course) return '';
    
    if (course.instructor) {
      if (typeof course.instructor === 'string') {
        return course.instructor;
      } else if (typeof course.instructor === 'object') {
        return course.instructor.name || course.instructor.fullName || course.instructor.firstName || '';
      }
    }
    
    if (course.trainerName) {
      if (typeof course.trainerName === 'string') {
        return course.trainerName;
      } else if (typeof course.trainerName === 'object') {
        return course.trainerName.name || course.trainerName.fullName || course.trainerName.firstName || '';
      }
    }
    
    return '';
  }

  navigateToCourse(course: any): void {
    try {
      if (!course) return;
      
      // Store course data for details page
      sessionStorage.setItem('course-details', JSON.stringify(course));
      
      // Get course title/slug - handle multiple possible field names
      const courseTitle = course.courseName || course.title || course.courseTitle || '';
      const courseSlug = courseTitle.toLowerCase().replace(/\s+/g, '-');
      
      // Navigate to course details
      if (courseSlug) {
        this.router.navigate(['/Course-details', courseSlug]);
      } else {
        // Fallback to courses page with course ID
        this.router.navigate(['/Courses'], {
          queryParams: { courseId: course.id || course._id }
        });
      }
      
      this.showSearchDropdown = false;
      this.searchQuery = '';
    } catch (error) {
      console.error('Error navigating to course:', error);
    }
  }

  navigateToTrainer(trainer: any): void {
    try {
      if (!trainer) return;
      
      sessionStorage.setItem('selected-trainer', JSON.stringify(trainer));
      this.router.navigate(['/Trainers'], {
        queryParams: {
          highlight: trainer.id,
          search: this.searchQuery
        }
      });
      this.showSearchDropdown = false;
    } catch (error) {
      console.error('Error navigating to trainer:', error);
    }
  }

  navigateToInstitute(institute: any): void {
    try {
      if (!institute) return;
      
      sessionStorage.setItem('selected-institute', JSON.stringify(institute));
      this.router.navigate(['/Institutes'], {
        queryParams: {
          highlight: institute.id,
          search: this.searchQuery
        }
      });
      this.showSearchDropdown = false;
    } catch (error) {
      console.error('Error navigating to institute:', error);
    }
  }

  // Clean up invalid or expired tokens on app startup
  private cleanupInvalidTokens(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    // If token exists but user doesn't, clear token (it's invalid)
    if (token && !user) {
      console.log('Clearing invalid token without user data');
      localStorage.removeItem('token');
    }
    
    // Try to parse user data - if it fails, clear both
    if (user) {
      try {
        JSON.parse(user);
      } catch (e) {
        console.log('Clearing corrupted user data');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  isAdminDashboardRoute(): boolean {
    return this.currentRoute.startsWith('/admin-dashboard');
  }

  logout(): void {
    this.authService.logout();
    this.currentUser = null;
    // Redirect to login page after logout
    this.router.navigate(['/login']);
    this.isUserMenuOpen = false;
  }

  toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  goToAccount(): void {
    this.isUserMenuOpen = false;
    this.router.navigate(['/Account']);
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isUserMenuOpen = false;
    }
  }

  openSignInPopup(): void {
    this.userTypePopupMode = 'signin';
    this.showUserTypePopup = true;
  }

  openStudentSignupPopup(): void {
    this.userTypePopupMode = 'signup';
    this.showUserTypePopup = true;
  }

  closeAuthPopup(): void {
    this.showAuthPopup = false;
  }

  // User type popup methods
  closeUserTypePopup(): void {
    this.showUserTypePopup = false;
  }

  onUserTypeSelected(userType: UserType): void {
    this.showUserTypePopup = false;
    
    // If it's signin mode, navigate to dashboards (old functionality)
    if (this.userTypePopupMode === 'signin') {
      if (userType === 'student') {
        this.router.navigate(['/Account']);
        return;
      }
      if (userType === 'trainer') {
        this.router.navigate(['/trainer-dashboard']);
        return;
      }
      if (userType === 'mentor') {
        this.router.navigate(['/mentor-dashboard']);
        return;
      }
      if (userType === 'institution') {
        this.router.navigate(['/institution-dashboard']);
        return;
      }
    }
    
    // If it's signup mode, show signup popups (new functionality)
    if (this.userTypePopupMode === 'signup') {
      if (userType === 'student') {
        this.authMode = 'student-signup';
        this.showAuthPopup = true;
        return;
      }
      if (userType === 'trainer') {
        this.authMode = 'trainer-signup';
        this.showAuthPopup = true;
        return;
      }
      if (userType === 'mentor') {
        this.authMode = 'mentor-signup';
        this.showAuthPopup = true;
        return;
      }
      if (userType === 'institution') {
        this.authMode = 'institution-signup';
        this.showAuthPopup = true;
        return;
      }
    }
    
    // Default fallback
    this.showAuthPopup = true;
  }

  onAuthSuccess(authData: any): void {
    console.log('Auth successful:', authData);
    this.closeAuthPopup();
    this.showUserTypePopup = false;
    
    if (authData.mode === 'signin') {
      const userName = authData.user.firstName || authData.user.name || 'User';
      const userType = authData.userType === 'student' ? 'Student' : 'User';
      alert(`Welcome back, ${userName}! (${userType})`);
    } else if (authData.mode === 'signup') {
      const userName = authData.user.firstName || 'User';
      alert(`Account created successfully! Welcome, ${userName}!`);
    } else if (authData.mode === 'student-signup') {
      const userName = authData.student?.firstName || 'Student';
      alert(`Student account created successfully! Welcome, ${userName}! Please check your email for OTP verification.`);
    }

    const activeUser = this.authService.getCurrentUserValue();
    if (activeUser) {
      this.currentUser = activeUser;
      return;
    }

    const normalizedUser = this.normalizeAuthUser(authData);
    if (normalizedUser) {
      this.authService.persistCurrentUser(normalizedUser, authData.token);
      this.currentUser = normalizedUser;
    }
  }

  getUserInitials(): string {
    if (!this.currentUser) {
      return 'U';
    }

    const first =
      this.currentUser.firstName?.charAt(0) ||
      this.currentUser.email?.charAt(0);
    const last = this.currentUser.lastName?.charAt(0);

    return (first || 'U').toUpperCase() + (last ? last.toUpperCase() : '');
  }

  getUserDisplayName(): string {
    if (!this.currentUser) {
      return 'User';
    }

    const first = this.currentUser.firstName?.trim() || '';
    const last = this.currentUser.lastName?.trim() || '';
    const fullName = `${first} ${last}`.trim();

    if (fullName) {
      return fullName;
    }

    if (this.currentUser.email) {
      return this.currentUser.email.split('@')[0];
    }

    return 'User';
  }

  getUserRoleLabel(): string {
    if (!this.currentUser) {
      return 'Member';
    }

    const roleLabels: Record<User['role'], string> = {
      user: 'Member',
      student: 'Student',
      trainer: 'Trainer',
      mentor: 'Mentor',
      admin: 'Administrator',
      institution: 'Institution'
    };

    return roleLabels[this.currentUser.role] || 'Member';
  }

  private normalizeAuthUser(authData: any): User | null {
    if (!authData) {
      return null;
    }

    const source = authData.user || authData.student;
    if (!source) {
      return null;
    }

    const role = this.resolveUserRole(source.role);

    return {
      id: source.id || `user-${Date.now()}`,
      firstName: source.firstName || source.name || 'User',
      lastName: source.lastName || '',
      email: source.email || 'user@example.com',
      role,
      avatar: source.avatar,
      phone: source.phone,
      bio: source.bio,
      location: source.location,
      isEmailVerified: source.isEmailVerified ?? false,
      isActive: source.isActive ?? true,
      profileCompletion: source.profileCompletion ?? 0,
      createdAt: source.createdAt || new Date().toISOString(),
    };
  }

  private resolveUserRole(role: any): User['role'] {
    const allowedRoles: User['role'][] = ['user', 'trainer', 'mentor', 'admin', 'student', 'institution'];
    return allowedRoles.includes(role) ? role : 'user';
  }
}
