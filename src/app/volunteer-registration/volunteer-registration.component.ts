import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../shared/services/shared-data.service';

@Component({
  selector: 'app-volunteer-registration',
  templateUrl: './volunteer-registration.component.html',
  styleUrls: ['./volunteer-registration.component.scss']
})
export class VolunteerRegistrationComponent implements OnInit {

  volunteers: any[] = [];
  selectedVolunteer: any = null;

  constructor(private dataService: SharedDataService) {}

  ngOnInit(): void {
    this.loadVolunteers();
  }

  // ── Load from API ──────────────────────────────────────────────────────────

  loadVolunteers(): void {
    this.dataService.getHttp('dashboard-api/Dashboard/getRecentRegistration').subscribe({
      next: (res: any) => {
        const raw: any[] = res?.data ?? res ?? [];
        this.volunteers = raw.map(v => {
          let parsedDomains: { domainID: number; domainTitle: string }[] = [];
          if (v.domains) {
            try {
              parsedDomains = typeof v.domains === 'string'
                ? JSON.parse(v.domains)
                : v.domains;
              // Remove duplicate domainIDs
              parsedDomains = parsedDomains.filter(
                (d, i, arr) => arr.findIndex(x => x.domainID === d.domainID) === i
              );
            } catch { parsedDomains = []; }
          }
          return {
            ...v,
            parsedDomains,
            initials: this.getInitials(v.userName)
          };
        });
      },
      error: (err: any) => { console.error('Volunteer load error:', err); }
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  getInitials(name: string): string {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();
  }

  // ── View / Delete ──────────────────────────────────────────────────────────

  viewVolunteer(volunteer: any): void {
    this.selectedVolunteer = volunteer;
  }

  deleteVolunteer(userID: number): void {
    if (confirm('Are you sure you want to delete this volunteer?')) {
      this.volunteers = this.volunteers.filter(v => v.userID !== userID);
    }
  }
}