import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { LocationStrategy, HashLocationStrategy, DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from '../../src/shared/interceptors/loader.interceptor';
import { AuthInterceptor } from '../../src/shared/interceptors/auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { TopNavComponent } from './top-nav/top-nav.component';
import { MosqueComponent } from './mosque/mosque.component';
import { HomeComponent } from './home/home.component';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { RegisterMosqueComponent } from './register-mosque/register-mosque.component';
import { PurposeComponent } from './purpose/purpose.component';
import { SimpleStepsComponent } from './simple-steps/simple-steps.component';
import { FooterComponent } from './footer/footer.component';
import { MosqueRegisterationComponent } from './mosque-registeration/mosque-registeration.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { LoginComponent } from './login/login.component';
import { MotherMosqueDashboardComponent } from './mother-mosque-dashboard/mother-mosque-dashboard.component';
import { StockDetailsComponent } from './stock-details/stock-details.component';
import { DistributionDetailsComponent } from './distribution-details/distribution-details.component';
import { MotherMosqueProfileComponent } from './mother-mosque-profile/mother-mosque-profile.component';
import { DaughterMosqueDashboardComponent } from './daughter-mosque-dashboard/daughter-mosque-dashboard.component';
import { RecivedItemsComponent } from './recived-items/recived-items.component';
import { DaughterMosqueProfileComponent } from './daughter-mosque-profile/daughter-mosque-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    MosqueComponent,
    HomeComponent,
    HeroSectionComponent,
    RegisterMosqueComponent,
    PurposeComponent,
    SimpleStepsComponent,
    FooterComponent,
    MosqueRegisterationComponent,
    ContactUsComponent,
    LoginComponent,
    MotherMosqueDashboardComponent,
    StockDetailsComponent,
    DistributionDetailsComponent,
    MotherMosqueProfileComponent,
    DaughterMosqueDashboardComponent,
    RecivedItemsComponent,
    DaughterMosqueProfileComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

 
      ToastrModule.forRoot({ // Configure toastr here
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      progressBar: true,
    }),

   


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
