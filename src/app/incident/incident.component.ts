import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../../shared/services/shared-data.service';
import { SharedGlobalService } from '../../shared/services/shared-global.service';
import { descriptors } from 'chart.js/dist/core/core.defaults';

declare var bootstrap: any;

interface Province {
  provinceID: number;
  provinceName: string;
}

interface City {
  cityID: number;
  cityName: string;
  provinceID: number;
}

interface Priority {
  priortyTypeID: number;
  priortyTypeTitle: string;
}

interface Domain {
  domainID: number;
  domainTitle: string;
  categoryID: number;
}

interface Category {
  categoryID: number;
  categoryTitle: string;
}

interface Incident {
  incidentID: number;
  incidentTitle: string;
  description: string;
  volunteerNeeded: number;
  location: string;
  date: string;
  cityID: number;
  cityName?: string;
  provinceName?: string;
  priortyTypeID: number;
  priortyTypeTitle?: string;
  status?: number;        // Add this - API returns status field
  isActive?: boolean | number;  // Keep this for component use
  domains?: string;        // raw JSON string from API e.g. "[{\"domainID\":1,\"domainTitle\":\".Net\"}]"
  domainTitle?: string[];  // parsed for display in table
}

@Component({
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.scss']
})
export class IncidentComponent implements OnInit {

  // ── Table data ─────────────────────────────────────────────────────────────
  incidentList: Incident[] = [];
  filteredIncidents: Incident[] = [];
  searchTerm: string = '';

  // ── Lookup lists ───────────────────────────────────────────────────────────
  provinceList: Province[]   = [];
  cityList: City[]           = [];
  filteredCities: City[]     = [];
  priorityList: Priority[]   = [];
  domainList: Domain[]       = [];
  categoryList: Category[]   = [];
  filteredDomains: Domain[]  = [];

  // ── Form fields ────────────────────────────────────────────────────────────
  f_incidentTitle: string          = '';
  f_description: string            = '';
  f_volunteerNeeded: number | null = null;
  f_location: string               = '';
  f_provinceID: number | null      = null;
  f_cityID: number | null          = null;
  f_priortyID: number | null       = null;
  f_categoryID: number | null      = null;
  f_selectedDomains: number[]      = [];

  // ── Image upload ───────────────────────────────────────────────────────────
  f_eDoc: string     = '';
  f_eDocPath: string = '';
  f_eDocExt: string  = '';
  imagePreview: string | null = null;

  isSubmitting: boolean = false;

  constructor(
    private dataService: SharedDataService,
    private toastr: ToastrService,
    private userSession: SharedGlobalService
  ) {}

  ngOnInit(): void {
    this.loadIncidents();
    this.loadProvinces();
    this.loadCities();
    this.loadPriorities();
    // this.loadDomains();
    this.loadCategories();
  }

  // ── Loaders ────────────────────────────────────────────────────────────────

loadIncidents(): void {
  this.dataService.getHttp('admin-api/Admin/getIncidents').subscribe({
    next: (res: any) => {
      const raw: Incident[] = res?.data ?? res ?? [];

      // Parse domains JSON string → extract domainTitle[] for table display
      this.incidentList = raw.map(inc => {
        let domainTitle: string[] = [];
        if (inc.domains) {
          try {
            const parsed: { domainID: number; domainTitle: string }[] =
              typeof inc.domains === 'string'
                ? JSON.parse(inc.domains)
                : inc.domains;
            domainTitle = parsed.map(d => d.domainTitle);
          } catch {
            domainTitle = [];
          }
        }
        
        // FIX: Only compare with number 1 since API returns status as number
        const isActive = inc.status === 1;
        
        return { ...inc, domainTitle, isActive };
      });

      this.applySearch();
    },
    error: (err: any) => { 
      console.error('Incidents error:', err);
      this.toastr.error('Failed to load incidents');
    }
  });
}
  // loadIncidents(): void {
  //   this.dataService.getHttp('admin-api/Admin/getIncidents').subscribe({
  //     next: (res: any) => {
  //       const raw: Incident[] = res?.data ?? res ?? [];

  //       // Parse domains JSON string → extract domainTitle[] for table display
  //       this.incidentList = raw.map(inc => {
  //         let domainTitle: string[] = [];
  //         if (inc.domains) {
  //           try {
  //             const parsed: { domainID: number; domainTitle: string }[] =
  //               typeof inc.domains === 'string'
  //                 ? JSON.parse(inc.domains)
  //                 : inc.domains;
  //             domainTitle = parsed.map(d => d.domainTitle);
  //           } catch {
  //             domainTitle = [];
  //           }
  //         }
  //         return { ...inc, domainTitle };
  //       });

  //       this.applySearch();
  //     },
  //     error: (err: any) => { console.error('Incidents error:', err); }
  //   });
  // }

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

  loadPriorities(): void {
    this.dataService.getHttp('admin-api/Admin/getPriority').subscribe({
      next: (res: any) => { this.priorityList = res?.data ?? res ?? []; },
      error: (err: any) => { console.error('Priority error:', err); }
    });
  }

  // loadDomains(): void {
  //   this.dataService.getHttp('user-api/User/getDomain').subscribe({
  //     next: (res: any) => { this.domainList = res?.data ?? res ?? []; },
  //     error: (err: any) => { console.error('Domain error:', err); }
  //   });
  // }

    onCategoryChange(): void {
    this.f_selectedDomains = [];
    this.filteredDomains   = [];
 
    if (!this.f_categoryID) return;
 
    this.dataService
      .getHttp('admin-api/Admin/GetCategoryDomain', { categoryID: this.f_categoryID })
      .subscribe({
        next: (res: any) => {
          this.filteredDomains = res?.data ?? res ?? [];
        },
        error: (err: any) => { console.error('Domain error:', err); }
      });
  }
  loadCategories(): void {
    this.dataService.getHttp('admin-api/Admin/GetCategory').subscribe({
      next: (res: any) => { this.categoryList = res?.data ?? res ?? []; },
      error: (err: any) => { console.error('Category error:', err); }
    });
  }

  // ── Search ─────────────────────────────────────────────────────────────────

  onSearch(): void {
    this.applySearch();
  }

  applySearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredIncidents = [...this.incidentList];
      return;
    }
    const q = this.searchTerm.toLowerCase();
    this.filteredIncidents = this.incidentList.filter(i =>
      i.incidentTitle?.toLowerCase().includes(q) ||
      i.location?.toLowerCase().includes(q) ||
      i.cityName?.toLowerCase().includes(q) ||
      i.provinceName?.toLowerCase().includes(q)
    );
  }

  // ── Province → City cascade ────────────────────────────────────────────────

  onProvinceChange(): void {
    this.filteredCities = this.f_provinceID
      ? this.cityList.filter(c => c.provinceID === this.f_provinceID)
      : [];
    this.f_cityID = null;
  }

  // ── Category → Domain cascade ──────────────────────────────────────────────

  // onCategoryChange(): void {
  //   this.filteredDomains = this.f_categoryID
  //     ? this.domainList.filter(d => d.categoryID === this.f_categoryID)
  //     : [];
  //   this.f_selectedDomains = [];
  // }

  // ── Image upload ───────────────────────────────────────────────────────────

  onImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!['png', 'jpg', 'jpeg'].includes(ext)) {
      this.toastr.warning('Only PNG and JPG files are supported');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64Full: string = e.target.result;
      this.f_eDoc      = base64Full.split(',')[1];
      this.f_eDocExt   = ext;
      this.f_eDocPath  = 'Incidents/' + file.name;
      this.imagePreview = base64Full;
    };
    reader.readAsDataURL(file);
  }

  triggerFileInput(): void {
    document.getElementById('incidentImageInput')?.click();
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  /** Auto-generates today's date as dd-mm-yyyy for the API — no form field needed */
  getCurrentDateForApi(): string {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    return `${d}-${m}-${y}`;
  }

  getPriorityClass(priortyID: number): string {
    switch (priortyID) {
      case 1: return 'badge-critical';
      case 2: return 'badge-medium';
      case 3: return 'badge-low';
      default: return 'badge-low';
    }
  }

  getPriorityLabel(priortyTypeID: number): string {
    return this.priorityList.find(p => p.priortyTypeID === priortyTypeID)?.priortyTypeTitle ?? 'Unknown';
  }

  isEmpty(v: any): boolean {
    return v === null || v === undefined || v.toString().trim() === '';
  }

  // ── Validation ─────────────────────────────────────────────────────────────

  validateForm(): boolean {
    if (!this.f_incidentTitle.trim()) {
      this.toastr.error('Incident title is required'); return false;
    }
    if (!this.f_provinceID) {
      this.toastr.error('Province is required'); return false;
    }
    if (!this.f_cityID) {
      this.toastr.error('City is required'); return false;
    }
    if (!this.f_location.trim()) {
      this.toastr.error('Location is required'); return false;
    }
    if (!this.f_priortyID) {
      this.toastr.error('Priority is required'); return false;
    }
    if (!this.f_volunteerNeeded || this.f_volunteerNeeded < 1) {
      this.toastr.error('Volunteers needed is required'); return false;
    }
    if (this.f_selectedDomains.length === 0) {
      this.toastr.error('At least one domain is required'); return false;
    }
    if (!this.f_description.trim()) {
      this.toastr.error('Description is required'); return false;
    }
    return true;
  }

  // ── Save ───────────────────────────────────────────────────────────────────

  save(): void {
    if (!this.validateForm()) return;

    this.isSubmitting = true;

    const payload = {
      incidentID:      0,
      incidentTitle:   this.f_incidentTitle.trim(),
      description:     this.f_description.trim(),
      volunteerNeeded: Number(this.f_volunteerNeeded),
      location:        this.f_location.trim(),
      date:            this.getCurrentDateForApi(),  // ← current date, no form field
      cityID:          Number(this.f_cityID),
      priortyTypeID:   Number(this.f_priortyID),
      eDoc:            this.f_eDoc,
      eDocPath:        this.f_eDocPath,
      eDocExt:         this.f_eDocExt,
      userID:          this.userSession.getUserID(),
      json:            JSON.stringify(this.f_selectedDomains),
      spType:          'insert'
    };

    console.log('Incident payload:', JSON.stringify(payload, null, 2));

    this.dataService.postDirect('admin-api/Admin/saveIncident', payload).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.toastr.success('Incident created successfully!');
        this.resetForm();
        this.loadIncidents();
        const el = document.getElementById('createIncidentModal');
        if (el) bootstrap.Modal.getInstance(el)?.hide();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        console.error(err);
        this.toastr.error('Failed to create incident. Please try again.');
      }
    });
  }

  // ── Domain multi-select helpers ────────────────────────────────────────────

  onDomainSelect(event: any): void {
    const id = Number(event.target.value);
    if (id && !this.f_selectedDomains.includes(id)) {
      this.f_selectedDomains = [...this.f_selectedDomains, id];
    }
    event.target.value = '';
  }

  getDomainTitle(id: number): string {
    return this.domainList.find(d => d.domainID === id)?.domainTitle ?? '';
  }

  removeDomain(id: number): void {
    this.f_selectedDomains = this.f_selectedDomains.filter(d => d !== id);
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  deleteIncident(incident: Incident): void {
    if (!confirm(`Delete "${incident.incidentTitle}"?`)) return;

    const payload = {
      incidentID: incident.incidentID,
      incidentTitle: incident.incidentTitle,
      description: incident.description,
      volunteerNeeded: incident.volunteerNeeded,
      location: incident.location,
      date: incident.date,
      cityID: incident.cityID,
      priortyTypeID: incident.priortyTypeID,
      eDoc: "null",
      eDocPath: "null",
      eDocExt: "null",
      userID: this.userSession.getUserID(),
      json: JSON.stringify(incident.domainTitle), 
      spType:     'delete',
   
    };
    console.log('Delete payload:', JSON.stringify(payload, null, 2));

    this.dataService.postDirect('admin-api/Admin/saveIncident', payload).subscribe({
      next: () => {
        this.toastr.success('Incident deleted!');
        this.loadIncidents();
      },
      error: (err: any) => {
        console.error(err);
        this.toastr.error('Failed to delete incident.');
      }
    });
  }

  // ── Toggle status ──────────────────────────────────────────────────────────

  // toggleStatus(incident: Incident): void {
  //   const payload = {
  //     incidentID: incident.incidentID,
  //     incidentTitle: incident.incidentTitle,
  //     status: incident.isActive ? 0 : 1, // toggle
  //     spType:     'update',
  //     userID:     this.userSession.getUserID()
  //   };
  //   console.log('Status toggle payload:', JSON.stringify(payload, null, 2)); 

  //   this.dataService.postDirect('admin-api/Admin/updateStatus', payload).subscribe({
  //     next: () => {
  //       incident.isActive = !incident.isActive;
  //     },
  //     error: (err: any) => { console.error(err); }
  //   });
  // }

 toggleStatus(incident: Incident): void {
  const newStatus = incident.isActive ? 0 : 1;
  const payload = {
    incidentID: incident.incidentID,
    incidentTitle: incident.incidentTitle,
    status: newStatus,
    spType: 'update',
    userID: this.userSession.getUserID()
  };
  
  console.log('Status toggle payload:', JSON.stringify(payload, null, 2)); 

  this.dataService.postDirect('admin-api/Admin/updateStatus', payload).subscribe({
    next: (res: any) => {
      // Show success message
      const statusText = newStatus === 1 ? 'activated' : 'deactivated';
      this.toastr.success(`Incident "${incident.incidentTitle}" ${statusText} successfully!`);
      
      // Update local state
      incident.isActive = !incident.isActive;
      
      // Also update in filteredIncidents array
      const filteredIndex = this.filteredIncidents.findIndex(i => i.incidentID === incident.incidentID);
      if (filteredIndex !== -1) {
        this.filteredIncidents[filteredIndex].isActive = incident.isActive;
      }
    },
    error: (err: any) => { 
      console.error('Status update error:', err);
      this.toastr.error('Failed to update incident status. Please try again.');
    }
  });
}

  // ── Reset form ─────────────────────────────────────────────────────────────

  resetForm(): void {
    this.f_incidentTitle   = '';
    this.f_description     = '';
    this.f_volunteerNeeded = null;
    this.f_location        = '';
    this.f_provinceID      = null;
    this.f_cityID          = null;
    this.f_priortyID       = null;
    this.f_categoryID      = null;
    this.f_selectedDomains = [];
    this.f_eDoc            = '';
    this.f_eDocPath        = '';
    this.f_eDocExt         = '';
    this.imagePreview      = null;
    this.filteredCities    = [];
    this.filteredDomains   = [];
  }
}