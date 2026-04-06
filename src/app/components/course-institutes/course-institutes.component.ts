import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ShareDataService } from 'src/app/services/share-data.service';
import { LocalCartItem, LocalCartService } from 'src/app/services/local-cart.service';
import { InstitutionDashboardService } from 'src/app/services/institution-dashboard.service';

@Component({
  selector: 'app-course-institutes',
  templateUrl: './course-institutes.component.html',
  styleUrls: ['./course-institutes.component.css']
})
export class CourseInstitutesComponent implements OnInit {

  // Search and filter properties
  public searchTerm: string = '';
  public selectedLocation: string = '';
  public selectedType: string = '';
  public selectedRating: string = '';
  public selectedMode: string = '';
  public filteredInstitutions: any[] = [];
  public courseTitle: any = "";
  public course: any = "";
  public selectedCourseId: string = '';
  public selectedCourseName: string = '';
  public selectedCourseCategory: string = '';
  public isLoadingInstitutions: boolean = false;
  public institutionsError: string = '';
  public breadcrumbs: any[] = [
    { label: 'Home', link: '/Home' },
    { label: 'Courses', link: '/Courses' },
    { label: 'Training Institutes', link: null }
  ];

  public institutions: any = [
    {
      name: "Techwindows",
      courseTitle: "Angular Web development Front frame work to Advanced+Frameworks",
      img: "techwindows.jpg",
      courseTitle2: "We are comitted to provide multiple sftware courses with realtime experts",
      courseDesc: "'TOP RATED #1 Master Web Development (Latest) course' -5 Million students learning worldWide with great collaboration",
      reviews: "102376",
      hours: "54",
      price: "9999",
      type: "Training Center",
      founded: "2010",
      isVerified: true,
      isFeatured: true,
      modes: { online: true, offline: true },
      location: "Hyderabad",
      students: { total: 5000 },
      courses: { total: 50, categories: 
        // ['Web Development', 'Mobile Development', 'Data Science'] 
        [{ courseId: 1, courseName: 'Angular', category: 'Frontend' ,
          trainerDetails:{name:"Srujan bharath",designation:"Senior Full-Stack Developer & Instructor",experience:"10+",courseDuration:"60days",totalStudents:"200",bio:"Srujan is a passionate computer science educator with over 10 years of experience in software development and teaching. He specializes in full-stack web development and has helped thousands of students transition into successful tech careers.",
            languages:"english",startDate:"Oct 1, 2024",scheduleTime:"12pm-1pm",availableSeats:"30",price:"20000",discount:"30%",courseOverview:[],courseCurriculum:[],education:"Btech Computer Science",expertiseSkills:["Angular", "React", "Node.js", "MongoDB"],languagesKnown:["English", "Telugu", "Hindi", "Tamil"],location:"Hyderabad",
            achievements:['Google Certified Developer', 'Microsoft Certified Developer', 'Oracle Certified Developer']
          }},
          { courseId: 2, courseName: 'React JS', category: 'Frontend' ,trainerDetails:{name:"bharath",designation:"Senior Full-Stack Developer & Instructor",experience:"10+",courseDuration:"60days",totalStudents:"200",bio:"Srujan is a passionate computer science educator with over 10 years of experience in software development and teaching. He specializes in full-stack web development and has helped thousands of students transition into successful tech careers.",
            languages:"english",startDate:"Oct 1, 2024",scheduleTime:"12pm-1pm",availableSeats:"30",price:"20000",discount:"30%",courseOverview:[],courseCurriculum:[],education:"Btech Computer Science",expertiseSkills:["Angular", "React", "Node.js", "MongoDB"],languagesKnown:["English", "Telugu", "Hindi", "Tamil"],location:"Hyderabad",
            achievements:['Google Certified Developer', 'Microsoft Certified Developer', 'Oracle Certified Developer']
          }},
          { courseId: 3, courseName: 'Vue JS', category: 'Frontend' ,trainerDetails:{name:"bharath",designation:"Senior Full-Stack Developer & Instructor",experience:"10+",courseDuration:"60days",totalStudents:"200",bio:"Srujan is a passionate computer science educator with over 10 years of experience in software development and teaching. He specializes in full-stack web development and has helped thousands of students transition into successful tech careers.",
            languages:"english",startDate:"Oct 1, 2024",scheduleTime:"12pm-1pm",availableSeats:"30",price:"20000",discount:"30%",courseOverview:[],courseCurriculum:[],education:"Btech Computer Science",expertiseSkills:["Angular", "React", "Node.js", "MongoDB"],languagesKnown:["English", "Telugu", "Hindi", "Tamil"],location:"Hyderabad",
            achievements:['Google Certified Developer', 'Microsoft Certified Developer', 'Oracle Certified Developer']
          }},
          { courseId: 4, courseName: 'Node JS', category: 'Backend' ,trainerDetails:{name:"bharath",designation:"Senior Full-Stack Developer & Instructor",experience:"10+",courseDuration:"60days",totalStudents:"200",bio:"Srujan is a passionate computer science educator with over 10 years of experience in software development and teaching. He specializes in full-stack web development and has helped thousands of students transition into successful tech careers.",
            languages:"english",startDate:"Oct 1, 2024",scheduleTime:"12pm-1pm",availableSeats:"30",price:"20000",discount:"30%",courseOverview:[],courseCurriculum:[],education:"Btech Computer Science",expertiseSkills:["Angular", "React", "Node.js", "MongoDB"],languagesKnown:["English", "Telugu", "Hindi", "Tamil"],location:"Hyderabad",
            achievements:['Google Certified Developer', 'Microsoft Certified Developer', 'Oracle Certified Developer']
          }},
          { courseId: 5, courseName: 'Express JS', category: 'Backend' ,trainerDetails:{name:"bharath",designation:"Senior Full-Stack Developer & Instructor",experience:"10+",courseDuration:"60days",totalStudents:"200",bio:"Srujan is a passionate computer science educator with over 10 years of experience in software development and teaching. He specializes in full-stack web development and has helped thousands of students transition into successful tech careers.",
            languages:"english",startDate:"Oct 1, 2024",scheduleTime:"12pm-1pm",availableSeats:"30",price:"20000",discount:"30%",courseOverview:[],courseCurriculum:[],education:"Btech Computer Science",expertiseSkills:["Angular", "React", "Node.js", "MongoDB"],languagesKnown:["English", "Telugu", "Hindi", "Tamil"],location:"Hyderabad",
            achievements:['Google Certified Developer', 'Microsoft Certified Developer', 'Oracle Certified Developer']
          }},
          { courseId: 6, courseName: 'Python', category: 'Programming' ,trainerDetails:{name:"bharath",designation:"Senior Full-Stack Developer & Instructor",experience:"10+"}}]
      },
      trainerDetails: { name: "bharath", designation: "Senior Full-Stack Developer & Instructor", experience: "10+" },
      experience: { years: 10 },
      faculty: { total: 25 },
      placement: { placementRate: 95, averagePackage: 8, highestPackage: 25 },
      address: { city: 'Hyderabad', state: 'Telangana', street: 'Tech Park, HITEC City' },
      rating: { overall: 4.6, teaching: 4.7, facilities: 4.5, placement: 4.8, totalReviews: 102376 },
      facilities: { library: true, cafeteria: true, hostel: true, parking: true, wifi: true, airConditioning: true },
      accreditations: ['ISO 9001:2015', 'NASSCOM Certified', 'Microsoft Partner']
    },
    {
      name: "Naresh IT",
      courseTitle: "Selenium WebDriver with Java -Basics to Advanced+Frameworks",
      img: "nareshit.png",
      courseTitle2: "We are comitted to provide multiple sftware courses with realtime experts",
      courseDesc: "'TOP RATED #1 Master Web Development (Latest) course' -5 Million students learning worldWide with great collaboration",
      reviews: "102376",
      hours: "54",
      price: "9999",
      type: "Training Center",
      founded: "2008",
      location: "Hyderabad",
      isVerified: true,
      isFeatured: false,
      modes: { online: true, offline: true },
      students: { total: 4500 },
      courses: { total: 45, categories:
         [{ courseId: 4, courseName: 'Node JS', category: 'Backend' },
          { courseId: 5, courseName: 'Express JS', category: 'Backend' },
          { courseId: 6, courseName: 'Python', category: 'Programming' },
          { courseId: 9, courseName: 'Java', category: 'Programming' },
        { courseId: 15, courseName: 'JavaScript', category: 'Programming' },
        { courseId: 16, courseName: 'TypeScript', category: 'Programming' },
        ] 
        },
      experience: { years: 12 },
      faculty: { total: 30 },
      placement: { placementRate: 92, averagePackage: 7, highestPackage: 22 },
      address: { city: 'Hyderabad', state: 'Telangana', street: 'Ameerpet, Hyderabad' },
      rating: { overall: 4.6, teaching: 4.6, facilities: 4.4, placement: 4.7, totalReviews: 102376 },
      facilities: { library: true, cafeteria: true, hostel: false, parking: true, wifi: true, airConditioning: true },
      accreditations: ['ISO 9001:2015', 'Oracle Certified', 'Sun Certified']
    },
    {
      name: "Apac Technologies",
      courseTitle: "Selenium WebDriver with Java -Basics to Advanced+Frameworks",
      img: "logo-Apec.png",
      courseTitle2: "We are comitted to provide multiple sftware courses with realtime experts",
      courseDesc: "'TOP RATED #1 Master Web Development (Latest) course' -5 Million students learning worldWide with great collaboration",
      reviews: "102376",
      hours: "54",
      price: "9999",
      type: "Training Center",
      founded: "2012",
      location: "Bangalore",
      isVerified: true,
      isFeatured: true,
      modes: { online: true, offline: true },
      students: { total: 6000 },
      courses: { total: 60, categories: [
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
    { courseId: 47, courseName: 'Manual Testing', category: 'Testing' }
      ] },
      experience: { years: 8 },
      faculty: { total: 35 },
      placement: { placementRate: 96, averagePackage: 9, highestPackage: 28 },
      address: { city: 'Bangalore', state: 'Karnataka', street: 'Electronic City, Bangalore' },
      rating: { overall: 4.6, teaching: 4.8, facilities: 4.6, placement: 4.9, totalReviews: 102376 },
      facilities: { library: true, cafeteria: true, hostel: true, parking: true, wifi: true, airConditioning: true },
      accreditations: ['ISO 9001:2015', 'AWS Partner', 'Google Cloud Partner']
    },
    {
      name: "Win IT",
      courseTitle: "Selenium WebDriver with Java -Basics to Advanced+Frameworks",
      img: "winit.png",
      courseTitle2: "We are comitted to provide multiple sftware courses with realtime experts",
      courseDesc: "'TOP RATED #1 Master Web Development (Latest) course' -5 Million students learning worldWide with great collaboration",
      reviews: "102376",
      hours: "54",
      price: "9999",
      type: "Training Center",
      founded: "2015",
      location: "Mumbai",
      isVerified: true,
      isFeatured: false,
      modes: { online: true, offline: true },
      students: { total: 3500 },
      courses: { total: 40, categories: [
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
    { courseId: 47, courseName: 'Manual Testing', category: 'Testing' }
      ] },
      experience: { years: 6 },
      faculty: { total: 20 },
      placement: { placementRate: 90, averagePackage: 6, highestPackage: 20 },
      address: { city: 'Mumbai', state: 'Maharashtra', street: 'Andheri West, Mumbai' },
      rating: { overall: 4.6, teaching: 4.5, facilities: 4.3, placement: 4.6, totalReviews: 102376 },
      facilities: { library: true, cafeteria: false, hostel: false, parking: true, wifi: true, airConditioning: true },
      accreditations: ['ISO 9001:2015', 'Adobe Partner']
    },
    {
      name: "Info Tech",
      courseTitle: "Selenium WebDriver with Java -Basics to Advanced+Frameworks",
      img: "infoit.jfif",
      courseTitle2: "We are comitted to provide multiple sftware courses with realtime experts",
      courseDesc: "'TOP RATED #1 Master Web Development (Latest) course' -5 Million students learning worldWide with great collaboration",
      reviews: "102376",
      hours: "54",
      price: "9999",
      type: "Training Center",
      founded: "2009",
      location: "Delhi",
      isVerified: true,
      isFeatured: true,
      modes: { online: true, offline: true },
      students: { total: 4800 },
      courses: { total: 55, categories: [
        { courseId: 25, courseName: 'Kubernetes', category: 'Cloud & CI/CD' },
        { courseId: 26, courseName: 'Git & GitHub', category: 'Version Control' },
        { courseId: 27, courseName: 'Machine Learning', category: 'AI/ML' },
        { courseId: 28, courseName: 'Data Science', category: 'AI/ML' },
        { courseId: 29, courseName: 'Artificial Intelligence', category: 'AI/ML' },
        { courseId: 30, courseName: 'Cyber Security', category: 'Security' },
        { courseId: 31, courseName: 'Power BI', category: 'Data Analytics' },
        { courseId: 32, courseName: 'Tableau', category: 'Data Analytics' },
        { courseId: 33, courseName: 'Big Data Hadoop', category: 'Data Engineering' }] },
      experience: { years: 11 },
      faculty: { total: 28 },
      placement: { placementRate: 94, averagePackage: 8, highestPackage: 26 },
      address: { city: 'Delhi', state: 'Delhi', street: 'Connaught Place, Delhi' },
      rating: { overall: 4.6, teaching: 4.7, facilities: 4.5, placement: 4.8, totalReviews: 102376 },
      facilities: { library: true, cafeteria: true, hostel: true, parking: true, wifi: true, airConditioning: true },
      accreditations: ['ISO 9001:2015', 'IBM Partner', 'Intel Partner']
    },
    {
      name: "Vision Technologies",
      courseTitle: "Selenium WebDriver with Java -Basics to Advanced+Frameworks",
      img: "vision.jpg",
      courseTitle2: "We are comitted to provide multiple sftware courses with realtime experts",
      courseDesc: "'TOP RATED #1 Master Web Development (Latest) course' -5 Million students learning worldWide with great collaboration",
      reviews: "102376",
      hours: "54",
      price: "9999",
      type: "Training Center",
      founded: "2013",
      location: "Pune",
      isVerified: true,
      isFeatured: false,
      modes: { online: true, offline: true },
      students: { total: 4200 },
      courses: { total: 48, categories: [
        { courseId: 4, courseName: 'Node JS', category: 'Backend' },
          { courseId: 5, courseName: 'Express JS', category: 'Backend' },
          { courseId: 6, courseName: 'Python', category: 'Programming' },
          { courseId: 9, courseName: 'Java', category: 'Programming' },
        { courseId: 15, courseName: 'JavaScript', category: 'Programming' },
        { courseId: 16, courseName: 'TypeScript', category: 'Programming' },
      ] },
      experience: { years: 7 },
      faculty: { total: 22 },
      placement: { placementRate: 91, averagePackage: 7, highestPackage: 23 },
      address: { city: 'Pune', state: 'Maharashtra', street: 'Hinjewadi, Pune' },
      rating: { overall: 4.6, teaching: 4.6, facilities: 4.4, placement: 4.7, totalReviews: 102376 },
      facilities: { library: true, cafeteria: true, hostel: false, parking: true, wifi: true, airConditioning: true },
      accreditations: ['ISO 9001:2015', 'Selenium Certified']
    },
    {
      name: "Satya Technologies",
      courseTitle: "Selenium WebDriver with Java -Basics to Advanced+Frameworks",
      img: "satyatech.png",
      courseTitle2: "We are comitted to provide multiple sftware courses with realtime experts",
      courseDesc: "'TOP RATED #1 Master Web Development (Latest) course' -5 Million students learning worldWide with great collaboration",
      reviews: "102376",
      hours: "54",
      price: "9999",
      location: "Chennai",
      type: "Training Center",
      founded: "2011",
      isVerified: true,
      isFeatured: true,
      modes: { online: true, offline: true },
      students: { total: 5500 },
      courses: { total: 65, categories: [
        { courseId: 4, courseName: 'Node JS', category: 'Backend' },
          { courseId: 5, courseName: 'Express JS', category: 'Backend' },
          { courseId: 6, courseName: 'Python', category: 'Programming' },
          { courseId: 9, courseName: 'Java', category: 'Programming' },
        { courseId: 15, courseName: 'JavaScript', category: 'Programming' },
        { courseId: 16, courseName: 'TypeScript', category: 'Programming' },
        { courseId: 20, courseName: 'DevOps', category: 'Cloud & CI/CD' },
        { courseId: 21, courseName: 'AWS', category: 'Cloud' },
        { courseId: 22, courseName: 'Azure', category: 'Cloud' },
        { courseId: 23, courseName: 'Google Cloud', category: 'Cloud' },
        { courseId: 24, courseName: 'Docker', category: 'Cloud & CI/CD' },
        { courseId: 25, courseName: 'Kubernetes', category: 'Cloud & CI/CD' },
        { courseId: 26, courseName: 'Git & GitHub', category: 'Version Control' },
      ] },
      experience: { years: 9 },
      faculty: { total: 32 },
      placement: { placementRate: 93, averagePackage: 8, highestPackage: 24 },
      address: { city: 'Chennai', state: 'Tamil Nadu', street: 'T. Nagar, Chennai' },
      rating: { overall: 4.6, teaching: 4.7, facilities: 4.5, placement: 4.8, totalReviews: 102376 },
      facilities: { library: true, cafeteria: true, hostel: true, parking: true, wifi: true, airConditioning: true },
      accreditations: ['ISO 9001:2015', 'Microsoft Partner', 'Oracle Partner']
    }
  ]
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public shareDataService: ShareDataService,
    private localCartService: LocalCartService,
    private institutionDashboardService: InstitutionDashboardService
  ) {
    this.route.queryParams.subscribe((params: any) => {
      console.log("params=============", params);
      let data = params.courseName;
      console.log("data=============", data); // 👉 "devops"
      this.course = data;
      // if (params['courseName']) {
      // }
    });
  }
  public courseid = 0;
  public coursesList: any = [];
  ngOnInit() {
    // Handle query parameters from course navigation
    this.route.queryParams.subscribe(params => {
      console.log("params=============", params);
      this.courseTitle = params['courseName'];
      this.courseid = params['courseId'];
      
      // Initialize breadcrumbs
      this.breadcrumbs = [
        { label: 'Home', link: '/Home' },
        { label: 'Courses', link: '/Courses' },
        { label: this.courseTitle || 'Training Institutes', link: null }
      ];
    });

    // Load institutions from API
    this.loadInstitutions();
  }

  loadInstitutions(): void {
    this.isLoadingInstitutions = true;
    this.institutionsError = '';

    this.institutionDashboardService.getInstitutionCourses().subscribe({
      next: (apiInstitutions) => {
        // Map API response to match current data structure
        this.institutions = this.mapApiDataToInstitutions(apiInstitutions);
        
        // Apply course filter if courseId is provided
        if (this.courseid) {
          this.filteredInstitutions = this.institutions.filter((inst: any) => {
            // Check if any course in categories matches the courseId
            const categories = inst.courses?.categories || [];
            return categories.some((course: any) => {
              // Check both courseId and id fields
              return course.courseId == this.courseid || 
                     course.id == this.courseid || 
                     course._id == this.courseid;
            });
          });
        } else {
          this.filteredInstitutions = [...this.institutions];
        }
        
        this.isLoadingInstitutions = false;
      },
      error: (error) => {
        console.error('Error loading institutions:', error);
        this.institutionsError = 'Failed to load institutions. Using default data.';
        // Fallback to mock data if API fails
        this.filteredInstitutions = this.institutions.filter((inst: any) =>
          inst.courses.categories.some((course: any) => course.courseId == this.courseid)
        );
        this.isLoadingInstitutions = false;
      }
    });
  }

  mapApiDataToInstitutions(apiData: any[]): any[] {
    return apiData.map((inst: any) => {
      // Map API response to match current component structure
      const mapped: any = {
        name: inst.name || 'Institution',
        courseTitle: inst.courseTitle || 'Course Title',
        img: inst.img || 'default-institute.jpg',
        courseTitle2: inst.courseTitle2 || 'We are committed to provide multiple software courses with realtime experts',
        courseDesc: inst.courseDesc || `'TOP RATED #1 Master Course' - ${inst.students?.total || 0} students learning worldwide with great collaboration`,
        reviews: inst.reviews || inst.rating?.totalReviews?.toString() || '0',
        hours: inst.hours || '54',
        price: inst.price || '9999',
        type: inst.type || 'Training Center',
        founded: inst.founded || '2010',
        isVerified: inst.isVerified || false,
        isFeatured: inst.isFeatured || false,
        modes: inst.modes || { online: true, offline: true },
        location: inst.location || 'Hyderabad',
        students: inst.students || { total: 5000 },
        courses: inst.courses || { total: 50, categories: [] },
        trainerDetails: inst.trainerDetails || {
          name: 'Instructor',
          designation: 'Senior Instructor',
          experience: '5+'
        },
        experience: inst.experience || { years: 10 },
        faculty: inst.faculty || { total: 25 },
        placement: inst.placement || { placementRate: 95, averagePackage: 8, highestPackage: 25 },
        address: inst.address || { city: inst.location || 'Hyderabad', state: '', street: '' },
        rating: inst.rating || { overall: 4.6, teaching: 4.7, facilities: 4.5, placement: 4.8, totalReviews: 100 },
        facilities: inst.facilities || { library: true, cafeteria: true, hostel: false, parking: true, wifi: true, airConditioning: true },
        accreditations: inst.accreditations || []
      };

      // Ensure courses.categories is an array and map courseId properly
      if (!mapped.courses.categories || !Array.isArray(mapped.courses.categories)) {
        mapped.courses.categories = [];
      } else {
        // Ensure each category has a courseId field for filtering
        mapped.courses.categories = mapped.courses.categories.map((cat: any) => {
          if (!cat.courseId && (cat.id || cat._id)) {
            cat.courseId = cat.id || cat._id;
          }
          return cat;
        });
      }

      return mapped;
    });
  }

  // Filter institutions by selected course
  filterInstitutionsByCourse(): void {
    if (!this.selectedCourseName) {
      this.filteredInstitutions = [...this.institutions];
      return;
    }

    // Filter institutions that offer the selected course
    this.filteredInstitutions = this.institutions.filter((institute: any) => {
      // Check if the institute offers courses in the same category
      const courseCategories = institute.courses?.categories || [];
      const matchesCategory = courseCategories.some((category: string) =>
        category.toLowerCase().includes(this.selectedCourseCategory.toLowerCase())
      );

      // Check if the institute name or description mentions the course
      const matchesCourse = institute.name.toLowerCase().includes(this.selectedCourseName.toLowerCase()) ||
        institute.courseTitle.toLowerCase().includes(this.selectedCourseName.toLowerCase()) ||
        institute.courseTitle2.toLowerCase().includes(this.selectedCourseName.toLowerCase()) ||
        institute.courseDesc.toLowerCase().includes(this.selectedCourseName.toLowerCase());

      return matchesCategory || matchesCourse;
    });
  }

  // Clear course filter
  clearCourseFilter(): void {
    this.selectedCourseId = '';
    this.selectedCourseName = '';
    this.selectedCourseCategory = '';
    this.filteredInstitutions = [...this.institutions];
  }

  // Search functionality
  onSearch(): void {
    this.filterInstitutions();
  }

  onLocationChange(): void {
    this.filterInstitutions();
  }

  onTypeChange(): void {
    this.filterInstitutions();
  }

  onRatingChange(): void {
    this.filterInstitutions();
  }

  onModeChange(): void {
    this.filterInstitutions();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedLocation = '';
    this.selectedType = '';
    this.selectedRating = '';
    this.selectedMode = '';
    this.filteredInstitutions = [...this.institutions];
  }

  private filterInstitutions(): void {
    let filtered = [...this.institutions];

    // Search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(institute =>
        institute.name.toLowerCase().includes(searchLower) ||
        institute.courseTitle.toLowerCase().includes(searchLower) ||
        institute.courseTitle2.toLowerCase().includes(searchLower) ||
        institute.courseDesc.toLowerCase().includes(searchLower) ||
        institute.address?.city.toLowerCase().includes(searchLower) ||
        institute.address?.state.toLowerCase().includes(searchLower)
      );
    }

    // Location filter
    if (this.selectedLocation) {
      filtered = filtered.filter(institute =>
        institute.address?.city.toLowerCase() === this.selectedLocation.toLowerCase()
      );
    }

    // Type filter
    if (this.selectedType) {
      filtered = filtered.filter(institute =>
        institute.type.toLowerCase() === this.selectedType.toLowerCase()
      );
    }

    // Rating filter
    if (this.selectedRating) {
      const minRating = parseFloat(this.selectedRating);
      filtered = filtered.filter(institute =>
        (institute.rating?.overall || institute.rating) >= minRating
      );
    }

    // Mode filter
    if (this.selectedMode) {
      switch (this.selectedMode) {
        case 'verified':
          filtered = filtered.filter(institute => institute.isVerified);
          break;
        case 'featured':
          filtered = filtered.filter(institute => institute.isFeatured);
          break;
        case 'online':
          filtered = filtered.filter(institute => institute.modes?.online);
          break;
        case 'offline':
          filtered = filtered.filter(institute => institute.modes?.offline);
          break;
      }
    }

    this.filteredInstitutions = filtered;
  }

  redirectToSignIn(): void {
    // Open sign-in popup instead of navigation
    // alert('Please sign in to enroll in this course');
  }

  // Navigate to course details page
  viewCourseDetails(data: any): void {
    // Show alert when view details button is clicked
    alert("View Details button clicked!");
    
    // Store institute data for course details page
    this.shareDataService.setOption(data);
    console.log("data=============", data);
    
    // Prepare course details object
    const courseDetails = {
      courseId: this.courseid,
      courseName: this.courseTitle,
      instituteId: data._id || data.id || '',
      instituteName: data.name || '',
      courseTitle: data.courseTitle || this.courseTitle,
      price: data.price || 0,
      duration: data.hours || data.duration || '60 Days',
      location: data.location || data.address?.city || '',
      rating: data.rating?.overall || data.rating || 4.6,
      reviews: data.rating?.totalReviews || data.reviews || 0,
      trainerDetails: data.trainerDetails || null,
      courses: data.courses || null
    };
    
    data.courseDetails = courseDetails;
    localStorage.setItem('courseDetails', JSON.stringify(data));
    
    // Navigate to course details page with all required query parameters
    this.router.navigate(['/Course-details', this.courseid], { 
      queryParams: { 
        from: 'institutes',
        instituteId: courseDetails.instituteId,
        instituteName: courseDetails.instituteName,
        courseName: courseDetails.courseName,
        courseTitle: courseDetails.courseTitle
      } 
    });
  }

  // Generate a unique course ID for navigation
  private generateCourseId(data: any): string {
    // Create a unique ID based on institute name and course title
    const instituteName = data.name?.replace(/\s+/g, '-').toLowerCase() || 'institute';
    const courseTitle = data.courseTitle?.replace(/\s+/g, '-').toLowerCase() || 'course';
    return `${instituteName}-${courseTitle}`;
  }

  addInstituteCourseToCart(institute: any): void {
    const itemId = this.buildInstituteCartId(institute);
    if (this.localCartService.hasItem(itemId)) {
      return;
    }

    const cartItem = this.mapInstituteToCartItem(institute, itemId);
    this.localCartService.addItem(cartItem);
  }

  isCourseInCart(institute: any): boolean {
    const itemId = this.buildInstituteCartId(institute);
    return this.localCartService.hasItem(itemId);
  }

  private mapInstituteToCartItem(institute: any, id: string): LocalCartItem {
    const price = Number(institute.price) || 0;
    const originalPrice = price ? Math.round(price * 1.2) : undefined;
    const tagSource = Array.isArray(institute.courses?.categories)
      ? institute.courses.categories.slice(0, 3).map((course: any) => course.courseName).filter(Boolean)
      : [];

    const mentorName =
      institute.trainerDetails?.name ||
      institute.courses?.categories?.find((course: any) => course?.trainerDetails?.name)?.trainerDetails?.name ||
      'Expert Mentor Team';

    const modeLabels = [];
    if (institute.modes?.online) {
      modeLabels.push('Online');
    }
    if (institute.modes?.offline) {
      modeLabels.push('Offline');
    }

    const rating = Number(institute.rating?.overall || institute.rating) || 4.6;
    const reviewsRaw = institute.rating?.totalReviews || institute.reviews || '0';
    const reviews = typeof reviewsRaw === 'number' ? reviewsRaw : Number(String(reviewsRaw).replace(/[, ]/g, ''));

    return {
      id,
      title: institute.courseTitle || `${this.courseTitle} Program`,
      description:
        institute.courseDesc ||
        institute.courseTitle2 ||
        'Comprehensive institute-led program with hands-on projects and placement assistance.',
      institute: institute.name,
      mentor: mentorName,
      mode: modeLabels.length ? modeLabels.join(' · ') : 'Flexible Learning Modes',
      duration: institute.hours ? `${institute.hours}+ Hours Guided Learning` : 'Structured Cohort Program',
      level: 'All Levels',
      price,
      originalPrice,
      rating,
      reviews: reviews || 0,
      image: `assets/photos/inistitution/${institute.img}`,
      tags: tagSource.length ? tagSource : ['Placement Support', 'Live Sessions'],
      addedAt: new Date().toISOString(),
      routeLink: this.courseid ? `/Course-details/${this.courseid}` : undefined,
    };
  }

  private buildInstituteCartId(institute: any): string {
    const courseKey = this.courseTitle || institute.courseTitle || 'course';
    const instituteKey = institute.name || 'institute';
    return `institute-${this.slugify(courseKey)}-${this.slugify(instituteKey)}`;
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
    if (this.courseTitle) {
      return `${this.courseTitle} - Training Institutes`;
    }
    return 'Training Institutes';
  }

  // Get trainers for an institute - only for the specific course
  getTrainersForInstitute(institute: any): any[] {
    const trainers: any[] = [];
    const trainerMap = new Map<string, any>();

    // Only collect trainers from courses matching the current courseId
    if (institute.courses?.categories && Array.isArray(institute.courses.categories)) {
      institute.courses.categories.forEach((category: any) => {
        // Check if this category matches the current course
        const categoryCourseId = category.courseId || category.id || category._id;
        const matchesCurrentCourse = this.courseid && (
          categoryCourseId == this.courseid || 
          categoryCourseId === this.courseid ||
          String(categoryCourseId) === String(this.courseid)
        );

        // Only include trainer if this course matches the current courseId
        if (matchesCurrentCourse && category.trainerDetails && category.trainerDetails.name) {
          const trainerName = category.trainerDetails.name;
          if (!trainerMap.has(trainerName)) {
            trainerMap.set(trainerName, category.trainerDetails);
          }
        }
      });
    }

    // Convert map to array
    trainerMap.forEach((trainer) => {
      trainers.push(trainer);
    });

    return trainers;
  }
}
