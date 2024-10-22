import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select'; // Import MatSelectModule
import { HttpClientModule } from '@angular/common/http';
import { BackendService } from '../../services/backend.service';
import { Incident } from '../../models/incident.model';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    CommonModule,
    HttpClientModule,
    NavbarComponent,
  ],
  providers:[BackendService],
  templateUrl: './incidents.component.html',
  styleUrl: './incidents.component.css'
})
export class IncidentsComponent {
  incidents: Incident[] = [];
  newIncident: Incident = { id: 0, title: '', description: '', deviceId: 0, severity: '', status: '' };
  devices: any[] = []; // Adjust type based on your response
  severities: any[] = []; // Adjust type based on your response

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.backendService.getIncidents().subscribe((incidents) => {
      this.incidents = incidents;
    });
    // Fetch devices and severities
    this.backendService.getDevices().subscribe((devices) => {
      this.devices = devices;
    });

    this.backendService.getSeverities().subscribe((severities) => {
      this.severities = severities;
    });
  }

  addIncident(): void {
    this.backendService.addIncident(this.newIncident).subscribe((incident) => {
      this.incidents.push(incident);
      this.newIncident = { id: 0, title: '', description: '', deviceId: 0, severity: '', status: '' };  // Reset form
    });
  }

  deleteIncident(id: number): void {
    this.backendService.deleteIncident(id).subscribe(() => {
      this.incidents = this.incidents.filter(incident => incident.id !== id);
    });
  }
}
