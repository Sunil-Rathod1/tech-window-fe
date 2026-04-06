import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {


    constructor() {}
    private data = {};  
    public coursesList= 
  [
    {courseId:2,courseName:"Testing Tools",img:"course6.jfif",courseTitle:"Mamnual and Selenium",tagName:"",coursereviewers:13340,coursePrice:"₹4999 to ₹29999",instituesReviews:"4.4",insreviewes:235647,courseTitle1:"Selenium WebDriver with Java -Basics to Advanced+Frameworks",courseTitle2:"We are comitted to provide multiple sftware courses with realtime experts",price:8999,
    courseDescription:"Et architecto provident deleniti facere repellat nobis iste. Id facere quia quae dolores dolorem tempore."},
    {courseId:3,courseName:"Data Science",img:"course7.jfif",courseTitle:"Data Analytics",tagName:"",coursereviewers:19082,coursePrice:"₹4999 to ₹29999",instituesReviews:"4.4",insreviewes:235647,courseTitle1:"Selenium WebDriver with Java -Basics to Advanced+Frameworks",courseTitle2:"We are comitted to provide multiple sftware courses with realtime experts",price:8999,
    courseDescription:"Et architecto provident deleniti facere repellat nobis iste. Id facere quia quae dolores dolorem tempore."},
    {courseId:4,courseName:"Java",img:"course11.jpg",courseTitle:"Core and Advance java",tagName:"",coursereviewers:9999,coursePrice:"₹4999 to ₹29999",instituesReviews:"4.4",insreviewes:235647,courseTitle1:"Selenium WebDriver with Java -Basics to Advanced+Frameworks",courseTitle2:"We are comitted to provide multiple sftware courses with realtime experts",price:8999,
    courseDescription:"Et architecto provident deleniti facere repellat nobis iste. Id facere quia quae dolores dolorem tempore."},
    {courseId:5,courseName:"Power Bi",img:"course_bi.jpg",courseTitle:"Business intillegence",tagName:"",coursereviewers:23456,coursePrice:"₹4999 to ₹29999",instituesReviews:"4.4",insreviewes:235647,courseTitle1:"Selenium WebDriver with Java -Basics to Advanced+Frameworks",courseTitle2:"We are comitted to provide multiple sftware courses with realtime experts",price:8999,
    courseDescription:"Et architecto provident deleniti facere repellat nobis iste. Id facere quia quae dolores dolorem tempore."},
    {courseId:6,courseName:"Networking",img:"course12.jpg",courseTitle:"Networking Technologies",tagName:"",coursereviewers:14567,coursePrice:"₹4999 to ₹29999",instituesReviews:"4.4",insreviewes:235647,courseTitle1:"Selenium WebDriver with Java -Basics to Advanced+Frameworks",courseTitle2:"We are comitted to provide multiple sftware courses with realtime experts",price:8999,
    courseDescription:"Et architecto provident deleniti facere repellat nobis iste. Id facere quia quae dolores dolorem tempore."},
    {courseId:7,courseName:"ADF",img:"course16.jpg",courseTitle:"",tagName:"Data analasys",coursereviewers:21879,coursePrice:"₹4999 to ₹29999",instituesReviews:"4.4",insreviewes:235647,courseTitle1:"Selenium WebDriver with Java -Basics to Advanced+Frameworks",courseTitle2:"We are comitted to provide multiple sftware courses with realtime experts",price:8999,
    courseDescription:"Et architecto provident deleniti facere repellat nobis iste. Id facere quia quae dolores dolorem tempore."},
    {courseId:8,courseName:"SAP",img:"course17.jpg",courseTitle:"SAP Technologies",tagName:"", coursereviewers :23427,coursePrice:"₹4999 to ₹29999",instituesReviews:"4.4",insreviewes:235647,courseTitle1:"Selenium WebDriver with Java -Basics to Advanced+Frameworks",courseTitle2:"We are comitted to provide multiple sftware courses with realtime experts",price:8999,
    courseDescription:"Et architecto provident deleniti facere repellat nobis iste. Id facere quia quae dolores dolorem tempore."},
    {courseId:9,courseName:".net",img:"course18.jpg",courseTitle:"Web Technlogies",tagName:"",coursereviewers:45678,coursePrice:"₹4999 to ₹29999",instituesReviews:"4.4",insreviewes:235647,courseTitle1:"Selenium WebDriver with Java -Basics to Advanced+Frameworks",courseTitle2:"We are comitted to provide multiple sftware courses with realtime experts",price:8999,
    courseDescription:"Et architecto provident deleniti facere repellat nobis iste. Id facere quia quae dolores dolorem tempore."},
    {courseId:10,courseName:"Angular",img:"course20.jfif",courseTitle:"UI Development",tagName:"",coursereviewers:98674,coursePrice:"₹4999 to ₹29999",instituesReviews:"4.4",insreviewes:235647,courseTitle1:"Selenium WebDriver with Java -Basics to Advanced+Frameworks",courseTitle2:"We are comitted to provide multiple sftware courses with realtime experts",price:8999,
    courseDescription:"Et architecto provident deleniti facere repellat nobis iste. Id facere quia quae dolores dolorem tempore."},
    {courseId:1,courseName:"Web Development",img:"course3.jpg",courseTitle:"Web Technologies",tagName:"",coursereviewers:12001,coursePrice:"₹4999 to ₹29999",instituesReviews:"4.4",insreviewes:235647,courseTitle1:"Selenium WebDriver with Java -Basics to Advanced+Frameworks",courseTitle2:"We are comitted to provide multiple sftware courses with realtime experts",price:8999,
    courseDescription:"Et architecto provident deleniti facere repellat nobis iste. Id facere quia quae dolores dolorem tempore."},
   
    // {courseId:11,courseName:"web Designing",img:"course12.jpg",courseTitle:"Designing Tools",tagName:"",coursereviewers:76542,coursePrice:"₹4999 to ₹29999",instituesReviews:"4.4",insreviewes:235647,courseTitle1:"Selenium WebDriver with Java -Basics to Advanced+Frameworks",courseTitle2:"We are comitted to provide multiple sftware courses with realtime experts",price:8999,
    // courseDescription:"Et architecto provident deleniti facere repellat nobis iste. Id facere quia quae dolores dolorem tempore."},
    // {courseId:12,courseName:"Sales force",img:"course15.jfif",courseTitle:"Testing and Development",tagName:"",coursereviewers:65789,coursePrice:"₹4999 to ₹29999",instituesReviews:"4.4",insreviewes:235647,courseTitle1:"Selenium WebDriver with Java -Basics to Advanced+Frameworks",courseTitle2:"We are comitted to provide multiple sftware courses with realtime experts",price:8999,
    // courseDescription:"Et architecto provident deleniti facere repellat nobis iste. Id facere quia quae dolores dolorem tempore."},
    ];
    setOption(value:any) {      
      this.data=value;      
    }  
    getOption() {  
      return this.data;  
    }  
    getCourses(){
      return this.coursesList;
    }
}
