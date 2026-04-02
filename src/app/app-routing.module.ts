import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
// import { HowItWorkComponent } from './how-it-work/how-it-work.component';
// import { SubjectsCoveredComponent } from './subjects-covered/subjects-covered.component';
// import { UpcomingTopicsComponent } from './upcoming-topics/upcoming-topics.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
// import { SpeakerComponent } from './speaker/speaker.component';
import { AppliedCandidatesComponent } from './applied-candidates/applied-candidates.component';
import { config } from 'rxjs';
import { ConfigurationComponent } from './configuration/configuration.component';
// import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
// import { SpeakerListComponent } from './speaker-list/speaker-list.component';
import { LoginComponent } from './login/login.component';
// import { WhyChoseComponent } from './why-chose/why-chose.component';
import { AboutComponent } from './about/about.component';
import { RequestLectureComponent } from './request-lecture/request-lecture.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { RecentIncidentComponent } from './recent-incident/recent-incident.component';
import { VolunteerRegistrationComponent } from './volunteer-registration/volunteer-registration.component';
import { SkillComponent } from './skill/skill.component';
import { IncidentComponent } from './incident/incident.component';
// import { RecomendedBooksComponent } from './recomended-books/recomended-books.component';


const routes: Routes = [

  { path: '', component: HomeComponent },
  // {path:'works',component:HowItWorkComponent},
  // {path:'subjetsCovered',component:SubjectsCoveredComponent},
  // {path:'UpcomingTopics',component:UpcomingTopicsComponent},
  {path:'registration',component:RegistrationFormComponent},
  {path:'adminDashboard',component:AdminDashboardComponent},
  // {path:'speaker',component:SpeakerComponent},
  {path:'appliedCandidates',component:AppliedCandidatesComponent},
  {path:'configuration',component:ConfigurationComponent},
  // {path:'userDashboard',component:UserDashboardComponent},
  // {path:'speakerList',component:SpeakerListComponent},
  {path:'login',component:LoginComponent},
  // {path:'whychose',component: WhyChoseComponent},
  {path:'about',component: AboutComponent},
  {path:'requestLecture',component: RequestLectureComponent},
  // {path:'books',component: RecomendedBooksComponent},
  {path:'howitworks', component: HowItWorksComponent},
  {path:'recentIncidents', component: RecentIncidentComponent},
  {path:'volunteerRegistration', component: VolunteerRegistrationComponent},
    {path:'skill', component: SkillComponent},
    {path:'incident', component: IncidentComponent},
 
    
   


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


