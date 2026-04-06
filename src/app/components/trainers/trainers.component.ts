import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TrainersService, Trainer, DetailedTrainer } from '../../services/trainers.service';
import { CourseDetailsPopupComponent, CourseData } from '../course-details-popup/course-details-popup.component';
import { AuthPopupComponent, AuthMode } from '../auth-popup/auth-popup.component';

interface LocalTrainer {
  id: number;
  courseId: number;
  name: string;
  title: string;
  courseCategory: string;
  coursePrice: number;
  avatar: string;
  courseImage: string;
  students: number;
  likes: number;
  description: string;
  expertise: string[];
  duration: string;
  modules: number;
  certification: boolean;
  achievements: string[];
  rating: number;
  online: boolean;
  location: string;
  experience: string;
}

@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.css']
})
export class TrainersComponent implements OnInit {
  
  trainers: LocalTrainer[] = [];
  filteredTrainers: DetailedTrainer[] = [];
  searchTerm: string = '';
  selectedTechnology: string = '';
  selectedExperience: string = '';
  selectedLocation: string = '';
  public trainersList:any[] =[
      {
        "id": "1",
        "courseName": "Full Stack Web Development",
        "title": "Senior Web Developer & Instructor",
        "studentsCount": 2500,
        "likes": 1200,
        "description": "Experienced full-stack developer with 10+ years in web development. Expert in React, Node.js, and modern web technologies.",
        "technologies": [
          "HTML",
          "CSS",
          "JavaScript",
          "React",
          "Node.js",
          "MongoDB",
          "Express",
          "Git"
        ],
        "duration": "6 months",
        "modules": 24,
        "certifications": [
          "AWS Certified Developer",
          "Microsoft Certified Azure Developer",
          "Google Cloud Professional Developer",
          "React Developer Certification"
        ],
        "rating": 4.9,
        "reviews": 450,
        "contact": {
          "email": "sarah.johnson@techacademy.com",
          "phone": "+91-9876543210",
          "linkedin": "https://linkedin.com/in/sarahjohnson"
        },
        "profile": {
          "name": "Sarah Johnson",
          "avatar": "assets/photos/trainers/sarah.jpg",
          "experience": "10+ years",
          "specialization": "Web Development",
          "company": "Tech Academy India",
          "location": "Bangalore, India",
          "bio": "Passionate about teaching and helping students become successful developers. Former Senior Developer at Google.",
          "achievements": [
            "Mentored 2500+ students",
            "Published 15 technical articles",
            "Speaker at 20+ tech conferences",
            "Open source contributor"
          ],
          "socialMedia": {
            "twitter": "https://twitter.com/sarahjohnson",
            "github": "https://github.com/sarahjohnson",
            "website": "https://sarahjohnson.dev"
          }
        },
        "courses": [
          {
            "id": "1",
            "name": "Full Stack Web Development",
            "students": 2500,
            "rating": 4.9
          },
          {
            "id": "2",
            "name": "React Advanced Concepts",
            "students": 1200,
            "rating": 4.8
          },
          {
            "id": "3",
            "name": "Node.js Backend Development",
            "students": 1800,
            "rating": 4.7
          }
        ],
        "isVerified": true,
        "isFeatured": true,
        "createdAt": "2020-01-15",
        "updatedAt": "2024-03-20"
      },
      {
        "id": "2",
        "courseName": "Data Science & Machine Learning",
        "title": "Lead Data Scientist & AI Researcher",
        "studentsCount": 1800,
        "likes": 950,
        "description": "PhD in Computer Science with expertise in Machine Learning, Deep Learning, and Data Analysis. Published researcher in top-tier journals.",
        "technologies": [
          "Python",
          "Pandas",
          "NumPy",
          "Scikit-learn",
          "TensorFlow",
          "Keras",
          "Jupyter",
          "Matplotlib"
        ],
        "duration": "8 months",
        "modules": 32,
        "certifications": [
          "AWS Certified Machine Learning Specialist",
          "Google Cloud Professional Data Engineer",
          "Microsoft Certified Azure Data Scientist",
          "TensorFlow Developer Certificate"
        ],
        "rating": 4.8,
        "reviews": 320,
        "contact": {
          "email": "michael.chen@techacademy.com",
          "phone": "+91-8765432109",
          "linkedin": "https://linkedin.com/in/michaelchen"
        },
        "profile": {
          "name": "Dr. Michael Chen",
          "avatar": "assets/photos/trainers/michael.jpg",
          "experience": "12+ years",
          "specialization": "Data Science & AI",
          "company": "Tech Academy India",
          "location": "Mumbai, India",
          "bio": "AI researcher and data scientist with PhD from Stanford. Former Principal Data Scientist at Microsoft Research.",
          "achievements": [
            "Published 25+ research papers",
            "Mentored 1800+ students",
            "Keynote speaker at AI conferences",
            "Patent holder in ML algorithms"
          ],
          "socialMedia": {
            "twitter": "https://twitter.com/michaelchen",
            "github": "https://github.com/michaelchen",
            "website": "https://michaelchen.ai"
          }
        },
        "courses": [
          {
            "id": "4",
            "name": "Data Science & ML",
            "students": 1800,
            "rating": 4.8
          },
          {
            "id": "5",
            "name": "Deep Learning Fundamentals",
            "students": 900,
            "rating": 4.7
          },
          {
            "id": "6",
            "name": "Python for Data Analysis",
            "students": 1500,
            "rating": 4.9
          }
        ],
        "isVerified": true,
        "isFeatured": true,
        "createdAt": "2020-03-10",
        "updatedAt": "2024-03-15"
      },
      {
        "id": "3",
        "courseName": "Mobile App Development",
        "title": "Senior Mobile Developer & Tech Lead",
        "studentsCount": 1200,
        "likes": 680,
        "description": "Expert mobile developer specializing in React Native and Flutter. Led mobile teams at top tech companies.",
        "technologies": [
          "React Native",
          "Flutter",
          "Dart",
          "JavaScript",
          "Firebase",
          "Redux",
          "API Integration"
        ],
        "duration": "4 months",
        "modules": 18,
        "certifications": [
          "Google Flutter Developer Certification",
          "React Native Developer Certificate",
          "AWS Mobile Developer Specialty",
          "Firebase Certified Developer"
        ],
        "rating": 4.7,
        "reviews": 280,
        "contact": {
          "email": "alex.rodriguez@techacademy.com",
          "phone": "+91-7654321098",
          "linkedin": "https://linkedin.com/in/alexrodriguez"
        },
        "profile": {
          "name": "Alex Rodriguez",
          "avatar": "assets/photos/trainers/alex.jpg",
          "experience": "8+ years",
          "specialization": "Mobile Development",
          "company": "Tech Academy India",
          "location": "Delhi, India",
          "bio": "Passionate mobile developer with experience building apps for millions of users. Former Senior Developer at Uber.",
          "achievements": [
            "Built 50+ mobile applications",
            "Mentored 1200+ students",
            "App Store featured developer",
            "Open source mobile libraries"
          ],
          "socialMedia": {
            "twitter": "https://twitter.com/alexrodriguez",
            "github": "https://github.com/alexrodriguez",
            "website": "https://alexrodriguez.dev"
          }
        },
        "courses": [
          {
            "id": "7",
            "name": "Mobile App Development",
            "students": 1200,
            "rating": 4.7
          },
          {
            "id": "8",
            "name": "React Native Advanced",
            "students": 600,
            "rating": 4.6
          },
          {
            "id": "9",
            "name": "Flutter Cross-Platform",
            "students": 800,
            "rating": 4.8
          }
        ],
        "isVerified": true,
        "isFeatured": false,
        "createdAt": "2021-06-20",
        "updatedAt": "2024-03-10"
      }
    ]
  // New API data
  public detailedTrainers: DetailedTrainer[] = [];
  public loading = false;
  public error = '';
  public pagination: any = {};
  public currentPage = 1;
  public pageSize = 10;
  
  // Search navigation properties
  public highlightedTrainerId: string | null = null;
  public searchQuery: string = '';

  // Popup state
  public showCoursePopup = false;
  public selectedCourse: CourseData | null = null;
  
  // Auth popup state
  public showAuthPopup = false;
  public authMode: AuthMode = 'signin';

  constructor(
    private trainersService: TrainersService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Initialize with empty arrays first
    this.trainers = [];
    this.filteredTrainers = [];
    
    // Check for query parameters from search navigation
    this.route.queryParams.subscribe(params => {
      if (params['highlight']) {
        this.highlightedTrainerId = params['highlight'];
        // Scroll to highlighted trainer after data loads
        setTimeout(() => this.scrollToHighlightedTrainer(), 500);
      }
      if (params['search']) {
        this.searchQuery = params['search'];
        this.searchTerm = params['search'];
        this.filterTrainers();
      }
    });

    // Load detailed trainers from API first
    this.loadDetailedTrainers();
    
    // Fallback to static data if API fails
    this.initializeTrainers();
  }

  loadDetailedTrainers() {
    this.loading = true;
    this.error = '';
    
    this.trainersService.getDetailedTrainers(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.detailedTrainers = response.data || [];
        this.pagination = response.pagination || {};
        this.loading = false;
        
        // Update filtered trainers to show API data
        this.filteredTrainers = [...this.detailedTrainers];
      },
      error: (error) => {
        console.error('Error loading detailed trainers:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          url: error.url
        });
        this.error = 'Failed to load trainers. Using fallback data.';
        this.loading = false;
        
        // Fallback to empty array since we can't mix types
        this.filteredTrainers = [];
      }
    });
  }

  filterTrainers() {
    const filters = {
      specialization: '',
      minRating: '',
      minStudents: '',
      technologies: this.selectedTechnology,
      location: this.selectedLocation,
      search: this.searchTerm,
      page: this.currentPage,
      limit: this.pageSize
    };

    this.loading = true;
    this.trainersService.filterTrainers(filters).subscribe({
      next: (response) => {
        // Convert Trainer[] to DetailedTrainer[] or use empty array
        this.detailedTrainers = [];
        this.pagination = response.pagination;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error filtering trainers:', error);
        this.error = 'Failed to filter trainers';
        this.loading = false;
      }
    });
  }

  initializeTrainers() {
    this.trainers = [
      {
        id: 1,
        courseId: 1,
        name: 'Srujan Bharath',
        title: 'Senior Web Development Trainer',
        courseCategory: 'Web Development',
        coursePrice: 14444,
        avatar: 'assets/photos/trainers/trainer-1.jpg',
        courseImage: 'assets/photos/course-2.jpg',
        students: 1948,
        likes: 1245,
        description: 'Expert web developer with 8+ years of experience in modern web technologies. Specializes in React, Node.js, and full-stack development. Passionate about teaching and helping students build real-world projects.',
        expertise: ['React.js', 'Node.js', 'JavaScript', 'HTML/CSS', 'MongoDB', 'Express.js'],
        duration: '6 months',
        modules: 24,
        certification: true,
        achievements: ['Microsoft Certified Trainer', '4.8/5 Rating'],
        rating: 4.8,
        online: true,
        location: 'Hyderabad',
        experience: '8+ Years'
      },
      {
        id: 2,
        courseId: 2,
        name: 'Zuly',
        title: 'UI/UX Design Specialist',
        courseCategory: 'Web Designing',
        coursePrice: 19999,
        avatar: 'assets/photos/trainers/trainer-2.jpg',
        courseImage: 'assets/photos/course-2.jpg',
        students: 2734,
        likes: 2134,
        description: 'Creative designer with expertise in user interface and user experience design. Specializes in creating intuitive, beautiful, and functional web applications. Expert in modern design tools and methodologies.',
        expertise: ['UI/UX Design', 'Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'Wireframing'],
        duration: '4 months',
        modules: 18,
        certification: true,
        achievements: ['Adobe Certified Expert', '4.9/5 Rating'],
        rating: 4.9,
        online: true,
        location: 'Hyderabad',
        experience: '6+ Years'
      },
      {
        id: 3,
        courseId: 3,
        name: 'John Doe',
        title: 'QA & Testing Expert',
        courseCategory: 'Software Testing',
        coursePrice: 9999,
        avatar: 'assets/photos/trainers/trainer-3.jpg',
        courseImage: 'assets/photos/course-2.jpg',
        students: 9734,
        likes: 2678,
        description: 'Quality assurance specialist with extensive experience in manual and automated testing. Expert in Selenium, JUnit, and various testing frameworks. Passionate about ensuring software quality and reliability.',
        expertise: ['Selenium', 'JUnit', 'TestNG', 'Manual Testing', 'API Testing', 'Performance Testing'],
        duration: '5 months',
        modules: 20,
        certification: true,
        achievements: ['ISTQB Certified', '4.7/5 Rating'],
        rating: 4.7,
        online: false,
        location: 'Hyderabad',
        experience: '10+ Years'
      },
      {
        id: 4,
        courseId: 4,
        name: 'Sarah Johnson',
        title: 'Java & Spring Boot Expert',
        courseCategory: 'Java Development',
        coursePrice: 16999,
        avatar: 'assets/photos/trainers/trainer-1.jpg',
        courseImage: 'assets/photos/course-2.jpg',
        students: 3456,
        likes: 1890,
        description: 'Senior Java developer with 10+ years of experience in enterprise application development. Expert in Spring Framework, Microservices, and cloud technologies. Passionate about teaching modern Java development practices.',
        expertise: ['Java 17+', 'Spring Boot', 'Microservices', 'Docker', 'Kubernetes', 'AWS'],
        duration: '8 months',
        modules: 32,
        certification: true,
        achievements: ['Oracle Certified Professional', '4.9/5 Rating'],
        rating: 4.9,
        online: true,
        location: 'Hyderabad',
        experience: '10+ Years'
      },
      {
        id: 5,
        courseId: 5,
        name: 'Michael Chen',
        title: 'Python & Data Science Trainer',
        courseCategory: 'Python Development',
        coursePrice: 12999,
        avatar: 'assets/photos/trainers/trainer-2.jpg',
        courseImage: 'assets/photos/course-2.jpg',
        students: 2789,
        likes: 1567,
        description: 'Data scientist and Python expert with specialization in machine learning and AI. Experienced in teaching Python programming, data analysis, and building intelligent applications. Focuses on practical, project-based learning.',
        expertise: ['Python 3.x', 'Machine Learning', 'Data Science', 'Pandas', 'NumPy', 'Scikit-learn'],
        duration: '6 months',
        modules: 26,
        certification: true,
        achievements: ['Google Certified ML Engineer', '4.8/5 Rating'],
        rating: 4.8,
        online: true,
        location: 'Hyderabad',
        experience: '7+ Years'
      },
      {
        id: 6,
        courseId: 6,
        name: 'David Wilson',
        title: 'DevOps & Cloud Architect',
        courseCategory: 'DevOps',
        coursePrice: 22999,
        avatar: 'assets/photos/trainers/trainer-3.jpg',
        courseImage: 'assets/photos/course-2.jpg',
        students: 1234,
        likes: 987,
        description: 'DevOps engineer with expertise in CI/CD pipelines, containerization, and cloud infrastructure. Specializes in AWS, Azure, and modern DevOps practices. Helps students understand the complete software delivery lifecycle.',
        expertise: ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Azure', 'Terraform'],
        duration: '7 months',
        modules: 28,
        certification: true,
        achievements: ['AWS Certified DevOps Engineer', '4.6/5 Rating'],
        rating: 4.6,
        online: false,
        location: 'Hyderabad',
        experience: '9+ Years'
      }
    ];
  }

  // Search and filter functionality
  onSearch() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  redirectToSignIn() {
    // Open sign-in popup
    this.authMode = 'signin';
    this.showAuthPopup = true;
  }

  openSignUpPopup() {
    // Open sign-up popup
    this.authMode = 'signup';
    this.showAuthPopup = true;
  }

  closeAuthPopup() {
    this.showAuthPopup = false;
  }

  onAuthSuccess(authData: any) {
    console.log('Auth successful:', authData);
    this.closeAuthPopup();
    
    if (authData.mode === 'signin') {
      // Handle sign in success
      alert('Welcome back, ' + authData.user.name + '!');
    } else {
      // Handle sign up success
      alert('Account created successfully! Welcome, ' + authData.user.firstName + '!');
    }
  }

  viewCourseDetails(trainer: DetailedTrainer | LocalTrainer) {
    // Convert trainer to CourseData format and show popup
    console.log('Opening popup for trainer:', trainer);
    
    // Handle both DetailedTrainer and LocalTrainer types
    const courseData: CourseData = {
      id: typeof trainer.id === 'string' ? parseInt(trainer.id) : trainer.id,
      courseId: 'courseId' in trainer ? trainer.courseId : parseInt(trainer.id.toString()),
      name: 'profile' in trainer ? trainer.profile?.name || 'Trainer' : trainer.name,
      title: trainer.title,
      courseCategory: 'courseCategory' in trainer ? trainer.courseCategory : trainer.courseName || 'IT Training',
      coursePrice: 'coursePrice' in trainer ? trainer.coursePrice : 0,
      avatar: 'profile' in trainer ? trainer.profile?.avatar || 'assets/photos/trainers/trainer-1.jpg' : trainer.avatar,
      courseImage: 'courseImage' in trainer ? trainer.courseImage : 'assets/photos/course-2.jpg',
      students: 'students' in trainer ? trainer.students : trainer.studentsCount || 0,
      likes: trainer.likes || 0,
      description: trainer.description,
      expertise: 'expertise' in trainer ? trainer.expertise : trainer.technologies || [],
      duration: trainer.duration,
      modules: trainer.modules,
      certification: 'certification' in trainer ? trainer.certification : false,
      achievements: 'achievements' in trainer ? trainer.achievements : trainer.profile?.achievements || [],
      rating: trainer.rating,
      online: 'online' in trainer ? trainer.online : trainer.isVerified || false,
      location: 'location' in trainer ? trainer.location : trainer.profile?.location || 'Unknown',
      experience: 'experience' in trainer ? trainer.experience : trainer.profile?.experience || 'Unknown'
    };
    
    this.selectedCourse = courseData;
    this.showCoursePopup = true;
    console.log('Popup state:', this.showCoursePopup, 'Selected course:', this.selectedCourse);
  }

  closeCoursePopup() {
    this.showCoursePopup = false;
    this.selectedCourse = null;
  }


  applyFilters() {
    // Use API filtering instead of local filtering
    this.filterTrainers();
  }

  // Safe array access methods
  getTrainersToDisplay(): any[] {
    return this.detailedTrainers && this.detailedTrainers.length > 0 ? this.detailedTrainers : this.filteredTrainers;
  }

  // Clear all filters
  clearFilters() {
    this.searchTerm = '';
    this.selectedTechnology = '';
    this.selectedExperience = '';
    this.selectedLocation = '';
    // Reset to API data if available, otherwise reload from API
    if (this.detailedTrainers.length > 0) {
      this.filteredTrainers = [...this.detailedTrainers];
    } else {
      this.loadDetailedTrainers();
    }
  }

  // Get filtered trainers count
  get filteredCount(): number {
    return this.filteredTrainers.length;
  }

  // Get total trainers count
  get totalCount(): number {
    return this.trainers.length;
  }

  // View trainer profile
  viewProfile(trainer: DetailedTrainer) {
    console.log('Viewing profile for:', trainer.profile?.name || 'Trainer');
    
    // Store trainer data for the trainer courses page
    // this.shareDataService.setOption({
    //   trainerId: trainer.id,
    //   trainerName: trainer.name,
    //   trainerTitle: trainer.title,
    //   courseCategory: trainer.courseCategory,
    //   coursePrice: trainer.coursePrice,
    //   courseImage: trainer.courseImage,
    //   students: trainer.students,
    //   rating: trainer.rating,
    //   experience: trainer.experience,
    //   duration: trainer.duration,
    //   modules: trainer.modules,
    //   certification: trainer.certification,
    //   expertise: trainer.expertise,
    //   achievements: trainer.achievements,
    //   description: trainer.description,
    //   avatar: trainer.avatar,
    //   online: trainer.online,
    //   location: trainer.location
    // });
    
    // // Navigate to trainer courses page
    // this.router.navigate(['/trainer-courses']);
  }

  // Contact trainer
  contactTrainer(trainer: DetailedTrainer) {
    console.log('Contacting trainer:', trainer.profile?.name || 'Trainer');
    // Add contact logic here
  }

  // Format price with Indian Rupee symbol
  formatPrice(price: number): string {
    return `₹${price.toLocaleString('en-IN')}`;
  }

  // Get online status class
  getOnlineStatusClass(online: boolean): string {
    return online ? 'online' : 'offline';
  }

  // Get rating stars
  getRatingStars(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }

  // redirectToSignIn(): void {
  //   this.router.navigate(['/login']);
  // }

  scrollToHighlightedTrainer(): void {
    if (this.highlightedTrainerId) {
      const element = document.getElementById(`trainer-${this.highlightedTrainerId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add highlight effect
        element.classList.add('highlighted');
        setTimeout(() => element.classList.remove('highlighted'), 3000);
      }
    }
  }

  isTrainerHighlighted(trainerId: string): boolean {
    return this.highlightedTrainerId === trainerId;
  }

  // Pagination methods
  onPageChange(page: number) {
    this.currentPage = page;
    this.loadDetailedTrainers();
  }

  onPageSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const size = parseInt(target.value, 10);
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page
    this.loadDetailedTrainers();
  }

  // Reload data
  reloadTrainers() {
    this.loadDetailedTrainers();
  }

  // Get pagination info
  getPaginationInfo(): string {
    if (this.pagination && this.pagination.totalPages) {
      return `Page ${this.pagination.currentPage} of ${this.pagination.totalPages}`;
    }
    return '';
  }

  // Get page numbers for pagination
  getPageNumbers(): number[] {
    if (!this.pagination || !this.pagination.totalPages) {
      return [];
    }
    
    const totalPages = this.pagination.totalPages;
    const currentPage = this.pagination.currentPage;
    const pages: number[] = [];
    
    // Show max 5 page numbers
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
