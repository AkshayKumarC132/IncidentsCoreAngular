import { Component, ViewChild, ElementRef } from '@angular/core';
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
import { NavbarService } from '../../services/navbar.service';
import Swal from 'sweetalert2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // Import the FontAwesomeModule
import { faPlay, faEye } from '@fortawesome/free-solid-svg-icons'; // Import icons

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
    FontAwesomeModule,
  ],
  providers: [BackendService],
  templateUrl: './incidents.component.html',
  styleUrl: './incidents.component.css',
})
export class IncidentsComponent {
  incidents: Incident[] = [];
  newIncident: Incident = {
    id: 0,
    title: '',
    description: '',
    deviceId: 0,
    severity: '',
    status: '',
  };
  devices: any[] = []; // Adjust type based on your response
  severities: any[] = []; // Adjust type based on your response
  menuOption: any = 'top';
  faPlay = faPlay;
  faEye = faEye;

  incidentsData: any[] = [];
  logDetails: any[] = []; // To store the log details for the selected incident
  selectedIncidentId: number | null = null; // To keep track of which incident's logs are being viewed

  constructor(
    private backendService: BackendService,
    private navservice: NavbarService
  ) {
    this.navservice.navbarPosition$.subscribe((position) => {
      this.menuOption = position;
      console.log('Dashbaord ', this.menuOption);
    });
  }

  @ViewChild('logDetailsSection', { static: false })
  logDetailsSection!: ElementRef;

  ngOnInit(): void {
    this.backendService.getIncidents().subscribe({
      next: (responce: any) => {
        console.log(responce);
        this.incidentsData = responce;
      },
      error: (error) => {
        console.log(error);
      },
    });
    // Fetch devices and severities
    this.backendService.getDevices().subscribe((devices) => {
      this.devices = devices;
    });

    this.backendService.getSeverities().subscribe((severities) => {
      this.severities = severities;
    });
  }

  callOrchestrationLayer(id: any) {
    this.backendService.runOrchestratioLayer(id).subscribe({
      next: (responce: any) => {
        console.log(responce);
        if (responce) {
          Swal.fire({
            icon: 'success',
            text: responce.message,
            width: '400px',
          });
        }
        // this.incidentsData = responce;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  viewLogDetails(id: any) {
    this.selectedIncidentId = id; // Set the selected incident ID
    this.backendService.getIncidentLogsByID(id).subscribe({
      next: (responce: any) => {
        console.log(responce);
        if (responce) {
          this.logDetails = responce;
          if (this.logDetails.length === 0) {
            Swal.fire({
              title: 'No Logs Available',
              // text: 'Before viewing logs, please run the Orchestration Layer.',
              width: '400px',
              icon: 'info',
              confirmButtonText: 'OK',
            });
          } else {
            // Scroll to the log details section if logs are available
            setTimeout(() => {
              this.logDetailsSection.nativeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }, 0);
          }
        }
        // this.incidentsData = responce;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  addIncident(): void {
    this.backendService.addIncident(this.newIncident).subscribe((incident) => {
      this.incidents.push(incident);
      this.newIncident = {
        id: 0,
        title: '',
        description: '',
        deviceId: 0,
        severity: '',
        status: '',
      }; // Reset form
    });
  }

  deleteIncident(id: number): void {
    this.backendService.deleteIncident(id).subscribe(() => {
      this.incidents = this.incidents.filter((incident) => incident.id !== id);
    });
  }
}
