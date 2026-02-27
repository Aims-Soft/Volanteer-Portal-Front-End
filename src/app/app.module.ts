import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


import { LocationStrategy, HashLocationStrategy, DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from '../../src/shared/interceptors/loader.interceptor';
import { AuthInterceptor } from '../../src/shared/interceptors/auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { TopNavComponent } from './top-nav/top-nav.component';

import { HomeComponent } from './home/home.component';
import { HeroSectionComponent } from './hero-section/hero-section.component';


import { FooterComponent } from './footer/footer.component';

import { ContactUsComponent } from './contact-us/contact-us.component';
import { LoginComponent } from './login/login.component';


import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { HowItWorkComponent } from './how-it-work/how-it-work.component';
import { SubjectsCoveredComponent } from './subjects-covered/subjects-covered.component';
import { UpcomingTopicsComponent } from './upcoming-topics/upcoming-topics.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { SpeakerComponent } from './speaker/speaker.component';
import { AppliedCandidatesComponent } from './applied-candidates/applied-candidates.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { SpeakerListComponent } from './speaker-list/speaker-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
  
    HomeComponent,
    HeroSectionComponent,


    FooterComponent,
   
    ContactUsComponent,
    LoginComponent,
  
    AdminDashboardComponent,
    HowItWorkComponent,
    SubjectsCoveredComponent,
    UpcomingTopicsComponent,
    RegistrationFormComponent,
    SpeakerComponent,
    AppliedCandidatesComponent,
    ConfigurationComponent,
    UserDashboardComponent,
    SpeakerListComponent,



    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
        MatIconModule,

 
      ToastrModule.forRoot({ // Configure toastr here
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      progressBar: true,
    }),
         BrowserAnimationsModule,

   


  ],
  // providers: [],
   providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    DatePipe,


    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },

   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
