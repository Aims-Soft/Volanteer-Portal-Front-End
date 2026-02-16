import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MosqueComponent } from './mosque/mosque.component';
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

const routes: Routes = [

  { path: '', component: HomeComponent },
  {path: 'mosques', component: MosqueComponent},
  {path: 'registeration', component: MosqueRegisterationComponent},
  {path: 'contactus', component:ContactUsComponent}, 
  {path:'login',component:LoginComponent},
   {path:'motherMosqueDashboard',component:MotherMosqueDashboardComponent},
   {path:'stockDetails',component:StockDetailsComponent},
   {path:'distributionDetails',component:DistributionDetailsComponent},
   {path: 'motherMosqueProfile', component: MotherMosqueProfileComponent}, 
   {path:'daughterMosqueDashboard',component:DaughterMosqueDashboardComponent},
   {path:'recivedItems',component:RecivedItemsComponent},
   {path: 'daughterMosqueProfile', component: DaughterMosqueProfileComponent}, 
    
   


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


