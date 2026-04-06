import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoursesComponent } from './components/courses/courses.component';
import { InstitutesComponent } from './components/institutes/institutes.component';
import { TrainersComponent } from './components/trainers/trainers.component';
import { MentorsComponent } from './components/mentors/mentors.component';
import { AccountComponent } from './components/account/account.component';
import { NewsComponent } from './components/news/news.component';
import { JobsComponent } from './components/jobs/jobs.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { CourseInstitutesComponent } from './components/course-institutes/course-institutes.component';
import { CourseTrainersComponent } from './components/course-trainers/course-trainers.component';
import { CourseMentorsComponent } from './components/course-mentors/course-mentors.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { InistitutionCoursesComponent } from './components/inistitution-courses/inistitution-courses.component';
import { InstituteCoursesComponent } from './components/institute-courses/institute-courses.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AccountDashboardComponent } from './components/account-dashboard/account-dashboard.component';
import { OrdersComponent } from './components/orders/orders.component';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';
import { PaymentBillingComponent } from './components/payment-billing/payment-billing.component';
import { HelpSupportComponent } from './components/help-support/help-support.component';
import { AccountCoursesComponent } from './components/account-courses/account-courses.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { PaymentGatewayComponent } from './components/payment-gateway/payment-gateway.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { MentorEnrollmentComponent } from './components/mentor-enrollment/mentor-enrollment.component';
import { TrainerCoursesComponent } from './components/trainer-courses/trainer-courses.component';
import { BookSessionComponent } from './components/book-session/book-session.component';
import { CourseDetailsPopupComponent } from './components/course-details-popup/course-details-popup.component';
import { RegistrationPopupComponent } from './components/registration-popup/registration-popup.component';
import { AuthPopupComponent } from './components/auth-popup/auth-popup.component';
import { UserTypePopupComponent } from './components/user-type-popup/user-type-popup.component';
import { TrainerDashboardComponent } from './components/trainer-dashboard/trainer-dashboard.component';
import { MentorDashboardComponent } from './components/mentor-dashboard/mentor-dashboard.component';
import { InstitutionDashboardComponent } from './components/institution-dashboard/institution-dashboard.component';
import { StudentEnrollmentComponent } from './components/student-enrollment/student-enrollment.component';
// Import interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { ExcelImportComponent } from './components/excel-import/excel-import.component';
import { PageHeaderComponent } from './components/shared/page-header/page-header.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CoursesComponent,
    InstitutesComponent,
    TrainersComponent,
    MentorsComponent,
    AccountComponent,
    NewsComponent,
    JobsComponent,
    CourseDetailsComponent,
    CourseInstitutesComponent,
    CourseTrainersComponent,
    CourseMentorsComponent,
    AdminDashboardComponent,
    InistitutionCoursesComponent,
    InstituteCoursesComponent,
    LoginComponent,
    SignupComponent,
    AccountDashboardComponent,
    OrdersComponent,
    PersonalInfoComponent,
    AccountSettingsComponent,
    PaymentBillingComponent,
    HelpSupportComponent,
    AccountCoursesComponent,
    ShoppingCartComponent,
    PaymentGatewayComponent,
    DashboardComponent,
    AboutComponent,
    ContactComponent,
    MentorEnrollmentComponent,
    TrainerCoursesComponent,
    BookSessionComponent,
    CourseDetailsPopupComponent,
    RegistrationPopupComponent,
    AuthPopupComponent,
    UserTypePopupComponent,
    TrainerDashboardComponent,
    MentorDashboardComponent,
    InstitutionDashboardComponent,
    WishlistComponent,
    ExcelImportComponent,
    PageHeaderComponent,
    StudentEnrollmentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
    
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
