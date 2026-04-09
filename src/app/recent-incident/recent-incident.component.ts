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
  domains: string;
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

  // Modal state
  selectedIncident: Incident | null = null;
  email: string          = '';
  otpCode: string        = '';
  isOtpSent: boolean     = false;
  isOtpVerified: boolean = false;
  isLoading: boolean     = false;
  userData: UserVerification | null = null;

  // true = existing user → fields are pre-filled & disabled
  isExistingUser: boolean = false;

  // Registration form fields
  fullName: string            = '';
  cnic: string                = '';
  phoneNumber: string         = '';
  address: string             = '';
  provinceID: number | null   = null;
  cityID: number | null       = null;
  selectedDomainID: number | null = null;

  // Lookups
  provinceList: any[]   = [];
  cityList: any[]       = [];
  filteredCities: any[] = [];
  domainList: Domain[]  = [];

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

  onProvinceChange(): void {
    if (this.isExistingUser) return; // locked for existing users
    this.filteredCities = this.provinceID
      ? this.cityList.filter((c: any) => c.provinceID === this.provinceID)
      : [];
    this.cityID = null;
  }

  // ── Display ────────────────────────────────────────────────────────────────

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
    this.dataService
      .getHttp('auth-api/userVerification', { email: this.email })
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          console.log('userVerification raw:', res);

          // API may return array OR single object OR wrapped in .data
          let userData: UserVerification | null = null;

          if (Array.isArray(res) && res.length > 0) {
            // ← your API returns an array
            userData = res[0]?.userID ? res[0] : null;
          } else if (Array.isArray(res?.data) && res.data.length > 0) {
            userData = res.data[0]?.userID ? res.data[0] : null;
          } else if (res?.userID) {
            userData = res;
          }

          if (userData) {
            // ── EXISTING USER ──────────────────────────────────────────────
            this.userData       = userData;
            this.isExistingUser = true;
            this.populateFormWithUserData(userData);
            this.toastr.info('Welcome back! Your information has been loaded.');
          } else {
            // ── NEW USER ───────────────────────────────────────────────────
            this.userData       = null;
            this.isExistingUser = false;
            this.resetRegistrationForm();
            this.toastr.info('Please complete your registration details.');
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

  // ── Populate existing user data into form ──────────────────────────────────

  populateFormWithUserData(u: UserVerification): void {
    this.fullName    = u.userName  || '';
    this.email       = u.email     || this.email;
    this.cnic        = u.cnic      || '';
    this.phoneNumber = u.contactNo || '';
    this.address     = u.address   || '';

    if (u.provinceID) {
      this.provinceID     = u.provinceID;
      // pre-filter cities without resetting cityID
      this.filteredCities = this.cityList.filter(
        (c: any) => c.provinceID === u.provinceID
      );
      setTimeout(() => { this.cityID = u.cityID; }, 150);
    }

    if (u.domains) {
      try {
        const domains: { domainID: number; domainTitle: string }[] =
          JSON.parse(u.domains);
        if (domains?.length) this.selectedDomainID = domains[0].domainID;
      } catch { /* ignore */ }
    }
  }

  // ── Save ───────────────────────────────────────────────────────────────────

  saveVolunteerRegistration(): void {
    if (!this.validateRegistrationForm()) return;
    this.isLoading = true;

    const payload = {
      userID:     this.userData?.userID ?? 0,
      email:      this.email,
      userName:   this.fullName,
      cnic:       this.cnic,
      contactNo:  this.phoneNumber,
      address:    this.address,
      provinceID: this.provinceID,
      cityID:     this.cityID,
      domainID:   this.selectedDomainID,
      incidentID: this.selectedIncident?.incidentID,
      spType:     this.isExistingUser ? 'update' : 'insert'
    };

    console.log('Payload →', JSON.stringify(payload, null, 2));

    this.dataService.postDirect('auth-api/saveUser', payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastr.success(
          this.isExistingUser
            ? 'Volunteered for incident successfully!'
            : 'Registration complete! You have volunteered successfully.'
        );
        const el = document.getElementById('volunteerRegistrationModal');
        if (el) bootstrap.Modal.getInstance(el)?.hide();
        this.resetModal();
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Save error:', err);
        this.toastr.error('Failed to complete registration. Please try again.');
      }
    });
  }

  // ── Validation ─────────────────────────────────────────────────────────────

  validateRegistrationForm(): boolean {
    if (!this.fullName.trim())    { this.toastr.error('Full name is required');    return false; }
    if (!this.cnic.trim())        { this.toastr.error('CNIC is required');         return false; }
    if (!this.phoneNumber.trim()) { this.toastr.error('Phone number is required'); return false; }
    if (!this.address.trim())     { this.toastr.error('Address is required');      return false; }
    if (!this.provinceID)         { this.toastr.error('Province is required');     return false; }
    if (!this.cityID)             { this.toastr.error('City is required');         return false; }
    if (!this.selectedDomainID)   { this.toastr.error('Domain is required');       return false; }
    return true;
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
    this.fullName         = '';
    this.cnic             = '';
    this.phoneNumber      = '';
    this.address          = '';
    this.provinceID       = null;
    this.cityID           = null;
    this.selectedDomainID = null;
    this.filteredCities   = [];
  }

  closeRegistrationModal(): void {
    const el = document.getElementById('volunteerRegistrationModal');
    if (el) bootstrap.Modal.getInstance(el)?.hide();
    this.resetModal();
  }
}