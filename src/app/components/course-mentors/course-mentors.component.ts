import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareDataService } from 'src/app/services/share-data.service';
import { LocalCartItem, LocalCartService } from 'src/app/services/local-cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-course-mentors',
  templateUrl: './course-mentors.component.html',
  styleUrls: ['./course-mentors.component.css']
})
export class CourseMentorsComponent implements OnInit, OnDestroy {

  // Search and filter properties
  public searchTerm: string = '';
  public selectedLocation: string = '';
  public selectedRating: string = '';
  public selectedMode: string = '';
  public selectedExperience: string = '';
  public filteredMentors: any[] = [];

  public course: any = "";
  public selectedCourseId: string = '';
  public selectedCourseName: string = '';
  public breadcrumbs: any[] = [
    { label: 'Home', link: '/Home' },
    { label: 'Courses', link: '/Courses' },
    { label: 'Expert Mentors', link: null }
  ];

  public mentors: any = [
    {
      name: "Srujan Bharath",
      title: "Senior Career Counselor",
      img: "mentor1.jpg",
      specialization: "Career Guidance & Development",
      bio: "15+ years of experience in career counseling and professional development with expertise in tech industry",
      rating: 4.9,
      totalStudents: 3200,
      totalSessions: 450,
      experience: "15 years",
      isVerified: true,
      isFeatured: true,
      modes: { online: true, offline: true },
      skills: [
        { courseId: 1, courseName: 'Angular', category: 'Frontend' },
    { courseId: 2, courseName: 'React JS', category: 'Frontend' },
    { courseId: 3, courseName: 'Vue JS', category: 'Frontend' },
    { courseId: 4, courseName: 'Node JS', category: 'Backend' },
    { courseId: 5, courseName: 'Express JS', category: 'Backend' },
    { courseId: 6, courseName: 'Python', category: 'Programming' },
    { courseId: 7, courseName: 'Django', category: 'Backend' },
    { courseId: 8, courseName: 'Flask', category: 'Backend' }
      ],
      education: "Ph.D. Career Psychology",
      certifications: ['Career Counselor Certified', 'HR Professional', 'Life Coach'],
      achievements: ['Top Rated Mentor', '1000+ Successful Placements'],
      languages: ['English', 'Hindi', 'Tamil'],
      hourlyRate: 1200,
      location: { city: 'Hyderabad', state: 'Telangana' }
    },
    {
      name: "Michael Chen",
      title: "Tech Industry Mentor",
      img: "mentor2.jpg",
      specialization: "Software Engineering & Career Growth",
      bio: "Tech veteran with 12+ years in FAANG companies, expert in software engineering and career advancement",
      rating: 4.8,
      totalStudents: 2800,
      totalSessions: 380,
      experience: "12 years",
      isVerified: true,
      isFeatured: true,
      modes: { online: true, offline: false },
      skills: [{ courseId: 6, courseName: 'Python', category: 'Programming' },
        { courseId: 7, courseName: 'Django', category: 'Backend' },
        { courseId: 8, courseName: 'Flask', category: 'Backend' },
        { courseId: 9, courseName: 'Java', category: 'Programming' },
        { courseId: 10, courseName: 'Spring Boot', category: 'Backend' },
        { courseId: 11, courseName: 'C# .NET', category: 'Programming' }],
      education: "M.S. Computer Science",
      certifications: ['Google Certified Mentor', 'System Design Expert'],
      achievements: ['FAANG Alumni', 'Helped 500+ Get Hired'],
      languages: ['English', 'Mandarin'],
      hourlyRate: 1500,
      location: { city: 'Bangalore', state: 'Karnataka' }
    },
    {
      name: "Anjali Verma",
      title: "Personal Development Mentor",
      img: "mentor3.jpg",
      specialization: "Personal Growth & Productivity",
      bio: "Life coach and productivity expert with 10+ years of experience in personal development and motivation",
      rating: 4.9,
      totalStudents: 2100,
      totalSessions: 320,
      experience: "10 years",
      isVerified: true,
      isFeatured: true,
      modes: { online: true, offline: true },
      skills: [
        { courseId: 10, courseName: 'Spring Boot', category: 'Backend' },
    { courseId: 11, courseName: 'C# .NET', category: 'Programming' },
    { courseId: 12, courseName: 'PHP', category: 'Backend' },
    { courseId: 13, courseName: 'Laravel', category: 'Backend' },
    { courseId: 14, courseName: 'HTML & CSS', category: 'Frontend' },
    { courseId: 15, courseName: 'JavaScript', category: 'Programming' },
    { courseId: 16, courseName: 'TypeScript', category: 'Programming' },
    { courseId: 17, courseName: 'MySQL', category: 'Database' },
    { courseId: 18, courseName: 'MongoDB', category: 'Database' }
      ],
      education: "Ph.D. Psychology",
      certifications: ['Certified Life Coach', 'Mental Health Professional', 'NLP Master'],
      achievements: ['Published Author', '10K+ Students Helped'],
      languages: ['English', 'Hindi', 'Bengali'],
      hourlyRate: 1100,
      location: { city: 'Delhi', state: 'Delhi' }
    },
    {
      name: "David Williams",
      title: "Business Strategy Mentor",
      img: "mentor4.jpg",
      specialization: "Entrepreneurship & Business Strategy",
      bio: "Serial entrepreneur and business strategist with 18 years of experience in startups and enterprise solutions",
      rating: 4.8,
      totalStudents: 1900,
      totalSessions: 280,
      experience: "18 years",
      isVerified: true,
      isFeatured: false,
      modes: { online: true, offline: false },
      skills: [{ courseId: 17, courseName: 'MySQL', category: 'Database' },
        { courseId: 18, courseName: 'MongoDB', category: 'Database' },
        { courseId: 19, courseName: 'PostgreSQL', category: 'Database' },
        { courseId: 20, courseName: 'DevOps', category: 'Cloud & CI/CD' },
        { courseId: 21, courseName: 'AWS', category: 'Cloud' },
        { courseId: 22, courseName: 'Azure', category: 'Cloud' },
        { courseId: 23, courseName: 'Google Cloud', category: 'Cloud' },
        { courseId: 24, courseName: 'Docker', category: 'Cloud & CI/CD' },
        { courseId: 25, courseName: 'Kubernetes', category: 'Cloud & CI/CD' }],
      education: "MBA Business Administration",
      certifications: ['Entrepreneur Certified', 'Business Coach', 'Startup Expert'],
      achievements: ['3 Successful Exits', 'Angel Investor'],
      languages: ['English', 'German'],
      hourlyRate: 1800,
      location: { city: 'Mumbai', state: 'Maharashtra' }
    },
    {
      name: "Priya Desai",
      title: "Leadership & Management Mentor",
      img: "mentor5.jpg",
      specialization: "Leadership Development",
      bio: "Executive coach specializing in leadership development with 14 years of experience in corporate training",
      rating: 4.9,
      totalStudents: 2500,
      totalSessions: 350,
      experience: "14 years",
      isVerified: true,
      isFeatured: true,
      modes: { online: true, offline: true },
      skills: [
        { courseId: 1, courseName: 'Angular', category: 'Frontend' },
    { courseId: 2, courseName: 'React JS', category: 'Frontend' },
    { courseId: 3, courseName: 'Vue JS', category: 'Frontend' },
    { courseId: 4, courseName: 'Node JS', category: 'Backend' },
    { courseId: 5, courseName: 'Express JS', category: 'Backend' },
    { courseId: 6, courseName: 'Python', category: 'Programming' }
      ],
      education: "M.S. Organizational Psychology",
      certifications: ['Executive Coach', 'Leadership Certified', 'Management Professional'],
      achievements: ['C-Suite Mentor', 'Fortune 500 Clients'],
      languages: ['English', 'Hindi', 'Gujarati'],
      hourlyRate: 1600,
      location: { city: 'Pune', state: 'Maharashtra' }
    },
    {
      name: "suaya pk",
      title: "Leadership & Management Mentor",
      img: "mentor5.jpg",
      specialization: "Leadership Development",
      bio: "Executive coach specializing in leadership development with 14 years of experience in corporate training",
      rating: 4.9,
      totalStudents: 2500,
      totalSessions: 350,
      experience: "14 years",
      isVerified: true,
      isFeatured: true,
      modes: { online: true, offline: true },
      skills: [
        { courseId: 1, courseName: 'Angular', category: 'Frontend' },
    { courseId: 2, courseName: 'React JS', category: 'Frontend' },
    { courseId: 3, courseName: 'Vue JS', category: 'Frontend' },
    { courseId: 4, courseName: 'Node JS', category: 'Backend' },
    { courseId: 5, courseName: 'Express JS', category: 'Backend' },
    { courseId: 6, courseName: 'Python', category: 'Programming' }
      ],
      education: "M.S. Organizational Psychology",
      certifications: ['Executive Coach', 'Leadership Certified', 'Management Professional'],
      achievements: ['C-Suite Mentor', 'Fortune 500 Clients'],
      languages: ['English', 'Hindi', 'Gujarati'],
      hourlyRate: 1600,
      location: { city: 'Pune', state: 'Maharashtra' }
    }
  ]

  private cartSubscription = new Subscription();
  private cartItemIds = new Set<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public shareDataService: ShareDataService,
    private localCartService: LocalCartService
  ) {
    this.route.queryParams.subscribe((params: any) => {
      console.log("params=============", params);
      let data = params.courseName;
      console.log("data=============", data);
      this.course = data;
    });
  }

  ngOnInit() {
    this.filteredMentors = [...this.mentors];

    // Handle query parameters from course navigation
    this.route.queryParams.subscribe(params => {
      if (params['courseId']) {
        this.selectedCourseId = params['courseId'];
        this.selectedCourseName = params['courseName'] || '';

        // Update breadcrumbs
        this.breadcrumbs = [
          { label: 'Home', link: '/Home' },
          { label: 'Courses', link: '/Courses' },
          { label: this.selectedCourseName || 'Expert Mentors', link: null }
        ];

        // Filter mentors based on the selected course
        // this.filterMentorsByCourse();
      }
      this.filteredMentors = this.mentors.filter((inst: any) =>
        inst.skills.some((course: any) => course.courseId == this.selectedCourseId)
      );
    });

    this.cartSubscription.add(
      this.localCartService.items$.subscribe((items) => {
        this.cartItemIds = new Set(items.map((item) => item.id));
      })
    );
  }

  // Filter mentors by selected course
  filterMentorsByCourse(): void {
    if (!this.selectedCourseName) {
      this.filteredMentors = [...this.mentors];
      return;
    }

    // Filter mentors that provide guidance in the selected course area
    this.filteredMentors = this.mentors.filter((mentor: any) => {
      // Check if mentor's skills match the course category
      const skillMatch = mentor.skills?.some((skill: any) => {
        const skillName = typeof skill === 'string' ? skill : skill?.courseName;
        return skillName
          ?.toString()
          .toLowerCase()
          .includes(this.selectedCourseName.toLowerCase());
      });

      // Check if mentor's specialization matches
      const specMatch = mentor.specialization?.toLowerCase().includes(this.selectedCourseName.toLowerCase());

      return skillMatch || specMatch;
    });
  }

  // Clear course filter
  clearCourseFilter(): void {
    this.selectedCourseId = '';
    this.selectedCourseName = '';
    this.filteredMentors = [...this.mentors];
  }

  // Search functionality
  onSearch(): void {
    this.filterMentors();
  }

  onLocationChange(): void {
    this.filterMentors();
  }

  onRatingChange(): void {
    this.filterMentors();
  }

  onModeChange(): void {
    this.filterMentors();
  }

  onExperienceChange(): void {
    this.filterMentors();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedLocation = '';
    this.selectedRating = '';
    this.selectedMode = '';
    this.selectedExperience = '';
    this.filteredMentors = [...this.mentors];
  }

  private filterMentors(): void {
    let filtered = [...this.mentors];

    // Search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(searchLower) ||
        mentor.specialization.toLowerCase().includes(searchLower) ||
        mentor.bio.toLowerCase().includes(searchLower) ||
        mentor.location?.city.toLowerCase().includes(searchLower) ||
        mentor.skills?.some((skill: any) => {
          const skillName = typeof skill === 'string' ? skill : skill?.courseName;
          return skillName?.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Location filter
    if (this.selectedLocation) {
      filtered = filtered.filter(mentor =>
        mentor.location?.city.toLowerCase() === this.selectedLocation.toLowerCase()
      );
    }

    // Rating filter
    if (this.selectedRating) {
      const minRating = parseFloat(this.selectedRating);
      filtered = filtered.filter(mentor =>
        mentor.rating >= minRating
      );
    }

    // Mode filter
    if (this.selectedMode) {
      switch (this.selectedMode) {
        case 'verified':
          filtered = filtered.filter(mentor => mentor.isVerified);
          break;
        case 'featured':
          filtered = filtered.filter(mentor => mentor.isFeatured);
          break;
        case 'online':
          filtered = filtered.filter(mentor => mentor.modes?.online);
          break;
        case 'offline':
          filtered = filtered.filter(mentor => mentor.modes?.offline);
          break;
      }
    }

    // Experience filter
    if (this.selectedExperience) {
      const minExp = parseInt(this.selectedExperience);
      filtered = filtered.filter(mentor => {
        const mentorExp = parseInt(mentor.experience);
        return mentorExp >= minExp;
      });
    }

    this.filteredMentors = filtered;
  }

  redirectToSignIn(): void {
    alert('Please sign in to book a session with this mentor');
  }

  // Navigate to mentor details or book session
  viewMentorProfile(mentor: any): void {
    // Store mentor data for mentor details page
    this.shareDataService.setOption(mentor);
    
    // Navigate to booking or mentor details
    // this.router.navigate(['/mentor-enrollment']);
    this.router.navigate(['/Course-details', this.selectedCourseId], { queryParams: { from: 'mentors' } });

  }

  addMentorProgramToCart(mentor: any): void {
    const itemId = this.buildMentorCartId(mentor);
    if (this.cartItemIds.has(itemId)) {
      return;
    }

    const cartItem = this.mapMentorToCartItem(mentor, itemId);
    this.localCartService.addItem(cartItem);
  }

  isMentorInCart(mentor: any): boolean {
    const itemId = this.buildMentorCartId(mentor);
    return this.cartItemIds.has(itemId);
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  private mapMentorToCartItem(mentor: any, id: string): LocalCartItem {
    const sessionBundleCount = 12;
    const pricePerSession = Number(mentor.hourlyRate) || 0;
    const price = pricePerSession * sessionBundleCount;
    const originalPrice = price ? Math.round(price * 1.2) : undefined;

    const tags = Array.isArray(mentor.skills)
      ? mentor.skills.slice(0, 4).map((skill: any) => skill.courseName).filter(Boolean)
      : [];

    const modeLabels = [];
    if (mentor.modes?.online) {
      modeLabels.push('Online');
    }
    if (mentor.modes?.offline) {
      modeLabels.push('Offline');
    }

    return {
      id,
      title: `${mentor.name} Mentorship · ${labelSelectedCourse(this.selectedCourseName)}`,
      description:
        mentor.bio ||
        `Guided mentorship sessions focused on ${labelSelectedCourse(this.selectedCourseName)} and career growth.`,
      institute: mentor.specialization || 'Mentorship Program',
      mentor: mentor.name,
      mode: modeLabels.length ? modeLabels.join(' · ') : 'Flexible Mentorship Modes',
      duration: `${sessionBundleCount} mentorship sessions · ${mentor.experience} experience`,
      level: 'Career Mentorship',
      price,
      originalPrice,
      rating: Number(mentor.rating) || 4.7,
      reviews: mentor.totalStudents || 0,
      image: `assets/photos/mentors/${mentor.img}`,
      tags: tags.length ? tags : ['Career Strategy', 'Personalised Plan'],
      addedAt: new Date().toISOString(),
      routeLink: this.selectedCourseId ? `/Course-details/${this.selectedCourseId}` : undefined,
    };
  }

  private buildMentorCartId(mentor: any): string {
    const nameKey = mentor.name || 'mentor';
    const courseKey = this.selectedCourseName || 'course';
    return `mentor-${this.slugify(nameKey)}-${this.slugify(courseKey)}`;
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
    if (this.selectedCourseName) {
      return `${this.selectedCourseName} - Expert Mentors`;
    }
    return 'Expert Mentors';
  }
}

function labelSelectedCourse(value: string | undefined): string {
  if (!value) {
    return 'Career Path';
  }
  return value;
}







