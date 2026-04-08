import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../../shared/services/shared-data.service';
import { SharedGlobalService } from '../../shared/services/shared-global.service';

declare var bootstrap: any;

interface Category {
  categoryID: number;
  categoryTitle: string;
}

interface Domain {
  categoryID: number;
  categoryTitle: string;
  domainID: number;
  domainTitle: string;
}

interface SkillCard {
  categoryID: number;
  categoryTitle: string;
  domain: string;
  parsedDomains?: { domainID: number; domainTitle: string }[];
}

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.scss']
})
export class SkillComponent implements OnInit {

  // ── Cards ──────────────────────────────────────────────────────────────────
  skillList: SkillCard[]      = [];
  filteredSkills: SkillCard[] = [];
  searchTerm: string          = '';

  // ── Lookups ────────────────────────────────────────────────────────────────
  categoryList: Category[] = [];
  domainList: Domain[]     = [];

  // ── Form ───────────────────────────────────────────────────────────────────
  f_categoryID: number | null  = null;

  // Bound to the dropdown — always resets to null after each pick
  f_domainDropdown: number | null = null;

  // Accumulated selections shown as tags
  selectedDomains: { domainID: number; domainTitle: string }[] = [];

  // ── Edit mode ──────────────────────────────────────────────────────────────
  isEditMode: boolean    = false;
  editCategoryID: number = 0;

  isSubmitting: boolean = false;

  constructor(
    private dataService: SharedDataService,
    private toastr: ToastrService,
    private userSession: SharedGlobalService
  ) {}

  ngOnInit(): void {
    this.loadSkills();
    this.loadCategories();
  }

  // ── Loaders ────────────────────────────────────────────────────────────────

  loadSkills(): void {
    this.dataService.getHttp('admin-api/Admin/getSkills').subscribe({
      next: (res: any) => {
        const raw: SkillCard[] = res?.data ?? res ?? [];
        this.skillList = raw.map(card => {
          let parsedDomains: { domainID: number; domainTitle: string }[] = [];
          if (card.domain) {
            try {
              parsedDomains = typeof card.domain === 'string'
                ? JSON.parse(card.domain)
                : card.domain;
            } catch { parsedDomains = []; }
          }
          return { ...card, parsedDomains };
        });
        this.applySearch();
      },
      error: (err: any) => { console.error('Skills error:', err); }
    });
  }

  loadCategories(): void {
    this.dataService.getHttp('admin-api/Admin/GetCategory').subscribe({
      next: (res: any) => { this.categoryList = res?.data ?? res ?? []; },
      error: (err: any) => { console.error('Category error:', err); }
    });
  }

  onCategoryChange(): void {
    this.domainList      = [];
    this.selectedDomains = [];
    this.f_domainDropdown = null;
    if (!this.f_categoryID) return;

    this.dataService
      .getHttp('admin-api/Admin/GetCategoryDomain', { categoryID: this.f_categoryID })
      .subscribe({
        next: (res: any) => { this.domainList = res?.data ?? res ?? []; },
        error: (err: any) => { console.error('Domain error:', err); }
      });
  }

  // ── Multi-select domain helpers ────────────────────────────────────────────


  // onDomainSelect(domainID: number | null): void {
  //   if (domainID === null) return;

  //   const found = this.domainList.find(d => d.domainID === domainID);
  //   if (found && !this.isDomainSelected(domainID)) {
  //     this.selectedDomains = [
  //       ...this.selectedDomains,
  //       { domainID: found.domainID, domainTitle: found.domainTitle }
  //     ];
  //   }

  //   // Reset dropdown to placeholder after a tick so Angular detects the change
  //   setTimeout(() => { this.f_domainDropdown = null; }, 0);
  // }


  onDomainSelect(domainID: number | null): void {
  if (domainID === null) return;

  // ── MAX 5 DOMAINS ──────────────────────────────────────
  if (this.selectedDomains.length >= 5) {
    this.toastr.warning('You can select a maximum of 5 domains.');
    setTimeout(() => { this.f_domainDropdown = null; }, 0);
    return;
  }
  // ───────────────────────────────────────────────────────

  const found = this.domainList.find(d => d.domainID === domainID);
  if (found && !this.isDomainSelected(domainID)) {
    this.selectedDomains = [
      ...this.selectedDomains,
      { domainID: found.domainID, domainTitle: found.domainTitle }
    ];
  }

  setTimeout(() => { this.f_domainDropdown = null; }, 0);
}

  isDomainSelected(domainID: number): boolean {
    return this.selectedDomains.some(d => d.domainID === domainID);
  }

  removeSelectedDomain(domainID: number): void {
    this.selectedDomains = this.selectedDomains.filter(d => d.domainID !== domainID);
  }

  // ── Search ─────────────────────────────────────────────────────────────────

  onSearch(): void { this.applySearch(); }

  applySearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredSkills = [...this.skillList];
      return;
    }
    const q = this.searchTerm.toLowerCase();
    this.filteredSkills = this.skillList.filter(s =>
      s.categoryTitle?.toLowerCase().includes(q) ||
      s.parsedDomains?.some(d => d.domainTitle.toLowerCase().includes(q))
    );
  }

  // ── Validation ─────────────────────────────────────────────────────────────

  validateForm(): boolean {
    if (!this.f_categoryID) {
      this.toastr.error('Category is required'); return false;
    }
    if (this.selectedDomains.length === 0) {
      this.toastr.error('Please select at least one domain'); return false;
    }
    return true;
  }

  // ── Save (Add / Update) ────────────────────────────────────────────────────

  save(): void {
    if (!this.validateForm()) return;
    this.isSubmitting = true;

    const domainIDs = this.selectedDomains.map(d => d.domainID);

    const payload = {
      categoryID: Number(this.f_categoryID),
      json:       JSON.stringify(domainIDs),  // e.g. "[1,2,3]"
      userID:     this.userSession.getUserID(),
      spType:     this.isEditMode ? 'update' : 'insert'
    };
     console.log('Payload for save:', payload);
    this.dataService.postDirect('admin-api/Admin/saveSkill', payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastr.success(this.isEditMode ? 'Skill updated!' : 'Skill added!');
        this.closeModal();
        this.loadSkills();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        console.error(err);
        this.toastr.error('Failed to save skill. Please try again.');
      }
    });
  }

  // ── Edit ───────────────────────────────────────────────────────────────────

  editSkill(card: SkillCard): void {
    this.isEditMode      = true;
    this.editCategoryID  = card.categoryID;
    this.f_categoryID    = card.categoryID;
    this.f_domainDropdown = null;

    // Pre-populate selected domains from the card
    this.selectedDomains = card.parsedDomains
      ? card.parsedDomains.map(d => ({ domainID: d.domainID, domainTitle: d.domainTitle }))
      : [];

    this.dataService
      .getHttp('admin-api/Admin/GetCategoryDomain', { categoryID: card.categoryID })
      .subscribe({
        next: (res: any) => {
          this.domainList = res?.data ?? res ?? [];
          this.openModal();
        },
        error: () => { this.openModal(); }
      });
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  deleteSkill(card: SkillCard): void {
    if (!confirm(`Delete all domains under "${card.categoryTitle}"?`)) return;

    const domainIDs = (card.parsedDomains ?? []).map(d => d.domainID);

    const payload = {
      categoryID: card.categoryID,
      json:       JSON.stringify(domainIDs),
      userID:     this.userSession.getUserID(),
      spType:     'delete'
    };
    console.log('Payload for delete:', payload);

    this.dataService.postDirect('admin-api/Admin/saveSkill', payload).subscribe({
      next: () => {
        this.toastr.success('Skill deleted!');
        this.loadSkills();
      },
      error: (err: any) => {
        console.error(err);
        this.toastr.error('Failed to delete skill.');
      }
    });
  }

  // ── Modal helpers ──────────────────────────────────────────────────────────

  openModal(): void {
    const el = document.getElementById('addSkillsModal');
    if (el) new bootstrap.Modal(el).show();
  }

  closeModal(): void {
    const el = document.getElementById('addSkillsModal');
    if (el) bootstrap.Modal.getInstance(el)?.hide();
    this.resetForm();
  }

  resetForm(): void {
    this.f_categoryID     = null;
    this.f_domainDropdown  = null;
    this.selectedDomains  = [];
    this.domainList       = [];
    this.isEditMode       = false;
    this.editCategoryID   = 0;
  }
}