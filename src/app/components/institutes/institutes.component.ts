import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ShareDataService } from 'src/app/services/share-data.service';
import { InstitutesService, Institute } from 'src/app/services/institutes.service';

@Component({
  selector: 'app-institutes',
  templateUrl: './institutes.component.html',
  styleUrls: ['./institutes.component.css']
})
export class InstitutesComponent implements OnInit {
  public courseName:any=null;
  public courseHeading:any;
  


  public toggleContactInfo:boolean = false;


  public institutionsList:any[] =[
      {
        "contact": {
          "email": "info@excelr.com",
          "phone": "+91-40-44665588",
          "website": "https://www.excelr.com"
        },
        "address": {
          "street": "5th Floor, Cyber Towers, Hitech City",
          "city": "Hyderabad",
          "state": "Telangana",
          "country": "India",
          "zipCode": "500081"
        },
        "facilities": {
          "library": true,
          "cafeteria": true,
          "hostel": false,
          "parking": true,
          "wifi": true,
          "airConditioning": true,
          "computerLab": true,
          "auditorium": true,
          "sportsFacilities": false
        },
        "faculty": {
          "total": 65,
          "experience": 0,
          "qualifications": []
        },
        "students": {
          "total": 12500,
          "international": 450
        },
        "rating": {
          "overall": 4.7,
          "teaching": 4.8,
          "facilities": 4.6,
          "placement": 4.7,
          "totalReviews": 2350
        },
        "placement": {
          "averagePackage": 800000,
          "highestPackage": 2500000,
          "placementRate": 89,
          "topRecruiters": [
            "Amazon",
            "Microsoft",
            "Google",
            "IBM",
            "Oracle",
            "Salesforce"
          ]
        },
        "seo": {
          "keywords": []
        },
        "stats": {
          "totalStudents": 0,
          "totalCourses": 0,
          "averageRating": 0,
          "totalReviews": 0,
          "placementRate": 0,
          "averagePackage": 0,
          "highestPackage": 0
        },
        "modes": {
          "online": true,
          "offline": true,
          "hybrid": true
        },
        "_id": "690a3504366ed08a03ba44a0",
        "name": "ExcelR Solutions",
        "shortName": "ExcelR",
        "description": "Global training institute offering Data Science, Cloud Computing, DevOps, and Full Stack Development courses. Partnerships with leading tech companies and universities.",
        "logo": "assets/photos/institution/excelr.png",
        "type": "Training Center",
        "category": "Technology",
        "founded": 2013,
        "specializations": [],
        "isVerified": true,
        "isFeatured": true,
        "isActive": true,
        "status": "approved",
        "tags": [],
        "accreditation": [],
        "programs": [],
        "gallery": [],
        "achievements": [],
        "partnerships": [],
        "createdAt": "2025-11-04T17:16:52.400Z",
        "updatedAt": "2025-11-04T17:16:52.400Z",
        "__v": 0,
        "fullAddress": "5th Floor, Cyber Towers, Hitech City, Hyderabad, Telangana, India, 500081",
        "averageRating": "4.7",
        "yearsOfExperience": 12,
        "id": "690a3504366ed08a03ba44a0"
      },
      {
        "contact": {
          "email": "info@visualpath.in",
          "phone": "+91-40-66510011",
          "website": "https://www.visualpath.in"
        },
        "address": {
          "street": "Flat No. 301, Ameerpet Main Road",
          "city": "Hyderabad",
          "state": "Telangana",
          "country": "India",
          "zipCode": "500073"
        },
        "facilities": {
          "library": true,
          "cafeteria": true,
          "hostel": false,
          "parking": true,
          "wifi": true,
          "airConditioning": true,
          "computerLab": true,
          "auditorium": true,
          "sportsFacilities": false
        },
        "faculty": {
          "total": 55,
          "experience": 0,
          "qualifications": []
        },
        "students": {
          "total": 11200,
          "international": 300
        },
        "rating": {
          "overall": 4.7,
          "teaching": 4.8,
          "facilities": 4.6,
          "placement": 4.7,
          "totalReviews": 2100
        },
        "placement": {
          "averagePackage": 780000,
          "highestPackage": 2200000,
          "placementRate": 88,
          "topRecruiters": [
            "Amazon",
            "Microsoft",
            "Capgemini",
            "Cognizant",
            "HCL"
          ]
        },
        "seo": {
          "keywords": []
        },
        "stats": {
          "totalStudents": 0,
          "totalCourses": 0,
          "averageRating": 0,
          "totalReviews": 0,
          "placementRate": 0,
          "averagePackage": 0,
          "highestPackage": 0
        },
        "modes": {
          "online": true,
          "offline": true,
          "hybrid": true
        },
        "_id": "690a3504366ed08a03ba448e",
        "name": "Visualpath Training Institute",
        "shortName": "Visualpath",
        "description": "Renowned training institute with focus on practical, hands-on learning. Specializes in Python, React, Angular, and cloud technologies with real-world project experience.",
        "logo": "assets/photos/institution/visualpath.png",
        "type": "Training Center",
        "category": "Technology",
        "founded": 2015,
        "specializations": [],
        "isVerified": true,
        "isFeatured": true,
        "isActive": true,
        "status": "approved",
        "tags": [],
        "accreditation": [],
        "programs": [],
        "gallery": [],
        "achievements": [],
        "partnerships": [],
        "createdAt": "2025-11-04T17:16:52.316Z",
        "updatedAt": "2025-11-04T17:16:52.316Z",
        "__v": 0,
        "fullAddress": "Flat No. 301, Ameerpet Main Road, Hyderabad, Telangana, India, 500073",
        "averageRating": "4.7",
        "yearsOfExperience": 10,
        "id": "690a3504366ed08a03ba448e"
      },
      {
        "contact": {
          "email": "contact@digitallync.com",
          "phone": "+91-40-22334455",
          "website": "https://www.digitallync.com"
        },
        "address": {
          "street": "1st Floor, Hitech City",
          "city": "Hyderabad",
          "state": "Telangana",
          "country": "India",
          "zipCode": "500081"
        },
        "facilities": {
          "library": true,
          "cafeteria": true,
          "hostel": false,
          "parking": true,
          "wifi": true,
          "airConditioning": true,
          "computerLab": true,
          "auditorium": true,
          "sportsFacilities": false
        },
        "faculty": {
          "total": 48,
          "experience": 0,
          "qualifications": []
        },
        "students": {
          "total": 8900,
          "international": 220
        },
        "rating": {
          "overall": 4.6,
          "teaching": 4.7,
          "facilities": 4.5,
          "placement": 4.6,
          "totalReviews": 1650
        },
        "placement": {
          "averagePackage": 730000,
          "highestPackage": 2000000,
          "placementRate": 85,
          "topRecruiters": [
            "TCS",
            "Infosys",
            "Wipro",
            "Capgemini",
            "Accenture"
          ]
        },
        "seo": {
          "keywords": []
        },
        "stats": {
          "totalStudents": 0,
          "totalCourses": 0,
          "averageRating": 0,
          "totalReviews": 0,
          "placementRate": 0,
          "averagePackage": 0,
          "highestPackage": 0
        },
        "modes": {
          "online": true,
          "offline": true,
          "hybrid": true
        },
        "_id": "690a3504366ed08a03ba449a",
        "name": "Digital Lync",
        "shortName": "DigitalLync",
        "description": "Modern IT training institute focusing on digital transformation technologies. Offers courses in Cloud, DevOps, Data Analytics, and Enterprise Software with hands-on experience.",
        "logo": "assets/photos/institution/digital-lync.png",
        "type": "Training Center",
        "category": "Technology",
        "founded": 2016,
        "specializations": [],
        "isVerified": true,
        "isFeatured": true,
        "isActive": true,
        "status": "approved",
        "tags": [],
        "accreditation": [],
        "programs": [],
        "gallery": [],
        "achievements": [],
        "partnerships": [],
        "createdAt": "2025-11-04T17:16:52.368Z",
        "updatedAt": "2025-11-04T17:16:52.368Z",
        "__v": 0,
        "fullAddress": "1st Floor, Hitech City, Hyderabad, Telangana, India, 500081",
        "averageRating": "4.6",
        "yearsOfExperience": 9,
        "id": "690a3504366ed08a03ba449a"
      },
      {
        "contact": {
          "email": "info@durgasoft.com",
          "phone": "+91-40-23746666",
          "website": "https://www.durgasoft.com"
        },
        "address": {
          "street": "Road No. 5, Banjara Hills",
          "city": "Hyderabad",
          "state": "Telangana",
          "country": "India",
          "zipCode": "500034"
        },
        "facilities": {
          "library": true,
          "cafeteria": true,
          "hostel": false,
          "parking": true,
          "wifi": true,
          "airConditioning": true,
          "computerLab": true,
          "auditorium": true,
          "sportsFacilities": false
        },
        "faculty": {
          "total": 50,
          "experience": 0,
          "qualifications": []
        },
        "students": {
          "total": 9500,
          "international": 180
        },
        "rating": {
          "overall": 4.6,
          "teaching": 4.7,
          "facilities": 4.5,
          "placement": 4.6,
          "totalReviews": 1850
        },
        "placement": {
          "averagePackage": 700000,
          "highestPackage": 2000000,
          "placementRate": 86,
          "topRecruiters": [
            "TCS",
            "Infosys",
            "Wipro",
            "Cognizant",
            "Accenture"
          ]
        },
        "seo": {
          "keywords": []
        },
        "stats": {
          "totalStudents": 0,
          "totalCourses": 0,
          "averageRating": 0,
          "totalReviews": 0,
          "placementRate": 0,
          "averagePackage": 0,
          "highestPackage": 0
        },
        "modes": {
          "online": true,
          "offline": true,
          "hybrid": true
        },
        "_id": "690a3504366ed08a03ba4494",
        "name": "Durga Soft",
        "shortName": "Durga",
        "description": "Established IT training institute with over 15 years of experience. Specializes in Java, Python, Testing, and Cloud technologies. Strong track record in placements.",
        "logo": "assets/photos/institution/durga-soft.png",
        "type": "Training Center",
        "category": "Technology",
        "founded": 2008,
        "specializations": [],
        "isVerified": true,
        "isFeatured": true,
        "isActive": true,
        "status": "approved",
        "tags": [],
        "accreditation": [],
        "programs": [],
        "gallery": [],
        "achievements": [],
        "partnerships": [],
        "createdAt": "2025-11-04T17:16:52.346Z",
        "updatedAt": "2025-11-04T17:16:52.346Z",
        "__v": 0,
        "fullAddress": "Road No. 5, Banjara Hills, Hyderabad, Telangana, India, 500034",
        "averageRating": "4.6",
        "yearsOfExperience": 17,
        "id": "690a3504366ed08a03ba4494"
      },
      {
        "contact": {
          "email": "info@sathyatech.com",
          "phone": "+91-40-23742345",
          "website": "https://www.sathyatech.com"
        },
        "address": {
          "street": "Plot No. 45, Ameerpet",
          "city": "Hyderabad",
          "state": "Telangana",
          "country": "India",
          "zipCode": "500016"
        },
        "facilities": {
          "library": true,
          "cafeteria": true,
          "hostel": false,
          "parking": true,
          "wifi": true,
          "airConditioning": true,
          "computerLab": true,
          "auditorium": true,
          "sportsFacilities": false
        },
        "faculty": {
          "total": 45,
          "experience": 0,
          "qualifications": []
        },
        "students": {
          "total": 8500,
          "international": 150
        },
        "rating": {
          "overall": 4.6,
          "teaching": 4.7,
          "facilities": 4.5,
          "placement": 4.6,
          "totalReviews": 1250
        },
        "placement": {
          "averagePackage": 650000,
          "highestPackage": 1800000,
          "placementRate": 85,
          "topRecruiters": [
            "TCS",
            "Infosys",
            "Wipro",
            "Tech Mahindra",
            "Accenture"
          ]
        },
        "seo": {
          "keywords": []
        },
        "stats": {
          "totalStudents": 0,
          "totalCourses": 0,
          "averageRating": 0,
          "totalReviews": 0,
          "placementRate": 0,
          "averagePackage": 0,
          "highestPackage": 0
        },
        "modes": {
          "online": true,
          "offline": true,
          "hybrid": true
        },
        "_id": "690a3504366ed08a03ba4488",
        "name": "Sathya Technologies",
        "shortName": "Sathya",
        "description": "Leading IT training institute providing comprehensive courses in software testing, cloud computing, and programming. Known for industry-oriented curriculum and excellent placement support.",
        "logo": "assets/photos/institution/sathya-technologies.png",
        "type": "Training Center",
        "category": "Technology",
        "founded": 2010,
        "specializations": [],
        "isVerified": true,
        "isFeatured": true,
        "isActive": true,
        "status": "approved",
        "tags": [],
        "accreditation": [],
        "programs": [],
        "gallery": [],
        "achievements": [],
        "partnerships": [],
        "createdAt": "2025-11-04T17:16:52.283Z",
        "updatedAt": "2025-11-04T17:16:52.283Z",
        "__v": 0,
        "fullAddress": "Plot No. 45, Ameerpet, Hyderabad, Telangana, India, 500016",
        "averageRating": "4.6",
        "yearsOfExperience": 15,
        "id": "690a3504366ed08a03ba4488"
      }
    ]
  







  // Search navigation properties
  public highlightedInstituteId: string | null = null;
  public searchQuery: string = '';
  
  // API integration properties
  public institutions: Institute[] = [];
  public loading: boolean = true;
  public error: string = '';
  
  constructor(
    public shareData:ShareDataService,
    private router: Router,
    private route: ActivatedRoute,
    private institutesService: InstitutesService
  ){
    let courseDetails:any = sessionStorage.getItem("course-details");
    if (courseDetails) {
      this.courseName = JSON.parse(courseDetails);
    }
  }
  
  ngOnInit(){
    this.courseHeading=this.shareData.getOption();
    
    // Check for query parameters from search navigation
    this.route.queryParams.subscribe(params => {
      if (params['highlight']) {
        this.highlightedInstituteId = params['highlight'];
        // Scroll to highlighted institute after data loads
        setTimeout(() => this.scrollToHighlightedInstitute(), 500);
      }
      if (params['search']) {
        this.searchQuery = params['search'];
      }
    });
    
    // Load institutes data from API
    this.loadInstitutes();
  }
  
  // Load institutes from API
  loadInstitutes(): void {
    this.loading = true;
    this.error = '';
    
    this.institutesService.getFeaturedInstitutes().subscribe({
      next: (response) => {
        // Check if response indicates success
        if (response.success === false) {
          // console.error('API returned error:', response.message || response.error);
          this.error = response.message || 'Failed to load institutes. Please try again later.';
          this.institutions = [];
        } else {
          this.institutions = response.data || [];
          if (this.institutions.length === 0) {
            this.error = 'No featured institutes found.';
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading featured institutes:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          url: error.url
        });
        this.error = 'Failed to load institutes. Please try again later.';
        this.loading = false;
        // Fallback to empty array or show error message
        this.institutions = [];
      }
    });
  }

  // Method to get institute image based on index
  getInstituteImage(index: number): string {
    const images = [
      'assets/photos/inistitution/techwindows.jpg',
      'assets/photos/inistitution/nareshit.png',
      'assets/photos/inistitution/satyatech.png',
      'assets/photos/inistitution/logo-Apec.png',
      'assets/photos/inistitution/winit.png',
      'assets/photos/inistitution/infoit.jfif',
      'assets/photos/inistitution/vision.jpg'
    ];
    return images[index] || 'assets/photos/inistitution/techwindows.jpg';
  }
  
  gotocourseDetail(instituteName?: string){
    if (instituteName) {
      // Navigate to institute courses page with institute name
      // The routerLink will handle the navigation
    }
  }

  scrollToHighlightedInstitute(): void {
    if (this.highlightedInstituteId) {
      const element = document.getElementById(`institute-${this.highlightedInstituteId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add highlight effect
        element.classList.add('highlighted');
        setTimeout(() => element.classList.remove('highlighted'), 3000);
      }
    }
  }

  isInstituteHighlighted(instituteId: string | undefined): boolean {
    return instituteId ? this.highlightedInstituteId === instituteId : false;
  }
}
