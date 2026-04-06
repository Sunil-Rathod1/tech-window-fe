import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ShareDataService } from 'src/app/services/share-data.service';
import { AuthPopupComponent, AuthMode } from '../auth-popup/auth-popup.component';
import { AuthService } from 'src/app/services/auth.service';
import { LocalCartService, LocalCartItem } from 'src/app/services/local-cart.service';
import { Subscription } from 'rxjs';
import { CourseDetailsService, CourseDetail } from 'src/app/services/course-details.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit, OnDestroy {
  
  public courseId: string = '';
  public courseData: any = {};
  public courseName: any = null;
  public courseHeading: any;
  public isCourseInCart: boolean = false;
  public isAuthenticated: boolean = false;
  private cartSubscription = new Subscription();
  private courseCartId = '';
  
  public courseDetailsData: any = {
    courseName: 'Featured Course',
    courseTitle: 'Comprehensive learning experience',
    CourseCategory: 'All Categories',
    courseDuration: '60 Days',
    totalStudents: 0,
    courseRating: 4.5,
    languages: 'English',
    trainerName: 'Expert Mentor',
    name: 'Expert Mentor',
    trainerDesignation: 'Lead Instructor',
    designation: 'Lead Instructor',
    trainerExp: '5+',
    trainerRating: 4.5,
    insRating: 4.5,
    institutesName: 'TechWindows Academy',
    courseReviews: 0,
    startDate: 'Oct 1, 2024',
    scheduleTime: '12 PM - 1 PM',
    availableSeats: 20,
    price: 15000,
    discountPrice: 20000,
    discount: '10%',
    courseOverview: [],
    courseCurriculum: [],
    expertiseSkills: [],
    languagesKnown: [],
    achievements: ['Industry mentor', 'Published author', 'Conference speaker'],
    education: 'B.Tech Computer Science',
    location: 'Hyderabad',
    bio: 'Course mentor with extensive industry experience.',
    videoUrl: 'https://www.youtube.com/embed/tgbNymZ7vqY'
  };
  // Auth popup state
  public showAuthPopup = false;
  public authMode: AuthMode = 'signin';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public shareData: ShareDataService,
    private authService: AuthService,
    private localCartService: LocalCartService,
    private courseDetailsService: CourseDetailsService
  ) {
    let courseDetails: any = sessionStorage.getItem("course-details");
    if (courseDetails) {
      this.courseName = JSON.parse(courseDetails);
    }
  }
  public selectedCourseId: any;
  public selectedCourseName: string = '';
  public courseDetails: any = {};
  public courseTrainersData: any = { totalReviews: 0 };
  public breadcrumbs: any[] = [
    { label: 'Home', link: '/Home' },
    { label: 'Courses', link: '/Courses' },
    { label: 'Course Details', link: null }
  ];
  public isLoadingCourseDetails: boolean = false;
  public courseDetailsError: string = '';
  private trainerIdentifier: string = '';

  ngOnInit(): void {
    scrollToTop();
    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      });
    }
    this.courseHeading = this.shareData.getOption();
    if (this.courseHeading?.courseName) {
      this.selectedCourseName = this.courseHeading.courseName;
    }
    this.isAuthenticated = this.authService.isAuthenticated();
    this.courseDetails = JSON.parse(localStorage.getItem('courseDetails') || '{}');

    this.cartSubscription.add(
      this.localCartService.items$.subscribe(() => {
        if (this.courseCartId) {
          this.isCourseInCart = this.localCartService.hasItem(this.courseCartId);
        }
      })
    );

    this.route.params.subscribe(params => {
      this.selectedCourseId = params['id'] || '';
      this.route.queryParams.subscribe(queryParams => {
        this.trainerIdentifier = queryParams['trainerId'] || this.trainerIdentifier;
        this.selectedCourseName = queryParams['courseName'] || queryParams['courseTitle'] || this.selectedCourseName;
        
        // If coming from institutes, use institute data from localStorage
        if (queryParams['from'] === 'institutes') {
          const storedData = localStorage.getItem('courseDetails');
          if (storedData) {
            try {
              this.courseDetails = JSON.parse(storedData);
              // Use institute data if available
              if (this.courseDetails.courseDetails) {
                this.selectedCourseId = this.courseDetails.courseDetails.courseId || this.selectedCourseId;
                this.selectedCourseName = this.courseDetails.courseDetails.courseName || this.selectedCourseName;
              }
            } catch (e) {
              console.error('Error parsing courseDetails from localStorage:', e);
            }
          }
        }
        
        this.fetchCourseDetails();
        this.updateBreadcrumbs(queryParams);
      });
    });

    this.updateBreadcrumbs(this.route.snapshot.queryParams);
  }

  private updateBreadcrumbs(queryParams: any): void {
    const courseName = this.courseDetailsData?.courseName || this.courseHeading?.courseName || 'Course Details';
    const from = queryParams['from'] || '';
    
    // Check if courseDetails has institute data (coming from institutes)
    const hasInstituteData = this.courseDetails?.name && this.courseDetails?.courseDetails;
    
    // Determine breadcrumbs based on navigation source
    if (from === 'institutes' || hasInstituteData) {
      // Coming from Course-institutes
      const courseTitle = this.courseDetails?.courseDetails?.courseName || this.courseHeading?.courseName || courseName;
      const courseId = this.courseDetails?.courseDetails?.courseId || this.selectedCourseId || '';
      this.breadcrumbs = [
        { label: 'Home', link: '/Home' },
        { label: 'Courses', link: '/Courses' },
        { label: courseTitle, link: `/Course-institutes${courseId ? `?courseId=${courseId}` : ''}` },
        { label: courseName, link: null }
      ];
    } else if (from === 'trainers') {
      // Coming from Course-trainers
      const courseTitle = this.courseDetails?.courseDetails?.courseName || this.courseHeading?.courseName || courseName;
      const courseId = this.selectedCourseId || '';
      this.breadcrumbs = [
        { label: 'Home', link: '/Home' },
        { label: 'Courses', link: '/Courses' },
        { label: courseTitle, link: `/Course-trainers${courseId ? `?courseId=${courseId}` : ''}` },
        { label: courseName, link: null }
      ];
    } else if (from === 'mentors') {
      // Coming from Course-mentors
      const courseTitle = this.courseDetails?.courseDetails?.courseName || this.courseHeading?.courseName || courseName;
      const courseId = this.selectedCourseId || '';
      this.breadcrumbs = [
        { label: 'Home', link: '/Home' },
        { label: 'Courses', link: '/Courses' },
        { label: courseTitle, link: `/Course-mentors${courseId ? `?courseId=${courseId}` : ''}` },
        { label: courseName, link: null }
      ];
    } else {
      // Default breadcrumbs (from Home, Courses, Wishlist, etc.)
      this.breadcrumbs = [
        { label: 'Home', link: '/Home' },
        { label: 'Courses', link: '/Courses' },
        { label: courseName, link: null }
      ];
    }
  }

  private fetchCourseDetails(): void {
    const identifier = this.trainerIdentifier || this.selectedCourseId;
    const routeSnapshot = this.route.snapshot;
    const queryParams = routeSnapshot.queryParams;
    const from = queryParams['from'];

    // If coming from trainers page, check localStorage first
    if (from === 'trainers') {
      const storedData = localStorage.getItem('trainerCourseDetails');
      if (storedData) {
        try {
          const trainerCourseData = JSON.parse(storedData);
          if (trainerCourseData.trainer && trainerCourseData.course) {
            console.log('Using trainer data from localStorage');
            this.mapTrainerDataToCourseDetails(trainerCourseData);
            return;
          }
        } catch (e) {
          console.error('Error parsing trainerCourseDetails from localStorage:', e);
        }
      }
    }

    if (!identifier) {
      // If no identifier but we have courseDetails from localStorage (institute data)
      if (this.courseDetails && this.courseDetails.courseDetails) {
        this.mapInstituteDataToCourseDetails();
        return;
      }
      return;
    }

    this.isLoadingCourseDetails = true;
    this.courseDetailsError = '';

    this.courseDetailsService.getCourseDetails(identifier, {
      trainerId: this.trainerIdentifier || queryParams['trainerId'],
      courseId: this.selectedCourseId || queryParams['courseId'],
      courseName: this.selectedCourseName || queryParams['courseName'],
      instituteId: queryParams['instituteId'],
      instituteName: queryParams['instituteName'],
      from: from
    }).subscribe({
      next: (detail) => {
        // If API returned basic structure and we have localStorage data, use localStorage instead
        if (from === 'institutes' && detail && detail.courseName && 
            (!detail.trainerName || detail.trainerName === 'Expert Instructor') &&
            this.courseDetails && this.courseDetails.courseDetails) {
          console.log('Using localStorage data instead of API response');
          this.mapInstituteDataToCourseDetails();
        } else if (from === 'trainers') {
          // If coming from trainers, enhance with trainer data from localStorage if available
          const storedData = localStorage.getItem('trainerCourseDetails');
          if (storedData) {
            try {
              const trainerCourseData = JSON.parse(storedData);
              if (trainerCourseData.trainer) {
                const mapped = this.mapCourseDetailResponse(detail, trainerCourseData.trainer);
                this.courseDetailsData = mapped;
              } else {
                const mapped = this.mapCourseDetailResponse(detail);
                this.courseDetailsData = mapped;
              }
            } catch (e) {
              const mapped = this.mapCourseDetailResponse(detail);
              this.courseDetailsData = mapped;
            }
          } else {
            const mapped = this.mapCourseDetailResponse(detail);
            this.courseDetailsData = mapped;
          }
          
          this.courseHeading = {
            courseName: this.courseDetailsData.courseName,
            courseTitle: this.courseDetailsData.courseTitle
          };
          this.courseTrainersData = {
            totalReviews: this.courseDetailsData.courseReviews || 0
          };
          this.courseId = this.courseDetailsData.courseId || this.selectedCourseId || '';
          this.courseCartId = this.buildCourseCartId();
          this.isCourseInCart = this.courseCartId ? this.localCartService.hasItem(this.courseCartId) : false;
        } else {
          const mapped = this.mapCourseDetailResponse(detail);
          this.courseDetailsData = mapped;
          this.courseHeading = {
            courseName: mapped.courseName,
            courseTitle: mapped.courseTitle
          };
          this.courseTrainersData = {
            totalReviews: mapped.courseReviews || 0
          };
          this.courseId = mapped.courseId || this.selectedCourseId || '';
          this.courseCartId = this.buildCourseCartId();
          this.isCourseInCart = this.courseCartId ? this.localCartService.hasItem(this.courseCartId) : false;
        }
        this.isLoadingCourseDetails = false;
      },
      error: (error) => {
        console.error('Error loading course details:', error);
        // If error and we have localStorage data, use it
        if (from === 'institutes' && this.courseDetails && this.courseDetails.courseDetails) {
          console.log('API error, using localStorage data');
          this.mapInstituteDataToCourseDetails();
          this.isLoadingCourseDetails = false;
        } else if (from === 'trainers') {
          // Try to use trainer data from localStorage
          const storedData = localStorage.getItem('trainerCourseDetails');
          if (storedData) {
            try {
              const trainerCourseData = JSON.parse(storedData);
              if (trainerCourseData.trainer && trainerCourseData.course) {
                console.log('API error, using trainer data from localStorage');
                this.mapTrainerDataToCourseDetails(trainerCourseData);
                this.isLoadingCourseDetails = false;
                return;
              }
            } catch (e) {
              console.error('Error parsing trainerCourseDetails:', e);
            }
          }
          this.courseDetailsError = error.message || 'Failed to load course details.';
          this.isLoadingCourseDetails = false;
        } else {
          this.courseDetailsError = error.message || 'Failed to load course details.';
          this.isLoadingCourseDetails = false;
        }
      }
    });
  }

  private mapCourseDetailResponse(detail: CourseDetail, trainerData?: any): any {
    const achievements = detail.achievements && detail.achievements.length
      ? [...detail.achievements]
      : (trainerData?.achievements && trainerData.achievements.length 
          ? [...trainerData.achievements]
          : ['Award-winning mentor', 'Community contributor', 'Industry speaker']);

    while (achievements.length < 3) {
      achievements.push('Industry recognized mentor');
    }

    const currentPrice = detail.discountPrice || detail.price || trainerData?.coursePrice || 0;
    const originalPrice = detail.discountPrice ? detail.price : (detail.price || trainerData?.coursePrice || 0);

    // Use trainer data to enhance course details if available
    const trainerName = trainerData?.name || detail.trainerName;
    const trainerBio = trainerData?.bio || detail.bio;
    const trainerLocation = trainerData?.location 
      ? (typeof trainerData.location === 'string' 
          ? trainerData.location 
          : `${trainerData.location.city || ''}, ${trainerData.location.state || ''}`.trim().replace(/^,\s*|,\s*$/g, ''))
      : detail.location;
    const expertiseSkills = trainerData?.skills 
      ? trainerData.skills.map((s: any) => s.courseName || s.name || s).filter(Boolean)
      : (detail.expertiseSkills || []);
    const languagesKnown = trainerData?.languages || detail.languagesKnown || ['English'];

    return {
      ...detail,
      courseId: detail.courseId || trainerData?.course?.courseId,
      trainerId: detail.trainerId || trainerData?.id || trainerData?._id || null, // Use trainerId from API response
      courseName: detail.courseName || trainerData?.course?.courseName,
      courseTitle: detail.courseTitle || trainerData?.course?.courseTitle || detail.courseName,
      CourseCategory: detail.CourseCategory || 'Other',
      courseDuration: detail.courseDuration || '60 Days',
      courseStudents: detail.courseStudents || trainerData?.totalStudents || 0,
      totalStudents: detail.totalStudents || trainerData?.totalStudents || 0,
      courseRating: detail.courseRating || trainerData?.rating || 4.6,
      courseReviews: detail.courseReviews || 0,
      languages: detail.languages || 'English',
      trainerName: trainerName,
      name: trainerName,
      designation: trainerData?.title || detail.trainerDesignation,
      trainerDesignation: trainerData?.title || detail.trainerDesignation,
      trainerExp: trainerData?.experienceYears ? `${trainerData.experienceYears}+` : (detail.trainerExp || '5+'),
      trainerRating: trainerData?.rating || detail.trainerRating || 4.6,
      experience: trainerData?.experience || detail.experience || '5+ years',
      expertiseSkills,
      languagesKnown,
      achievements,
      education: trainerData?.education || detail.education || 'Professional Certification',
      location: trainerLocation,
      bio: trainerBio || 'Expert instructor with industry experience',
      price: currentPrice,
      discountPrice: originalPrice,
      discount: detail.discount || 'Limited Offer',
      startDate: trainerData?.batchDate || detail.startDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      scheduleTime: trainerData?.batchTime || detail.scheduleTime || '12:00 PM - 1:00 PM IST',
      availableSeats: detail.availableSeats || 30,
      videoUrl: detail.videoUrl || 'https://www.youtube.com/embed/tgbNymZ7vqY',
      // Additional trainer-specific fields
      batchDates: trainerData?.batchDates || [],
      batchEndDate: trainerData?.batchEndDate,
      totalSessions: trainerData?.totalSessions,
      modeOfClass: trainerData?.modeOfClass,
      hourlyRate: trainerData?.hourlyRate || 0,
      totalCourses: trainerData?.totalCourses || 0
    };
  }

  redirectToSignIn(): void {
    this.authMode = 'signin';
    this.showAuthPopup = true;
  }

  navigateToPaymentGateway(): void {
    try {
      if (!this.courseCartId) {
        this.courseCartId = this.buildCourseCartId();
      }

      if (!this.localCartService.hasItem(this.courseCartId)) {
        const cartItem = this.mapCourseToCartItem(this.courseCartId);
        this.localCartService.addItem(cartItem);
        this.isCourseInCart = true;
      }

      this.router.navigate(['/payment-gateway']);
    } catch (error) {
      console.error('Error navigating to payment gateway:', error);
      alert('Unable to proceed to payment. Please try again.');
    }
  }

  openSignUpPopup(): void {
    this.authMode = 'signup';
    this.showAuthPopup = true;
  }

  closeAuthPopup(): void {
    this.showAuthPopup = false;
  }

  onAuthSuccess(authData: any): void {
    console.log('Auth successful:', authData);
    this.closeAuthPopup();
    this.isAuthenticated = true;
    
    if (authData.mode === 'signin') {
      alert('Welcome back, ' + authData.user.name + '!');
    } else {
      alert('Account created successfully! Welcome, ' + authData.user.firstName + '!');
    }
  }

  // Handle wishlist button click
  handleWishlistClick(): void {
    try {
      if (!this.courseCartId) {
        this.courseCartId = this.buildCourseCartId();
      }

      if (this.localCartService.hasItem(this.courseCartId)) {
        alert('This course is already in your cart!');
        return;
      }

      const cartItem = this.mapCourseToCartItem(this.courseCartId);
      this.localCartService.addItem(cartItem);
      this.isCourseInCart = true;
      alert('Course added to your cart!');
    } catch (error) {
      console.error('Error handling wishlist click:', error);
      alert('An error occurred. Please try again.');
    }
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  private mapCourseToCartItem(id: string): LocalCartItem {
    const details = this.courseDetailsData || {};
    const title = details.courseName || this.courseHeading?.courseName || 'Featured Course';
    const mentorName = details.trainerName || 'Expert Mentor';
    const instituteName = details.institutesName || 'TechWindows Academy';
    const description =
      details.courseTitle ||
      `Comprehensive ${title} program with live mentor support and job readiness guidance.`;

    const tags =
      Array.isArray(details.expertiseSkills) && details.expertiseSkills.length
        ? details.expertiseSkills.slice(0, 4)
        : ['Live Projects', 'Mentor Support'];

    const mode = details.scheduleTime
      ? `Schedule · ${details.scheduleTime}`
      : 'Flexible Learning Modes';

    const duration = details.courseDuration
      ? `${details.courseDuration} · Cohort Based Learning`
      : 'Structured Cohort Program';

    const price = this.parsePrice(details.discountPrice ?? details.price);
    const originalPrice = this.parsePrice(details.price);

    // Extract courseId and trainerId from available sources
    const courseId = details.courseId || this.courseId || this.selectedCourseId || null;
    const trainerId = details.trainerId || this.trainerIdentifier || details.trainer?.id || null;

    return {
      id,
      title,
      description,
      institute: instituteName,
      mentor: mentorName,
      mode,
      duration,
      level: details.CourseCategory || 'All Levels',
      price,
      originalPrice: originalPrice || undefined,
      rating: Number(details.courseRating) || 4.6,
      reviews: Number(details.courseReviews) || 0,
      image: details.image || 'assets/photos/courses/course1.jfif',
      tags,
      addedAt: new Date().toISOString(),
      routeLink: courseId ? `/Course-details/${courseId}` : undefined,
      courseId: courseId || undefined,
      trainerId: trainerId || undefined,
      instructorId: trainerId || undefined, // Alias for compatibility
    };
  }

  private buildCourseCartId(): string {
    const courseName = this.courseDetailsData?.courseName || this.courseHeading?.courseName || 'course';
    const instituteName = this.courseDetailsData?.institutesName || 'academy';
    return `course-${this.slugify(courseName)}-${this.slugify(instituteName)}`;
  }

  private parsePrice(value: any): number {
    if (value === undefined || value === null) {
      return 0;
    }
    const numeric = Number(String(value).replace(/[^0-9.]/g, ''));
    return isNaN(numeric) ? 0 : numeric;
  }

  private slugify(value: string): string {
    return value
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  getPageTitle(): string {
    const courseName = this.courseDetailsData?.courseName || this.courseHeading?.courseName || 'Course Details';
    return courseName;
  }

  getPageSubtitle(): string {
    return this.courseDetailsData?.courseTitle || 'Comprehensive course with expert guidance and hands-on learning';
  }

  // Map institute data from localStorage to course details format
  private mapInstituteDataToCourseDetails(): void {
    if (!this.courseDetails || !this.courseDetails.courseDetails) {
      return;
    }

    const instituteData = this.courseDetails;
    const courseInfo = this.courseDetails.courseDetails;
    
    // Get first trainer if available
    const trainers = this.getTrainersFromInstitute(instituteData);
    const trainer = trainers.length > 0 ? trainers[0] : null;

    this.courseDetailsData = {
      courseId: courseInfo.courseId || this.selectedCourseId,
      courseName: courseInfo.courseName || instituteData.courseTitle || 'Course',
      courseTitle: instituteData.courseTitle || courseInfo.courseName || 'Course Title',
      CourseCategory: courseInfo.courseName || 'Other',
      courseDuration: instituteData.hours ? `${instituteData.hours} Hours` : '60 Days',
      courseStudents: instituteData.students?.total || 0,
      totalStudents: instituteData.students?.total || 0,
      courseRating: instituteData.rating?.overall || instituteData.rating || 4.6,
      courseReviews: instituteData.rating?.totalReviews || instituteData.reviews || 0,
      languages: 'English',
      trainerName: trainer?.name || instituteData.trainerDetails?.name || 'Expert Instructor',
      name: trainer?.name || instituteData.trainerDetails?.name || 'Expert Instructor',
      designation: trainer?.designation || instituteData.trainerDetails?.designation || 'Senior Instructor',
      trainerDesignation: trainer?.designation || instituteData.trainerDetails?.designation || 'Senior Instructor',
      trainerExp: trainer?.experience || instituteData.trainerDetails?.experience || '5+',
      trainerRating: trainer?.trainerRating || instituteData.rating?.overall || 4.6,
      experience: trainer?.experience || '5+ years',
      expertiseSkills: trainer?.expertiseSkills || instituteData.trainerDetails?.expertiseSkills || [],
      languagesKnown: trainer?.languagesKnown || instituteData.trainerDetails?.languagesKnown || ['English'],
      achievements: trainer?.achievements || instituteData.trainerDetails?.achievements || [],
      education: trainer?.education || instituteData.trainerDetails?.education || 'Professional Certification',
      location: trainer?.location || instituteData.location || instituteData.address?.city || 'Hyderabad',
      bio: trainer?.bio || instituteData.trainerDetails?.bio || instituteData.courseDesc || 'Expert instructor',
      price: instituteData.price || 9999,
      discountPrice: instituteData.price ? Math.round(instituteData.price * 0.8) : 7999,
      discount: '20%',
      startDate: trainer?.startDate || instituteData.trainerDetails?.startDate || 'Oct 1, 2024',
      scheduleTime: trainer?.scheduleTime || instituteData.trainerDetails?.scheduleTime || '12:00 PM - 1:00 PM IST',
      availableSeats: trainer?.availableSeats || instituteData.trainerDetails?.availableSeats || 30,
      institutesName: instituteData.name || 'Training Institute',
      insRating: instituteData.rating?.overall || instituteData.rating || 4.6,
      videoUrl: 'https://www.youtube.com/embed/tgbNymZ7vqY',
      courseOverview: trainer?.courseOverview || instituteData.trainerDetails?.courseOverview || [],
      courseCurriculum: trainer?.courseCurriculum || instituteData.trainerDetails?.courseCurriculum || []
    };

    this.courseHeading = {
      courseName: this.courseDetailsData.courseName,
      courseTitle: this.courseDetailsData.courseTitle
    };

    this.courseId = this.courseDetailsData.courseId || this.selectedCourseId || '';
    this.courseCartId = this.buildCourseCartId();
    this.isCourseInCart = this.courseCartId ? this.localCartService.hasItem(this.courseCartId) : false;
  }

  // Helper to extract trainers from institute data
  private getTrainersFromInstitute(instituteData: any): any[] {
    const trainers: any[] = [];
    
    if (instituteData.courses?.categories && Array.isArray(instituteData.courses.categories)) {
      instituteData.courses.categories.forEach((category: any) => {
        if (category.trainerDetails) {
          trainers.push(category.trainerDetails);
        }
      });
    }

    if (instituteData.trainerDetails && trainers.length === 0) {
      trainers.push(instituteData.trainerDetails);
    }

    return trainers;
  }

  // Map trainer data from localStorage to course details format
  private mapTrainerDataToCourseDetails(trainerCourseData: any): void {
    if (!trainerCourseData || !trainerCourseData.trainer || !trainerCourseData.course) {
      return;
    }

    const trainer = trainerCourseData.trainer;
    const course = trainerCourseData.course;

    // Get batch dates info
    const batchDates = trainer.batchDates || [];
    const nextBatch = batchDates.length > 0 ? batchDates[0] : null;

    // Map skills
    const expertiseSkills = Array.isArray(trainer.skills)
      ? trainer.skills.map((skill: any) => skill.courseName || skill.name || skill).filter(Boolean)
      : [];

    // Map achievements
    const achievements = Array.isArray(trainer.achievements) && trainer.achievements.length
      ? [...trainer.achievements]
      : ['Industry mentor', 'Expert trainer', 'Professional instructor'];

    while (achievements.length < 3) {
      achievements.push('Industry recognized mentor');
    }

    // Format location
    const location = trainer.location
      ? (typeof trainer.location === 'string'
          ? trainer.location
          : `${trainer.location.city || ''}, ${trainer.location.state || ''}`.trim().replace(/^,\s*|,\s*$/g, ''))
      : 'Online';

    // Calculate price
    const coursePrice = trainer.coursePrice || trainer.minCoursePrice || 0;
    const discountPrice = trainer.maxCoursePrice && trainer.maxCoursePrice > coursePrice
      ? trainer.maxCoursePrice
      : (coursePrice ? Math.round(coursePrice * 0.8) : 0);

    this.courseDetailsData = {
      courseId: course.courseId || this.selectedCourseId,
      courseName: course.courseName || 'Course',
      courseTitle: course.courseTitle || course.courseName || 'Course Title',
      CourseCategory: course.courseName || 'Other',
      courseDuration: '60 Days',
      courseStudents: trainer.totalStudents || 0,
      totalStudents: trainer.totalStudents || 0,
      courseRating: trainer.rating || 4.6,
      courseReviews: Math.floor((trainer.totalStudents || 0) * 0.1),
      languages: Array.isArray(trainer.languages) ? trainer.languages.join(', ') : (trainer.languages || 'English'),
      trainerName: trainer.name || 'Expert Trainer',
      name: trainer.name || 'Expert Trainer',
      designation: trainer.title || 'Expert Instructor',
      trainerDesignation: trainer.title || 'Expert Instructor',
      trainerExp: trainer.experienceYears ? `${trainer.experienceYears}+` : '5+',
      trainerRating: trainer.rating || 4.6,
      experience: trainer.experience || (trainer.experienceYears ? `${trainer.experienceYears}+ years` : '5+ years'),
      expertiseSkills,
      languagesKnown: Array.isArray(trainer.languages) ? trainer.languages : [trainer.languages || 'English'],
      achievements,
      education: trainer.education || 'Professional Certification',
      location,
      bio: trainer.bio || 'Expert trainer with industry experience',
      price: coursePrice,
      discountPrice,
      discount: coursePrice && discountPrice ? `${Math.round(((coursePrice - discountPrice) / coursePrice) * 100)}%` : '20%',
      startDate: nextBatch?.batchDate || trainer.batchDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      scheduleTime: nextBatch?.batchTime || trainer.batchTime || '12:00 PM - 1:00 PM IST',
      availableSeats: 30,
      institutesName: 'TechWindows Academy',
      insRating: trainer.rating || 4.6,
      videoUrl: 'https://www.youtube.com/embed/tgbNymZ7vqY',
      courseOverview: [
        'Comprehensive course curriculum with expert guidance',
        'Hands-on projects and real-world applications',
        'Industry-relevant skills and best practices'
      ],
      courseCurriculum: [
        { module: 'Module 1', title: 'Introduction & Fundamentals', lessons: 8, duration: '2.5 hours' },
        { module: 'Module 2', title: 'Core Concepts & Advanced Topics', lessons: 12, duration: '4 hours' },
        { module: 'Module 3', title: 'Projects & Real-World Applications', lessons: 10, duration: '3 hours' }
      ],
      // Trainer-specific fields
      batchDates,
      batchEndDate: nextBatch?.batchEndDate || trainer.batchEndDate,
      totalSessions: trainer.totalSessions || 1,
      modeOfClass: trainer.modeOfClass || 'online',
      hourlyRate: trainer.hourlyRate || 0,
      totalCourses: trainer.totalCourses || 0
    };

    this.courseHeading = {
      courseName: this.courseDetailsData.courseName,
      courseTitle: this.courseDetailsData.courseTitle
    };

    this.courseTrainersData = {
      totalReviews: this.courseDetailsData.courseReviews || 0
    };

    this.courseId = this.courseDetailsData.courseId || this.selectedCourseId || '';
    this.courseCartId = this.buildCourseCartId();
    this.isCourseInCart = this.courseCartId ? this.localCartService.hasItem(this.courseCartId) : false;
  }
}
