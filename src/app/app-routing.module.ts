import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';


import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';


import { config } from 'rxjs';
import { ConfigurationComponent } from './configuration/configuration.component';

import { LoginComponent } from './login/login.component';

import { AboutComponent } from './about/about.component';
import { RequestLectureComponent } from './request-lecture/request-lecture.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { RecentIncidentComponent } from './recent-incident/recent-incident.component';
import { VolunteerRegistrationComponent } from './volunteer-registration/volunteer-registration.component';
import { SkillComponent } from './skill/skill.component';
import { IncidentComponent } from './incident/incident.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ActiveIncidentComponent } from './active-incident/active-incident.component';



const routes: Routes = [

  { path: '', component: HomeComponent },
 
  {path:'registration',component:RegistrationFormComponent},
  {path:'adminDashboard',component:AdminDashboardComponent},

 
  {path:'configuration',component:ConfigurationComponent},

  {path:'login',component:LoginComponent},

  {path:'about',component: AboutComponent},
  {path:'requestLecture',component: RequestLectureComponent},

  {path:'howitworks', component: HowItWorksComponent},
  {path:'recentIncident', component: RecentIncidentComponent},
  {path:'volunteerReg', component: VolunteerRegistrationComponent},
    {path:'skill', component: SkillComponent},
    {path:'incident', component: IncidentComponent},
    
    {path:'contactus', component: ContactUsComponent},
    {path:'active', component: ActiveIncidentComponent},
    {path:'**', redirectTo: ''} 
 
    
   


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


