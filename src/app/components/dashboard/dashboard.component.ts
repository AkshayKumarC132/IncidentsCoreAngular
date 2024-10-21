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
  isDarkMode : false | undefined

  constructor (private backendService:BackendService, private route:Router){
  }

  ngOnInit(): void {
    this.getApiData();
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
  
  // Function to get API data and assign it to a variable
  getApiData(): void {
    this.backendService.getIncidentData().subscribe(
      (response) => {
        // Assuming your API returns the following structure
        this.totalCustomers = response.total_customers;
        this.totalDevices = response.total_devices;
        this.activeIncidents = response.active_incidents;
        this.resolvedIncidents = response.resolved_incidents;
        this.incidents = response.incident_data;  // This will contain the array of incidents
      },
      (error) => {
        if (error.status === 401) {
          // Redirect to the login page if the user is not authenticated
          this.route.navigate(['/login']); // Adjust the route as necessary
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
