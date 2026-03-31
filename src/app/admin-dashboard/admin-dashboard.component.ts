import { Component ,OnInit} from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  
  constructor() { }
  
  ngOnInit(): void {
    this.createVolunteersChart();
    this.createPriorityChart();
  }
  
  createVolunteersChart(): void {
    const ctx = document.getElementById('volunteersChart') as HTMLCanvasElement;
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['MEDICAL', 'MEDICAL', 'MEDICAL', 'MEDICAL', 'MEDICAL', 'MEDICAL', 'ENGINEERING', 'HEALTHCARE', 'PHYSICAL', 'SWIMMERS', 'FIREFIGHTERS', 'HEALTHCARE'],
        datasets: [{
          label: 'Volunteers',
          data: [55, 50, 35, 20, 30, 35, 40, 45, 35, 30, 40, 58],
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
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
  
createPriorityChart(): void {
  const ctx = document.getElementById('priorityChart') as HTMLCanvasElement;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Low Priority', 'Medium Priority', 'Critical Priority'],
      datasets: [{
        data: [60, 25, 15],
        backgroundColor: ['#FFA726', '#42A5F5', '#FF2056'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,

      // ✅ MOVE HERE
      cutout: '70%',

      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 13
            }
          }
        }
      }
    }
  });
}
  
}
