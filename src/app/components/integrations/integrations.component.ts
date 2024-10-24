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
@Component({
  standalone:true,
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
    HttpClientModule
  ]
})
export class IntegrationsComponent {
  // Form states
  integrationType: string = 'ConnectWise';  // Default to ConnectWise
  connectWiseForm = {
    company_id: '',
    public_key: '',
    private_key: '',
    client_id: '',
    instance_url: ''
  };
  haloPSAForm = {
    instance_url: '',
    client_id: '',
    client_secret: ''
  };

  // Message and success state
  message: string = '';
  success: boolean = false;

  constructor(private backendService: BackendService) {}

  // Function to submit the form
  submitIntegrationForm() {
    if (this.integrationType === 'ConnectWise') {
      this.saveConnectWiseIntegration();
    } else if (this.integrationType === 'HaloPSA') {
      this.saveHaloPSAIntegration();
    }
  }

  // Function to save ConnectWise integration
  saveConnectWiseIntegration() {
    const payload = {
      company_id: this.connectWiseForm.company_id,
      public_key: this.connectWiseForm.public_key,
      private_key: this.connectWiseForm.private_key,
      client_id: this.connectWiseForm.client_id,
      instance_url: this.connectWiseForm.instance_url  // Ensure this is being set
    };
    console.log(payload)

    this.backendService.saveConnectWiseIntegration(payload).subscribe(
      (response: any) => {
        this.message = response.message;
        this.success = true;
      },
      (error: any) => {
        this.message = error.error.message || 'Failed to save ConnectWise integration';
        this.success = false;
      }
    );
  }

  // Function to save HaloPSA integration
  saveHaloPSAIntegration() {
    const payload = {
      instance_url: this.haloPSAForm.instance_url,
      client_id: this.haloPSAForm.client_id,
      client_secret: this.haloPSAForm.client_secret
    };

    this.backendService.saveHaloPSAIntegration(payload).subscribe(
      (response: any) => {
        this.message = response.message;
        this.success = true;
      },
      (error: any) => {
        this.message = error.error.message || 'Failed to save HaloPSA integration';
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