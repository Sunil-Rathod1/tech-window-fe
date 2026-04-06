import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareDataService } from 'src/app/services/share-data.service';
import { LocalCartItem, LocalCartService } from 'src/app/services/local-cart.service';
import { Subscription } from 'rxjs';
import { CourseTrainerService } from './course-trainer.service';
@Component({
  selector: 'app-course-trainers',
  templateUrl: './course-trainers.component.html',
  styleUrls: ['./course-trainers.component.css']
})
export class CourseTrainersComponent implements OnInit, OnDestroy {

  // Search and filter properties
  public searchTerm: string = '';
  public selectedLocation: string = '';
  public selectedRating: string = '';
  public selectedMode: string = '';
  public selectedExperience: string = '';
  public filteredTrainers: any[] = [];
  public isLoadingTrainers: boolean = false;
  public trainersError: string = '';

  public course: any = "";
  public selectedCourseId: string = '';
  public selectedCourseName: string = '';
  public breadcrumbs: any[] = [
    { label: 'Home', link: '/Home' },
    { label: 'Courses', link: '/Courses' },
    { label: 'Expert Trainers', link: null }
  ];

  public trainers: any[] = [];

  private cartSubscription = new Subscription();
  private cartItemIds = new Set<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public shareDataService: ShareDataService,
    private localCartService: LocalCartService,
    private courseTrainerService: CourseTrainerService
  ) {}

  ngOnInit() {
    
    this.fetchTrainers();

    console.log('trainers=============',this.trainers);
    this.filteredTrainers = [...this.trainers];
console.log('filer=============',this.filteredTrainers);
    this.route.queryParams.subscribe(params => {
      this.selectedCourseId = params['courseId'] || '';
      this.selectedCourseName = params['courseName'] || '';
      this.course = this.selectedCourseName;

      this.breadcrumbs = [
        { label: 'Home', link: '/Home' },
        { label: 'Courses', link: '/Courses' },
        { label: this.selectedCourseName || 'Expert Trainers', link: null }
      ];
      
      
    });

    this.cartSubscription.add(
      this.localCartService.items$.subscribe((items) => {
        this.cartItemIds = new Set(items.map((item) => item.id));
      })
    );
  }
  public filteredTrainersData: any[] = [];
  private fetchTrainers(): void {
    this.isLoadingTrainers = true;
    this.trainersError = '';

    const params: any = {};
    if (this.selectedCourseId) {
      params.courseId = this.selectedCourseId;
    }
    if (this.selectedCourseName) {
      params.search = this.selectedCourseName;
    }

    this.courseTrainerService.getCourseTrainers(params).subscribe({
      next: (data) => {
        if (data && data.length) {
          this.trainers = this.normalizeTrainerData(data);
          console.log("trainers data",this.trainers);
          this.filteredTrainersData = this.trainers.filter((trainer: any) =>
            trainer.batchDates?.some((batch: any) =>
              batch.courseTitle?.trim().toLowerCase() ===
              this.selectedCourseName?.trim().toLowerCase()
            )
          );
          // this.filteredTrainersData = this.trainers.filter((trainer: any) => {
          //   // console.log('trainer.specialization=============',trainer.specialization);
          //   // console.log('selectedCourse flag=============',this.selectedCourseName.toLowerCase()==trainer.specialization.toLowerCase());
          //   return trainer.specialization.toLowerCase() == this.selectedCourseName.toLowerCase();

          // });
            console.log('xxxxxxxxxxxxx=============',this.filteredTrainersData);
      
        }
        this.filterTrainers();
        this.isLoadingTrainers = false;
      },
      error: (error) => {
        console.error('Error loading trainers:', error);
        this.trainersError = error.message || 'Failed to load trainers. Showing curated mentors instead.';
        this.trainers = this.normalizeTrainerData(this.trainers || []);
        this.filterTrainers();
        this.isLoadingTrainers = false;
      }
    });

  }

  private normalizeTrainerData(trainers: any[]): any[] {
    if (!Array.isArray(trainers) || !trainers.length) {
      return [...this.trainers];
    }

    return trainers.map((trainer) => {
      const skills = Array.isArray(trainer.skills)
        ? trainer.skills
        : [];

      return {
        ...trainer,
        img: trainer.img || trainer.avatar || 'trainer-1.jpg',
        specialization: trainer.specialization || this.selectedCourseName || 'Expert Trainer',
        skills: skills.length
          ? skills.map((skill: any) => ({
              courseName: skill.courseName || skill.name || skill,
              category: skill.category || skill.name || '',
              courseId: skill.courseId || skill.name || ''
            }))
          : [{ courseName: this.selectedCourseName || 'Full Stack', category: 'General', courseId: this.selectedCourseId || '0' }],
        location: trainer.location || { city: 'Online', state: '' },
        totalStudents: trainer.totalStudents || 0,
        totalCourses: trainer.totalCourses || 0,
        experience: trainer.experience || `${trainer.experienceYears || 0} years`,
        rating: trainer.rating || 4.8,
        hourlyRate: trainer.hourlyRate || 1500,
        modes: trainer.modes || { online: true, offline: true },
        certifications: trainer.certifications || [],
        achievements: trainer.achievements || []
      };
    });
  }

  // Filter trainers by selected course (used as base before other filters)
  private getCourseFilteredTrainers(): any[] {
    if (!this.selectedCourseName && !this.selectedCourseId) {
      return [...this.trainers];
    }

    const courseMatch = (trainer: any) => {
      const searchValue = (this.selectedCourseName || '').toLowerCase();
      const skillMatch = trainer.skills?.some((skill: any) => {
        const skillName = typeof skill === 'string' ? skill : skill?.courseName;
        return skillName?.toString().toLowerCase().includes(searchValue);
      });
      const specMatch = trainer.specialization?.toLowerCase().includes(searchValue);
      return skillMatch || specMatch;
    };

    return this.trainers.filter((trainer: any) => {
      if (this.selectedCourseId) {
        return trainer.skills?.some((skill: any) => {
          const skillId = skill.courseId || skill.name || '';
          return skillId?.toString() === this.selectedCourseId?.toString();
        });
      }
      return courseMatch(trainer);
    });
  }

  // Clear course filter
  clearCourseFilter(): void {
    this.selectedCourseId = '';
    this.selectedCourseName = '';
    this.filterTrainers();
  }

  // Search functionality
  onSearch(): void {
    this.filterTrainers();
  }

  onLocationChange(): void {
    this.filterTrainers();
  }

  onRatingChange(): void {
    this.filterTrainers();
  }

  onModeChange(): void {
    this.filterTrainers();
  }

  onExperienceChange(): void {
    this.filterTrainers();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedLocation = '';
    this.selectedRating = '';
    this.selectedMode = '';
    this.selectedExperience = '';
    this.filteredTrainers = [...this.trainers];
  }

  private filterTrainers(): void {
    if (!this.trainers || !this.trainers.length) {
      this.filteredTrainers = [];
      return;
    }

    let filtered = this.getCourseFilteredTrainers();

    // Search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(trainer =>
        trainer.name?.toLowerCase().includes(searchLower) ||
        trainer.specialization?.toLowerCase().includes(searchLower) ||
        trainer.bio?.toLowerCase().includes(searchLower) ||
        trainer.location?.city?.toLowerCase().includes(searchLower) ||
        trainer.skills?.some((skill: any) => {
          const skillName = typeof skill === 'string' ? skill : skill?.courseName;
          return skillName?.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Location filter
    if (this.selectedLocation) {
      filtered = filtered.filter(trainer =>
        trainer.location?.city?.toLowerCase() === this.selectedLocation.toLowerCase()
      );
    }

    // Rating filter
    if (this.selectedRating) {
      const minRating = parseFloat(this.selectedRating);
      filtered = filtered.filter(trainer =>
        trainer.rating >= minRating
      );
    }

    // Mode filter
    if (this.selectedMode) {
      switch (this.selectedMode) {
        case 'verified':
          filtered = filtered.filter(trainer => trainer.isVerified);
          break;
        case 'featured':
          filtered = filtered.filter(trainer => trainer.isFeatured);
          break;
        case 'online':
          filtered = filtered.filter(trainer => trainer.modes?.online);
          break;
        case 'offline':
          filtered = filtered.filter(trainer => trainer.modes?.offline);
          break;
      }
    }

    // Experience filter
    if (this.selectedExperience) {
      const minExp = parseInt(this.selectedExperience);
      filtered = filtered.filter(trainer => {
        const trainerExp = parseInt((trainer.experience || '').toString(), 10);
        return (isNaN(trainerExp) ? 0 : trainerExp) >= minExp;
      });
    }

    this.filteredTrainers = filtered;
  }

  trackByTrainer(_: number, trainer: any): string {
    return trainer.id || trainer.name;
  }

  getTrainerImage(trainer: any): string {
    return trainer.avatar || (trainer.img?.includes('http') ? trainer.img : `assets/photos/trainers/${trainer.img || 'trainer-1.jpg'}`);
  }

  redirectToSignIn(): void {
    alert('Please sign in to book a session with this trainer');
  }

  // Navigate to trainer details or book session
  viewTrainerProfile(trainer: any): void {
    const primarySkill = Array.isArray(trainer.skills) && trainer.skills.length ? trainer.skills[0] : {};
    const courseId = this.selectedCourseId || primarySkill.courseId || trainer.id || this.slugify(primarySkill.courseName || trainer.specialization || trainer.name);
    const courseName = this.selectedCourseName || primarySkill.courseName || trainer.specialization || 'Featured Course';
    const trainerId = trainer.id || trainer.trainerId || this.slugify(trainer.name || trainer.trainerName || 'trainer');
    const trainerSlug = this.slugify(trainer.name || trainer.trainerName || 'trainer');

    // Store trainer data for course-details page
    const trainerData = {
      id: trainer.id || trainerId,
      name: trainer.name,
      title: trainer.title,
      specialization: trainer.specialization,
      bio: trainer.bio,
      rating: trainer.rating,
      totalStudents: trainer.totalStudents,
      totalCourses: trainer.totalCourses,
      experience: trainer.experience,
      experienceYears: trainer.experienceYears,
      location: trainer.location,
      skills: trainer.skills,
      certifications: trainer.certifications,
      achievements: trainer.achievements,
      languages: trainer.languages,
      hourlyRate: trainer.hourlyRate,
      coursePrice: trainer.coursePrice,
      minCoursePrice: trainer.minCoursePrice,
      maxCoursePrice: trainer.maxCoursePrice,
      batchDates: trainer.batchDates,
      batchTime: trainer.batchTime,
      batchDate: trainer.batchDate,
      batchEndDate: trainer.batchEndDate,
      totalSessions: trainer.totalSessions,
      modeOfClass: trainer.modeOfClass,
      avatar: trainer.avatar || trainer.img,
      email: trainer.email,
      phone: trainer.phone
    };

    this.shareDataService.setOption({
      courseName,
      courseId,
      trainer: trainerData,
      from: 'trainers'
    });

    // Store trainer data in localStorage for course-details component
    localStorage.setItem('trainerCourseDetails', JSON.stringify({
      trainer: trainerData,
      course: {
        courseId,
        courseName,
        courseTitle: courseName
      }
    }));

    this.router.navigate(['/Course-details', courseId], {
      queryParams: {
        from: 'trainers',
        courseId,
        courseName,
        trainerId: trainerId,
        trainerName: trainer.name
      }
    });
  }

  addTrainerCourseToCart(trainer: any): void {
    const itemId = this.buildTrainerCartId(trainer);
    if (this.cartItemIds.has(itemId)) {
      return;
    }

    const cartItem = this.mapTrainerToCartItem(trainer, itemId);
    this.localCartService.addItem(cartItem);
  }

  isTrainerInCart(trainer: any): boolean {
    const itemId = this.buildTrainerCartId(trainer);
    return this.cartItemIds.has(itemId);
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  private mapTrainerToCartItem(trainer: any, id: string): LocalCartItem {
    const pricePerSession = Number(trainer.hourlyRate) || 0;
    const sessionCount = 24;
    const price = pricePerSession * sessionCount;
    const originalPrice = price ? Math.round(price * 1.15) : undefined;

    const tags = Array.isArray(trainer.skills)
      ? trainer.skills.slice(0, 4).map((skill: any) => skill.courseName).filter(Boolean)
      : [];

    const modeLabels = [];
    if (trainer.modes?.online) {
      modeLabels.push('Online');
    }
    if (trainer.modes?.offline) {
      modeLabels.push('Offline');
    }

    return {
      id,
      title: `${trainer.name} · ${selectedCourseLabel(this.selectedCourseName)}`,
      description:
        trainer.bio ||
        `Personalized ${selectedCourseLabel(this.selectedCourseName)} mentorship with ${trainer.name}.`,
      institute: trainer.specialization || 'Expert Trainer',
      mentor: trainer.name,
      mode: modeLabels.length ? modeLabels.join(' · ') : 'Flexible Learning Modes',
      duration: `${sessionCount} mentor-led sessions · ${trainer.experience} experience`,
      level: 'Mentor Guided',
      price,
      originalPrice,
      rating: Number(trainer.rating) || 4.6,
      reviews: trainer.totalStudents || 0,
      image: this.getTrainerImage(trainer),
      tags: tags.length ? tags : ['1:1 Guidance', 'Interview Prep'],
      addedAt: new Date().toISOString(),
      routeLink: this.selectedCourseId ? `/Course-details/${this.selectedCourseId}` : undefined,
    };
  }

  private buildTrainerCartId(trainer: any): string {
    const nameKey = trainer.name || 'trainer';
    return `trainer-${this.slugify(nameKey)}-${this.slugify(this.selectedCourseName || 'course')}`;
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
      return `${this.selectedCourseName} - Expert Trainers`;
    }
    return 'Expert Trainers';
  }
}

function selectedCourseLabel(value: string | undefined): string {
  if (!value) {
    return 'Course';
  }
  return value;
}







