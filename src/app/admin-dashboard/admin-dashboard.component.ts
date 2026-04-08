import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { SharedDataService } from '../../shared/services/shared-data.service';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

Chart.register(...registerables);

interface VolunteerByDomain {
  volunteer: number;
  domainTitle: string;
}

interface CrisesByPriority {
  criticalPriorty: string;
  mediumPriorty: string;
  lowPriorty: string;
}

interface DashboardCount {
  totalVolunteers: number;
  totalIncidents: number;
  activeIncidents: number;
  activeVolunteers: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  
  // Dashboard Counts
  totalVolunteers: number = 0;
  totalIncidents: number = 0;
  activeIncidents: number = 0;
  activeVolunteers: number = 0;
  
  // Lists for Modals
  volunteersList: any[] = [];
  incidentsList: any[] = [];
  activeIncidentsList: any[] = [];
  activeVolunteersList: any[] = [];
  
  // Chart Data
  volunteersByDomain: VolunteerByDomain[] = [];
  crisesByPriority: CrisesByPriority | null = null;
  
  // Loading states
  isLoadingCounts: boolean = false;
  isLoadingVolunteers: boolean = false;
  isLoadingIncidents: boolean = false;
  
  // Chart instances
  volunteersChart: Chart | null = null;
  priorityChart: Chart | null = null;
  
  constructor(
    private dataService: SharedDataService,
    private toastr: ToastrService
  ) { }
  
  ngOnInit(): void {
    this.loadDashboardCounts();
    this.loadVolunteersList();
    this.loadIncidentsList();
    this.loadActiveIncidentsList();
    this.loadActiveVolunteersList();
    this.loadVolunteersByDomain();
    this.loadCrisesByPriority();
  }
  
  loadDashboardCounts(): void {
    this.isLoadingCounts = true;
    this.dataService.getHttp('dashboard-api/Dashboard/getDashboardCount').subscribe({
      next: (res: any) => {
        console.log('Dashboard Count API Response:', res);
        
        // Handle different response structures
        let data: DashboardCount;
        
        if (Array.isArray(res) && res.length > 0) {
          // If response is an array, take the first element
          data = res[0];
        } else if (res?.data) {
          // If response has a data property
          data = Array.isArray(res.data) ? res.data[0] : res.data;
        } else {
          // Direct object response
          data = res;
        }
        
        console.log('Extracted data:', data);
        
        // Extract values with proper type checking
        this.totalVolunteers = Number(data.totalVolunteers) || 0;
        this.totalIncidents = Number(data.totalIncidents) || 0;
        this.activeIncidents = Number(data.activeIncidents) || 0;
        this.activeVolunteers = Number(data.activeVolunteers) || 0;
        
        this.isLoadingCounts = false;
        
        console.log('Dashboard counts loaded:', {
          totalVolunteers: this.totalVolunteers,
          totalIncidents: this.totalIncidents,
          activeIncidents: this.activeIncidents,
          activeVolunteers: this.activeVolunteers
        });
      },
      error: (err: any) => {
        console.error('Error loading dashboard counts:', err);
        this.toastr.error('Failed to load dashboard statistics');
        this.isLoadingCounts = false;
        
        // Set default values
        this.totalVolunteers = 0;
        this.totalIncidents = 0;
        this.activeIncidents = 0;
        this.activeVolunteers = 0;
      }
    });
  }
  
  loadVolunteersList(): void {
    this.isLoadingVolunteers = true;
    this.dataService.getHttp('dashboard-api/Dashboard/getRecentRegistration').subscribe({
      next: (res: any) => {
        console.log('Recent Registrations Response:', res);
        
        if (Array.isArray(res)) {
          this.volunteersList = res;
        } else if (res?.data && Array.isArray(res.data)) {
          this.volunteersList = res.data;
        } else {
          this.volunteersList = [];
        }
        
        this.isLoadingVolunteers = false;
      },
      error: (err: any) => {
        console.error('Error loading volunteers:', err);
        this.volunteersList = [];
        this.isLoadingVolunteers = false;
      }
    });
  }
  
  loadIncidentsList(): void {
    this.isLoadingIncidents = true;
    this.dataService.getHttp('admin-api/Admin/getIncidents').subscribe({
      next: (res: any) => {
        console.log('Incidents Response:', res);
        
        if (Array.isArray(res)) {
          this.incidentsList = res;
        } else if (res?.data && Array.isArray(res.data)) {
          this.incidentsList = res.data;
        } else {
          this.incidentsList = [];
        }
        
        this.isLoadingIncidents = false;
      },
      error: (err: any) => {
        console.error('Error loading incidents:', err);
        this.incidentsList = [];
        this.isLoadingIncidents = false;
      }
    });
  }
  
  loadActiveIncidentsList(): void {
    this.dataService.getHttp('admin-api/Admin/getActiveIncidents').subscribe({
      next: (res: any) => {
        console.log('Active Incidents Response:', res);
        
        if (Array.isArray(res)) {
          this.activeIncidentsList = res;
        } else if (res?.data && Array.isArray(res.data)) {
          this.activeIncidentsList = res.data;
        } else {
          this.activeIncidentsList = [];
        }
      },
      error: (err: any) => {
        console.error('Error loading active incidents:', err);
        this.activeIncidentsList = [];
      }
    });
  }
  
  loadActiveVolunteersList(): void {
    this.dataService.getHttp('admin-api/Admin/getActiveVolunteers').subscribe({
      next: (res: any) => {
        console.log('Active Volunteers Response:', res);
        
        if (Array.isArray(res)) {
          this.activeVolunteersList = res;
        } else if (res?.data && Array.isArray(res.data)) {
          this.activeVolunteersList = res.data;
        } else {
          this.activeVolunteersList = [];
        }
      },
      error: (err: any) => {
        console.error('Error loading active volunteers:', err);
        this.activeVolunteersList = [];
      }
    });
  }
  
  loadVolunteersByDomain(): void {
    this.dataService.getHttp('dashboard-api/Dashboard/getVolunteerByDomain').subscribe({
      next: (res: any) => {
        console.log('Volunteers by Domain Response:', res);
        
        if (Array.isArray(res)) {
          this.volunteersByDomain = res;
        } else if (res?.data && Array.isArray(res.data)) {
          this.volunteersByDomain = res.data;
        } else {
          this.volunteersByDomain = [];
        }
        
        // Create chart after data is loaded
        setTimeout(() => this.createVolunteersChart(), 100);
      },
      error: (err: any) => {
        console.error('Error loading volunteers by domain:', err);
        this.volunteersByDomain = [];
        // Create chart with empty data
        setTimeout(() => this.createVolunteersChart(), 100);
      }
    });
  }
  
  loadCrisesByPriority(): void {
    this.dataService.getHttp('dashboard-api/Dashboard/getCrisesByPriorty').subscribe({
      next: (res: any) => {
        console.log('Crises by Priority Response:', res);
        
        if (Array.isArray(res) && res.length > 0) {
          this.crisesByPriority = res[0];
        } else if (res?.data) {
          this.crisesByPriority = Array.isArray(res.data) ? res.data[0] : res.data;
        } else {
          this.crisesByPriority = res;
        }
        
        // Create chart after data is loaded
        setTimeout(() => this.createPriorityChart(), 100);
      },
      error: (err: any) => {
        console.error('Error loading crises by priority:', err);
        this.crisesByPriority = null;
        // Create chart with empty data
        setTimeout(() => this.createPriorityChart(), 100);
      }
    });
  }
  
  createVolunteersChart(): void {
    const ctx = document.getElementById('volunteersChart') as HTMLCanvasElement;
    if (!ctx) {
      console.warn('volunteersChart canvas not found');
      return;
    }
    
    // Destroy existing chart if it exists
    if (this.volunteersChart) {
      this.volunteersChart.destroy();
    }
    
    // Prepare chart data
    const labels = this.volunteersByDomain.map(v => v.domainTitle || 'Unknown');
    const data = this.volunteersByDomain.map(v => Number(v.volunteer) || 0);
    
    // If no data, show placeholder
    const hasData = data.some(value => value > 0);
    
    this.volunteersChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: hasData ? labels : ['No Data'],
        datasets: [{
          label: 'Volunteers',
          data: hasData ? data : [0],
          backgroundColor: '#FF2056',
          borderRadius: 8,
          barThickness: 30
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1e293b',
            padding: 12,
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#FF2056',
            borderWidth: 1
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              font: {
                size: 12
              },
              color: '#64748b'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 11
              },
              color: '#64748b',
              maxRotation: 45,
              minRotation: 0
            }
          }
        }
      }
    });
  }
  
  createPriorityChart(): void {
    const ctx = document.getElementById('priorityChart') as HTMLCanvasElement;
    if (!ctx) {
      console.warn('priorityChart canvas not found');
      return;
    }
    
    // Destroy existing chart if it exists
    if (this.priorityChart) {
      this.priorityChart.destroy();
    }
    
    // Parse percentages to numbers
    const lowPriority = this.crisesByPriority 
      ? parseFloat(this.crisesByPriority.lowPriorty?.replace('%', '') || '0')
      : 0;
    const mediumPriority = this.crisesByPriority 
      ? parseFloat(this.crisesByPriority.mediumPriorty?.replace('%', '') || '0')
      : 0;
    const criticalPriority = this.crisesByPriority 
      ? parseFloat(this.crisesByPriority.criticalPriorty?.replace('%', '') || '0')
      : 0;
    
    this.priorityChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Low Priority', 'Medium Priority', 'Critical Priority'],
        datasets: [{
          data: [lowPriority, mediumPriority, criticalPriority],
          backgroundColor: ['#FFA726', '#42A5F5', '#FF2056'],
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 13,
                family: "'Inter', sans-serif"
              },
              color: '#1e293b',
          generateLabels: (chart) => {
  const data = chart.data;
  if (data.labels && data.datasets.length) {
    return data.labels.map((label, i) => {
      const value = data.datasets[0].data[i];
      return {
        text: `${label}: ${value}%`,
        fillStyle: (data.datasets[0].backgroundColor as string[])?.[i] || '#42A5F5',
        hidden: false,
        index: i
      };
    });
  }
  return [];
}
            }
          },
          tooltip: {
            backgroundColor: '#1e293b',
            padding: 12,
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#FF2056',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
        }
      }
    });
  }
  
  // Modal Methods
  openVolunteersModal(): void {
    const modal = document.getElementById('volunteersModal');
    if (modal) {
      new bootstrap.Modal(modal).show();
    }
  }
  
  openIncidentsModal(): void {
    const modal = document.getElementById('incidentsModal');
    if (modal) {
      new bootstrap.Modal(modal).show();
    }
  }
  
  openActiveIncidentsModal(): void {
    const modal = document.getElementById('activeIncidentsModal');
    if (modal) {
      new bootstrap.Modal(modal).show();
    }
  }
  
  openActiveVolunteersModal(): void {
    const modal = document.getElementById('activeVolunteersModal');
    if (modal) {
      new bootstrap.Modal(modal).show();
    }
  }
  
  closeModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      bootstrap.Modal.getInstance(modal)?.hide();
    }
  }
  
  viewProfile(userId: number): void {
    console.log('View profile:', userId);
    // Navigate to profile or open profile modal
  }
  
  viewIncident(incidentId: number): void {
    console.log('View incident:', incidentId);
    // Navigate to incident details
  }


  
  
  ngOnDestroy(): void {
    // Cleanup charts
    if (this.volunteersChart) {
      this.volunteersChart.destroy();
    }
    if (this.priorityChart) {
      this.priorityChart.destroy();
    }
  }

  
}