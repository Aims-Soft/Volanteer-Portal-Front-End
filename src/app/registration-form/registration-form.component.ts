import { Component, EventEmitter, Output, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SharedDataService } from '../../shared/services/shared-data.service';
import { SharedFormFieldValidationService } from '../../shared/services/shared-form-field-validation.service';
import { SharedGlobalService } from '../../shared/services/shared-global.service';
import { MyFormField } from '../../shared/interfaces/myFormFields';
import { ToastrService } from 'ngx-toastr';

interface Province {
  provinceID: number;
  provinceName: string;
  countryID: number;
}

interface City {
  cityID: number;
  cityName: string;
  provinceID: number;
}

interface Gender {
  genderID: number;
  genderName: string;
}

interface Degree {
  degreeID: number;
  degreeName: string;
}

interface Experience {
  experienceID: number;
  experienceTitle: string;
}

interface Domain {
  domainID: number;
  domainTitle: string;
}

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {

  isFormSubmitted: boolean = false;

  // Lookup lists
  provinceList: Province[] = [];
  cityList: City[] = [];
  filteredCities: City[] = [];
  genderList: Gender[] = [];
  degreeList: Degree[] = [];
  experienceList: Experience[] = [];
  domainList: Domain[] = [];

  // Selected values (standalone — NOT inside formFields)
  selectedProvinceID: number | null = null;
  selectedDomains: number[] = [];

  // ─── Direct form-bound properties ─────────────────────────────────────────
  // These are bound in the template via [(ngModel)] directly.
  // They are assembled into the payload in save().
  f_userName: string = '';
  f_email: string = '';
  f_cnic: string = '';
  f_age: number | null = null;
  f_genderID: number | null = null;
  f_contactNo: string = '';
  f_physicallyFit: number | null = null;
  f_address: string = '';
  f_cityID: number | null = null;
  f_degreeID: number | null = null;
  f_experienceID: number | null = null;

  // formFields is kept for saveHttp compatibility — values are synced in save()
  formFields: MyFormField[] = [
    { value: 0,        msg: '',                      type: 'hidden',   required: false }, // 0  userID
    { value: 'insert', msg: '',                      type: 'hidden',   required: false }, // 1  spType
    { value: '',       msg: 'Enter Full Name',        type: 'textbox',  required: true  }, // 2  userName
    { value: '',       msg: 'Enter Email',            type: 'textbox',  required: true  }, // 3  email
    { value: '',       msg: 'Enter CNIC',             type: 'textbox',  required: true  }, // 4  cnic
    { value: null,     msg: 'Enter Age',              type: 'textbox',  required: true  }, // 5  age
    { value: null,     msg: 'Select Gender',          type: 'selectbox',required: true  }, // 6  genderID
    { value: '',       msg: 'Enter Phone Number',     type: 'textbox',  required: true  }, // 7  contactNo
    { value: null,     msg: 'Select Physical Fitness',type: 'radio',    required: true  }, // 8  physicallyFit
    { value: null,     msg: 'Select City',            type: 'selectbox',required: true  }, // 9  cityID
    { value: null,     msg: 'Select Degree',          type: 'selectbox',required: true  }, // 10 degreeID
    { value: null,     msg: 'Select Experience',      type: 'selectbox',required: true  }, // 11 experienceID
    { value: 1,        msg: '',                       type: 'hidden',   required: false }, // 12 countryID
    { value: 1,        msg: '',                       type: 'hidden',   required: false }, // 13 roleID
    { value: 1,        msg: '',                       type: 'hidden',   required: false }, // 14 userTypeID
    { value: '',       msg: 'Enter Address',          type: 'textbox',  required: true  }, // 15 address
    { value: '',       msg: '',                       type: 'hidden',   required: false }, // 16 password
    { value: '[]',     msg: '',                       type: 'hidden',   required: false }, // 17 json (domains)
  ];

  constructor(
    private dataService: SharedDataService,
    private valid: SharedFormFieldValidationService,
    private global: SharedGlobalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getProvince();
    this.getCity();
    this.getGender();
    this.getDegree();
    this.getExperience();
    this.getDomain();
  }

  // ─── API Calls ─────────────────────────────────────────────────────────────

  getProvince(): void {
    this.dataService.getHttp('trainer-api/Trainer/getProvince').subscribe(
      (res: any) => { this.provinceList = res; },
      (err: any) => { console.error('Province error:', err); }
    );
  }

  getCity(): void {
    this.dataService.getHttp('trainer-api/Trainer/getCity').subscribe(
      (res: any) => { this.cityList = res; },
      (err: any) => { console.error('City error:', err); }
    );
  }

  getGender(): void {
    this.dataService.getHttp('trainer-api/Trainer/getGender').subscribe(
      (res: any) => { this.genderList = res; },
      (err: any) => { console.error('Gender error:', err); }
    );
  }

  getDegree(): void {
    this.dataService.getHttp('user-api/User/getDegree').subscribe(
      (res: any) => { this.degreeList = res; },
      (err: any) => { console.error('Degree error:', err); }
    );
  }

  getExperience(): void {
    this.dataService.getHttp('trainer-api/Job/getExperience').subscribe(
      (res: any) => { this.experienceList = res; },
      (err: any) => { console.error('Experience error:', err); }
    );
  }

  getDomain(): void {
    this.dataService.getHttp('user-api/User/getDomain').subscribe(
      (res: any) => { this.domainList = res; },
      (err: any) => { console.error('Domain error:', err); }
    );
  }

  // ─── Event Handlers ────────────────────────────────────────────────────────

  onProvinceChange(): void {
    if (this.selectedProvinceID) {
      this.filteredCities = this.cityList.filter(
        city => city.provinceID === this.selectedProvinceID
      );
    } else {
      this.filteredCities = [];
    }
    this.f_cityID = null; // reset city
  }

  formatCNIC(): void {
    let value = (this.f_cnic || '').replace(/\D/g, '');
    if (value.length > 5)  value = value.slice(0, 5)  + '-' + value.slice(5);
    if (value.length > 13) value = value.slice(0, 13) + '-' + value.slice(13);
    this.f_cnic = value.slice(0, 15);
  }

  formatPhoneNumber(): void {
    let value = (this.f_contactNo || '').replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4) + '-' + value.slice(4);
    this.f_contactNo = value.slice(0, 12);
  }

  getdomainTitle(id: number): string {
    const d = this.domainList.find(x => x.domainID === id);
    return d ? d.domainTitle : '';
  }

  removeDomain(id: number): void {
    this.selectedDomains = this.selectedDomains.filter(d => d !== id);
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  isEmpty(value: any): boolean {
    return value === null || value === undefined || value.toString().trim() === '';
  }

  isAlphabetic(value: string): boolean {
    return /^[a-zA-Z\s]+$/.test(value);
  }

  isValidCNIC(value: string): boolean {
    return /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/.test(value);
  }

  isValidPhone(value: string): boolean {
    return /^[0-9]{4}-[0-9]{7}$/.test(value);
  }

  // ─── Validation ────────────────────────────────────────────────────────────
validateForm(): boolean {
    this.isFormSubmitted = true;

    if (!this.f_userName?.trim()){
        this.toastr.error('Full name is required'); 
        return false;
    }
    if (!this.isAlphabetic(this.f_userName)) {
        this.toastr.error('Full name should contain only alphabets'); 
        return false;
    }
    if (this.isEmpty(this.f_email)) {
        this.toastr.error('Email is required'); 
        return false;
    }
    // Add email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.f_email)) {
        this.toastr.error('Please enter a valid email address');
        return false;
    }
    if (this.isEmpty(this.f_cnic) || !this.isValidCNIC(this.f_cnic)) {
        this.toastr.error('Invalid CNIC format (00000-0000000-0)'); 
        return false;
    }
    if (this.isEmpty(this.f_age)) {
        this.toastr.error('Age is required'); 
        return false;
    }
    if (this.isEmpty(this.f_genderID)) {
        this.toastr.error('Gender is required'); 
        return false;
    }
    if (this.isEmpty(this.f_contactNo) || !this.isValidPhone(this.f_contactNo)) {
        this.toastr.error('Invalid phone format (0300-1234567)'); 
        return false;
    }
    if (this.f_physicallyFit === null) {
        this.toastr.error('Physical fitness field is required'); 
        return false;
    }
    if (this.isEmpty(this.f_address)) {
        this.toastr.error('Address is required'); 
        return false;
    }
    if (!this.selectedProvinceID) {
        this.toastr.error('Province is required'); 
        return false;
    }
    if (this.isEmpty(this.f_cityID)) {
        this.toastr.error('City is required'); 
        return false;
    }
    if (this.isEmpty(this.f_degreeID)) {
        this.toastr.error('Degree is required'); 
        return false;
    }
    if (this.isEmpty(this.f_experienceID)) {
        this.toastr.error('Experience is required'); 
        return false;
    }
    if (this.selectedDomains.length === 0) {
        this.toastr.error('At least one domain is required'); 
        return false;
    }

    // Only reset isFormSubmitted if validation passes
    this.isFormSubmitted = false;
    return true;
}
  // ─── Save ──────────────────────────────────────────────────────────────────

save(): void {
  if (!this.validateForm()) return;

  console.log('Name value:', this.f_userName);

  // Build the correct payload
  const pageFields = {
    userID:        0,
    spType:        'insert',
    userName:      String(this.f_userName).trim(),
    email:         String(this.f_email).trim(),
    json:          JSON.stringify(this.selectedDomains),
    cnic:          String(this.f_cnic),
    genderID:      Number(this.f_genderID),
    cityID:        Number(this.f_cityID),
    countryID:     1,
    physicallyFit: Number(this.f_physicallyFit),
    contactNo:     String(this.f_contactNo),
    address:       String(this.f_address).trim(),
    roleID:        1,
    userTypeID:    1,
    degreeID:      Number(this.f_degreeID),
    experienceID:  Number(this.f_experienceID),
  };

  console.log('Sending payload:', pageFields);

  // ✅ Use postDirect instead of saveHttp to bypass validateToastr
  this.dataService
    .postDirect('auth-api/saveUser', pageFields)
    .subscribe({
      next: (response: any) => {
        if (response?.[0]?.includes('Success')) {
          const userID = Number(response[0].split('|||')[1]);
          this.global.setTempUserID(userID);
          this.toastr.success('Volunteer registered successfully!');
          this.resetForm();
        } else {
          this.toastr.error(response?.[0] || 'Registration failed');
        }
      },
      error: (err: any) => {
        this.toastr.error(err?.error || 'Registration failed due to server error');
      },
      complete: () => {
        console.log('Volunteer registration request completed');
      }
    });
}

  // ─── Reset ─────────────────────────────────────────────────────────────────

resetForm(): void {
    this.f_userName      = '';
    this.f_email         = '';
    this.f_cnic          = '';
    this.f_age           = null;
    this.f_genderID      = null;
    this.f_contactNo     = '';
    this.f_physicallyFit = null;
    this.f_address       = '';
    this.f_cityID        = null;
    this.f_degreeID      = null;
    this.f_experienceID  = null;
    this.selectedProvinceID = null;
    this.selectedDomains    = [];
    this.filteredCities     = [];
    this.isFormSubmitted    = false;  // Reset the submission flag
    
    // Clear Angular form validation states if needed
    // if (this.volunteerForm) {
    //     this.volunteerForm.resetForm();
    // }
    
    this.toastr.info('Form has been reset');
}
}