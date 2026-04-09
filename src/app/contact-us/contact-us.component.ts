import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SharedDataService } from '../../shared/services/shared-data.service';
import { SharedGlobalService } from '../../shared/services/shared-global.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  @ViewChild('contactForm') contactForm!: NgForm;
  
  // Form fields
  f_userName: string = '';
  f_email: string = '';
  f_contact: string = '';
  f_subject: string = '';
  f_userMessage: string = '';
  
  // Form state
  isFormSubmitted: boolean = false;
  isSubmitting: boolean = false;
  
  constructor(
    private dataService: SharedDataService,
    private globalService: SharedGlobalService,
    private toastr: ToastrService
  ) {}
  
  ngOnInit(): void {
    // Initialize if needed
  }
  
  // Validation helper
  isEmpty(value: any): boolean {
    return value === null || value === undefined || value.toString().trim() === '';
  }
  
  // Form validation
  validateForm(): boolean {
    this.isFormSubmitted = true;
    
    if (this.isEmpty(this.f_userName)) {
      this.toastr.error('Full name is required');
      return false;
    }
    
    if (this.isEmpty(this.f_email)) {
      this.toastr.error('Email is required');
      return false;
    }
    
    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.f_email)) {
      this.toastr.error('Please enter a valid email address');
      return false;
    }
    
    if (this.isEmpty(this.f_subject)) {
      this.toastr.error('Subject is required');
      return false;
    }
    
    if (this.isEmpty(this.f_userMessage)) {
      this.toastr.error('Message is required');
      return false;
    }
    
    return true;
  }
  
  // Submit form
  submitForm(): void {
    if (!this.validateForm()) {
      return;
    }
    
    this.isSubmitting = true;
    
    const payload = {
      userName: String(this.f_userName).trim(),
      email: String(this.f_email).trim(),
      contact: String(this.f_contact).trim() || '',
      subject: String(this.f_subject).trim(),
      userMessage: String(this.f_userMessage).trim(),
      userID: this.globalService.getUserID() || 1,
      spType: 'insert'
    };
    
    console.log('Contact Form Payload:', payload);
    
    this.dataService.postDirect('dashboard-api/Website/saveContactUS', payload).subscribe({
      next: (response: any) => {
        console.log('Contact form response:', response);
        
        this.isSubmitting = false;
        this.toastr.success('Thank you! Your message has been sent successfully. We will get back to you soon.');
        this.resetForm();
      },
      error: (err: any) => {
        console.error('Contact form error:', err);
        this.isSubmitting = false;
        this.toastr.error('Failed to send message. Please try again or contact us directly.');
      }
    });
  }
  
  // Reset form
  resetForm(): void {
    this.f_userName = '';
    this.f_email = '';
    this.f_contact = '';
    this.f_subject = '';
    this.f_userMessage = '';
    this.isFormSubmitted = false;
    
    if (this.contactForm) {
      this.contactForm.resetForm();
    }
  }
}