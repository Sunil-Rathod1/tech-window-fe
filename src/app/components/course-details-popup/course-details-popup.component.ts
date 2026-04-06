import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

export interface CourseData {
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
  selector: 'app-course-details-popup',
  templateUrl: './course-details-popup.component.html',
  styleUrls: ['./course-details-popup.component.css']
})
export class CourseDetailsPopupComponent implements OnInit, OnChanges {
  @Input() course: CourseData | null = null;
  @Input() isOpen: boolean = false;
  @Output() closePopup = new EventEmitter<void>();

  constructor() {
    console.log('CourseDetailsPopupComponent constructor called');
  }

  // Course demo videos for different technologies
  courseDemoVideos: { [key: string]: string } = {
    'Web Development': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'Web Designing': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'Software Testing': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'Java Development': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'Python Development': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'DevOps': 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  };

  // Detailed course information
  courseDetails: any = {};

  ngOnInit() {
    console.log('CourseDetailsPopupComponent ngOnInit called');
    if (this.course) {
      this.loadCourseDetails();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Popup ngOnChanges called:', changes);
    if (this.course) {
      this.loadCourseDetails();
    }
  }

  private loadCourseDetails() {
    if (!this.course) return;

    // Enhanced course details based on category
    this.courseDetails = {
      ...this.course,
      overview: this.getCourseOverview(),
      curriculum: this.getCourseCurriculum(),
      prerequisites: this.getPrerequisites(),
      careerOpportunities: this.getCareerOpportunities(),
      languages: this.getSupportedLanguages(),
      demoVideo: this.courseDemoVideos[this.course.courseCategory] || this.courseDemoVideos['Web Development']
    };
  }

  private getCourseOverview(): string {
    const category = this.course?.courseCategory || '';
    const overviews: { [key: string]: string } = {
      'Web Development': 'Master modern web development with our comprehensive full-stack course. Learn HTML5, CSS3, JavaScript, React, Node.js, and MongoDB. Build real-world projects and get hands-on experience with industry best practices.',
      'Web Designing': 'Create stunning, responsive websites with our UI/UX design course. Learn design principles, prototyping tools, and user experience optimization techniques.',
      'Software Testing': 'Become a skilled QA professional with our comprehensive testing course. Master manual testing, automation with Selenium, and performance testing methodologies.',
      'Java Development': 'Build enterprise-grade applications with Java and Spring Framework. Learn microservices architecture, cloud deployment, and modern Java development practices.',
      'Python Development': 'Dive into Python programming and data science. Learn machine learning, data analysis, and building intelligent applications with Python.',
      'DevOps': 'Master DevOps practices and cloud technologies. Learn CI/CD pipelines, containerization with Docker, Kubernetes orchestration, and cloud infrastructure management.'
    };
    return overviews[category] || 'Comprehensive course covering all essential concepts and practical applications.';
  }

  private getCourseCurriculum(): any[] {
    const category = this.course?.courseCategory || '';
    const curricula: { [key: string]: any[] } = {
      'Web Development': [
        { title: 'HTML5 & CSS3 Fundamentals', lessons: 8, duration: '2.5 hours', topics: ['HTML5 Structure', 'CSS3 Styling', 'Responsive Design', 'Flexbox & Grid'] },
        { title: 'JavaScript Mastery', lessons: 12, duration: '4 hours', topics: ['ES6+ Features', 'DOM Manipulation', 'Async Programming', 'Modern JavaScript'] },
        { title: 'React Development', lessons: 15, duration: '6 hours', topics: ['Components', 'State Management', 'Hooks', 'Routing'] },
        { title: 'Backend Development', lessons: 10, duration: '4 hours', topics: ['Node.js', 'Express.js', 'MongoDB', 'RESTful APIs'] }
      ],
      'Web Designing': [
        { title: 'Design Fundamentals', lessons: 6, duration: '2 hours', topics: ['Color Theory', 'Typography', 'Layout Principles', 'Visual Hierarchy'] },
        { title: 'UI Design Tools', lessons: 8, duration: '3 hours', topics: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'] },
        { title: 'UX Research', lessons: 6, duration: '2.5 hours', topics: ['User Research', 'Wireframing', 'Usability Testing', 'User Journey'] }
      ],
      'Software Testing': [
        { title: 'Manual Testing', lessons: 10, duration: '3 hours', topics: ['Test Planning', 'Test Cases', 'Bug Reporting', 'Test Documentation'] },
        { title: 'Automation Testing', lessons: 12, duration: '4 hours', topics: ['Selenium WebDriver', 'TestNG', 'Page Object Model', 'Data-Driven Testing'] },
        { title: 'Performance Testing', lessons: 8, duration: '3 hours', topics: ['Load Testing', 'Stress Testing', 'JMeter', 'Performance Metrics'] }
      ]
    };
    return curricula[category] || [
      { title: 'Module 1: Fundamentals', lessons: 8, duration: '3 hours', topics: ['Basic Concepts', 'Core Principles', 'Practical Applications'] },
      { title: 'Module 2: Advanced Topics', lessons: 10, duration: '4 hours', topics: ['Advanced Techniques', 'Best Practices', 'Real-world Projects'] }
    ];
  }

  private getPrerequisites(): string[] {
    const category = this.course?.courseCategory || '';
    const prerequisites: { [key: string]: string[] } = {
      'Web Development': ['Basic computer knowledge', 'Logical thinking', 'No prior programming experience required'],
      'Web Designing': ['Creative mindset', 'Basic computer skills', 'Interest in design'],
      'Software Testing': ['Basic computer knowledge', 'Analytical thinking', 'Attention to detail'],
      'Java Development': ['Basic programming knowledge', 'Object-oriented programming concepts', 'Logical thinking'],
      'Python Development': ['Basic computer knowledge', 'Mathematical aptitude', 'Interest in data science'],
      'DevOps': ['Basic Linux knowledge', 'Understanding of software development', 'System administration basics']
    };
    return prerequisites[category] || ['Basic computer knowledge', 'Logical thinking', 'Interest in learning'];
  }

  private getCareerOpportunities(): string[] {
    const category = this.course?.courseCategory || '';
    const opportunities: { [key: string]: string[] } = {
      'Web Development': ['Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 'Web Application Developer'],
      'Web Designing': ['UI/UX Designer', 'Web Designer', 'Graphic Designer', 'Product Designer'],
      'Software Testing': ['QA Engineer', 'Test Automation Engineer', 'Performance Tester', 'Test Lead'],
      'Java Development': ['Java Developer', 'Spring Developer', 'Enterprise Developer', 'Software Architect'],
      'Python Development': ['Python Developer', 'Data Scientist', 'Machine Learning Engineer', 'Data Analyst'],
      'DevOps': ['DevOps Engineer', 'Cloud Engineer', 'Site Reliability Engineer', 'Infrastructure Engineer']
    };
    return opportunities[category] || ['Software Developer', 'Technical Specialist', 'Project Manager', 'Consultant'];
  }

  private getSupportedLanguages(): string[] {
    return ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam'];
  }

  closeModal() {
    this.closePopup.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  formatPrice(price: number): string {
    return `₹${price.toLocaleString('en-IN')}`;
  }

  getRatingStars(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }

  enrollNow() {
    // Navigate to enrollment or login
    console.log('Enrolling in course:', this.course?.name);
    // You can implement enrollment logic here
  }
}
