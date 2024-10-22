import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,
    HttpClientModule,
    NavbarComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [BackendService],
})
export class DashboardComponent {
  totalCustomers: number = 0;
  totalDevices: number = 0;
  activeIncidents: number = 0;
  resolvedIncidents: number = 0;
  incidents: any[] = [];
  role: string = '';  // Track the user role
  isDarkMode : false | undefined

  constructor (private backendService:BackendService, private route:Router){
  }

  ngOnInit(): void {
    this.getApiData();
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
        this.role = response.role;  // Fetch and store the user role
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

  getSeverityLabel(severity_id: number): string {
    switch (severity_id) {
      case 4: return 'Critical';
      case 3: return 'High';
      case 2: return 'Medium';
      case 1: return 'Low';
      default: return 'Unknown';
    }
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }
}
