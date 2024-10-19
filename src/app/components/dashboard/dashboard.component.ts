import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../navbar/navbar.component';

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

  // incidents = [
    // { id: 1, title: 'Server Down', description: 'Main server is down', status: 'Active', severity: 'High' },
    // { id: 2, title: 'Router Issue', description: 'Router configuration needed', status: 'Resolved', severity: 'Medium' }
    // // Add more incidents
  // ];
  constructor (private backendService:BackendService){
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
        console.error('Error fetching data from API', error);
      }
    );
  }

  toggleDarkMode() {
    // Swal.fire({
    //   title: 'Dark Mode toggled!',
    //   text: 'This is just a mock for dark mode toggle.',
    //   icon: 'info',
    //   confirmButtonText: 'Ok'
    // });
    document.body.classList.toggle('dark-mode');
  }


}
