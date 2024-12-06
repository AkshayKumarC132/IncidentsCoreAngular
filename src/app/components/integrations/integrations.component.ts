import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { BackendService } from '../../services/backend.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.css'],
  providers: [BackendService],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    NavbarComponent,
    HttpClientModule,
  ],
})
export class IntegrationsComponent {
  // Form states
  integrationType: string = 'ConnectWise'; // Default to ConnectWise
  connectWiseForm = {
    company_id: '',
    public_key: '',
    private_key: '',
    client_id: '',
    instance_url: '',
  };
  haloPSAForm = {
    instance_url: '',
    client_id: '',
    client_secret: '',
  };
  jiraForm = {
    api_base_url: '',
    user_email: '',
    api_token: '',
    project_key: '',
    project_name: '',
  };

  isDarkMode: boolean = false;

  // Message and success state
  message: string = '';
  success: boolean = false;
  submitted: boolean = false; // Track if the form has been submitted

  constructor(private backendService: BackendService, private router: Router) {}

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }
  get isFormValid(): boolean {
    if (this.integrationType === 'ConnectWise') {
      return Object.values(this.connectWiseForm).every(
        (field) => field.trim() !== ''
      );
    } else if (this.integrationType === 'HaloPSA') {
      return Object.values(this.haloPSAForm).every(
        (field) => field.trim() !== ''
      );
    } else if (this.integrationType === 'Jira') {
      return Object.values(this.jiraForm).every((field) => field.trim() !== '');
    }
    return false;
  }

  // Function to submit the form
  submitIntegrationForm() {
    this.submitted = true; // Set submitted to true on form submission
    if (this.isFormValid) {
      if (this.integrationType === 'ConnectWise') {
        this.saveConnectWiseIntegration();
      } else if (this.integrationType === 'HaloPSA') {
        this.saveHaloPSAIntegration();
      } else if (this.integrationType === 'Jira') {
        this.saveJiraIntegration();
      }
    } else {
      this.message = 'Please fill all required fields.';
      this.success = false;
    }
  }

  // Function to save ConnectWise integration
  saveConnectWiseIntegration() {
    const payload = {
      company_id: this.connectWiseForm.company_id,
      public_key: this.connectWiseForm.public_key,
      private_key: this.connectWiseForm.private_key,
      client_id: this.connectWiseForm.client_id,
      instance_url: this.connectWiseForm.instance_url, // Ensure this is being set
    };
    console.log(payload);

    this.backendService.saveConnectWiseIntegration(payload).subscribe(
      (response: any) => {
        // this.message = response.message;
        // this.message = response.message;
        this.success = true;
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
        }).then(() => {
          // Redirect after Swal popup closes
          this.router.navigate(['/dashboard']);
        });
      },
      (error: any) => {
        this.message =
          error.error.message || 'Failed to save ConnectWise integration';
        this.success = false;
      }
    );
  }

  // Function to save HaloPSA integration
  saveHaloPSAIntegration() {
    const payload = {
      instance_url: this.haloPSAForm.instance_url,
      client_id: this.haloPSAForm.client_id,
      client_secret: this.haloPSAForm.client_secret,
    };

    this.backendService.saveHaloPSAIntegration(payload).subscribe(
      (response: any) => {
        // this.message = response.message;
        // this.message = response.message;
        this.success = true;
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
        }).then(() => {
          // Redirect after Swal popup closes
          this.router.navigate(['/dashboard']);
        });
      },
      (error: any) => {
        this.message =
          error.error.message || 'Failed to save HaloPSA integration';
        this.success = false;
      }
    );
  }

  // Function to save Jira integration
  saveJiraIntegration() {
    const payload = {
      jira_api_base_url: this.jiraForm.api_base_url,
      jira_user_email: this.jiraForm.user_email,
      jira_api_token: this.jiraForm.api_token,
      jira_project_key: this.jiraForm.project_key,
      jira_project_name: this.jiraForm.project_name,
    };

    this.backendService.saveJiraIntegration(payload).subscribe(
      (response: any) => {
        //
        this.success = true;
        this.fetchJiraIssues();
      },
      (error: any) => {
        this.message = error.error.message || 'Failed to save Jira integration';
        this.success = false;
      }
    );
  }

  fetchJiraIssues() {
    this.backendService.fetchJiraIssues().subscribe(
      (response: any) => {
        // this.message = response.message;
        // this.message = response.message;
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
        }).then(() => {
          // Redirect after Swal popup closes
          this.router.navigate(['/dashboard']);
        });
      },
      (error: any) => {
        this.message = 'Failed to fetch Jira issues';
        this.success = false;
      }
    );
  }
  // Function to fetch data
  fetchData() {
    this.backendService.fetchData().subscribe(
      (response: any) => {
        this.message = 'Data fetched successfully';
        this.success = true;
      },
      (error: any) => {
        this.message = 'Failed to fetch data';
        this.success = false;
      }
    );
  }
}
