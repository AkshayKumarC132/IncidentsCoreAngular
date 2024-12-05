import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
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
import { NavbarService } from '../../services/navbar.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    NavbarComponent,
    BaseChartDirective,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [BackendService],
})
export class DashboardComponent {
  totalCustomers: number = 0;
  totalDevices: number = 0;
  activeIncidents: number = 0;
  resolvedIncidents: number = 0;
  incidents: any[] = [];
  role: string = ''; // Track the user role
  isDarkMode: boolean = false;

  dashboardData: any = {};
  drillDownData: any[] = []; // Holds the data for the drill-down
  userRole: string = '';

  // Chart data for severity
  severityChartLabels: string[] = [];
  severityChartData: any[] = [];

  // Chart data for devices
  deviceChartLabels: string[] = [];
  deviceChartData: any[] = [];
  menuOption: any = 'top';

  constructor(
    private backendService: BackendService,
    private route: Router,
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
    const barChartCanvas = document.querySelector(
      'canvas.bar-chart'
    ) as HTMLCanvasElement;

    if (pieChartCanvas) {
      pieChartCanvas.width = 600;
      pieChartCanvas.height = 400;
    }

    if (barChartCanvas) {
      barChartCanvas.width = 800;
      barChartCanvas.height = 450;
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

    this.getApiData();
    this.fetchDashboardData();
  }

  // Fetch high-level dashboard data
  fetchDashboardData() {
    this.backendService.getDashboardSummary().subscribe(
      (data) => {
        console.log('Dashboard Data:', data);
        this.dashboardData = data;
        this.userRole = data.role;

        // Populate charts
        this.populateSeverityChart(data.severitySummary);
        this.populateDeviceChart(data.deviceSummary);
      },
      (error) => {
        console.error('Error fetching dashboard data', error);
      }
    );
  }

  // Populate the severity chart
  populateSeverityChart(severitySummary: any[]) {
    this.severityChartLabels = severitySummary.map(
      (item) => item.severity__level
    );

    this.severityChartData = [
      {
        data: severitySummary.map((item) => item.count),
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
  }

  // Populate the device chart
  populateDeviceChart(deviceSummary: any[]) {
    this.deviceChartLabels = deviceSummary.map((item) => item.device__name);
    this.deviceChartData = [
      {
        data: deviceSummary.map((item) => item.count),
        label: 'Incidents by Device',
        backgroundColor: [
          'rgba(153,102,255,0.2)',
          'rgba(255,159,64,0.2)',
          'rgba(255,99,132,0.2)',
        ],
        borderColor: [
          'rgba(153,102,255,1)',
          'rgba(255,159,64,1)',
          'rgba(255,99,132,1)',
        ],
        borderWidth: 1,
      },
    ];
  }

  // Handle chart click event
  onChartClick(event: any) {
    if (event.active.length > 0) {
      const chart = event.event.chart; // Access the chart
      const activePoint = chart.getElementAtEvent(event.event)[0];
      const label = chart.data.labels[activePoint._index]; // The clicked label (severity/device)
      const chartType = chart.config.type; // Get the chart type (pie or bar)

      console.log('Label clicked:', label); // Debugging log
      console.log('Chart type:', chartType); // Debugging log

      if (chartType === 'pie') {
        this.drillDownIncidentsBySeverity(label);
      } else if (chartType === 'bar') {
        this.drillDownIncidentsByDevice(label);
      }
    }
  }

  onNativeChartClick(chartType: string, event: MouseEvent) {
    const canvas = event.target as HTMLCanvasElement;
    const chart = Chart.getChart(canvas); // Get the chart instance

    if (chart) {
      const activePoints = chart.getElementsAtEventForMode(
        event,
        'nearest',
        { intersect: true },
        false
      );

      if (activePoints.length > 0) {
        const firstPoint = activePoints[0];

        // Ensure labels exist and are defined
        const labels = chart.data.labels;
        if (labels && labels.length > firstPoint.index) {
          const label = labels[firstPoint.index] as string; // Type assertion

          if (chartType === 'severity') {
            console.log('Clicked severity label:', label); // Debugging
            this.drillDownIncidentsBySeverity(label);
          } else if (chartType === 'device') {
            console.log('Clicked device label:', label); // Debugging
            this.drillDownIncidentsByDevice(label);
          }
        } else {
          console.error('Label not found for the clicked point.');
        }
      }
    }
  }

  // Drill down by severity
  drillDownIncidentsBySeverity(severity: string) {
    this.backendService.getIncidentsBySeverity(severity).subscribe(
      (data) => {
        this.drillDownData = data;
      },
      (error) => {
        console.error('Error fetching drill-down data by severity', error);
      }
    );
  }

  // Drill down by device
  drillDownIncidentsByDevice(device: string) {
    this.backendService.getIncidentsByDevice(device).subscribe(
      (data) => {
        this.drillDownData = data;
      },
      (error) => {
        console.error('Error fetching drill-down data by device', error);
      }
    );
  }

  // Fetch role-based data from the backend
  getApiData(): void {
    this.backendService.getIncidentData().subscribe(
      (response) => {
        this.totalCustomers = response.total_customers;
        this.totalDevices = response.total_devices;
        this.activeIncidents = response.active_incidents;
        this.resolvedIncidents = response.resolved_incidents;
        this.incidents = response.incident_data;
        this.role = response.role;
      },
      (error) => {
        if (error.status === 401) {
          this.route.navigate(['/login']);
        } else {
          console.error('Error fetching data from API', error);
        }
      }
    );
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }
}
