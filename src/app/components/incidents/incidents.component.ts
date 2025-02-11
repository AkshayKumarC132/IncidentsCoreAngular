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

  pagentFilter: string = '';
  sortBy: string = 'id';
  order: string = 'desc';
  jiraTicket: boolean | null = null; // Holds the boolean filter for jira_ticket (null for no filter)
  availableAgents: string[] = [
    'network',
    'security',
    'hardware',
    'software',
    'human',
  ];

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
    // this.backendService.getIncidents().subscribe({
    //   next: (responce: any) => {
    //     console.log(responce);
    //     this.incidentsData = responce;
    //   },
    //   error: (error) => {
    //     console.log(error);
    //   },
    // });
    // // Fetch devices and severities
    // this.backendService.getDevices().subscribe((devices) => {
    //   this.devices = devices;
    // });
    this.fetchIncidents();

    this.backendService.getSeverities().subscribe((severities) => {
      this.severities = severities;
    });
  }

  fetchIncidents(): void {
    this.backendService
      .getIncidents(this.pagentFilter, this.sortBy, this.order, this.jiraTicket)
      .subscribe({
        next: (data: any[]) => {
          // Explicitly type the response as an array
          this.incidentsData = data;
          console.log(data);
        },
        error: (error) => {
          console.error('Failed to fetch incidents', error);
        },
      });
  }

  onFilterChange(): void {
    this.fetchIncidents();
  }

  applyFilter(): void {
    this.fetchIncidents();
  }

  toggleOrder(): void {
    this.order = this.order === 'asc' ? 'desc' : 'asc';
    this.fetchIncidents();
  }

  callOrchestrationLayer(id: any) {
    Swal.fire({
      title: 'Enter Valid Email IDs',
      input: 'textarea',
      inputPlaceholder: 'Enter email IDs, separated by commas...',
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter at least one email ID!';
        }
        const emails = value.split(',').map(email => email.trim());
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const invalidEmails = emails.filter(email => !emailRegex.test(email));
  
        if (invalidEmails.length > 0) {
          return `Invalid email(s): ${invalidEmails.join(', ')}`;
        }
        return null;
      },
      showCancelButton: true,
      confirmButtonText: 'Submit',
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const emailList = result.value.split(',').map((email: string) => email.trim());
  
        this.backendService.runOrchestratioLayer(id, emailList).subscribe({
          next: (response: any) => {
            console.log(response);
            if (response) {
              Swal.fire({
                icon: 'success',
                text: response.message,
                width: '400px',
                customClass: {
                  popup: 'swal-custom-popup',
                  title: 'swal-custom-title',
                  htmlContainer: 'swal-custom-html',
                  confirmButton: 'swal-custom-button',
                  cancelButton: 'swal-custom-button',
                },
              });
            }
          },
          error: (error) => {
            console.log(error);
            Swal.fire({
              icon: 'error',
              text: 'Failed to process the request.',
            });
          },
        });
      }
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
              customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                htmlContainer: 'swal-custom-html', // Use htmlContainer instead of content
                confirmButton: 'swal-custom-button',
                cancelButton: 'swal-custom-button',
              },
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
