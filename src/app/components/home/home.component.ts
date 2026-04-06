import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ShareDataService } from 'src/app/services/share-data.service';
import { CoursesService, Course } from '../../services/courses.service';
import { InstitutesService, Institute } from '../../services/institutes.service';
import { TrainersService, Trainer } from '../../services/trainers.service';
import { MentorsService, Mentor } from '../../services/mentors.service';
import { HomeService, TrendingCourse, Highlight, Achievement, Service, Review, HomeStats } from '../../services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    public shareData: ShareDataService,
    private coursesService: CoursesService,
    private institutesService: InstitutesService,
    private trainersService: TrainersService,
    private mentorsService: MentorsService,
    private homeService: HomeService,
    private router: Router
  ) {
    // this.coursesList = this.shareData.getCourses();
    // console.log(this.coursesList)
  }

  public searchModel: any;
  public descflag: boolean = false;
  public addheight: number = 600;
  public logos: any = ["fa-cogs", "fa-keyboard-o", "fa-free-code-camp", "fa-th", "fa-venus-mars", "fa-meetup", "fa-address-card-o", "fa-venus-mars", "fa-address-card-o", "fa-keyboard-o"]

  // Enhanced search functionality
  public searchQuery: string = '';
  public selectedCategory: string = 'courses';
  public filteredCourses: any[] = [];
  public filteredTrainers: any[] = [];
  public filteredInstitutes: any[] = [];
  public searchSuggestions: string[] = [];
  public showSearchDropdown: boolean = false;

  // Predefined suggestions based on common searches
  private allSuggestions: string[] = [
    'selenium automation testing',
    'penetration testing',
    'software testing',
    'qa testing',
    'api testing',
    'manual testing',
    'performance testing',
    'automation testing',
    'aws cloud computing',
    'azure cloud platform',
    'java programming',
    'python development',
    'react development',
    'angular framework',
    'devops engineering',
    'power bi analytics',
    'sap implementation'
  ];

  // API Data
  public featuredCourses: Course[] = [];
  public featuredInstitutes: Institute[] = [];
  public featuredTrainers: Trainer[] = [];
  public featuredMentors: Mentor[] = [];
  public loading = false;
  public error = '';

  // New Home API Data
  public trendingCourses: TrendingCourse[] = [];
  public highlights: Highlight[] = [];
  public achievements: Achievement[] = [];
  public services: Service[] = [];
  public reviews: Review[] = [];
  public homeStats: HomeStats = {
    totalStudents: 0,
    totalCourses: 0,
    totalInstructors: 0,
    totalReviews: 0,
    averageRating: 0,
    successRate: 0
  };
  public currentReviewIndex = 0;

  /** Home → login: same roles as `/login` (query `role`). */
  readonly loginRoleTabs: { role: 'student' | 'trainer' | 'institution' | 'admin'; label: string; icon: string; blurb: string }[] = [
    { role: 'student', label: 'Student', icon: 'fas fa-user-graduate', blurb: 'Learner account' },
    { role: 'trainer', label: 'Trainer', icon: 'fas fa-chalkboard-teacher', blurb: 'Teach & manage sessions' },
    { role: 'institution', label: 'Institution', icon: 'fas fa-building', blurb: 'Organization portal' },
    { role: 'admin', label: 'Admin', icon: 'fas fa-shield-alt', blurb: 'Platform administration' }
  ];

  // Registration popup state (removed - now handled by navigation bar)
  // public showRegistrationPopup: boolean = false;

  // Achievements view state
  public showAllAchievements = false;

  // Company logos data (static)
  public companyLogos = [
    { icon: '🪟', name: 'Microsoft', specialClass: '' },
    { icon: '🔍', name: 'Google', specialClass: '' },
    { icon: '📦', name: 'Amazon', specialClass: '' },
    { icon: '🍎', name: 'Apple', specialClass: '' },
    { icon: '💙', name: 'IBM', specialClass: '' },
    { icon: '🗼', name: 'Oracle', specialClass: '' },
    { icon: '♠', name: 'Capgemini', specialClass: '' },
    { icon: '🏢', name: '<span class="tech-text">Tech</span><span class="mahindra-text">Mahindra</span>', specialClass: '' },
    { icon: '💼', name: 'Infosys', specialClass: '' },
    { icon: '🔷', name: 'TCS', specialClass: '' },
    { icon: '🌐', name: 'Wipro', specialClass: '' },
    { icon: '🎯', name: 'Accenture', specialClass: '' },
    { icon: '🧠', name: 'Cognizant', specialClass: '' },
    { icon: '🏗️', name: 'HCL', specialClass: '' },
    { icon: '⚡', name: 'e-Zest', specialClass: '' },
    { icon: '🧩', name: '<span class="q-text">Q</span><span class="brainx-text">BRAINX</span>', specialClass: '' },
    { icon: '🌍', name: 'Globant', specialClass: '' },
    { icon: '🔧', name: '<span class="ness-name">Ness</span><span class="ness-subtitle">Digital Engineering</span>', specialClass: '' },
    { icon: '📊', name: 'Deloitte', specialClass: '' },
    { icon: '💎', name: 'PwC', specialClass: '' },
    { icon: '👁️', name: 'EY', specialClass: '' },
    { icon: '🔐', name: 'KPMG', specialClass: '' }
  ];

  public allcoursesList:any = [
    { courseId: 1, courseName: 'Angular', category: 'Frontend' },
    { courseId: 2, courseName: 'React JS', category: 'Frontend' },
    { courseId: 3, courseName: 'Vue JS', category: 'Frontend' },
    { courseId: 4, courseName: 'Node JS', category: 'Backend' },
    { courseId: 5, courseName: 'Express JS', category: 'Backend' },
    { courseId: 6, courseName: 'Python', category: 'Programming' },
    { courseId: 7, courseName: 'Django', category: 'Backend' },
    { courseId: 8, courseName: 'Flask', category: 'Backend' },
    { courseId: 9, courseName: 'Java', category: 'Programming' },
    { courseId: 10, courseName: 'Spring Boot', category: 'Backend' },
    { courseId: 11, courseName: 'C# .NET', category: 'Programming' },
    { courseId: 12, courseName: 'PHP', category: 'Backend' },
    { courseId: 13, courseName: 'Laravel', category: 'Backend' },
    { courseId: 14, courseName: 'HTML & CSS', category: 'Frontend' },
    { courseId: 15, courseName: 'JavaScript', category: 'Programming' },
    { courseId: 16, courseName: 'TypeScript', category: 'Programming' },
    { courseId: 17, courseName: 'MySQL', category: 'Database' },
    { courseId: 18, courseName: 'MongoDB', category: 'Database' },
    { courseId: 19, courseName: 'PostgreSQL', category: 'Database' },
    { courseId: 20, courseName: 'DevOps', category: 'Cloud & CI/CD' },
    { courseId: 21, courseName: 'AWS', category: 'Cloud' },
    { courseId: 22, courseName: 'Azure', category: 'Cloud' },
    { courseId: 23, courseName: 'Google Cloud', category: 'Cloud' },
    { courseId: 24, courseName: 'Docker', category: 'Cloud & CI/CD' },
    { courseId: 25, courseName: 'Kubernetes', category: 'Cloud & CI/CD' },
    { courseId: 26, courseName: 'Git & GitHub', category: 'Version Control' },
    { courseId: 27, courseName: 'Machine Learning', category: 'AI/ML' },
    { courseId: 28, courseName: 'Data Science', category: 'AI/ML' },
    { courseId: 29, courseName: 'Artificial Intelligence', category: 'AI/ML' },
    { courseId: 30, courseName: 'Cyber Security', category: 'Security' },
    { courseId: 31, courseName: 'Power BI', category: 'Data Analytics' },
    { courseId: 32, courseName: 'Tableau', category: 'Data Analytics' },
    { courseId: 33, courseName: 'Big Data Hadoop', category: 'Data Engineering' },
    { courseId: 34, courseName: 'Spark', category: 'Data Engineering' },
    { courseId: 35, courseName: 'Scala', category: 'Programming' },
    { courseId: 36, courseName: 'R Programming', category: 'Data Science' },
    { courseId: 37, courseName: 'Blockchain Development', category: 'Emerging Tech' },
    { courseId: 38, courseName: 'Web3 Development', category: 'Emerging Tech' },
    { courseId: 39, courseName: 'Mobile App Development', category: 'Mobile' },
    { courseId: 40, courseName: 'Android (Kotlin)', category: 'Mobile' },
    { courseId: 41, courseName: 'iOS (Swift)', category: 'Mobile' },
    { courseId: 42, courseName: 'Flutter', category: 'Mobile' },
    { courseId: 43, courseName: 'React Native', category: 'Mobile' },
    { courseId: 44, courseName: 'UI/UX Design', category: 'Design' },
    { courseId: 45, courseName: 'Figma & Prototyping', category: 'Design' },
    { courseId: 46, courseName: 'Testing with Selenium', category: 'Testing' },
    { courseId: 47, courseName: 'Manual Testing', category: 'Testing' },
    { courseId: 48, courseName: 'JIRA & Agile Tools', category: 'Project Management' },
    { courseId: 49, courseName: 'Cloud Security', category: 'Security' },
    { courseId: 50, courseName: 'Prompt Engineering (AI)', category: 'AI/ML' }
  ];
  

  public courses = [
    { course: ["HTML", "css", "Javascript", "Jquery", "Bootstarp"], description: "UI Development with angular", courseTitle: "UI Devlopment" },
    { course: ["HTML", "css", "Javascript", "Jquery", "Bootstarp"], description: "UI Development with Angular Js", courseTitle: "UI Devlopment" },
    { course: ["HTML", "css", "Javascript", "Jquery", "Bootstarp"], description: "UI Development with React Js", courseTitle: "UI Devlopment" },
    { course: ["HTML", "css", "Javascript", "Jquery", "Bootstarp"], description: "UI Development with Vennila Js", courseTitle: "UI Devlopment" },
    { course: ["HTML", "css", "Javascript", "Jquery", "Bootstarp", "Angular"], description: "UI Development with Node Js", courseTitle: "UI Devlopment" },
    { course: ["HTML", "css", "Javascript", "Jquery", "Bootstarp", "ReactJs"], description: "UI Development with Node Js", courseTitle: "UI Devlopment" },
    { course: ["HTML", "css", "Javascript", "Jquery", "Bootstarp", "Angular"], description: "Fullstack Development with Java", courseTitle: "UI Devlopment" },
    { course: ["HTML", "css", "Javascript", "Jquery", "Bootstarp", "ReactJs"], description: "Fullstack Development with Java", courseTitle: "UI Devlopment" },
    { course: ["HTML", "css", "Javascript", "Jquery", "Bootstarp", "Angular"], description: "Fullstack Development with .net", courseTitle: "UI Devlopment" },
    { course: ["HTML", "css", "Javascript", "Jquery", "Bootstarp", "ReactJs"], description: "Fullstack Development with .net", courseTitle: "UI Devlopment" },
    // Additional courses for better search results
    { course: ["AWS", "Cloud Computing", "DevOps"], description: "AWS Cloud Practitioner Certification", courseTitle: "AWS Cloud Computing" },
    { course: ["Azure", "Microsoft", "Cloud"], description: "Microsoft Azure Fundamentals", courseTitle: "Azure Cloud Platform" },
    { course: ["Java", "Spring Boot", "Microservices"], description: "Java Full Stack Development", courseTitle: "Java Programming" },
    { course: ["Python", "Django", "Data Science"], description: "Python for Data Science and AI", courseTitle: "Python Development" },
    { course: ["React", "Node.js", "MongoDB"], description: "Full Stack React Development", courseTitle: "React Development" },
    { course: ["Angular", "TypeScript", "RxJS"], description: "Angular Advanced Development", courseTitle: "Angular Framework" },
    { course: ["SAP", "ERP", "Business"], description: "SAP Business Process Integration", courseTitle: "SAP Implementation" },
    { course: ["Power BI", "Data Analytics", "Visualization"], description: "Power BI Data Visualization", courseTitle: "Power BI Analytics" },
    { course: ["Testing", "Selenium", "Automation"], description: "Software Testing Automation", courseTitle: "Testing Tools" },
    { course: ["DevOps", "Docker", "Kubernetes"], description: "DevOps with Containerization", courseTitle: "DevOps Engineering" }
  ]

  public trendingcoursesList:any = [
    { courseId: 1, courseName: 'Angular', category: 'Frontend' ,class: 'testing-bg'},
    { courseId: 9, courseName: 'Java', category: 'Programming' ,class: 'java-bg'},
    { courseId: 20, courseName: 'DevOps', category: 'Cloud & CI/CD',class: 'devops-bg'},
    { courseId: 22, courseName: 'Azure', category: 'Cloud' ,class: 'azure-bg'},
    { courseId: 28, courseName: 'Data Science', category: 'AI/ML' ,class: 'azure-bg'},
    { courseId: 29, courseName: 'Artificial Intelligence', category: 'Machine Learning',class: 'devops-bg' },
    { courseId: 31, courseName: 'Power BI', category: 'Data Analytics' ,class: 'java-bg'},
    { courseId: 46, courseName: 'Testing with Selenium', category: 'Testing' ,class: 'testing-bg'},
  ];
  public coursesList:any = [];
  // Sample trainers data
  public trainersList: any[] = [
    {
      id: 'trainer-1',
      name: 'Rahul Shetty',
      specialization: 'Selenium Automation Testing',
      experience: '8+ years',
      rating: 4.8,
      students: 15000,
      avatar: '/assets/photos/trainers/trainer-1.jpg',
      bio: 'Expert in Selenium Automation Testing and Framework Development'
    },
    {
      id: 'trainer-2',
      name: 'Artem Bondar',
      specialization: 'Playwright Testing',
      experience: '6+ years',
      rating: 4.7,
      students: 8500,
      avatar: '/assets/photos/trainers/trainer-2.jpg',
      bio: 'Specialized in Playwright Web Automation Testing'
    },
    {
      id: 'trainer-3',
      name: 'Tarek Roshdy',
      specialization: 'Software Testing',
      experience: '10+ years',
      rating: 4.9,
      students: 25000,
      avatar: '/assets/photos/trainers/trainer-3.jpg',
      bio: 'Comprehensive Software Testing Expert'
    },
    {
      id: 'trainer-4',
      name: 'Sarah Johnson',
      specialization: 'AWS Cloud Computing',
      experience: '7+ years',
      rating: 4.6,
      students: 12000,
      avatar: '/assets/photos/trainers/trainer-1.jpg',
      bio: 'AWS Certified Solutions Architect'
    },
    {
      id: 'trainer-5',
      name: 'Michael Chen',
      specialization: 'Java Programming',
      experience: '9+ years',
      rating: 4.8,
      students: 18000,
      avatar: '/assets/photos/trainers/trainer-2.jpg',
      bio: 'Senior Java Developer and Trainer'
    }
  ];

  // Sample institutes data
  public institutesList: any[] = [
    {
      id: 'institute-1',
      name: 'TechWindows Academy',
      specialization: 'Software Testing & QA',
      location: 'Bangalore, India',
      rating: 4.7,
      students: 50000,
      logo: '/assets/photos/logo.png',
      description: 'Leading institute for Software Testing and Quality Assurance'
    },
    {
      id: 'institute-2',
      name: 'Cloud Masters Institute',
      specialization: 'Cloud Computing',
      location: 'Hyderabad, India',
      rating: 4.6,
      students: 35000,
      logo: '/assets/photos/logo.png',
      description: 'Expert training in AWS, Azure, and Google Cloud'
    },
    {
      id: 'institute-3',
      name: 'CodeCraft Academy',
      specialization: 'Programming Languages',
      location: 'Mumbai, India',
      rating: 4.8,
      students: 45000,
      logo: '/assets/photos/logo.png',
      description: 'Comprehensive programming courses in Java, Python, React'
    },
    {
      id: 'institute-4',
      name: 'DevOps Pro Institute',
      specialization: 'DevOps Engineering',
      location: 'Pune, India',
      rating: 4.5,
      students: 28000,
      logo: '/assets/photos/logo.png',
      description: 'Advanced DevOps and CI/CD training programs'
    },
    {
      id: 'institute-5',
      name: 'Data Science Hub',
      specialization: 'Data Analytics',
      location: 'Chennai, India',
      rating: 4.7,
      students: 32000,
      logo: '/assets/photos/logo.png',
      description: 'Power BI, Tableau, and Data Science training'
    }
  ];
  ngOnInit() {
    this.loadFeaturedData();

    // Load home page data from new APIs
    this.loadHomeData();
  }

  loadFeaturedData() {
    this.loading = true;
    this.error = '';

    // Load featured courses
    this.coursesService.getFeaturedCourses().subscribe({
      next: (courses: Course[]) => {
        this.featuredCourses = courses;
      },
      error: (error: any) => {
        console.error('Error loading featured courses:', error);
        this.error = 'Failed to load featured courses';
      }
    });

    // Load featured institutes
    this.institutesService.getFeaturedInstitutes().subscribe({
      next: (response: any) => {
        this.featuredInstitutes = response.data || [];
      },
      error: (error: any) => {
        console.error('Error loading featured institutes:', error);
        this.error = 'Failed to load featured institutes';
      }
    });

    // Load featured trainers
    this.trainersService.getFeaturedTrainers().subscribe({
      next: (trainers: Trainer[]) => {
        this.featuredTrainers = trainers;
      },
      error: (error: any) => {
        console.error('Error loading featured trainers:', error);
        this.error = 'Failed to load featured trainers';
      }
    });

    // Load featured mentors
    this.mentorsService.getFeaturedMentors().subscribe({
      next: (mentors: Mentor[]) => {
        this.featuredMentors = mentors;
      },
      error: (error: any) => {
        console.error('Error loading featured mentors:', error);
        this.error = 'Failed to load featured mentors';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  loadHomeData() {
    // Load trending courses
    this.homeService.getTrendingCourses().subscribe({
      next: (courses: TrendingCourse[]) => {
        this.trendingCourses = courses || [];
        console.log('Trending courses loaded:', this.trendingCourses);
      },
      error: (error: any) => {
        console.error('Error loading trending courses:', error);
        this.trendingCourses = [];
      }
    });

    // Load highlights
    this.homeService.getHighlights().subscribe({
      next: (highlights: Highlight[]) => {
        this.highlights = highlights || [];
      },
      error: (error: any) => {
        console.error('Error loading highlights:', error);
        this.highlights = [];
      }
    });

    // Load achievements
    this.homeService.getAchievements().subscribe({
      next: (achievements: Achievement[]) => {
        this.achievements = achievements || [];
      },
      error: (error: any) => {
        console.error('Error loading achievements:', error);
        this.achievements = [];
      }
    });

    // Load services
    this.homeService.getServices().subscribe({
      next: (services: Service[]) => {
        this.services = services || [];
      },
      error: (error: any) => {
        console.error('Error loading services:', error);
        this.services = [];
      }
    });

    // Load reviews
    this.homeService.getReviews().subscribe({
      next: (response: any) => {
        this.reviews = response.data || [];
        // If no reviews from API, use default reviews
        if (this.reviews.length === 0) {
          this.reviews = this.getDefaultReviews();
        }
      },
      error: (error: any) => {
        console.error('Error loading reviews:', error);
        // Use default reviews on error
        this.reviews = this.getDefaultReviews();
      }
    });

    // Load home stats
    this.homeService.getHomeStats().subscribe({
      next: (stats: HomeStats) => {
        this.homeStats = stats || {
          totalStudents: 0,
          totalCourses: 0,
          totalInstructors: 0,
          totalReviews: 0,
          averageRating: 0,
          successRate: 0
        };
      },
      error: (error: any) => {
        console.error('Error loading home stats:', error);
        this.homeStats = {
          totalStudents: 0,
          totalCourses: 0,
          totalInstructors: 0,
          totalReviews: 0,
          averageRating: 0,
          successRate: 0
        };
      }
    });
  }
  ipfocus() {
    this.descflag = true;
  }
  ipblur() {
    this.descflag = false;
  }
  gotocourse(data: any) {
    console.log("ddd", data)
    this.shareData.setOption(data);
  }
  loadmore() {
    this.addheight += 300;
    let data = ["Phython", "PHP", "Oracle", "Node Js", "c#", "Big Data", "Jira", "Devops", "ADF", ".net"];
    data.forEach((val) => {
      // this.coursesList.push(val)

    })
  }

  // Reviews pagination methods
  goToReview(index: number) {
    if (this.reviews && this.reviews.length > 0) {
      this.currentReviewIndex = index;
    }
  }

  nextReview() {
    if (this.reviews && this.reviews.length > 0) {
      this.currentReviewIndex = (this.currentReviewIndex + 1) % this.reviews.length;
    }
  }

  previousReview() {
    if (this.reviews && this.reviews.length > 0) {
      this.currentReviewIndex = this.currentReviewIndex === 0
        ? this.reviews.length - 1
        : this.currentReviewIndex - 1;
    }
  }

  // Default reviews to display if API doesn't return any
  getDefaultReviews(): Review[] {
    return [
      {
        id: '1',
        studentName: 'Rajesh Kumar',
        author: 'Rajesh Kumar',
        text: 'Excellent training platform! The instructors are highly knowledgeable and the course content is comprehensive. I successfully completed the AWS Cloud course and got placed in a top MNC.',
        review: 'Excellent training platform! The instructors are highly knowledgeable and the course content is comprehensive. I successfully completed the AWS Cloud course and got placed in a top MNC.',
        course: 'AWS Cloud Computing',
        rating: 5,
        avatar: '',
        company: 'TCS',
        position: 'Cloud Engineer',
        date: '2024-01-15'
      },
      {
        id: '2',
        studentName: 'Priya Sharma',
        author: 'Priya Sharma',
        text: 'Amazing experience! The hands-on projects and real-world scenarios helped me understand Java programming deeply. The placement support team was very helpful in preparing for interviews.',
        review: 'Amazing experience! The hands-on projects and real-world scenarios helped me understand Java programming deeply. The placement support team was very helpful in preparing for interviews.',
        course: 'Java Programming',
        rating: 5,
        avatar: '',
        company: 'Infosys',
        position: 'Software Developer',
        date: '2024-02-20'
      },
      {
        id: '3',
        studentName: 'Amit Patel',
        author: 'Amit Patel',
        text: 'Best decision I made for my career! The Data Science course covered everything from basics to advanced topics. The trainers are industry experts and always available for doubt clarification.',
        review: 'Best decision I made for my career! The Data Science course covered everything from basics to advanced topics. The trainers are industry experts and always available for doubt clarification.',
        course: 'Data Science',
        rating: 5,
        avatar: '',
        company: 'Wipro',
        position: 'Data Analyst',
        date: '2024-03-10'
      },
      {
        id: '4',
        studentName: 'Sneha Reddy',
        author: 'Sneha Reddy',
        text: 'Outstanding quality of training! The course materials are up-to-date and the practical sessions are very engaging. I landed my dream job as a DevOps Engineer after completing the course.',
        review: 'Outstanding quality of training! The course materials are up-to-date and the practical sessions are very engaging. I landed my dream job as a DevOps Engineer after completing the course.',
        course: 'DevOps',
        rating: 5,
        avatar: '',
        company: 'Accenture',
        position: 'DevOps Engineer',
        date: '2024-04-05'
      },
      {
        id: '5',
        studentName: 'Vikram Singh',
        author: 'Vikram Singh',
        text: 'Highly recommended! The Python course structure is excellent and the instructors explain complex concepts in a simple way. The certification helped me switch to a better role.',
        review: 'Highly recommended! The Python course structure is excellent and the instructors explain complex concepts in a simple way. The certification helped me switch to a better role.',
        course: 'Python Development',
        rating: 5,
        avatar: '',
        company: 'Cognizant',
        position: 'Python Developer',
        date: '2024-05-12'
      },
      {
        id: '6',
        studentName: 'Anjali Mehta',
        author: 'Anjali Mehta',
        text: 'Fantastic learning platform! The React.js course is well-structured with practical projects. The support team is responsive and the placement assistance is top-notch.',
        review: 'Fantastic learning platform! The React.js course is well-structured with practical projects. The support team is responsive and the placement assistance is top-notch.',
        course: 'React.js',
        rating: 5,
        avatar: '',
        company: 'HCL',
        position: 'Frontend Developer',
        date: '2024-06-18'
      }
    ];
  }

  // Helper methods for mentor data
  getMentorAvatar(mentor: any): string {
    return (mentor && mentor.user && mentor.user.avatar) || 'assets/photos/default-avatar.png';
  }

  getMentorName(mentor: any): string {
    if (!mentor || !mentor.user) return 'Mentor';
    const firstName = mentor.user.firstName || '';
    const lastName = mentor.user.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Mentor';
  }

  getMentorHourlyRate(mentor: any): number {
    return (mentor && mentor.pricing && mentor.pricing.hourlyRate) || 0;
  }

  getMentorRating(mentor: any): number {
    return (mentor && mentor.rating && mentor.rating.overall) || 0;
  }

  getMentorExperience(mentor: any): number {
    return (mentor && mentor.experience && mentor.experience.years) || 0;
  }

  getMentorDomain(mentor: any): string {
    return (mentor && mentor.domain) || 'Mentor';
  }

  getReviewAuthorInitial(review: any): string {
    const name = (review && (review.studentName || review.author)) || 'U';
    return name.charAt(0).toUpperCase();
  }

  hideImageOnError(event: any): void {
    if (event && event.target) {
      event.target.style.display = 'none';
    }
  }

  // Helper methods for trainer data
  getTrainerAvatar(trainer: any): string {
    return (trainer && trainer.user && trainer.user.avatar) || 'assets/photos/default-avatar.png';
  }

  getTrainerName(trainer: any): string {
    if (!trainer || !trainer.user) return 'Trainer';
    const firstName = trainer.user.firstName || '';
    const lastName = trainer.user.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Trainer';
  }

  getTrainerHourlyRate(trainer: any): number {
    return (trainer && trainer.pricing && trainer.pricing.hourlyRate) || 0;
  }

  getTrainerRating(trainer: any): number {
    return (trainer && trainer.rating && trainer.rating.overall) || 0;
  }

  getTrainerExperience(trainer: any): number {
    return (trainer && trainer.experience && trainer.experience.years) || 0;
  }

  getTrainerSpecialization(trainer: any): string {
    return (trainer && trainer.specialization) || 'Trainer';
  }

  getInstituteRating(institute: any): number {
    return (institute && institute.rating && institute.rating.overall) || 0;
  }

  getInstituteStudentsTotal(institute: any): number {
    return (institute && institute.students && institute.students.total) || 0;
  }

  getInstituteDescription(institute: any): string {
    const desc = (institute && institute.description) || '';
    return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
  }

  // Toggle achievements view
  toggleAchievements() {
    this.showAllAchievements = !this.showAllAchievements;
  }

  // Navigate to course institutes page (original method - kept for compatibility)
  // navigateToCourseInstitutesOld(courseName: string) {
  //   alert("a")
  //   console.log('Navigating to course institutes for:', courseName);
  //   this.router.navigate(['/Course-institutes', courseName.toLowerCase().replace(/\s+/g, '-')]);
  //   // Store the selected course name for the institute listing page
  //   this.shareData.setOption({
  //     courseName: courseName,
  //     courseTitle: courseName
  //   });

  //   // Navigate to the course institutes page
  //   this.router.navigate(['/Course-institutes', courseName.toLowerCase().replace(/\s+/g, '-')]);
  // }

  // Simple search functionality
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.updateSearchResults();
  }

  onSearchFocus(): void {
    this.showSearchDropdown = true;
    this.updateSearchResults();
  }

  onSearchBlur(): void {
    // Delay hiding to allow clicking on results
    setTimeout(() => {
      this.showSearchDropdown = false;
    }, 200);
  }

  onSearchClick(): void {
    // Handle search button click
    if (this.searchQuery.trim()) {
      this.updateSearchResults();
      this.showSearchDropdown = true;
    }
  }

  // Update search results based on current query
  updateSearchResults(): void {
    const query = this.searchQuery.toLowerCase().trim();
    console.log('Search query:', query);
    console.log('Courses list:', this.allcoursesList);

    if (query.length > 0) {
      // Filter courses based on search query
      this.filteredCourses = this.allcoursesList.filter((course: any) =>
        course.courseName.toLowerCase().includes(query) ||
        course.category?.toLowerCase().includes(query)
      );

      this.showSearchDropdown = this.filteredCourses.length > 0;
    } else {
      this.filteredCourses = [];
      this.showSearchDropdown = false;
    }
  }

  onCategoryChange(): void {
    // Handle category change
    console.log('Selected category:', this.selectedCategory);
    // Update search results based on selected category
    this.updateSearchResults();
  }

  // Get category icon based on selected category
  getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      'courses': 'bi bi-book',
      'institutes': 'bi bi-building',
      'trainers': 'bi bi-person',
      'mentors': 'bi bi-people'
    };
    return iconMap[category] || 'bi bi-search';
  }

  // Get category label based on selected category
  getCategoryLabel(category: string): string {
    const labelMap: { [key: string]: string } = {
      'courses': 'Courses',
      'institutes': 'Institutes',
      'trainers': 'Trainers',
      'mentors': 'Mentors'
    };
    return labelMap[category] || 'All';
  }

  // Handle clicking outside search dropdown
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const searchContainer = document.querySelector('.search-container');

    if (searchContainer && !searchContainer.contains(target)) {
      this.showSearchDropdown = false;
    }
  }


  selectSuggestion(suggestion: string): void {
    this.searchQuery = suggestion;
    this.updateSearchResults();
    // Keep dropdown open to show results for the selected suggestion
  }

  getCourseImage(title: string): string {
    const imageMap: { [key: string]: string } = {
      'devops': 'course1.jfif',
      'power bi': 'course2.jfif',
      'testing': 'course3.jfif',
      'azure': 'course1.jfif',
      'sap': 'course2.jfif',
      'aws': 'course3.jfif',
      'java': 'course1.jfif',
      'net': 'course2.jfif',
      'web': 'course3.jfif',
      'python': 'course1.jfif',
      'react': 'course2.jfif',
      'angular': 'course3.jfif'
    };

    const lowerTitle = title.toLowerCase();
    for (const [key, image] of Object.entries(imageMap)) {
      if (lowerTitle.includes(key)) {
        return `/assets/photos/courses/${image}`;
      }
    }
    return '/assets/photos/courses/course1.jfif';
  }

  viewCourseDetails(course: any): void {
    try {
      if (!course || !course.courseTitle) {
        console.error('Invalid course data:', course);
        alert('Unable to view course details. Please try again.');
        return;
      }

      // Store course data for details page
      sessionStorage.setItem('course-details', JSON.stringify(course));

      // Navigate to course details page
      const courseSlug = course.courseTitle.toLowerCase().replace(/\s+/g, '-');
      this.router.navigate(['/Course-details', courseSlug]);
      this.showSearchDropdown = false; // Hide dropdown after navigation

      console.log('Navigating to course:', course.courseTitle);
    } catch (error) {
      console.error('Error navigating to course details:', error);
      alert('An error occurred while navigating to course details.');
    }
  }

  viewTrainerDetails(trainer: any): void {
    try {
      if (!trainer || !trainer.id) {
        console.error('Invalid trainer data:', trainer);
        alert('Unable to view trainer details. Please try again.');
        return;
      }

      // Store trainer data for trainers page
      sessionStorage.setItem('selected-trainer', JSON.stringify(trainer));

      // Navigate to trainers page with highlight and search parameters
      this.router.navigate(['/Trainers'], {
        queryParams: {
          highlight: trainer.id,
          search: this.searchQuery
        }
      });
      this.showSearchDropdown = false; // Hide dropdown after navigation

      console.log('Navigating to trainer:', trainer.name);
    } catch (error) {
      console.error('Error navigating to trainer details:', error);
      alert('An error occurred while navigating to trainer details.');
    }
  }

  viewInstituteDetails(institute: any): void {
    try {
      if (!institute || !institute.id) {
        console.error('Invalid institute data:', institute);
        alert('Unable to view institute details. Please try again.');
        return;
      }

      // Store institute data for institutes page
      sessionStorage.setItem('selected-institute', JSON.stringify(institute));

      // Navigate to institutes page with highlight and search parameters
      this.router.navigate(['/Institutes'], {
        queryParams: {
          highlight: institute.id,
          search: this.searchQuery
        }
      });
      this.showSearchDropdown = false; // Hide dropdown after navigation

      console.log('Navigating to institute:', institute.name);
    } catch (error) {
      console.error('Error navigating to institute details:', error);
      alert('An error occurred while navigating to institute details.');
    }
  }

  // Helper methods for trending courses API integration
  getTrendingCourseIcon(title: string): string {
    if (!title) return '📚';
    const iconMap: { [key: string]: string } = {
      'devops': '∞',
      'power bi': '📊',
      'testing': '🔍',
      'azure': '☁️',
      'sap': 'SAP',
      'aws': 'AWS',
      'java': '☕',
      'net': '.NET',
      'python': '🐍',
      'react': '⚛️',
      'angular': '🅰️',
      'javascript': '📜',
      'html': '🌐',
      'css': '🎨',
      'node': '🟢',
      'mongodb': '🍃',
      'mysql': '🐬',
      'docker': '🐳',
      'kubernetes': '☸️',
      'jenkins': '🔧',
      'git': '📦',
      'github': '🐙',
      'linux': '🐧',
      'windows': '🪟',
      'android': '🤖',
      'ios': '🍎',
      'flutter': '🦋',
      'react native': '📱',
      'vue': '💚',
      'typescript': '🔷',
      'php': '🐘',
      'laravel': '🔴',
      'django': '🎯',
      'flask': '🌶️',
      'spring': '🍃',
      'hibernate': '💤',
      'jpa': '📊',
      'microservices': '🔗',
      'rest api': '🌐',
      'graphql': '📈',
      'redis': '🔴',
      'elasticsearch': '🔍',
      'kafka': '📨',
      'rabbitmq': '🐰',
      'nginx': '🟢',
      'apache': '🔴',
      'tomcat': '🐱',
      'jetty': '✈️',
      'wildfly': '🦋',
      'jboss': '🔴',
      'weblogic': '🔵',
      'websphere': '🔵',
      'oracle': '🗼',
      'postgresql': '🐘',
      'sqlite': '🗃️',
      'firebase': '🔥',
      'supabase': '⚡',
      'planetscale': '🪐',
      'vercel': '▲',
      'netlify': '🌐',
      'heroku': '🟣',
      // 'aws': '☁️',
      // 'azure': '🔵',
      'gcp': '🌩️',
      'digital ocean': '🌊',
      'linode': '🌲',
      'vultr': '⚡',
      'cloudflare': '☁️',
      'fastly': '⚡',
      'cloudfront': '🌩️',
      's3': '🪣',
      'ec2': '💻',
      'lambda': 'λ',
      'api gateway': '🚪',
      'dynamodb': '⚡',
      'rds': '🗄️',
      'elasticache': '⚡',
      'sns': '📢',
      'sqs': '📬',
      'ses': '📧',
      'cloudwatch': '👁️',
      'cloudtrail': '🛤️',
      'iam': '🔐',
      'cognito': '👤',
      'amplify': '⚡',
      'appsync': '🔄',
      'step functions': '👣',
      'batch': '📦',
      'fargate': '🚀',
      'eks': '☸️',
      'ecs': '🐳',
      'ecr': '📦',
      'codebuild': '🔨',
      'codedeploy': '🚀',
      'codepipeline': '🔧',
      'codecommit': '📝',
      'codestar': '⭐',
      'x-ray': '🔍',
      'cloudformation': '🏗️',
      'cdk': '🏗️',
      'terraform': '🏗️',
      'ansible': '🎭',
      'chef': '👨‍🍳',
      'puppet': '🎭',
      'salt': '🧂',
      'vagrant': '📦',
      'packer': '📦',
      'consul': '🏛️',
      'vault': '🔐',
      'nomad': '🚀',
      'traefik': '🚦',
      'istio': '🌐',
      'linkerd': '🔗',
      'envoy': '🛡️',
      'prometheus': '📊',
      'grafana': '📈',
      'elk': '🦌',
      'fluentd': '🌊',
      'jaeger': '🔍',
      'zipkin': '📦',
      'datadog': '🐕',
      'newrelic': '🆕',
      'splunk': '🔍',
      'sumo logic': '📊',
      'pagerduty': '📞',
      'opsgenie': '🚨',
      'victorops': '⚡',
      'sentry': '🚨',
      'rollbar': '📦',
      'bugsnag': '🐛',
      'honeybadger': '🍯',
      'airbrake': '✈️',
      'raygun': '🔫',
      'logrocket': '🚀',
      'hotjar': '🔥',
      'mixpanel': '📊',
      'amplitude': '📈',
      'segment': '📦',
      'rudderstack': '🚀',
      'mparticle': '📱',
      'branch': '🌿',
      'adjust': '⚖️',
      'appsflyer': '✈️',
      'kochava': '🦎',
      'singular': '🎯',
      'tenjin': '🔟',
      'tune': '🎵',
      'hasoffers': '💰',
      'affise': '🤝',
      'cake': '🎂',
      'voluum': '📊',
      'thrive': '🌱',
      'clickmagick': '🪄',
      'prosper202': '💰',
      'tracking202': '📊',
      'imobitrax': '📱',
      'binom': '📊',
      // 'voluum': '📊',
      // 'thrive': '🌱',
      // 'clickmagick': '🪄',
      // 'prosper202': '💰',
      // 'tracking202': '📊',
      // 'imobitrax': '📱',
      // 'binom': '📊'
    };

    const lowerTitle = title.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerTitle.includes(key)) {
        return icon;
      }
    }
    return '📚'; // Default icon
  }

  getTrendingCourseBgClass(title: string): string {
    if (!title) return 'default-bg';
    const bgClassMap: { [key: string]: string } = {
      'devops': 'devops-bg',
      'power bi': 'powerbi-bg',
      'testing': 'testing-bg',
      'azure': 'azure-bg',
      'sap': 'sap-bg',
      'aws': 'aws-bg',
      'java': 'java-bg',
      'net': 'dotnet-bg',
      'python': 'python-bg',
      'react': 'react-bg',
      'angular': 'angular-bg',
      'javascript': 'js-bg',
      'html': 'html-bg',
      'css': 'css-bg',
      'node': 'node-bg',
      'mongodb': 'mongo-bg',
      'mysql': 'mysql-bg',
      'docker': 'docker-bg',
      'kubernetes': 'k8s-bg',
      'jenkins': 'jenkins-bg',
      'git': 'git-bg',
      'github': 'github-bg',
      'linux': 'linux-bg',
      'windows': 'windows-bg',
      'android': 'android-bg',
      'ios': 'ios-bg',
      'flutter': 'flutter-bg',
      'react native': 'rn-bg',
      'vue': 'vue-bg',
      'typescript': 'ts-bg',
      'php': 'php-bg',
      'laravel': 'laravel-bg',
      'django': 'django-bg',
      'flask': 'flask-bg',
      'spring': 'spring-bg',
      'hibernate': 'hibernate-bg',
      'jpa': 'jpa-bg',
      'microservices': 'microservices-bg',
      'rest api': 'api-bg',
      'graphql': 'graphql-bg',
      'redis': 'redis-bg',
      'elasticsearch': 'elasticsearch-bg',
      'kafka': 'kafka-bg',
      'rabbitmq': 'rabbitmq-bg',
      'nginx': 'nginx-bg',
      'apache': 'apache-bg',
      'tomcat': 'tomcat-bg',
      'jetty': 'jetty-bg',
      'wildfly': 'wildfly-bg',
      'jboss': 'jboss-bg',
      'weblogic': 'weblogic-bg',
      'websphere': 'websphere-bg',
      'oracle': 'oracle-bg',
      'postgresql': 'postgresql-bg',
      'sqlite': 'sqlite-bg',
      'firebase': 'firebase-bg',
      'supabase': 'supabase-bg',
      'planetscale': 'planetscale-bg',
      'vercel': 'vercel-bg',
      'netlify': 'netlify-bg',
      'heroku': 'heroku-bg',
      // 'aws': 'aws-bg',
      'gcp': 'gcp-bg',
      'digital ocean': 'do-bg',
      'linode': 'linode-bg',
      'vultr': 'vultr-bg',
      'cloudflare': 'cloudflare-bg',
      'fastly': 'fastly-bg',
      'cloudfront': 'cloudfront-bg',
      's3': 's3-bg',
      'ec2': 'ec2-bg',
      'lambda': 'lambda-bg',
      'api gateway': 'apigateway-bg',
      'dynamodb': 'dynamodb-bg',
      'rds': 'rds-bg',
      'elasticache': 'elasticache-bg',
      'sns': 'sns-bg',
      'sqs': 'sqs-bg',
      'ses': 'ses-bg',
      'cloudwatch': 'cloudwatch-bg',
      'cloudtrail': 'cloudtrail-bg',
      'iam': 'iam-bg',
      'cognito': 'cognito-bg',
      'amplify': 'amplify-bg',
      'appsync': 'appsync-bg',
      'step functions': 'stepfunctions-bg',
      'batch': 'batch-bg',
      'fargate': 'fargate-bg',
      'eks': 'eks-bg',
      'ecs': 'ecs-bg',
      'ecr': 'ecr-bg',
      'codebuild': 'codebuild-bg',
      'codedeploy': 'codedeploy-bg',
      'codepipeline': 'codepipeline-bg',
      'codecommit': 'codecommit-bg',
      'codestar': 'codestar-bg',
      'x-ray': 'xray-bg',
      'cloudformation': 'cloudformation-bg',
      'cdk': 'cdk-bg',
      'terraform': 'terraform-bg',
      'ansible': 'ansible-bg',
      'chef': 'chef-bg',
      'puppet': 'puppet-bg',
      'salt': 'salt-bg',
      'vagrant': 'vagrant-bg',
      'packer': 'packer-bg',
      'consul': 'consul-bg',
      'vault': 'vault-bg',
      'nomad': 'nomad-bg',
      'traefik': 'traefik-bg',
      'istio': 'istio-bg',
      'linkerd': 'linkerd-bg',
      'envoy': 'envoy-bg',
      'prometheus': 'prometheus-bg',
      'grafana': 'grafana-bg',
      'elk': 'elk-bg',
      'fluentd': 'fluentd-bg',
      'jaeger': 'jaeger-bg',
      'zipkin': 'zipkin-bg',
      'datadog': 'datadog-bg',
      'newrelic': 'newrelic-bg',
      'splunk': 'splunk-bg',
      'sumo logic': 'sumologic-bg',
      'pagerduty': 'pagerduty-bg',
      'opsgenie': 'opsgenie-bg',
      'victorops': 'victorops-bg',
      'sentry': 'sentry-bg',
      'rollbar': 'rollbar-bg',
      'bugsnag': 'bugsnag-bg',
      'honeybadger': 'honeybadger-bg',
      'airbrake': 'airbrake-bg',
      'raygun': 'raygun-bg',
      'logrocket': 'logrocket-bg',
      'hotjar': 'hotjar-bg',
      'mixpanel': 'mixpanel-bg',
      'amplitude': 'amplitude-bg',
      'segment': 'segment-bg',
      'rudderstack': 'rudderstack-bg',
      'mparticle': 'mparticle-bg',
      'branch': 'branch-bg',
      'adjust': 'adjust-bg',
      'appsflyer': 'appsflyer-bg',
      'kochava': 'kochava-bg',
      'singular': 'singular-bg',
      'tenjin': 'tenjin-bg',
      'tune': 'tune-bg',
      'hasoffers': 'hasoffers-bg',
      'affise': 'affise-bg',
      'cake': 'cake-bg',
      'voluum': 'voluum-bg',
      'thrive': 'thrive-bg',
      'clickmagick': 'clickmagick-bg',
      'prosper202': 'prosper202-bg',
      'tracking202': 'tracking202-bg',
      'imobitrax': 'imobitrax-bg',
      'binom': 'binom-bg'
    };

    const lowerTitle = title.toLowerCase();
    for (const [key, bgClass] of Object.entries(bgClassMap)) {
      if (lowerTitle.includes(key)) {
        return bgClass;
      }
    }
    return 'default-bg'; // Default background class
  }

  // Course selection popup
  public showCourseSelectionPopup: boolean = false;
  public selectedCourse: any = null;
  openCourseSelectionPopup(courseTitle: any): void {

    this.selectedCourse = courseTitle;

    console.log("selectedCourse=============",courseTitle);
    this.showCourseSelectionPopup = true;
    this.showSearchDropdown = false;
  }
  navigateToCoursepopup(courseDetails: any): void {
    // alert(courseTitle);
    // Find the selected course
    this.selectedCourse = courseDetails;
    // this.selectedCourse = this.coursesList.find((course: any) => 
    //   course.courseTitle === courseTitle
    // );
    console.log(this.selectedCourse);   // Show the course selection popup
    this.showCourseSelectionPopup = true;
    this.showSearchDropdown = false;
  }

  closeCourseSelectionPopup(): void {
    this.showCourseSelectionPopup = false;
    this.selectedCourse = null;
  }


  // Navigation methods for the popup cards
  navigateToInstitutes(): void {
    console.log("selectedCourse=============",this.selectedCourse);
    const navigateTo: NavigationExtras = {
      queryParams: {
        courseId: this.selectedCourse.courseId,
        courseName: this.selectedCourse.courseName,
      }
    }
    console.log("navigateTo",navigateTo);
    this.router.navigate(['/Course-institutes/'], navigateTo);
  }

  navigateToTrainers(): void {
    // Navigate to Course-trainers with course information
    const navigateTo: NavigationExtras = {
      queryParams: {
        
        courseId: this.selectedCourse.courseId,
        courseName: this.selectedCourse.courseName,
      }
    }
    this.router.navigate(['/Course-trainers/'], navigateTo);
    this.closeCourseSelectionPopup();

  }

  navigateToMentors(): void {
    
    // Navigate to Course-mentors with course information
    const navigateTo: NavigationExtras = {
      queryParams: {
        courseId: this.selectedCourse.courseId,
        courseName: this.selectedCourse.courseName
      }
    };
    console.log("Navigate to Course-mentors", navigateTo);
    this.router.navigate(['/Course-mentors/'], navigateTo);
    this.closeCourseSelectionPopup();

  }

  // Registration popup methods (removed - now handled by navigation bar)
  // openRegistrationPopup(): void {
  //   this.showRegistrationPopup = true;
  // }

  // closeRegistrationPopup(): void {
  //   this.showRegistrationPopup = false;
  // }
  
}
