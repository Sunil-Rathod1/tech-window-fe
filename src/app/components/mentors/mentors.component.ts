import { Component, OnInit } from '@angular/core';
import { MentorsService, Mentor } from '../../services/mentors.service';

interface LocalMentor {
  id: number;
  name: string;
  title: string;
  specialization: string;
  consultationFee: number;
  avatar: string;
  backgroundImage: string;
  mentees: number;
  sessions: number;
  description: string;
  expertise: string[];
  experience: string;
  availability: string;
  achievements: string[];
  rating: number;
  online: boolean;
  location: string;
  industry: string;
  company: string;
  linkedin: string;
  github: string;
  portfolio: string;
  languages: string[];
  sessionTypes: string[];
  certifications: string[];
}

@Component({
  selector: 'app-mentors',
  templateUrl: './mentors.component.html',
  styleUrls: ['./mentors.component.css']
})
export class MentorsComponent implements OnInit {

  mentors: LocalMentor[] = [];
  filteredMentors: LocalMentor[] = [];
  searchTerm: string = '';
  selectedSpecialization: string = '';
  selectedExperience: string = '';
  selectedLocation: string = '';
  selectedIndustry: string = '';
  selectedAvailability: string = '';

  // New API data
  public detailedMentors: Mentor[] = [];
  public loading = false;
  public error = '';
  public pagination: any = {};
  public currentPage = 1;
  public pageSize = 10;

  constructor(private mentorsService: MentorsService) {}

  ngOnInit() {
    this.initializeMentors();
    this.filteredMentors = [...this.mentors];
    
    // Load detailed mentors from API
    this.loadDetailedMentors();
  }

  loadDetailedMentors() {
    this.loading = true;
    this.error = '';
    
    this.mentorsService.getDetailedMentors(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.detailedMentors = response.data;
        this.pagination = response.pagination;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading detailed mentors:', error);
        this.error = 'Failed to load mentors';
        this.loading = false;
      }
    });
  }

  filterMentors() {
    const filters = {
      industry: this.selectedIndustry,
      location: this.selectedLocation,
      minRating: '',
      maxPrice: '',
      technologies: '',
      availability: this.selectedAvailability,
      search: this.searchTerm,
      page: this.currentPage,
      limit: this.pageSize
    };

    this.loading = true;
    this.mentorsService.filterMentors(filters).subscribe({
      next: (response) => {
        this.detailedMentors = response.data;
        this.pagination = response.pagination;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error filtering mentors:', error);
        this.error = 'Failed to filter mentors';
        this.loading = false;
      }
    });
  }

  initializeMentors() {
    this.mentors = [
      {
        id: 1,
        name: 'Srujan Bharath',
        title: 'Senior Software Architect & Career Mentor',
        specialization: 'Software Architecture & Leadership',
        consultationFee: 2500,
        avatar: 'assets/photos/trainers/trainer-1.jpg',
        backgroundImage: 'assets/photos/course-1.jpg',
        mentees: 156,
        sessions: 324,
        description: 'Experienced software architect with 15+ years in enterprise systems. Specializes in helping developers transition to leadership roles and architectural positions. Passionate about mentoring the next generation of tech leaders.',
        expertise: ['Software Architecture', 'Leadership Development', 'System Design', 'Team Management', 'Cloud Architecture', 'Microservices'],
        experience: '15+ Years',
        availability: 'Weekdays & Weekends',
        achievements: ['Google Certified Architect', 'Mentored 50+ Tech Leads', '5.0/5 Rating'],
        rating: 5.0,
        online: true,
        location: 'San Francisco',
        industry: 'Technology',
        company: 'Google',
        linkedin: 'linkedin.com/in/sarahchen',
        github: 'github.com/sarahchen',
        portfolio: 'sarahchen.dev',
        languages: ['English', 'Mandarin'],
        sessionTypes: ['1-on-1', 'Group Sessions', 'Code Reviews', 'Career Planning'],
        certifications: ['AWS Solutions Architect', 'Google Cloud Architect', 'TOGAF 9.2']
      },
      {
        id: 2,
        name: 'Rajesh Kumar',
        title: 'Full-Stack Development Mentor',
        specialization: 'Web Development & Career Growth',
        consultationFee: 1800,
        avatar: 'assets/photos/trainers/trainer-2.jpg',
        backgroundImage: 'assets/photos/course-2.jpg',
        mentees: 89,
        sessions: 187,
        description: 'Full-stack developer turned mentor with expertise in modern web technologies. Helps developers build practical skills and navigate career transitions. Known for hands-on coding sessions and real-world project guidance.',
        expertise: ['React.js', 'Node.js', 'Python', 'DevOps', 'Career Planning', 'Interview Prep'],
        experience: '8+ Years',
        availability: 'Evenings & Weekends',
        achievements: ['Microsoft MVP', '4.9/5 Rating', '100+ Successful Placements'],
        rating: 4.9,
        online: true,
        location: 'Bangalore',
        industry: 'Technology',
        company: 'Microsoft',
        linkedin: 'linkedin.com/in/rajeshkumar',
        github: 'github.com/rajeshkumar',
        portfolio: 'rajeshkumar.tech',
        languages: ['English', 'Hindi', 'Kannada'],
        sessionTypes: ['1-on-1', 'Pair Programming', 'Project Reviews', 'Interview Prep'],
        certifications: ['Microsoft Certified Developer', 'AWS Developer Associate']
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        title: 'Data Science & AI Career Mentor',
        specialization: 'Data Science & Machine Learning',
        consultationFee: 2200,
        avatar: 'assets/photos/trainers/trainer-3.jpg',
        backgroundImage: 'assets/photos/course-3.jpg',
        mentees: 203,
        sessions: 456,
        description: 'Data scientist with expertise in machine learning and AI. Specializes in helping professionals transition into data science roles and building AI-powered solutions. Provides guidance on both technical skills and industry insights.',
        expertise: ['Machine Learning', 'Python', 'Deep Learning', 'Data Engineering', 'AI Ethics', 'Career Transition'],
        experience: '12+ Years',
        availability: 'Flexible Schedule',
        achievements: ['PhD in Computer Science', '4.8/5 Rating', 'Published 20+ Papers'],
        rating: 4.8,
        online: true,
        location: 'New York',
        industry: 'Technology',
        company: 'Netflix',
        linkedin: 'linkedin.com/in/emilyrodriguez',
        github: 'github.com/emilyrodriguez',
        portfolio: 'emilyrodriguez.ai',
        languages: ['English', 'Spanish'],
        sessionTypes: ['1-on-1', 'Technical Deep Dives', 'Research Guidance', 'Industry Insights'],
        certifications: ['Google TensorFlow Developer', 'AWS Machine Learning Specialist']
      },
      {
        id: 4,
        name: 'Amit Patel',
        title: 'DevOps & Cloud Infrastructure Mentor',
        specialization: 'DevOps & Cloud Computing',
        consultationFee: 2000,
        avatar: 'assets/photos/trainers/trainer-1.jpg',
        backgroundImage: 'assets/photos/course-1.jpg',
        mentees: 134,
        sessions: 289,
        description: 'DevOps engineer with extensive experience in cloud infrastructure and automation. Helps developers and operations teams master modern DevOps practices and cloud technologies. Focuses on practical implementation and best practices.',
        expertise: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Infrastructure as Code', 'Monitoring'],
        experience: '10+ Years',
        availability: 'Weekdays',
        achievements: ['AWS Community Builder', '4.7/5 Rating', 'DevOps Expert'],
        rating: 4.7,
        online: false,
        location: 'Mumbai',
        industry: 'Technology',
        company: 'Amazon',
        linkedin: 'linkedin.com/in/amitpatel',
        github: 'github.com/amitpatel',
        portfolio: 'amitpatel.dev',
        languages: ['English', 'Hindi', 'Gujarati'],
        sessionTypes: ['1-on-1', 'Infrastructure Reviews', 'Best Practices', 'Tool Selection'],
        certifications: ['AWS Solutions Architect Pro', 'Kubernetes Administrator', 'Terraform Associate']
      },
      {
        id: 5,
        name: 'Lisa Thompson',
        title: 'Product Management & Strategy Mentor',
        specialization: 'Product Management & Business Strategy',
        consultationFee: 2800,
        avatar: 'assets/photos/trainers/trainer-2.jpg',
        backgroundImage: 'assets/photos/course-2.jpg',
        mentees: 78,
        sessions: 156,
        description: 'Senior product manager with experience in both startups and enterprise companies. Helps professionals develop product thinking, strategy skills, and business acumen. Specializes in product-market fit and user experience design.',
        expertise: ['Product Strategy', 'User Research', 'Data Analysis', 'Stakeholder Management', 'Go-to-Market', 'Agile'],
        experience: '14+ Years',
        availability: 'Weekends',
        achievements: ['Stanford MBA', '4.9/5 Rating', 'Product Leader'],
        rating: 4.9,
        online: true,
        location: 'Seattle',
        industry: 'Technology',
        company: 'Amazon',
        linkedin: 'linkedin.com/in/lisathompson',
        github: 'github.com/lisathompson',
        portfolio: 'lisathompson.pm',
        languages: ['English'],
        sessionTypes: ['1-on-1', 'Strategy Sessions', 'Case Studies', 'Career Planning'],
        certifications: ['Certified Scrum Product Owner', 'Google Analytics Individual']
      },
      {
        id: 6,
        name: 'Carlos Mendez',
        title: 'Mobile Development & Entrepreneurship Mentor',
        specialization: 'Mobile Development & Startup Growth',
        consultationFee: 1600,
        avatar: 'assets/photos/trainers/trainer-3.jpg',
        backgroundImage: 'assets/photos/course-3.jpg',
        mentees: 167,
        sessions: 312,
        description: 'Mobile developer and startup founder with experience building successful apps. Combines technical expertise with business insights to help developers create marketable products and build sustainable careers.',
        expertise: ['iOS Development', 'Android Development', 'React Native', 'Startup Strategy', 'App Monetization', 'User Acquisition'],
        experience: '9+ Years',
        availability: 'Flexible Schedule',
        achievements: ['App Store Featured App', '4.6/5 Rating', '3 Successful Exits'],
        rating: 4.6,
        online: true,
        location: 'Austin',
        industry: 'Technology',
        company: 'Self-Employed',
        linkedin: 'linkedin.com/in/carlosmendez',
        github: 'github.com/carlosmendez',
        portfolio: 'carlosmendez.dev',
        languages: ['English', 'Spanish'],
        sessionTypes: ['1-on-1', 'App Reviews', 'Business Strategy', 'Technical Guidance'],
        certifications: ['Apple Developer', 'Google Play Developer', 'AWS Mobile Specialist']
      }
    ];
  }

  onSearch() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    if (!this.mentors || this.mentors.length === 0) {
      this.filteredMentors = [];
      return;
    }

    this.filteredMentors = this.mentors.filter(mentor => {
      const matchesSearch = !this.searchTerm ||
        mentor.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        mentor.specialization.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (mentor.expertise && mentor.expertise.some(exp => exp.toLowerCase().includes(this.searchTerm.toLowerCase())));

      const matchesSpecialization = !this.selectedSpecialization ||
        mentor.specialization.toLowerCase().includes(this.selectedSpecialization.toLowerCase()) ||
        (mentor.expertise && mentor.expertise.some(exp => exp.toLowerCase().includes(this.selectedSpecialization.toLowerCase())));

      const matchesExperience = !this.selectedExperience ||
        mentor.experience.includes(this.selectedExperience);

      const matchesLocation = !this.selectedLocation ||
        mentor.location.toLowerCase().includes(this.selectedLocation.toLowerCase());

      const matchesIndustry = !this.selectedIndustry ||
        mentor.industry.toLowerCase().includes(this.selectedIndustry.toLowerCase());

      const matchesAvailability = !this.selectedAvailability ||
        mentor.availability.toLowerCase().includes(this.selectedAvailability.toLowerCase());

      return matchesSearch && matchesSpecialization && matchesExperience && 
             matchesLocation && matchesIndustry && matchesAvailability;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedSpecialization = '';
    this.selectedExperience = '';
    this.selectedLocation = '';
    this.selectedIndustry = '';
    this.selectedAvailability = '';
    this.filteredMentors = this.mentors ? [...this.mentors] : [];
  }

  // Safe array access methods
  getMentorsToDisplay(): any[] {
    return this.detailedMentors && this.detailedMentors.length > 0 ? this.detailedMentors : this.filteredMentors;
  }

  get filteredCount(): number { return this.filteredMentors.length; }
  get totalCount(): number { return this.mentors.length; }
  
  viewProfile(mentor: LocalMentor) { 
    console.log('Viewing mentor profile for:', mentor.name); 
  }
  
  bookSession(mentor: LocalMentor) { 
    console.log('Booking session with mentor:', mentor.name); 
  }
  
  contactMentor(mentor: LocalMentor) { 
    console.log('Contacting mentor:', mentor.name); 
  }
  
  formatPrice(price: number): string { 
    return `₹${price.toLocaleString('en-IN')}`; 
  }
  
  getOnlineStatusClass(online: boolean): string { 
    return online ? 'online' : 'offline'; 
  }
  
  getRatingStars(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }

  getAvailabilityBadge(availability: string): string {
    if (availability.includes('Flexible')) return 'flexible';
    if (availability.includes('Weekends')) return 'weekends';
    return 'weekdays';
  }

  // Navigate to mentor enrollment page
  becomeMentor() {
    // this.router.navigate(['/mentor-enrollment']);
  }
}
