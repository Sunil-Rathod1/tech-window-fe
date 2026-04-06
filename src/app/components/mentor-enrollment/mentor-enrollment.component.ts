import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mentor-enrollment',
  templateUrl: './mentor-enrollment.component.html',
  styleUrls: ['./mentor-enrollment.component.css']
})
export class MentorEnrollmentComponent implements OnInit {

  mentorForm!: FormGroup;
  isSubmitting = false;
  currentStep = 1;
  totalSteps = 4;

  // Form data
  specializations = [
    'Software Architecture & Leadership',
    'Web Development & Career Growth',
    'Data Science & Machine Learning',
    'DevOps & Cloud Computing',
    'Product Management & Business Strategy',
    'Mobile Development & Startup Growth',
    'UI/UX Design',
    'Cybersecurity',
    'AI & Machine Learning',
    'Blockchain Development'
  ];

  experienceLevels = [
    '5+ Years',
    '8+ Years',
    '10+ Years',
    '12+ Years',
    '15+ Years',
    '20+ Years'
  ];

  industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'E-commerce',
    'Education',
    'Gaming',
    'Fintech',
    'EdTech'
  ];

  locations = [
    'Hyderabad',
    'Bangalore',
    'Mumbai',
    'Delhi',
    'Chennai',
    'Pune',
    'Kolkata',
    'Online'
  ];

  sessionTypes = [
    '1-on-1 Mentoring',
    'Group Sessions',
    'Code Reviews',
    'Career Planning',
    'Technical Deep Dives',
    'Interview Preparation',
    'Project Guidance',
    'Business Strategy'
  ];

  languages = [
    'English',
    'Hindi',
    'Telugu',
    'Tamil',
    'Kannada',
    'Malayalam',
    'Bengali',
    'Gujarati',
    'Marathi'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Initialize form
  }

  initializeForm() {
    this.mentorForm = this.fb.group({
      // Personal Information
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      
      // Professional Information
      title: ['', [Validators.required]],
      specialization: ['', [Validators.required]],
      experience: ['', [Validators.required]],
      company: ['', [Validators.required]],
      industry: ['', [Validators.required]],
      location: ['', [Validators.required]],
      
      // Expertise and Skills
      expertise: [[], [Validators.required, Validators.minLength(3)]],
      certifications: [[]],
      languages: [[], [Validators.required, Validators.minLength(1)]],
      
      // Mentoring Details
      consultationFee: ['', [Validators.required, Validators.min(500)]],
      sessionTypes: [[], [Validators.required, Validators.minLength(1)]],
      availability: ['', [Validators.required]],
      maxMentees: ['', [Validators.required, Validators.min(1)]],
      
      // Additional Information
      description: ['', [Validators.required, Validators.minLength(50)]],
      achievements: [[]],
      linkedin: [''],
      github: [''],
      portfolio: [''],
      
      // Terms and Conditions
      agreeToTerms: [false, [Validators.requiredTrue]],
      agreeToPrivacy: [false, [Validators.requiredTrue]]
    });
  }

  // Navigation methods
  nextStep() {
    if (this.isCurrentStepValid()) {
      this.currentStep++;
    }
  }

  previousStep() {
    this.currentStep--;
  }

  goToStep(step: number) {
    if (step <= this.currentStep || this.isStepCompleted(step)) {
      this.currentStep = step;
    }
  }

  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!(this.mentorForm.get('firstName')?.valid &&
               this.mentorForm.get('lastName')?.valid &&
               this.mentorForm.get('email')?.valid &&
               this.mentorForm.get('phone')?.valid);
      case 2:
        return !!(this.mentorForm.get('title')?.valid &&
               this.mentorForm.get('specialization')?.valid &&
               this.mentorForm.get('experience')?.valid &&
               this.mentorForm.get('company')?.valid &&
               this.mentorForm.get('industry')?.valid &&
               this.mentorForm.get('location')?.valid);
      case 3:
        return !!(this.mentorForm.get('expertise')?.valid &&
               this.mentorForm.get('consultationFee')?.valid &&
               this.mentorForm.get('sessionTypes')?.valid &&
               this.mentorForm.get('availability')?.valid &&
               this.mentorForm.get('maxMentees')?.valid);
      case 4:
        return !!(this.mentorForm.get('description')?.valid &&
               this.mentorForm.get('agreeToTerms')?.valid &&
               this.mentorForm.get('agreeToPrivacy')?.valid);
      default:
        return false;
    }
  }

  isStepCompleted(step: number): boolean {
    // Check if all required fields in previous steps are completed
    for (let i = 1; i < step; i++) {
      if (!this.isStepValid(i)) {
        return false;
      }
    }
    return true;
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!(this.mentorForm.get('firstName')?.valid &&
               this.mentorForm.get('lastName')?.valid &&
               this.mentorForm.get('email')?.valid &&
               this.mentorForm.get('phone')?.valid);
      case 2:
        return !!(this.mentorForm.get('title')?.valid &&
               this.mentorForm.get('specialization')?.valid &&
               this.mentorForm.get('experience')?.valid &&
               this.mentorForm.get('company')?.valid &&
               this.mentorForm.get('industry')?.valid &&
               this.mentorForm.get('location')?.valid);
      case 3:
        return !!(this.mentorForm.get('expertise')?.valid &&
               this.mentorForm.get('consultationFee')?.valid &&
               this.mentorForm.get('sessionTypes')?.valid &&
               this.mentorForm.get('availability')?.valid &&
               this.mentorForm.get('maxMentees')?.valid);
      case 4:
        return !!(this.mentorForm.get('description')?.valid &&
               this.mentorForm.get('agreeToTerms')?.valid &&
               this.mentorForm.get('agreeToPrivacy')?.valid);
      default:
        return false;
    }
  }

  // Form submission
  onSubmit() {
    if (this.mentorForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      // Simulate API call
      setTimeout(() => {
        console.log('Mentor enrollment submitted:', this.mentorForm.value);
        this.isSubmitting = false;
        
        // Show success message and redirect
        alert('Thank you for your application! We will review your profile and get back to you within 2-3 business days.');
        this.router.navigate(['/mentors']);
      }, 2000);
    }
  }

  // Utility methods
  getStepTitle(step: number): string {
    switch (step) {
      case 1: return 'Personal Information';
      case 2: return 'Professional Details';
      case 3: return 'Mentoring Preferences';
      case 4: return 'Review & Submit';
      default: return '';
    }
  }

  getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  // Expertise management
  addExpertise(skill: string) {
    const expertise = this.mentorForm.get('expertise')?.value || [];
    if (!expertise.includes(skill)) {
      expertise.push(skill);
      this.mentorForm.get('expertise')?.setValue(expertise);
    }
  }

  removeExpertise(skill: string) {
    const expertise = this.mentorForm.get('expertise')?.value || [];
    const index = expertise.indexOf(skill);
    if (index > -1) {
      expertise.splice(index, 1);
      this.mentorForm.get('expertise')?.setValue(expertise);
    }
  }

  // Achievement management
  addAchievement(achievement: string) {
    const achievements = this.mentorForm.get('achievements')?.value || [];
    if (!achievements.includes(achievement) && achievement.trim()) {
      achievements.push(achievement.trim());
      this.mentorForm.get('achievements')?.setValue(achievements);
    }
  }

  removeAchievement(achievement: string) {
    const achievements = this.mentorForm.get('achievements')?.value || [];
    const index = achievements.indexOf(achievement);
    if (index > -1) {
      achievements.splice(index, 1);
      this.mentorForm.get('achievements')?.setValue(achievements);
    }
  }

  // Checkbox handlers
  onSessionTypeChange(event: any, sessionType: string) {
    const sessionTypes = this.mentorForm.get('sessionTypes')?.value || [];
    if (event.target.checked) {
      if (!sessionTypes.includes(sessionType)) {
        sessionTypes.push(sessionType);
      }
    } else {
      const index = sessionTypes.indexOf(sessionType);
      if (index > -1) {
        sessionTypes.splice(index, 1);
      }
    }
    this.mentorForm.get('sessionTypes')?.setValue(sessionTypes);
  }

  onLanguageChange(event: any, language: string) {
    const languages = this.mentorForm.get('languages')?.value || [];
    if (event.target.checked) {
      if (!languages.includes(language)) {
        languages.push(language);
      }
    } else {
      const index = languages.indexOf(language);
      if (index > -1) {
        languages.splice(index, 1);
      }
    }
    this.mentorForm.get('languages')?.setValue(languages);
  }
}
