import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-volunteer-registration',
  templateUrl: './volunteer-registration.component.html',
  styleUrls: ['./volunteer-registration.component.scss']
})
export class VolunteerRegistrationComponent  implements OnInit {
  
  volunteers = [
    {
      id: 1,
      initials: 'FS',
      name: 'Farhan Sabir',
      phone: '03005178889',
      email: 'farhan343@gmail.com',
      cnic: '36603-8345677-9',
      role: 'General',
      location: 'Vehari, Pakistan',
      domains: ['Engineering'],
      physicalFitness: 'Fit for demanding tasks',
      demographics: '10 years old • Male',
      registeredOn: '17 March 2026'
    },
    // ... more volunteers
  ];
  
  selectedVolunteer: any = null;
  
  constructor() { }
  
  ngOnInit(): void {
  }
  
  viewVolunteer(volunteer: any): void {
    this.selectedVolunteer = volunteer;
  }
  
  deleteVolunteer(id: number): void {
    if (confirm('Are you sure you want to delete this volunteer?')) {
      this.volunteers = this.volunteers.filter(v => v.id !== id);
    }
  }
  
}
