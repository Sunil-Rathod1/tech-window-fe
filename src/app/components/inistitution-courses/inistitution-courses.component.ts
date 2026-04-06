import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inistitution-courses',
  templateUrl: './inistitution-courses.component.html',
  styleUrls: ['./inistitution-courses.component.css']
})
export class InistitutionCoursesComponent {
  constructor(public route:Router){

  }
  
  public coursesList:any=[{id:1,course:"Web Development",title:"Web Technologies"},{id:2,course:"SAP",title:"SAP Technologies"},
  {id:3,course:"Data Science",title:"Data Technologies"},{id:4,course:"Business Analyst",title:"Business Technologies"},{id:5,course:"Web Designing",title:"Business Technologies"},
  {id:6,course:"Power Bi",title:"Business Technologies"},{id:7,course:"Java",title:"Business Technologies"},{id:8,course:"Networking",title:"Business Technologies"}
]
getCourse() {
  this.route.navigateByUrl("/Course-details");
}
}
