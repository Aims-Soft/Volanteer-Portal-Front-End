import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../../shared/services/shared-data.service';
import { SharedGlobalService  } from '../../shared/services/shared-global.service';

declare var bootstrap: any;

interface Category {
  categoryID: number;
  categoryTitle: string;
}

interface Domain {
  domainID: number;
  domainTitle: string;
  categoryID: number;
}

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  // ── Category ──────────────────────────────────────────────────────────────
  categoryList: Category[]        = [];
  selectedCategoryID: number | null = null;
  newCategoryName: string         = '';

  // ── Domain ────────────────────────────────────────────────────────────────
  allDomains: Domain[]     = [];
  filteredDomains: Domain[] = [];
  domainTitle: string      = '';
  editMode: boolean        = false;
  editingDomainID: number  = 0;

  // ── Search ────────────────────────────────────────────────────────────────
  searchTerm: string = '';

  constructor(
    private dataService: SharedDataService,
    private toastr: ToastrService,
  
    private userSession: SharedGlobalService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadDomains();
  }

  // ── Load ───────────────────────────────────────────────────────────────────

  loadCategories(): void {
    this.dataService.getHttp('admin-api/Admin/GetCategory').subscribe({
      next: (res: any) => { this.categoryList = res?.data ?? res ?? []; },
      error: (err: any) => { console.error('Categories error:', err); }
    });
  }

  loadDomains(): void {
    this.dataService.getHttp('admin-api/Admin/getConfigration').subscribe({
      next: (res: any) => {
        this.allDomains = res?.data ?? res ?? [];
        this.applyFilters();
      },
      error: (err: any) => { console.error('Domains error:', err); }
    });
  }

  // ── Filter ─────────────────────────────────────────────────────────────────

  onCategoryChange(): void {
    this.applyFilters();
    this.resetDomainForm();
  }

  applyFilters(): void {
    let result = this.selectedCategoryID
      ? this.allDomains.filter(d => d.categoryID === this.selectedCategoryID)
      : this.allDomains;

    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      result = result.filter(d => d.domainTitle.toLowerCase().includes(q));
    }

    this.filteredDomains = result;
  }

  onSearch(): void {
    this.applyFilters();
  }

  // ── Category CRUD ──────────────────────────────────────────────────────────

  addCategory(): void {
    if (!this.newCategoryName.trim()) {
      this.toastr.warning('Please enter a category name');
      return;
    }

    const payload = {
      categoryID:    0,
      categoryTitle: this.newCategoryName.trim(),
      userID:           this.userSession.getUserID(),
      spType:           'Insert'
    };

    this.dataService.postDirect('admin-api/Admin/saveCategory', payload).subscribe({
      next: (res: any) => {
        this.toastr.success('Category added successfully!');
        this.newCategoryName = '';
        this.loadCategories();
        // close modal
        const el = document.getElementById('addCategoryModal');
        if (el) bootstrap.Modal.getInstance(el)?.hide();
      },
      error: (err: any) => {
        console.error(err);
        this.toastr.error('Failed to add category. Please try again.');
      }
    });
  }

  // ── Domain CRUD ────────────────────────────────────────────────────────────

  addOrUpdateDomain(): void {
    if (!this.selectedCategoryID) {
      this.toastr.warning('Please select a category first');
      return;
    }
    if (!this.domainTitle.trim()) {
      this.toastr.warning('Please enter a domain name');
      return;
    }

    const payload = {
      domainID:      this.editMode ? this.editingDomainID : 0,
      domainTitle:   this.domainTitle.trim(),
      categoryID: this.selectedCategoryID,
      userID:        this.userSession.getUserID(),
      spType:        this.editMode ? 'Update' : 'Insert'
    };

    this.dataService.postDirect('admin-api/Admin/saveConfigration', payload).subscribe({
      next: (res: any) => {
        this.toastr.success(this.editMode ? 'Domain updated!' : 'Domain added!');
        this.resetDomainForm();
        this.loadDomains();
      },
      error: (err: any) => {
        console.error(err);
        this.toastr.error('Failed to save domain. Please try again.');
      }
    });
  }

  editDomain(domain: Domain): void {
    this.editMode        = true;
    this.editingDomainID = domain.domainID;
    this.domainTitle     = domain.domainTitle;
    this.selectedCategoryID = domain.categoryID;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteDomain(domain: Domain): void {
    if (!confirm(`Delete "${domain.domainTitle}"?`)) return;

    const payload = {
      domainID:      domain.domainID,
      domainTitle:   domain.domainTitle,
      categoryID: domain.categoryID,
      userID:        this.userSession.getUserID(),
      spType:        'Delete'
    };
    console.log('Deleting domain with payload:', payload);

    this.dataService.postDirect('admin-api/Admin/saveConfigration', payload).subscribe({
      next: (res: any) => {
        this.toastr.success('Domain deleted!');
        this.loadDomains();
      },
      error: (err: any) => {
        console.error(err);
        this.toastr.error('Failed to delete domain. Please try again.');
      }
    });
  }

  resetDomainForm(): void {
    this.domainTitle     = '';
    this.editingDomainID = 0;
    this.editMode        = false;
  }

  getCategoryName(id: number): string {
    return this.categoryList.find(c => c.categoryID === id)?.categoryTitle ?? 'Unknown';
  }
}
