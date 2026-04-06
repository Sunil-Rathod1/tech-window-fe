import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareDataService } from 'src/app/services/share-data.service';

interface Course {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  level: string;
  rating: number;
  students: number;
  modules: number;
  certification: boolean;
}

@Component({
  selector: 'app-trainer-courses',
  templateUrl: './trainer-courses.component.html',
  styleUrls: ['./trainer-courses.component.css']
})
export class TrainerCoursesComponent implements OnInit {

  trainer: any = {};
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm: string = '';
  selectedLevel: string = '';
  selectedDuration: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shareDataService: ShareDataService
  ) {}

  ngOnInit(): void {
    // Get trainer data from ShareDataService
    this.trainer = this.shareDataService.getOption();
    
    // Initialize courses based on trainer's expertise
    this.initializeCourses();
    
    // Initialize filtered courses
    this.filteredCourses = [...this.courses];
  }

  initializeCourses(): void {
    // Generate courses based on trainer's expertise and specialization
    const baseCourses = this.generateCoursesForTrainer(this.trainer);
    this.courses = baseCourses;
  }

  generateCoursesForTrainer(trainer: any): Course[] {
    const courses: Course[] = [];
    
    // Base course from trainer's specialization
    if (trainer.courseCategory) {
      courses.push({
        id: 1,
        name: trainer.courseCategory,
        description: `Comprehensive ${trainer.courseCategory} course taught by ${trainer.name}. ${trainer.description}`,
        duration: trainer.duration || '6 months',
        price: trainer.coursePrice || 15000,
        image: trainer.courseImage || 'assets/photos/course-1.jpg',
        level: 'Intermediate',
        rating: trainer.rating || 4.5,
        students: trainer.students || 1000,
        modules: trainer.modules || 20,
        certification: trainer.certification || true
      });
    }

    // Additional courses based on expertise
    if (trainer.expertise && trainer.expertise.length > 0) {
      trainer.expertise.forEach((skill: string, index: number) => {
        if (index < 4) { // Limit to 4 additional courses
          courses.push({
            id: courses.length + 1,
            name: skill,
            description: `Advanced ${skill} training program by ${trainer.name}. Learn industry best practices and real-world applications.`,
            duration: this.getRandomDuration(),
            price: this.getRandomPrice(trainer.coursePrice),
            image: this.getRandomCourseImage(),
            level: this.getRandomLevel(),
            rating: this.getRandomRating(trainer.rating),
            students: this.getRandomStudents(trainer.students),
            modules: this.getRandomModules(),
            certification: true
          });
        }
      });
    }

    return courses;
  }

  // Helper methods for generating random data
  private getRandomDuration(): string {
    const durations = ['3 months', '4 months', '6 months', '8 months'];
    return durations[Math.floor(Math.random() * durations.length)];
  }

  private getRandomPrice(basePrice: number): number {
    const variation = 0.8 + Math.random() * 0.4; // 80% to 120% of base price
    return Math.round(basePrice * variation);
  }

  private getRandomCourseImage(): string {
    const images = [
      'assets/photos/course-1.jpg',
      'assets/photos/course-2.jpg',
      'assets/photos/course-3.jpg',
      'assets/photos/course-details.jpg'
    ];
    return images[Math.floor(Math.random() * images.length)];
  }

  private getRandomLevel(): string {
    const levels = ['Beginner', 'Intermediate', 'Advanced'];
    return levels[Math.floor(Math.random() * levels.length)];
  }

  private getRandomRating(baseRating: number): number {
    const variation = baseRating + (Math.random() - 0.5) * 0.5;
    return Math.round(variation * 10) / 10; // Round to 1 decimal place
  }

  private getRandomStudents(baseStudents: number): number {
    const variation = 0.5 + Math.random() * 1.0; // 50% to 150% of base students
    return Math.round(baseStudents * variation);
  }

  private getRandomModules(): number {
    return 15 + Math.floor(Math.random() * 20); // 15 to 35 modules
  }

  // Search and filter functionality
  onSearch(): void {
    this.filterCourses();
  }

  onLevelChange(): void {
    this.filterCourses();
  }

  onDurationChange(): void {
    this.filterCourses();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedLevel = '';
    this.selectedDuration = '';
    this.filteredCourses = [...this.courses];
  }

  private filterCourses(): void {
    let filtered = [...this.courses];

    // Search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(course => 
        course.name.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower)
      );
    }

    // Level filter
    if (this.selectedLevel) {
      filtered = filtered.filter(course => course.level === this.selectedLevel);
    }

    // Duration filter
    if (this.selectedDuration) {
      filtered = filtered.filter(course => course.duration === this.selectedDuration);
    }

    this.filteredCourses = filtered;
  }

  // Navigation methods
  selectCourse(course: Course): void {
    console.log('Selected course:', course.name);
    
    // Store course and trainer data for enrollment page
    this.shareDataService.setOption({
      courseId: course.id,
      courseName: course.name,
      courseDescription: course.description,
      courseDuration: course.duration,
      coursePrice: course.price,
      courseImage: course.image,
      courseLevel: course.level,
      courseRating: course.rating,
      courseStudents: course.students,
      courseModules: course.modules,
      courseCertification: course.certification,
      
      // Trainer information
      trainerId: this.trainer.trainerId,
      trainerName: this.trainer.trainerName,
      trainerTitle: this.trainer.trainerTitle,
      trainerExperience: this.trainer.experience,
      trainerAvatar: this.trainer.avatar,
      trainerRating: this.trainer.rating,
      trainerLocation: this.trainer.location,
      trainerOnline: this.trainer.online
    });
    
    // Navigate to enrollment page
    this.router.navigate(['/Course-details']);
  }

  goBack(): void {
    this.router.navigate(['/Trainers']);
  }

  // Utility methods
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

  get filteredCount(): number {
    return this.filteredCourses.length;
  }

  get totalCount(): number {
    return this.courses.length;
  }

  redirectToSignIn(): void {
    // Open sign-in popup instead of navigation
    alert('Please sign in to enroll in this course');
  }
}
