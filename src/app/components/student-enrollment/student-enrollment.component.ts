import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService, StudentProfile } from '../../services/student.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-enrollment',
  templateUrl: './student-enrollment.component.html',
  styleUrls: ['./student-enrollment.component.css']
})
export class StudentEnrollmentComponent implements OnInit {
  public studentForm!: FormGroup;
  public isSubmitting = false;
  public isLoading = false;
  public currentStep = 1;
  public totalSteps = 4;
  public loadError = '';
  public submitError = '';
  public submitSuccess = '';

  public qualifications = [
    'High School Diploma',
    'Bachelors Degree',
    'Masters Degree',
    'Post Graduate Diploma',
    'Doctorate / PhD',
    'Other'
  ];

  public fieldsOfStudy = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Business Administration',
    'Data Science & Analytics',
    'Design & UI/UX',
    'Cyber Security',
    'Cloud & DevOps',
    'Artificial Intelligence',
    'Other'
  ];

  public skillsLibrary = [
    'JavaScript', 'TypeScript', 'Angular', 'React', 'Node.js', 'Python', 'Java',
    'SQL', 'MongoDB', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'HTML5', 'CSS3',
    'Figma', 'Tableau', 'Power BI', 'Selenium', 'Git & GitHub'
  ];

  public preferredRoles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Machine Learning Engineer',
    'Cloud / DevOps Engineer',
    'UI/UX Designer',
    'Product Manager',
    'QA Automation Engineer'
  ];

  public learningModes = [
    'Live Cohort Sessions',
    'Self-paced Modules',
    'Weekend Batches',
    'Mentor Led Sessions',
    'Hybrid Learning'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private studentService: StudentService,
    public authService: AuthService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Load existing student profile if authenticated
    if (this.authService.isAuthenticated() && this.authService.isStudent()) {
      this.loadStudentProfile();
    }
  }

  private loadStudentProfile(): void {
    this.isLoading = true;
    this.loadError = '';
    
    this.studentService.getStudentProfile().subscribe({
      next: (profile: StudentProfile) => {
        this.isLoading = false;
        this.populateForm(profile);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading student profile:', error);
        // Don't show error if student doesn't exist yet (first time enrollment)
        if (error.status !== 401 && error.status !== 404) {
          this.loadError = 'Failed to load profile. You can still complete the form.';
        }
      }
    });
  }

  private populateForm(profile: StudentProfile): void {
    // Split name into firstName and lastName if name exists but firstName/lastName don't
    let firstName = profile.firstName || '';
    let lastName = profile.lastName || '';
    
    if (!firstName && !lastName && profile.name) {
      const nameParts = profile.name.trim().split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }

    // Format date for date inputs
    const formatDateForInput = (date: string | Date | undefined): string => {
      if (!date) return '';
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    };

    this.studentForm.patchValue({
      firstName: firstName,
      lastName: lastName,
      email: profile.email || '',
      phone: profile.phone || '',
      dateOfBirth: formatDateForInput(profile.dateOfBirth),
      gender: profile.gender || '',
      city: profile.city || '',
      country: profile.country || '',
      highestQualification: profile.highestQualification || '',
      fieldOfStudy: profile.fieldOfStudy || '',
      institutionName: profile.institutionName || '',
      graduationYear: profile.graduationYear || '',
      cgpa: profile.cgpa || '',
      skills: profile.skills || [],
      portfolio: profile.portfolio || '',
      resumeLink: profile.resumeLink || '',
      careerGoalStatement: profile.careerGoalStatement || '',
      desiredRoles: profile.desiredRoles || [],
      learningMode: profile.learningMode || '',
      availability: profile.availability || '',
      preferredStartDate: formatDateForInput(profile.preferredStartDate),
      mentorSupport: profile.mentorSupport !== undefined ? profile.mentorSupport : true,
      needPlacementSupport: profile.needPlacementSupport !== undefined ? profile.needPlacementSupport : true,
      aboutYou: profile.aboutYou || '',
      accomplishments: profile.accomplishments || ''
    });
  }

  private initializeForm(): void {
    this.studentForm = this.fb.group({
      // Step 1: Personal - Only firstName, lastName, email, phone are mandatory
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      dateOfBirth: [''], // Optional
      gender: [''], // Optional
      city: [''], // Optional
      country: [''], // Optional

      // Step 2: Academic - Only highestQualification is mandatory
      highestQualification: ['', [Validators.required]],
      fieldOfStudy: [''], // Optional
      institutionName: [''], // Optional
      graduationYear: [''], // Optional (removed pattern validator as it's optional)
      cgpa: [''], // Optional
      skills: [[]], // Optional
      portfolio: [''], // Optional
      resumeLink: [''], // Optional

      // Step 3: Goals & Preferences - All optional
      careerGoalStatement: [''], // Optional
      desiredRoles: [[]], // Optional
      learningMode: [''], // Optional
      availability: [''], // Optional
      preferredStartDate: [''], // Optional
      mentorSupport: [true], // Optional
      needPlacementSupport: [true], // Optional

      // Step 4: Additional & Terms - agreeToTerms and agreeToPrivacy are mandatory
      aboutYou: [''], // Optional
      accomplishments: [''], // Optional
      agreeToTerms: [false, [Validators.requiredTrue]],
      agreeToPrivacy: [false, [Validators.requiredTrue]]
    });
  }

  public nextStep(): void {
    if (this.isCurrentStepValid() && this.currentStep < this.totalSteps) {
      this.currentStep++;
    } else {
      this.markCurrentStepFields();
    }
  }

  public previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  public goToStep(step: number): void {
    if (step <= this.currentStep || this.isStepCompleted(step)) {
      this.currentStep = step;
    }
  }

  public isStepCompleted(step: number): boolean {
    for (let i = 1; i < step; i++) {
      if (!this.isStepValid(i)) {
        return false;
      }
    }
    return true;
  }

  public getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  private isCurrentStepValid(): boolean {
    return this.isStepValid(this.currentStep);
  }

  private isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        // Only mandatory fields: firstName, lastName, email, phone
        return this.studentForm.get('firstName')?.valid &&
               this.studentForm.get('lastName')?.valid &&
               this.studentForm.get('email')?.valid &&
               this.studentForm.get('phone')?.valid || false;
      case 2:
        // Only mandatory field: highestQualification
        return this.studentForm.get('highestQualification')?.valid || false;
      case 3:
        // All fields are optional in step 3, so always valid
        return true;
      case 4:
        // Only mandatory fields: agreeToTerms, agreeToPrivacy
        return this.studentForm.get('agreeToTerms')?.valid &&
               this.studentForm.get('agreeToPrivacy')?.valid || false;
      default:
        return false;
    }
  }

  private markCurrentStepFields(): void {
    const controls = this.getControlsForStep(this.currentStep);
    controls.forEach(controlName => {
      this.studentForm.get(controlName)?.markAsTouched();
    });
  }

  private getControlsForStep(step: number): string[] {
    switch (step) {
      case 1:
        // Only mark mandatory fields as touched
        return ['firstName', 'lastName', 'email', 'phone'];
      case 2:
        // Only mark mandatory field as touched
        return ['highestQualification'];
      case 3:
        // No mandatory fields in step 3
        return [];
      case 4:
        // Only mark mandatory fields as touched
        return ['agreeToTerms', 'agreeToPrivacy'];
      default:
        return [];
    }
  }

  public toggleRole(role: string, event: any): void {
    const roles = this.studentForm.get('desiredRoles')?.value || [];
    if (event.target.checked) {
      if (!roles.includes(role)) {
        roles.push(role);
      }
    } else {
      const index = roles.indexOf(role);
      if (index > -1) {
        roles.splice(index, 1);
      }
    }
    this.studentForm.get('desiredRoles')?.setValue(roles);
    this.studentForm.get('desiredRoles')?.markAsDirty();
  }

  public addSkill(skill: string): void {
    const trimmedSkill = skill.trim();
    if (!trimmedSkill) {
      return;
    }
    const skills = this.studentForm.get('skills')?.value || [];
    if (!skills.includes(trimmedSkill)) {
      skills.push(trimmedSkill);
      this.studentForm.get('skills')?.setValue(skills);
    }
  }

  public removeSkill(skill: string): void {
    const skills = this.studentForm.get('skills')?.value || [];
    const index = skills.indexOf(skill);
    if (index > -1) {
      skills.splice(index, 1);
      this.studentForm.get('skills')?.setValue(skills);
    }
  }

  public onSkillChipToggle(event: any, skill: string): void {
    if (event.target.checked) {
      this.addSkill(skill);
    } else {
      this.removeSkill(skill);
    }
  }

  public submitEnrollment(): void {
    if (this.studentForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = '';
      this.submitSuccess = '';

      // Prepare payload
      const formValue = this.studentForm.value;
      const payload: Partial<StudentProfile> = {
        firstName: formValue.firstName?.trim() || '',
        lastName: formValue.lastName?.trim() || '',
        email: formValue.email?.trim() || '',
        phone: formValue.phone?.trim() || '',
        dateOfBirth: formValue.dateOfBirth || undefined,
        gender: formValue.gender || '',
        city: formValue.city?.trim() || '',
        country: formValue.country?.trim() || '',
        highestQualification: formValue.highestQualification?.trim() || '',
        fieldOfStudy: formValue.fieldOfStudy?.trim() || '',
        institutionName: formValue.institutionName?.trim() || '',
        graduationYear: formValue.graduationYear?.trim() || '',
        cgpa: formValue.cgpa ? Number(formValue.cgpa) : undefined,
        skills: Array.isArray(formValue.skills) ? formValue.skills.filter((s: string) => s && s.trim()) : [],
        portfolio: formValue.portfolio?.trim() || '',
        resumeLink: formValue.resumeLink?.trim() || '',
        careerGoalStatement: formValue.careerGoalStatement?.trim() || '',
        desiredRoles: Array.isArray(formValue.desiredRoles) ? formValue.desiredRoles : [],
        learningMode: formValue.learningMode?.trim() || '',
        availability: formValue.availability?.trim() || '',
        preferredStartDate: formValue.preferredStartDate || undefined,
        mentorSupport: formValue.mentorSupport !== undefined ? formValue.mentorSupport : true,
        needPlacementSupport: formValue.needPlacementSupport !== undefined ? formValue.needPlacementSupport : true,
        aboutYou: formValue.aboutYou?.trim() || '',
        accomplishments: formValue.accomplishments?.trim() || '',
        enrollmentCompleted: true
      };

      this.studentService.updateStudentProfile(payload).subscribe({
        next: (updatedProfile: StudentProfile) => {
          this.isSubmitting = false;
          this.submitSuccess = 'Profile updated successfully! Your learning journey dashboard will be personalized shortly.';
          console.log('Student profile updated:', updatedProfile);
          
          // Update local user data if available
          const currentUser = this.authService.getCurrentUserValue();
          if (currentUser && currentUser.role === 'student') {
            const updatedUser = {
              ...currentUser,
              firstName: updatedProfile.firstName || updatedProfile.name?.split(' ')[0] || currentUser.firstName,
              lastName: updatedProfile.lastName || updatedProfile.name?.split(' ').slice(1).join(' ') || currentUser.lastName,
              email: updatedProfile.email || currentUser.email,
              phone: updatedProfile.phone || currentUser.phone,
              enrollmentCompleted: true
            };
            this.authService.persistCurrentUser(updatedUser);
          }

          setTimeout(() => {
            this.router.navigate(['/Account']);
          }, 2000);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.submitError = error.error?.message || error.message || 'Failed to save profile. Please try again.';
          console.error('Error updating student profile:', error);
        }
      });
    } else {
      this.markCurrentStepFields();
    }
  }

  public getStepTitle(step: number): string {
    switch (step) {
      case 1: return 'Personal Information';
      case 2: return 'Academic Profile';
      case 3: return 'Goals & Preferences';
      case 4: return 'Review & Submit';
      default: return '';
    }
  }
}



