import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/shared/services/shared-data.service';
import { ToastrService } from 'ngx-toastr';
import { SharedGlobalService } from 'src/shared/services/shared-global.service';

declare var bootstrap: any;

interface Incident {
  incidentID: number;
  incidentTitle: string;
  description: string;
  volunteerNeeded: number;
  location: string;
  date: string;
  status: number;
  domains: string;
  domainTitle?: string[];
  cityID: number;
  cityName: string;
  provinceID: number;
  provinceName: string;
  priortyTypeID: number;
  priortyTypeTitle: string;
}

interface Domain {
  domainID: number;
  domainTitle: string;
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

interface UserVerification {
  userID: number;
  userName: string;
  email: string;
  contactNo: string;
  cnic: string;
  address: string;
  createdOn: string;
  cityID: number;
  cityName: string;
  provinceID: number;
  provinceName: string;
  physicallyFit: number;
  age: number;
  genderID: number;
  genderName: string;
  degreeID: number;
  degreeName: string;
  experienceID: number;
  experienceTitle: string;
  domains?: string;
}

@Component({
  selector: 'app-recent-incident',
  templateUrl: './recent-incident.component.html',
  styleUrls: ['./recent-incident.component.scss']
})
export class RecentIncidentComponent implements OnInit {

  incidents: Incident[]          = [];
  displayedIncidents: Incident[] = [];
  showAll = false;

  // ── Modal state ────────────────────────────────────────────────────────────
  selectedIncident: Incident | null = null;
  email: string           = '';
  otpCode: string         = '';
  isOtpSent: boolean      = false;
  isOtpVerified: boolean  = false;
  isLoading: boolean      = false;
  userData: UserVerification | null = null;
  isExistingUser: boolean = false;

  // ── Form fields (ALL editable regardless of existing/new user) ─────────────
  fullName: string             = '';
  cnic: string                 = '';
  phoneNumber: string          = '';
  address: string              = '';
  age: number | null           = null;
  genderID: number | null      = null;
  physicallyFit: number | null = null;
  degreeID: number | null      = null;
  experienceID: number | null  = null;
  provinceID: number | null    = null;
  cityID: number | null        = null;
  selectedDomains: number[]    = [];

  // ── Lookups ────────────────────────────────────────────────────────────────
  provinceList: any[]      = [];
  cityList: any[]          = [];
  filteredCities: any[]    = [];
  domainList: Domain[]     = [];
  genderList: Gender[]     = [];
  degreeList: Degree[]     = [];
  experienceList: Experience[] = [];

  constructor(
    private dataService: SharedDataService,
    private toastr: ToastrService,
    private userSession: SharedGlobalService
  ) {}

  ngOnInit(): void {
    this.fetchIncidents();
    this.loadProvinces();
    this.loadCities();
    this.loadDomains();
    this.loadGenders();
    this.loadDegrees();
    this.loadExperiences();
  }

  // ── Fetch Incidents ────────────────────────────────────────────────────────

  fetchIncidents(): void {
    this.dataService.getHttp('admin-api/Admin/getIncidents').subscribe({
      next: (res: any) => {
        const raw: any[] = res?.data ?? res ?? [];
        this.incidents = raw.map(inc => {
          let domainTitle: string[] = [];
          if (inc.domains) {
            try {
              const parsed: { domainID: number; domainTitle: string }[] =
                typeof inc.domains === 'string' ? JSON.parse(inc.domains) : inc.domains;
              domainTitle = parsed.map(d => d.domainTitle);
            } catch { domainTitle = []; }
          }
          return { ...inc, domainTitle } as Incident;
        });
        console.log('Incidents loaded:', this.incidents.length);
        this.updateDisplayedIncidents();
      },
      error: (err: any) => {
        console.error('Incidents error:', err);
        this.toastr.error('Failed to load incidents');
      }
    });
  }

  // ── Lookups ────────────────────────────────────────────────────────────────

  loadProvinces(): void {
    this.dataService.getHttp('trainer-api/Trainer/getProvince').subscribe({
      next: (res: any) => { this.provinceList = res?.data ?? res ?? []; },
      error: (err: any) => { console.error('Province error:', err); }
    });
  }

  loadCities(): void {
    this.dataService.getHttp('trainer-api/Trainer/getCity').subscribe({
      next: (res: any) => { this.cityList = res?.data ?? res ?? []; },
      error: (err: any) => { console.error('City error:', err); }
    });
  }

  loadDomains(): void {
    this.dataService.getHttp('user-api/User/getDomain').subscribe({
      next: (res: any) => { this.domainList = res?.data ?? res ?? []; },
      error: (err: any) => { console.error('Domain error:', err); }
    });
  }

  loadGenders(): void {
    this.dataService.getHttp('trainer-api/Trainer/getGender').subscribe({
      next: (res: any) => { this.genderList = res?.data ?? res ?? []; },
      error: (err: any) => { console.error('Gender error:', err); }
    });
  }

  loadDegrees(): void {
    this.dataService.getHttp('user-api/User/getDegree').subscribe({
      next: (res: any) => { this.degreeList = res?.data ?? res ?? []; },
      error: (err: any) => { console.error('Degree error:', err); }
    });
  }

  loadExperiences(): void {
    this.dataService.getHttp('trainer-api/Job/getExperience').subscribe({
      next: (res: any) => { this.experienceList = res?.data ?? res ?? []; },
      error: (err: any) => { console.error('Experience error:', err); }
    });
  }

  onProvinceChange(): void {
    this.filteredCities = this.provinceID
      ? this.cityList.filter((c: any) => c.provinceID === this.provinceID)
      : [];
    this.cityID = null;
  }

  // ── Domain multi-select ────────────────────────────────────────────────────

  onDomainSelect(event: any): void {
    const id = Number(event.target.value);
    if (id && !this.selectedDomains.includes(id)) {
      this.selectedDomains = [...this.selectedDomains, id];
    }
    event.target.value = '';
  }

  removeDomain(id: number): void {
    this.selectedDomains = this.selectedDomains.filter(d => d !== id);
  }

  getDomainName(id: number): string {
    return this.domainList.find(d => d.domainID === id)?.domainTitle ?? '';
  }

  // ── Display helpers ────────────────────────────────────────────────────────

  updateDisplayedIncidents(): void {
    this.displayedIncidents = this.showAll
      ? this.incidents
      : this.incidents.slice(0, 6);
  }

  toggleViewAll(): void {
    this.showAll = !this.showAll;
    this.updateDisplayedIncidents();
  }

  getPriorityClass(priorityTitle: string): string {
    if (!priorityTitle) return 'priority-medium';
    const t = priorityTitle.toLowerCase();
    if (t.includes('critical') || t.includes('high')) return 'priority-high';
    if (t.includes('medium')) return 'priority-medium';
    if (t.includes('low'))    return 'priority-low';
    return 'priority-medium';
  }

  getPriorityIcon(priorityTitle: string): string {
    if (!priorityTitle) return 'bi bi-exclamation-triangle-fill';
    return priorityTitle.toLowerCase().includes('low')
      ? 'bi bi-info-circle-fill'
      : 'bi bi-exclamation-triangle-fill';
  }

  getParsedDomains(domainsJson: string): Domain[] {
    try { return JSON.parse(domainsJson); } catch { return []; }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'Date not specified';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[1]}/${parts[0]}/${parts[2]}`;
    return dateStr;
  }

  // ── Volunteer click ────────────────────────────────────────────────────────

  volunteerForIncident(incident: Incident): void {
    this.selectedIncident = incident;
    this.resetModal();
    const el = document.getElementById('emailVerificationModal');
    if (el) new bootstrap.Modal(el).show();
  }

  // ── OTP: Send ──────────────────────────────────────────────────────────────

  sendOTP(): void {
    if (!this.email || !this.isValidEmail(this.email)) {
      this.toastr.error('Please enter a valid email address');
      return;
    }
    this.isLoading = true;
    this.dataService.postDirect('auth-api/saveOTP', { email: this.email }).subscribe({
      next: () => {
        this.isLoading = false;
        this.isOtpSent = true;
        this.toastr.success('OTP sent to your email');
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('OTP send error:', err);
        this.toastr.error('Failed to send OTP. Please try again.');
      }
    });
  }

  // ── OTP: Verify ────────────────────────────────────────────────────────────

  verifyOTP(): void {
    if (!this.otpCode) {
      this.toastr.error('Please enter the verification code');
      return;
    }
    this.isLoading = true;
    this.dataService.getHttp('auth-api/getOTP', { OTP: this.otpCode }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        console.log('OTP response:', res);
        this.isOtpVerified = true;
        this.toastr.success('Email verified!');
        this.checkUserAndProceed();
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('OTP verify error:', err);
        this.toastr.error('Invalid verification code. Please try again.');
      }
    });
  }

  // ── Check user existence ───────────────────────────────────────────────────

  checkUserAndProceed(): void {
    this.isLoading = true;
    this.dataService.getHttp('auth-api/userVerification', { email: this.email }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        console.log('userVerification raw response:', res);

        // Handle array / wrapped / direct object responses
        let userData: UserVerification | null = null;
        if (Array.isArray(res) && res.length > 0) {
          userData = res[0]?.userID ? res[0] : null;
        } else if (Array.isArray(res?.data) && res.data.length > 0) {
          userData = res.data[0]?.userID ? res.data[0] : null;
        } else if (res?.userID) {
          userData = res;
        }

        if (userData) {
          console.log('Existing user found:', userData);
          this.userData       = userData;
          this.isExistingUser = true;
          this.populateFormWithUserData(userData);
          this.toastr.info('Welcome back! Your information has been loaded. You can edit if needed.');
        } else {
          console.log('No existing user — new registration');
          this.userData       = null;
          this.isExistingUser = false;
          this.resetRegistrationForm();
          this.toastr.info('Please fill in your details to register.');
        }

        this.switchToRegistrationModal();
      },
      error: (err: any) => {
        this.isLoading      = false;
        this.userData       = null;
        this.isExistingUser = false;
        this.resetRegistrationForm();
        console.error('userVerification error:', err);
        this.switchToRegistrationModal();
      }
    });
  }

  private switchToRegistrationModal(): void {
    const emailEl = document.getElementById('emailVerificationModal');
    if (emailEl) bootstrap.Modal.getInstance(emailEl)?.hide();
    setTimeout(() => {
      const regEl = document.getElementById('volunteerRegistrationModal');
      if (regEl) new bootstrap.Modal(regEl).show();
    }, 400);
  }

  // ── Populate all fields from existing user — all remain EDITABLE ───────────

  populateFormWithUserData(u: UserVerification): void {
    this.fullName      = u.userName    || '';
    this.email         = u.email       || this.email;
    this.cnic          = u.cnic        || '';
    this.phoneNumber   = u.contactNo   || '';
    this.address       = u.address     || '';
    this.age           = u.age         > 0 ? u.age : null;
    this.genderID      = u.genderID    || null;
    this.physicallyFit = u.physicallyFit ?? null;
    this.degreeID      = u.degreeID    || null;
    this.experienceID  = u.experienceID || null;

    // Province → filter cities → set city
    if (u.provinceID) {
      this.provinceID     = u.provinceID;
      this.filteredCities = this.cityList.filter(
        (c: any) => c.provinceID === u.provinceID
      );
      // Set cityID after filteredCities is populated
      setTimeout(() => { this.cityID = u.cityID ?? null; }, 150);
    }

    // Parse domains JSON string → populate selectedDomains array
    if (u.domains) {
      try {
        const parsed: { domainID: number; domainTitle: string }[] =
          JSON.parse(u.domains);
        if (parsed && parsed.length > 0) {
          // Deduplicate by domainID
          const seen = new Set<number>();
          this.selectedDomains = parsed
            .filter(d => {
              if (seen.has(d.domainID)) return false;
              seen.add(d.domainID);
              return true;
            })
            .map(d => d.domainID);
        }
      } catch (e) {
        console.error('Error parsing user domains:', e);
        this.selectedDomains = [];
      }
    }

    console.log('Form populated:', {
      fullName: this.fullName,
      cnic: this.cnic,
      age: this.age,
      genderID: this.genderID,
      physicallyFit: this.physicallyFit,
      degreeID: this.degreeID,
      experienceID: this.experienceID,
      provinceID: this.provinceID,
      cityID: this.cityID,
      selectedDomains: this.selectedDomains
    });
  }

  // ── Validation ─────────────────────────────────────────────────────────────

  validateRegistrationForm(): boolean {
    if (!this.fullName.trim())       { this.toastr.error('Full name is required');        return false; }
    if (!this.cnic.trim())           { this.toastr.error('CNIC is required');             return false; }
    if (!this.age || this.age < 1)   { this.toastr.error('Age is required');              return false; }
    if (!this.genderID)              { this.toastr.error('Gender is required');           return false; }
    if (!this.phoneNumber.trim())    { this.toastr.error('Phone number is required');     return false; }
    if (this.physicallyFit === null) { this.toastr.error('Physical fitness is required'); return false; }
    if (!this.address.trim())        { this.toastr.error('Address is required');          return false; }
    if (!this.degreeID)              { this.toastr.error('Degree is required');           return false; }
    if (!this.experienceID)          { this.toastr.error('Experience is required');       return false; }
    if (!this.provinceID)            { this.toastr.error('Province is required');         return false; }
    if (!this.cityID)                { this.toastr.error('City is required');             return false; }
    if (this.selectedDomains.length === 0) { this.toastr.error('At least one domain is required'); return false; }
    return true;
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ── Complete Registration ──────────────────────────────────────────────────
  //
  // EXISTING USER: saveUser(spType:'update') with current form values → applyForIncident
  // NEW USER:      saveUser(spType:'insert') → userVerification to get userID → applyForIncident

  saveVolunteerRegistration(): void {
    if (!this.validateRegistrationForm()) return;
    this.isLoading = true;

    const payload = {
      userID:        this.isExistingUser ? (this.userData?.userID ?? 0) : 0,
      userName:      this.fullName.trim(),
      email:         this.email.trim(),
      json:          JSON.stringify(this.selectedDomains),
      cnic:          this.cnic.trim(),
      age:           Number(this.age),
      genderID:      Number(this.genderID),
      cityID:        Number(this.cityID),
      countryID:     1,
      physicallyFit: Number(this.physicallyFit),
      contactNo:     this.phoneNumber.trim(),
      address:       this.address.trim(),
      roleID:        1,
      userTypeID:    1,
      degreeID:      Number(this.degreeID),
      experienceID:  Number(this.experienceID),
      spType:        this.isExistingUser ? 'insert' : 'insert'
    };

    console.log('saveUser payload:', JSON.stringify(payload, null, 2));

    this.dataService.postDirect('auth-api/saveUser', payload).subscribe({
      next: (res: any) => {
        console.log('saveUser response:', res);

        if (this.isExistingUser && this.userData?.userID) {
          // Existing user — userID already known, apply directly
          this.applyForIncident(this.userData.userID);
        } else {
          // New user — fetch userID from verification then apply
          this.fetchNewUserIDAndApply();
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('saveUser error:', err);
        this.toastr.error('Failed to save. Please try again.');
      }
    });
  }

  private fetchNewUserIDAndApply(): void {
    this.dataService.getHttp('auth-api/userVerification', { email: this.email }).subscribe({
      next: (res: any) => {
        console.log('userVerification after save:', res);

        let newUserID: number | null = null;
        if (Array.isArray(res) && res.length > 0 && res[0]?.userID) {
          newUserID = res[0].userID;
        } else if (Array.isArray(res?.data) && res.data.length > 0) {
          newUserID = res.data[0]?.userID ?? null;
        } else if (res?.userID) {
          newUserID = res.userID;
        }

        if (newUserID) {
          this.applyForIncident(newUserID);
        } else {
          this.isLoading = false;
          this.toastr.error('Could not retrieve user ID. Please try again.');
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('userVerification after save error:', err);
        this.toastr.error('Registration saved but could not apply. Please try again.');
      }
    });
  }

  private applyForIncident(userID: number): void {
    const applyPayload = {
      applicantVolunteerID: 0,
      userID:               userID,
      incidentID:           this.selectedIncident?.incidentID ?? 0,
      spType:               'insert'
    };

    console.log('applyForIncident payload:', JSON.stringify(applyPayload, null, 2));

    this.dataService.postDirect('user-api/User/saveApplicantUser', applyPayload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        console.log('applyForIncident response:', res);
        this.toastr.success('You have successfully volunteered for this incident!');
        const el = document.getElementById('volunteerRegistrationModal');
        if (el) bootstrap.Modal.getInstance(el)?.hide();
        this.resetModal();
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('applyForIncident error:', err);
        this.toastr.error('Could not apply for incident. Please try again.');
      }
    });
  }

  // ── Reset ──────────────────────────────────────────────────────────────────

  resetModal(): void {
    this.email          = '';
    this.otpCode        = '';
    this.isOtpSent      = false;
    this.isOtpVerified  = false;
    this.userData       = null;
    this.isExistingUser = false;
    this.resetRegistrationForm();
  }

  resetRegistrationForm(): void {
    this.fullName        = '';
    this.cnic            = '';
    this.phoneNumber     = '';
    this.address         = '';
    this.age             = null;
    this.genderID        = null;
    this.physicallyFit   = null;
    this.degreeID        = null;
    this.experienceID    = null;
    this.provinceID      = null;
    this.cityID          = null;
    this.selectedDomains = [];
    this.filteredCities  = [];
  }

  closeRegistrationModal(): void {
    const el = document.getElementById('volunteerRegistrationModal');
    if (el) bootstrap.Modal.getInstance(el)?.hide();
    this.resetModal();
  }
}