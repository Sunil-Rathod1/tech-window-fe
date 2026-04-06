import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeModule } from './modules/home/home.module';
import { HomeComponent } from './components/home/home.component';
import { CoursesComponent } from './components/courses/courses.component';
import { InstitutesComponent } from './components/institutes/institutes.component';
import { TrainersComponent } from './components/trainers/trainers.component';
import { MentorsComponent } from './components/mentors/mentors.component';
import { AccountComponent } from './components/account/account.component';
import { JobsComponent } from './components/jobs/jobs.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { CourseInstitutesComponent } from './components/course-institutes/course-institutes.component';
import { CourseTrainersComponent } from './components/course-trainers/course-trainers.component';
import { CourseMentorsComponent } from './components/course-mentors/course-mentors.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { InistitutionCoursesComponent } from './components/inistitution-courses/inistitution-courses.component';
import { InstituteCoursesComponent } from './components/institute-courses/institute-courses.component';
import { OrdersComponent } from './components/orders/orders.component';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';
import { PaymentBillingComponent } from './components/payment-billing/payment-billing.component';
import { HelpSupportComponent } from './components/help-support/help-support.component';
import { AccountCoursesComponent } from './components/account-courses/account-courses.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AboutComponent } from './components/about/about.component';
import { MentorEnrollmentComponent } from './components/mentor-enrollment/mentor-enrollment.component';
import { TrainerCoursesComponent } from './components/trainer-courses/trainer-courses.component';
import { BookSessionComponent } from './components/book-session/book-session.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { TrainerDashboardComponent } from './components/trainer-dashboard/trainer-dashboard.component';
import { MentorDashboardComponent } from './components/mentor-dashboard/mentor-dashboard.component';
import { InstitutionDashboardComponent } from './components/institution-dashboard/institution-dashboard.component';
import { StudentEnrollmentComponent } from './components/student-enrollment/student-enrollment.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminAuthGuard } from './guards/admin-auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/Home', pathMatch: 'full' },
  {path:"Home",component:HomeComponent}, 
  {path:"Courses",component:CoursesComponent},
  {path:"Institutes",component:InstitutesComponent},
  {path:"Trainers",component:TrainersComponent},
  {path:"Mentors",component:MentorsComponent},
  {path:"Jobs",component:JobsComponent},
  {path:"About",component:AboutComponent},
  {path:"cart",component:ShoppingCartComponent},
  {path:"payment-gateway",component:PaymentBillingComponent},
  {path:"login",component:LoginComponent},
  { path: 'student-signin', redirectTo: '/login?role=student', pathMatch: 'full' },
  {path:"dashboard",component:DashboardComponent, canActivate: [AuthGuard]},
  {path:"Dashboard",component:DashboardComponent, canActivate: [AuthGuard]},
  // {path:"signup",component:SignupComponent},
  {path:"Account",component:AccountComponent,children:[
    {path:"orders",component:OrdersComponent},
    {path:"personal-info",component:PersonalInfoComponent},
    {path:"account-settings",component:AccountSettingsComponent},
    {path:"courses",component:AccountCoursesComponent},
    {path:"payment",component:PaymentBillingComponent},
    {path:"help",component:HelpSupportComponent},
  ]},
  {path:"Course-details/:id",component:CourseDetailsComponent},
  {path:"Course-institutes",component:CourseInstitutesComponent},
  {path:"Course-institutes/:id",component:CourseInstitutesComponent},
  {path:"Course-trainers",component:CourseTrainersComponent},
  {path:"Course-trainers/:id",component:CourseTrainersComponent},
  {path:"Course-mentors",component:CourseMentorsComponent},
  {path:"Course-mentors/:id",component:CourseMentorsComponent},
  {path:"Inistitution-courses",component:InistitutionCoursesComponent},
  {path:"Institute-courses/:name",component:InstituteCoursesComponent},
  {path:"mentor-enrollment",component:MentorEnrollmentComponent},
  {path:"trainer-courses",component:TrainerCoursesComponent},
  {path:"book-session",component:BookSessionComponent},
  {path:"wishlist",component:WishlistComponent},
  {path:"trainer-dashboard",component:TrainerDashboardComponent, canActivate: [AuthGuard]},
  {path:"mentor-dashboard",component:MentorDashboardComponent},
  {path:"institution-dashboard",component:InstitutionDashboardComponent, canActivate: [AuthGuard]},
  {path:"student-enrollment",component:StudentEnrollmentComponent},
  { path: 'admin-login', redirectTo: '/login?role=admin', pathMatch: 'full' },
  {path:"admin-dashboard",component:AdminDashboardComponent, canActivate: [AdminAuthGuard]},

  // OrdersComponent,
  // PersonalInfoComponent,
  // AccountSettingsComponent,
  // PaymentBillingComponent,
  // HelpSupportComponent,

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
