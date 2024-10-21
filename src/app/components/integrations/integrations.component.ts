import { Component } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
    // BrowserModule,
    // BrowserAnimationsModule,
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
  connectWiseApiKey = '';
  haloPsaApiKey = '';

  saveIntegration(serviceName: string, apiKey: string) {
    // Logic to save the API key for the specific service (e.g., ConnectWise, HaloPSA)
    // alert(${serviceName} API key saved: ${apiKey});
    alert("Saved Successful")
  }
}