import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlay, faEye, faPause } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '../navbar/navbar.component';
import { NavbarService } from '../../services/navbar.service';
@Component({
  selector: 'app-human-agent.component',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FontAwesomeModule, NavbarComponent],
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
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private uploadInterval: any;
  private mediaStream: any;
  recordStatus = false;
  // private readonly uploadUrl = 'http://127.0.0.1:5000/api/upload_recording_chunk/';
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
  }

  ngOnInit(): void {
    this.fetchAssignedTickets();
  }

  startRecording(ticketId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getDisplayMedia({ video: true, audio: true })
        .then((stream) => {
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
    this.backendService.stopRecording(id);
    this.isRecording = false;
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
      const ticket = this.tickets.find((t: { id: any }) => t.id === id);
      if (ticket) {
        ticket.is_recording = false;
        this.recordStatus = false;
        this.cdr.detectChanges();
      }
    }
  }

  fetchAssignedTickets(): void {
    this.backendService.getAssignedTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        console.log(this.tickets);
      },
      error: (error) => {
        console.log(error);
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
}
