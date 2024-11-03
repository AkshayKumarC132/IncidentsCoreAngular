import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { NavbarService } from '../../services/navbar.service';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  PieController,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-log-view',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    NavbarComponent,
    BaseChartDirective,
  ],
  templateUrl: './log-view.component.html',
  styleUrl: './log-view.component.css',
  providers: [BackendService],
})
export class LogViewComponent {
  logs: any[] = [];
  totalIncidents = 0;
  averageResolutionTime = 0;
  humanInterventionIncidents = 0;
  severityData: any[] = [];
  severityLabels: string[] = [];
  menuOption: any = 'top';

  constructor(
    private backendService: BackendService,
    private navservice: NavbarService
  ) {
    this.navservice.navbarPosition$.subscribe((position) => {
      this.menuOption = position;
      console.log('Dashbaord ', this.menuOption);
    });
  }

  ngOnInit(): void {
    // Programmatically set chart canvas size
    const pieChartCanvas = document.querySelector(
      'canvas.pie-chart'
    ) as HTMLCanvasElement;

    if (pieChartCanvas) {
      pieChartCanvas.width = 600;
      pieChartCanvas.height = 400;
    }

    // Register the required components
    Chart.register(
      ArcElement,
      Tooltip,
      Legend,
      CategoryScale,
      LinearScale,
      BarController,
      BarElement,
      PieController
    );
    this.loadLogs();
  }

  loadLogs() {
    this.backendService.getIncidentLogs().subscribe(
      (data) => {
        this.logs = data.logs;
        this.totalIncidents = data.summary.total_incidents;
        this.humanInterventionIncidents =
          data.summary.human_intervention_incidents;
        this.averageResolutionTime = data.summary.average_resolution_time;

        // Prepare severity chart data
        this.severityLabels = Object.keys(data.summary.severity_distribution);
        this.severityData = [
          {
            data: Object.values(data.summary.severity_distribution).map((val) =>
              Number(val)
            ),
            label: 'Incidents by Severity',
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)', // Critical
              'rgba(255, 206, 86, 0.2)', // High
              'rgba(75, 192, 192, 0.2)', // Medium
              'rgba(54, 162, 235, 0.2)', // Low
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)', // Critical
              'rgba(255, 206, 86, 1)', // High
              'rgba(75, 192, 192, 1)', // Medium
              'rgba(54, 162, 235, 1)', // Low
            ],
            borderWidth: 1,
          },
        ];
      },
      (error) => {
        console.error('Error fetching incident logs:', error);
      }
    );
  }
}
