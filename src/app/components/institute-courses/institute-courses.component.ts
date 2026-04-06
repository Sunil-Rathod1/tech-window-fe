import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-institute-courses',
  templateUrl: './institute-courses.component.html',
  styleUrls: ['./institute-courses.component.css']
})
export class InstituteCoursesComponent implements OnInit {
  
  // Search and filter properties
  public searchTerm: string = '';
  public selectedCategory: string = '';
  public selectedLevel: string = '';
  public selectedPrice: string = '';
  public filteredCourses: any[] = [];
  
  public instituteName: string = '';
  public instituteData: any = {};
  
  public courses: any[] = [
    {
      id: 1,
      name: "Testing Tools",
      title: "Manual and Selenium",
      description: "Learn comprehensive software testing methodologies including manual testing, automated testing with Selenium, and performance testing tools.",
      duration: "4-6 months",
      modules: 24,
      students: "18K+",
      price: "₹4999 to ₹29999",
      category: "TESTING TOOLS",
      level: "Beginner to Advanced",
      technologies: ["Selenium", "JUnit", "TestNG", "Cucumber", "Maven", "Jenkins"],
      status: ["NEW"],
      image: "course-1.jpg"
    },
    {
      id: 2,
      name: "Data Science",
      title: "Data Analytics",
      description: "Explore data analytics, machine learning, and artificial intelligence. Master Python, R, SQL, and data visualization tools.",
      duration: "8-10 months",
      modules: 32,
      students: "30K+",
      price: "₹7999 to ₹39999",
      category: "DATA SCIENCE",
      level: "Intermediate to Advanced",
      technologies: ["Python", "R", "SQL", "Tableau", "Power BI", "Machine Learning"],
      status: ["POPULAR", "NEW"],
      image: "course-2.jpg"
    },
    {
      id: 3,
      name: "Java",
      title: "Core and Advance java",
      description: "Develop robust enterprise applications with Java. Learn Core Java, Advanced Java, Spring Framework, and microservices architecture.",
      duration: "6-8 months",
      modules: 30,
      students: "22K+",
      price: "₹5999 to ₹34999",
      category: "JAVA",
      level: "Beginner to Advanced",
      technologies: ["Java 17+", "Spring Boot", "Hibernate", "Maven", "Microservices", "REST APIs"],
      status: ["NEW"],
      image: "course-3.jpg"
    },
    {
      id: 4,
      name: "Web Development",
      title: "Web Technologies",
      description: "Master modern web development with HTML5, CSS3, JavaScript, React, Node.js, and full-stack development practices.",
      duration: "5-7 months",
      modules: 28,
      students: "25K+",
      price: "₹6999 to ₹32999",
      category: "WEB DEVELOPMENT",
      level: "Beginner to Advanced",
      technologies: ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "MongoDB"],
      status: ["POPULAR"],
      image: "course-4.jpg"
    },
    {
      id: 5,
      name: "Python",
      title: "Python Programming",
      description: "Learn Python from basics to advanced concepts including web development, data science, and automation scripting.",
      duration: "4-6 months",
      modules: 26,
      students: "20K+",
      price: "₹4999 to ₹27999",
      category: "PYTHON",
      level: "Beginner to Advanced",
      technologies: ["Python 3", "Django", "Flask", "Pandas", "NumPy", "Matplotlib"],
      status: ["NEW"],
      image: "course-5.jpg"
    },
    {
      id: 6,
      name: "DevOps",
      title: "DevOps Technologies",
      description: "Master DevOps practices including CI/CD, containerization, cloud platforms, and infrastructure automation.",
      duration: "6-8 months",
      modules: 30,
      students: "15K+",
      price: "₹8999 to ₹44999",
      category: "DEVOPS",
      level: "Intermediate to Advanced",
      technologies: ["Docker", "Kubernetes", "Jenkins", "AWS", "Azure", "Terraform"],
      status: ["POPULAR"],
      image: "course-6.jpg"
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private shareDataService: ShareDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get institute data from route or service
    this.route.params.subscribe(params => {
      this.instituteName = params['name'] || 'TechWindows Institute';
      this.loadInstituteData();
      this.loadInstituteCourses();
    });
    
    // Initialize filtered courses
    this.filteredCourses = [...this.courses];
  }

  private loadInstituteData(): void {
    // You can load institute-specific data here
    // For now, we'll use default data
    this.instituteData = {
      name: this.instituteName,
      description: "Leading IT training institute offering comprehensive courses in software testing, development, and automation. Expert instructors with industry experience.",
      students: "50K+",
      courses: "25+",
      experience: "10+",
      rating: "4.5",
      reviews: "10K+"
    };
  }

  private loadInstituteCourses(): void {
    // Filter courses based on institute name
    // In a real application, this would be an API call
    this.courses = this.courses.filter(course => {
      // For demo purposes, show all courses for any institute
      // In real implementation, you would filter based on institute-specific courses
      return true;
    });
    
    // Update filtered courses
    this.filteredCourses = [...this.courses];
  }

  // Search functionality
  onSearch(): void {
    this.filterCourses();
  }

  onCategoryChange(): void {
    this.filterCourses();
  }

  onLevelChange(): void {
    this.filterCourses();
  }

  onPriceChange(): void {
    this.filterCourses();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedLevel = '';
    this.selectedPrice = '';
    this.filteredCourses = [...this.courses];
  }

  private filterCourses(): void {
    let filtered = [...this.courses];

    // Search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(course => 
        course.name.toLowerCase().includes(searchLower) ||
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.technologies.some((tech: string) => tech.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(course => 
        course.category.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }

    // Level filter
    if (this.selectedLevel) {
      filtered = filtered.filter(course => 
        course.level.toLowerCase().includes(this.selectedLevel.toLowerCase())
      );
    }

    // Price filter
    if (this.selectedPrice) {
      filtered = filtered.filter(course => {
        const price = course.price;
        switch (this.selectedPrice) {
          case 'under-10k':
            return price.includes('₹4999') || price.includes('₹5999') || price.includes('₹6999');
          case '10k-20k':
            return price.includes('₹7999') || price.includes('₹8999') || price.includes('₹12999');
          case '20k-30k':
            return price.includes('₹19999') || price.includes('₹22999') || price.includes('₹27999');
          case 'above-30k':
            return price.includes('₹32999') || price.includes('₹34999') || price.includes('₹39999') || price.includes('₹44999');
          default:
            return true;
        }
      });
    }

    this.filteredCourses = filtered;
  }

  getCourse(course: any): void {
    // Navigate to course details/enrollment page
    this.shareDataService.setOption(course);
    // You can add navigation logic here if needed
  }

  redirectToSignIn(): void {
    // Open sign-in popup instead of navigation
    alert('Please sign in to enroll in this course');
  }

  // Navigate to course details page
  viewCourseDetails(course: any): void {
    // Store course data for course details page
    this.shareDataService.setOption(course);
    
    // Navigate to course details page
    this.router.navigate(['/Course-details', course.id || course.courseId]);
  }

}
