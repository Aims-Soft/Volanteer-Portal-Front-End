import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { SharedDataService } from 'src/shared/services/shared-data.service';
import { ToastrService } from 'ngx-toastr';
import { SharedGlobalService } from 'src/shared/services/shared-global.service';

interface Incident {
  incidentID: number;
  incidentTitle: string;
  description: string;
  volunteerNeeded: number;
  location: string;
  date: string;
  status: number;
  domains: string; // JSON string
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

@Component({
  selector: 'app-recent-incident',
  templateUrl: './recent-incident.component.html',
  styleUrls: ['./recent-incident.component.scss']
})
export class RecentIncidentComponent implements OnInit {
  incidents: Incident[] = [];
  displayedIncidents: Incident[] = [];
  showAll = false;

 constructor(
    private dataService : SharedDataService,
    private toastr: ToastrService,
    private userSession: SharedGlobalService,
  ) {}


  ngOnInit(): void {
    this.fetchIncidents();
  }

  // fetchIncidents(): void {
  //   this.http.get<Incident[]>('admin-api/Admin/getIncidents').subscribe({
  //     next: (data) => {
  //       this.incidents = data;
  //       this.updateDisplayedIncidents();
  //     },
  //     error: (err) => {
  //       console.error('Error fetching incidents:', err);
  //     }
  //   });
  // }
    fetchIncidents(): void {
    this.dataService.getHttp('admin-api/Admin/getIncidents').subscribe({
      next: (res: any) => {
        const raw: Incident[] = res?.data ?? res ?? [];

        // Parse domains JSON string → extract domainTitle[] for display
        this.incidents = raw.map(inc => {
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
          
          // Ensure isActive is properly set (default to true/false based on your API)
          // const isActive = inc.isActive === true || inc.isActive === 1;
          
          return { ...inc, domainTitle };
        });

        this.updateDisplayedIncidents();
      },
      error: (err: any) => { 
        console.error('Incidents error:', err);
        this.toastr?.error('Failed to load incidents');
      }
    });
  }

  updateDisplayedIncidents(): void {
    if (this.showAll) {
      this.displayedIncidents = this.incidents;
    } else {
      this.displayedIncidents = this.incidents.slice(0, 6);
    }
  }

  toggleViewAll(): void {
    this.showAll = !this.showAll;
    this.updateDisplayedIncidents();
  }

  getPriorityClass(priorityTitle: string): string {
    const title = priorityTitle.toLowerCase();
    if (title.includes('high')) return 'priority-high';
    if (title.includes('medium')) return 'priority-medium';
    if (title.includes('low')) return 'priority-low';
    return 'priority-medium';
  }

  getPriorityIcon(priorityTitle: string): string {
    const title = priorityTitle.toLowerCase();
    if (title.includes('high')) return 'bi bi-exclamation-triangle-fill';
    if (title.includes('medium')) return 'bi bi-exclamation-triangle-fill';
    if (title.includes('low')) return 'bi bi-info-circle-fill';
    return 'bi bi-exclamation-triangle-fill';
  }

  getParsedDomains(domainsJson: string): Domain[] {
    try {
      return JSON.parse(domainsJson);
    } catch (e) {
      return [];
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'Date not specified';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[1]}/${parts[0]}/${parts[2]}`;
    }
    return dateStr;
  }

  volunteerForIncident(incidentID: number): void {
    console.log('Volunteering for incident:', incidentID);
    // Add your volunteer logic here
  }
}