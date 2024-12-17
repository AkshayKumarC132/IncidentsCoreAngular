import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlay, faEye, faPause, faVideoCamera } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '../navbar/navbar.component';
import { NavbarService } from '../../services/navbar.service';
import { tick } from '@angular/core/testing';
import { response } from 'express';
import { FormsModule } from '@angular/forms'; // Add this line
import Swal from 'sweetalert2';
@Component({
  selector: 'app-human-agent.component',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FontAwesomeModule,
    NavbarComponent,
    FormsModule,
  ],
  templateUrl: './human-agent.component.component.html',
  styleUrl: './human-agent.component.component.css',
  providers: [BackendService],
})
export class HumanAgentComponentComponent implements OnInit {
  isRecording: boolean = false;
  menuOption: any = 'top';
  // ticketId: string = '123'; // Example ticket ID, can be dynamically set
  tickets: any;
  faPlay = faPlay;
  faPause = faPause;
  faVideoCamera = faVideoCamera;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private uploadInterval: any;
  private mediaStream: any;
  recordStatus = false;
  // Add these new properties
  activeRecordingTicketId: string | null = null;
  finalizingTickets: Set<string> = new Set();
  activeFinalizingTicketId: string | null = null; // Track active finalizing ticket

  classificationOptions: string[] = [
    'software',
    'network',
    'hardware',
    'security',
    'human',
  ];
  selectedIncidentId: number | null = null;
  postResolutionClassification = '';
  postResolutionDescription = '';

  // private readonly uploadUrl = 'http://127.0.0.1:5000/api/upload_recording_chunk/';
  sortBy: string = 'id';  // Default sort field
  sortOrder: string = 'asc';  // Default sort order
  apiUrl: string;

  constructor(
    private backendService: BackendService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private navservice: NavbarService
  ) {
    this.navservice.navbarPosition$.subscribe((position) => {
      this.menuOption = position;
      console.log('Dashbaord ', this.menuOption);
    });
    this.apiUrl = this.backendService.getApiUrl();
  }

  ngOnInit(): void {
    this.fetchAssignedTickets();
  }

  startRecording(ticketId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getDisplayMedia({ video: true, audio: true })
        .then((stream) => {
          this.activeRecordingTicketId = ticketId; // Set active recording ticket
          this.mediaStream = stream;
          this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm',
          });

          // On data available, push chunks into the array
          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.recordedChunks.push(event.data);
            }
          };

          // Start upload chunks in intervals
          this.mediaRecorder.onstart = () => {
            this.startUploadingChunks(ticketId);
            console.log('Recording started.');
            const ticket = this.tickets.find(
              (t: { id: string }) => t.id === ticketId
            );
            if (ticket) {
              ticket.is_recording = true;
              this.recordStatus = true;
              this.cdr.detectChanges(); // Trigger change detection manually
            }
          };

          this.mediaRecorder.onstop = () => {
            console.log('Recording stopped.');
            this.stopUploadingChunks(ticketId); // Upload any remaining chunks
            if (this.mediaStream) {
              this.mediaStream
                .getTracks()
                .forEach((track: { stop: () => any }) => track.stop());
            }
          };

          this.mediaRecorder.start(1000); // Send data every second
          resolve();
        })
        .catch((error) => {
          console.error('Error starting recording:', error);
          reject(error);
        });
    });
  }
  stopRecording(id: any): void {
    this.activeRecordingTicketId = null; // Clear active recording ticket
    // this.backendService.stopRecording(id);
    this.isRecording = false;
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
      const ticket = this.tickets.find((t: { id: any }) => t.id === id);
      if (ticket) {
        ticket.is_recording = false;
        this.recordStatus = false;
        this.cdr.detectChanges();
        // this.finalizeRecording(id);
      }
    }
  }

  fetchAssignedTickets(sortBy: string = this.sortBy, sortOrder: string = this.sortOrder): void {
    const params = {
      sort_by: sortBy,
      order: sortOrder
    };

    this.backendService.getAssignedTickets(params).subscribe({
      next: (data) => {
        this.tickets = data;
        this.sortBy = sortBy;      // Update current sort field
        this.sortOrder = sortOrder; // Update current sort order
        console.log(this.tickets);
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch tickets',
          width: '400px',
          customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            htmlContainer: 'swal-custom-html',
            confirmButton: 'swal-custom-button',
          },
        });
      },
    });
  }

  private startUploadingChunks(ticketId: string): void {
    this.uploadInterval = setInterval(() => {
      if (this.recordedChunks.length > 0) {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        this.uploadChunk(blob, ticketId);
        this.recordedChunks = []; // Clear chunks after upload
      }
    }, 30000); // Upload every 30 seconds
  }

  private stopUploadingChunks(ticketId: string): void {
    clearInterval(this.uploadInterval);

    if (this.recordedChunks.length > 0) {
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      this.uploadChunk(blob, ticketId);
      this.recordedChunks = [];
    }
  }

  private uploadChunk(chunk: Blob, ticketId: string): void {
    const formData = new FormData();
    formData.append('file', chunk);
    formData.append('ticket_id', ticketId);
    // for (const [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }
    // this.http.post(this.uploadUrl, formData).subscribe({
    //   next: (response) => console.log('Chunk uploaded successfully:', response),
    //   error: (error) => console.error('Error uploading chunk:', error),
    // });
    this.backendService.uploadChunk(chunk, ticketId).subscribe({
      next: (response) => console.log('Chunk uploaded successfully:', response),
      error: (error) => console.error('Error uploading chunk:', error),
    });
  }

  finalizeRecording(ticketId: string): void {
    this.activeFinalizingTicketId = ticketId; // Set active finalizing ticket
    const formData = new FormData();
    formData.append('ticket_id', ticketId);

    // Find the ticket and update its state
    const ticket = this.tickets.find((t: { id: string }) => t.id === ticketId);
    if (ticket) {
      ticket.isFinalizingInProgress = true;
    }

    this.backendService.finalizeRecording(formData).subscribe({
      next: (response) => {
        console.log('Recording finalized:', response);
        if (ticket) {
          ticket.isFinalizingInProgress = false;
        }
        this.activeFinalizingTicketId = null;

        // Display Swal popup on success
        Swal.fire({
          icon: 'success',
          title: 'Recording Finalized',
          text: 'The recording has been successfully finalized.',
          width: '400px',
          customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            htmlContainer: 'swal-custom-html',
            confirmButton: 'swal-custom-button',
          },
        });
      },
      error: (error) => {
        console.error('Error finalizing recording:', error.error.error);
        alert(error.error.error);
        if (ticket) {
          ticket.isFinalizingInProgress = false;
        }
        this.activeFinalizingTicketId = null;
      },
    });
  }

  extractTextFromFinalizedVideo(ticketId: string): void {
    this.backendService.extractTextFromVideo(ticketId).subscribe({
      next: (response) => {
        console.log('Success', response);
        // alert('Extracted Text fron Video');
      },
      error: (error) => {
        console.error('Error :', error.error);
        alert(error.error);
      },
    });
  }

  submitPostResolution(
    incidentId: number,
    classification: string,
    description: string
  ): void {
    if (!classification) {
      alert('Please select a classification agent for the incident.');
      return;
    }

    const payload = {
      classification: classification,
      description: description,
    };

    this.backendService.updatePostResolution(incidentId, payload).subscribe({
      next: (response) => {
        // alert(`Incident ${incidentId} updated successfully.`);
        Swal.fire({
          icon: 'success',
          text: response.message,
          width: '400px',
          customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            htmlContainer: 'swal-custom-html', // Use htmlContainer instead of content
            confirmButton: 'swal-custom-button',
            cancelButton: 'swal-custom-button',
          },
        });
        this.fetchAssignedTickets(); // Refresh ticket list after update
      },
      error: (err) => {
        console.error('Error updating incident:', err);
        alert('Failed to update incident.');
      },
    });
  }
}
