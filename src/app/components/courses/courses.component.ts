import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShareDataService } from 'src/app/services/share-data.service';
import { CoursesService, Course } from '../../services/courses.service';

interface LocalCourse {
  courseId: number;
  courseName: string;
  img: string;
  courseTitle: string;
  tagName: string;
  coursereviewers: number;
  coursePrice: string;
  instituesReviews: string;
  insreviewes: number;
  courseTitle1: string;
  courseTitle2: string;
  price: number;
  courseDescription: string;
}

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  
  public coursesList: any[] = [];
  public filteredCourses: any[] = [];
  public searchTerm: string = '';
  public selectedCategory: string = '';
  public selectedLevel: string = '';
  public selectedPrice: string = '';

  // New API data
  public detailedCourses: Course[] = [];
  public loading = false;
  public error = '';
  public pagination: any = {};
  public currentPage = 1;
  public pageSize = 10;
  public selectedCourse:any;
  constructor(
    public route: Router, 
    public shareDataService: ShareDataService,
    private coursesService: CoursesService
  ) {
    this.coursesList = this.shareDataService.getCourses();
    this.filteredCourses = [...this.coursesList];
  }

  ngOnInit() {
    console.log('CoursesComponent initialized');
    console.log('Initial coursesList:', this.coursesList);
    
    // Initialize with all courses
    this.filteredCourses = [...this.coursesList];
    
    // Load detailed courses from API (this will also populate coursesList)
    this.loadDetailedCourses();
  }

  loadDetailedCourses() {
    this.loading = true;
    this.error = '';
    
    this.coursesService.getDetailedCourses(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.detailedCourses = response.data;
        this.pagination = response.pagination;
        
        // Also populate coursesList for compatibility with existing UI
        this.coursesList = response.data.map((course: any) => ({
          courseId: course.id,
          courseName: course.courseName || course.title,
          img: course.image,
          courseTitle: course.title,
          tagName: course.category,
          coursereviewers: course.reviewsCount || course.totalReviews,
          coursePrice: `₹${course.price}`,
          instituesReviews: course.institute?.name || 'TechWindows',
          insreviewes: course.reviewsCount || course.totalReviews,
          courseTitle1: course.subtitle,
          courseTitle2: course.description,
          price: course.price,
          courseDescription: course.description,
          // Additional API data
          technologies: course.technologies,
          features: course.features,
          requirements: course.requirements,
          whatYouWillLearn: course.whatYouWillLearn,
          syllabus: course.syllabus,
          rating: course.rating,
          enrolledStudents: course.studentsCount || course.enrolledStudents,
          duration: course.duration,
          modules: course.modules,
          instructor: course.instructor,
          institute: course.institute,
          isFeatured: course.isFeatured,
          isPopular: course.isPopular
        }));
        
        this.filteredCourses = [...this.coursesList];
        this.loading = false;
        console.log('Detailed courses loaded:', this.detailedCourses);
        console.log('Courses list updated:', this.coursesList);
      },
      error: (error) => {
        console.error('Error loading detailed courses:', error);
        this.error = 'Failed to load courses';
        this.loading = false;
        // Keep existing local data as fallback
      }
    });
  }

  loadCourses() {
    this.loading = true;
    this.error = '';
    
    this.coursesService.getCourses({
      page: this.currentPage,
      limit: this.pageSize
    }).subscribe({
      next: (response) => {
        // Convert API courses to local format for compatibility
        this.coursesList = response.courses.map(course => ({
          courseId: course.id,
          courseName: course.title,
          img: course.image,
          courseTitle: course.title,
          tagName: course.category,
          coursereviewers: course.totalReviews,
          coursePrice: `₹${course.price}`,
          instituesReviews: course.institute?.name || 'TechWindows',
          insreviewes: course.totalReviews,
          courseTitle1: course.subtitle,
          courseTitle2: course.description,
          price: course.price,
          courseDescription: course.description,
          // Additional API data
          technologies: course.technologies,
          features: course.features,
          requirements: course.requirements,
          whatYouWillLearn: course.whatYouWillLearn,
          syllabus: course.syllabus,
          rating: course.rating,
          enrolledStudents: course.enrolledStudents,
          duration: course.duration,
          modules: course.modules,
          instructor: course.instructor,
          institute: course.institute,
          isFeatured: course.isFeatured,
          isPopular: course.isPopular
        }));
        
        this.filteredCourses = [...this.coursesList];
        this.loading = false;
        console.log('Regular courses loaded:', this.coursesList);
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.error = 'Failed to load courses';
        this.loading = false;
      }
    });
  }

  filterCourses() {
    const filters = {
      search: this.searchTerm,
      category: this.selectedCategory,
      level: this.selectedLevel,
      minPrice: this.selectedPrice === 'low' ? 0 : this.selectedPrice === 'medium' ? 5000 : this.selectedPrice === 'high' ? 10000 : '',
      maxPrice: this.selectedPrice === 'low' ? 5000 : this.selectedPrice === 'medium' ? 10000 : this.selectedPrice === 'high' ? 50000 : '',
      page: this.currentPage,
      limit: this.pageSize
    };

    this.loading = true;
    this.coursesService.filterCourses(filters).subscribe({
      next: (response) => {
        this.detailedCourses = response.data;
        this.pagination = response.pagination;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error filtering courses:', error);
        this.error = 'Failed to filter courses';
        this.loading = false;
      }
    });
  }

  // Search and filter functionality
  onSearch() {
    this.applyFilters();
  }

  // Safe array access methods
  getCoursesToDisplay(): any[] {
    // Prioritize detailed courses from API, then filtered courses, then fallback to local data
    if (this.detailedCourses && this.detailedCourses.length > 0) {
      return this.detailedCourses;
    } else if (this.filteredCourses && this.filteredCourses.length > 0) {
      return this.filteredCourses;
    } else {
      return this.coursesList;
    }
  }

  onFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredCourses = this.coursesList.filter(course => {
      const matchesSearch = !this.searchTerm || 
        course.courseName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.courseTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.courseDescription.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory = !this.selectedCategory || 
        this.getCourseCategory(course.courseName).toLowerCase().includes(this.selectedCategory.toLowerCase());

      const matchesLevel = !this.selectedLevel || 
        this.getCourseLevel(course.courseName) === this.selectedLevel;

      const matchesPrice = !this.selectedPrice || 
        this.getPriceRange(course.price) === this.selectedPrice;

      return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    });
  }

  // Clear all filters
  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedLevel = '';
    this.selectedPrice = '';
    this.filteredCourses = [...this.coursesList];
  }

  // Get filtered courses count
  get filteredCount(): number {
    return this.filteredCourses.length;
  }

  // Get total courses count
  get totalCount(): number {
    return this.coursesList.length;
  }

  // Get course category for filtering
  getCourseCategory(courseName: string): string {
    const categoryMap: { [key: string]: string } = {
      'Web Development': 'web',
      'Testing Tools': 'testing',
      'Data Science': 'python',
      'Java': 'java',
      'Power Bi': 'business',
      'Networking': 'devops',
      'ADF': 'business',
      'SAP': 'business',
      '.net': 'web',
      'Angular': 'web',
      'web Designing': 'design',
      'Sales force': 'testing'
    };
    return categoryMap[courseName] || 'other';
  }

  // Get course level for filtering
  getCourseLevel(courseName: string): string {
    const levelMap: { [key: string]: string } = {
      'Web Development': 'intermediate',
      'Testing Tools': 'intermediate',
      'Data Science': 'advanced',
      'Java': 'intermediate',
      'Power Bi': 'beginner',
      'Networking': 'intermediate',
      'ADF': 'advanced',
      'SAP': 'advanced',
      '.net': 'intermediate',
      'Angular': 'intermediate',
      'web Designing': 'beginner',
      'Sales force': 'intermediate'
    };
    return levelMap[courseName] || 'intermediate';
  }

  // Get price range for filtering
  getPriceRange(price: number): string {
    if (price < 10000) return 'low';
    if (price < 20000) return 'medium';
    return 'high';
  }

  // Get course description based on course name
  getCourseDescription(courseName: string): string {
    const descriptions: { [key: string]: string } = {
      'Web Development': 'Master modern web technologies including HTML5, CSS3, JavaScript, React, Node.js, and full-stack development. Build responsive, interactive web applications.',
      'Testing Tools': 'Learn comprehensive software testing methodologies including manual testing, automated testing with Selenium, and performance testing tools.',
      'Data Science': 'Explore data analytics, machine learning, and artificial intelligence. Master Python, R, SQL, and data visualization tools.',
      'Java': 'Develop robust enterprise applications with Java. Learn Core Java, Advanced Java, Spring Framework, and microservices architecture.',
      'Power Bi': 'Master business intelligence and data visualization with Power BI. Create interactive dashboards and reports for data-driven decision making.',
      'Networking': 'Understand network infrastructure, protocols, and security. Learn about LAN, WAN, wireless networks, and network administration.',
      'ADF': 'Master Oracle Application Development Framework for building enterprise applications with Java EE and Oracle technologies.',
      'SAP': 'Learn SAP technologies for enterprise resource planning. Master SAP modules, ABAP programming, and SAP implementation.',
      '.net': 'Develop applications using Microsoft .NET framework. Learn C#, ASP.NET, MVC, and cloud development with Azure.',
      'Angular': 'Build modern single-page applications with Angular. Master TypeScript, components, services, and reactive programming.',
      'web Designing': 'Create beautiful and functional user interfaces. Learn UI/UX design principles, tools, and responsive design techniques.',
      'Sales force': 'Master Salesforce platform development and administration. Learn Apex, Lightning, and Salesforce integration.'
    };
    return descriptions[courseName] || 'Comprehensive training course designed by industry experts with hands-on projects and real-world applications.';
  }

  // Get course duration based on course name
  getCourseDuration(courseName: string): string {
    const durations: { [key: string]: string } = {
      'Web Development': '6-8 months',
      'Testing Tools': '4-6 months',
      'Data Science': '8-10 months',
      'Java': '6-8 months',
      'Power Bi': '3-4 months',
      'Networking': '5-6 months',
      'ADF': '6-8 months',
      'SAP': '8-10 months',
      '.net': '6-8 months',
      'Angular': '4-6 months',
      'web Designing': '4-5 months',
      'Sales force': '5-6 months'
    };
    return durations[courseName] || '4-6 months';
  }

  // Get course modules based on course name
  getCourseModules(courseName: string): number {
    const modules: { [key: string]: number } = {
      'Web Development': 28,
      'Testing Tools': 24,
      'Data Science': 32,
      'Java': 30,
      'Power Bi': 18,
      'Networking': 22,
      'ADF': 26,
      'SAP': 34,
      '.net': 28,
      'Angular': 22,
      'web Designing': 20,
      'Sales force': 24
    };
    return modules[courseName] || 24;
  }

  // Get course students based on course name
  getCourseStudents(courseName: string): string {
    const students: { [key: string]: string } = {
      'Web Development': '25K+',
      'Testing Tools': '18K+',
      'Data Science': '30K+',
      'Java': '22K+',
      'Power Bi': '15K+',
      'Networking': '12K+',
      'ADF': '8K+',
      'SAP': '20K+',
      '.net': '18K+',
      'Angular': '28K+',
      'web Designing': '16K+',
      'Sales force': '14K+'
    };
    return students[courseName] || '15K+';
  }

  // Get course technologies based on course name
  getCourseTechnologies(courseName: string): string[] {
    const technologies: { [key: string]: string[] } = {
      'Web Development': ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Express.js'],
      'Testing Tools': ['Selenium', 'JUnit', 'TestNG', 'Cucumber', 'Postman', 'JMeter', 'Appium'],
      'Data Science': ['Python', 'R', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow'],
      'Java': ['Java 17+', 'Spring Boot', 'Hibernate', 'Maven', 'JUnit', 'Microservices', 'Docker'],
      'Power Bi': ['Power BI Desktop', 'Power Query', 'DAX', 'Power Pivot', 'Power View', 'Power Map'],
      'Networking': ['TCP/IP', 'Cisco', 'Wireshark', 'VMware', 'Linux', 'Network Security', 'Cloud'],
      'ADF': ['Java EE', 'Oracle Database', 'ADF Faces', 'ADF Business Components', 'JDeveloper'],
      'SAP': ['ABAP', 'SAP HANA', 'SAP Fiori', 'SAP NetWeaver', 'SAP Business Suite'],
      '.net': ['C#', 'ASP.NET', 'MVC', 'Entity Framework', 'Azure', 'Visual Studio', 'Xamarin'],
      'Angular': ['TypeScript', 'Angular CLI', 'RxJS', 'Angular Material', 'NgRx', 'Testing'],
      'web Designing': ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'Prototyping'],
      'Sales force': ['Apex', 'Lightning', 'SOQL', 'Visualforce', 'Process Builder', 'Flow']
    };
    return technologies[courseName] || ['Industry Standard Tools', 'Best Practices', 'Hands-on Projects'];
  }

  // Get rating stars
  getRatingStars(rating: string): boolean[] {
    const numRating = parseFloat(rating);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= numRating);
    }
    return stars;
  }

  // Navigate to Course-institutes for a specific course
  navigateToCourseInstitutes(course: any) {
    this.getCourse(course);
    this.route.navigate(['/Course-institutes'], { 
      queryParams: { 
        courseId: course.courseId,
        courseName: course.courseName,
        category: this.getCourseCategory(course.courseName)
      } 
    });
  }

  // Get course data
  getCourse(data: any) {
    this.shareDataService.setOption(data);
  }

  // Demo Videos Data
  demoVideos: { [key: string]: any[] } = {
    'Web Development': [
      {
        title: 'Introduction to HTML5 & CSS3',
        description: 'Learn the fundamentals of web development with HTML5 and CSS3. Build your first responsive webpage.',
        thumbnail: 'https://via.placeholder.com/300x200/ff0000/ffffff?text=HTML+CSS',
        duration: '15:30',
        views: '45K',
        rating: '4.8',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        title: 'JavaScript Fundamentals',
        description: 'Master JavaScript basics including variables, functions, and DOM manipulation.',
        thumbnail: 'https://via.placeholder.com/300x200/ff0000/ffffff?text=JavaScript',
        duration: '22:15',
        views: '38K',
        rating: '4.9',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        title: 'React.js Basics',
        description: 'Introduction to React.js framework and component-based development.',
        thumbnail: 'https://via.placeholder.com/300x200/ff0000/ffffff?text=React',
        duration: '28:45',
        views: '52K',
        rating: '4.7',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ],
    'Testing Tools': [
      {
        title: 'Selenium WebDriver Basics',
        description: 'Learn automated testing with Selenium WebDriver and Java.',
        thumbnail: 'https://via.placeholder.com/300x200/ff0000/ffffff?text=Selenium',
        duration: '18:20',
        views: '32K',
        rating: '4.6',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        title: 'TestNG Framework',
        description: 'Master TestNG framework for advanced test automation.',
        thumbnail: 'https://via.placeholder.com/300x200/ff0000/ffffff?text=TestNG',
        duration: '25:10',
        views: '28K',
        rating: '4.8',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        title: 'API Testing with Postman',
        description: 'Learn API testing fundamentals using Postman tool.',
        thumbnail: 'https://via.placeholder.com/300x200/ff0000/ffffff?text=Postman',
        duration: '20:35',
        views: '35K',
        rating: '4.7',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ],
    'Data Science': [
      {
        title: 'Python for Data Science',
        description: 'Introduction to Python programming for data analysis and visualization.',
        thumbnail: 'https://via.placeholder.com/300x200/ff0000/ffffff?text=Python+DS',
        duration: '30:15',
        views: '65K',
        rating: '4.9',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        title: 'Pandas Data Manipulation',
        description: 'Learn data manipulation and analysis with Pandas library.',
        thumbnail: 'https://via.placeholder.com/300x200/ff0000/ffffff?text=Pandas',
        duration: '35:20',
        views: '48K',
        rating: '4.8',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        title: 'Machine Learning Basics',
        description: 'Introduction to machine learning algorithms and concepts.',
        thumbnail: 'https://via.placeholder.com/300x200/ff0000/ffffff?text=ML+Basics',
        duration: '40:30',
        views: '55K',
        rating: '4.7',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ],
    'Java': [
      {
        title: 'Core Java Fundamentals',
        description: 'Learn Java programming basics including OOP concepts.',
        thumbnail: 'https://via.placeholder.com/300x200/ff0000/ffffff?text=Core+Java',
        duration: '25:45',
        views: '42K',
        rating: '4.8',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        title: 'Spring Framework Introduction',
        description: 'Introduction to Spring Framework and dependency injection.',
        thumbnail: 'https://via.placeholder.com/300x200/ff0000/ffffff?text=Spring',
        duration: '32:10',
        views: '38K',
        rating: '4.7',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        title: 'Microservices with Spring Boot',
        description: 'Learn to build microservices using Spring Boot framework.',
        thumbnail: 'https://via.placeholder.com/300x200/ff0000/ffffff?text=Microservices',
        duration: '28:30',
        views: '35K',
        rating: '4.6',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ],
    'Power Bi': [
      {
        title: 'Power BI Desktop Basics',
        description: 'Learn Power BI Desktop interface and data import features.',
        thumbnail: 'https://via.placeholder.com/300x200/ff0000/ffffff?text=Power+BI',
        duration: '20:15',
        views: '25K',
        rating: '4.5',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        title: 'Data Visualization',
        description: 'Create compelling visualizations and dashboards in Power BI.',
        thumbnail: 'https://via.placeholder.com/300x200/ff0000/ffffff?text=Viz',
        duration: '25:30',
        views: '22K',
        rating: '4.6',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        title: 'DAX Formulas',
        description: 'Master DAX formulas for advanced data analysis in Power BI.',
        thumbnail: 'https://via.placeholder.com/300x200/ff0000/ffffff?text=DAX',
        duration: '30:45',
        views: '28K',
        rating: '4.7',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ]
  };

  // Demo Methods
  viewDemo(course: any) {
    this.selectedCourse = course;
    // Open the modal using Bootstrap
    const modal = document.getElementById('demoModal');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  getDemoVideos(courseName: string): any[] {
    return this.demoVideos[courseName] || [
      {
        title: 'Course Introduction',
        description: 'Overview of the course curriculum and learning objectives.',
        thumbnail: 'https://via.placeholder.com/300x200/ff0000/ffffff?text=Intro',
        duration: '10:00',
        views: '15K',
        rating: '4.5',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ];
  }

  playVideo(video: any) {
    // Open video in a new window or embed in modal
    window.open(video.url, '_blank');
  }

  enrollCourse(course: any) {
    // Close modal and navigate to enrollment
    const modal = document.getElementById('demoModal');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.hide();
    }
    this.getCourse(course);
    this.route.navigate(['/Course-institutes', course.courseId]);
  }

  viewFullCourse(course: any) {
    // Close modal and navigate to full course details
    const modal = document.getElementById('demoModal');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.hide();
    }
    this.getCourse(course);
    this.route.navigate(['/Course-institutes', course.courseId]);
  }

  // Cart and Wishlist Methods
  addToCart(course: any) {
    console.log('Adding to cart:', course.courseName);
    // Here you would typically:
    // 1. Add the course to a cart service
    // 2. Update cart count in header
    // 3. Show success notification
    // 4. Optionally navigate to cart page
    
    // For now, we'll show a success message
    alert(`"${course.courseName}" has been added to your cart!`);
  }

  addToWishlist(course: any) {
    console.log('Adding to wishlist:', course.courseName);
    // Here you would typically:
    // 1. Add the course to a wishlist service
    // 2. Update wishlist count in header
    // 3. Show success notification
    // 4. Optionally toggle wishlist state
    
    // For now, we'll show a success message
    alert(`"${course.courseName}" has been added to your wishlist!`);
  }

  // Pagination methods
  onPageChange(page: number) {
    this.currentPage = page;
    this.loadDetailedCourses();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadDetailedCourses();
  }

  // Refresh courses data
  refreshCourses() {
    this.currentPage = 1;
    this.loadDetailedCourses();
  }

  // Get pagination info
  getPaginationInfo(): any {
    return this.pagination || {
      currentPage: this.currentPage,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    };
  }
}
