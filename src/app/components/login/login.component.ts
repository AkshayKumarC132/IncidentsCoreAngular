import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service'; // Import your service
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NavbarComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [BackendService],
})
export class LoginComponent {

  loginData = {
    username: '',
    password: ''
  };

  errorMessage: string = '';

  constructor (private backendService: BackendService, private route:Router){

  }

  onSubmit() {
    this.backendService.login(this.loginData).subscribe(
      (response) => {
        console.log('Login successful', response);
        // Store the token in local storage or a service for later use
        localStorage.setItem('authToken', response.token); // Store the token
        
        // Redirect to the dashboard or any other page on success
        this.route.navigate(['/dashboard']); // Adjust the URL as needed
      },
      (error) => {
        // Handle backend error response appropriately
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message; // Use the appropriate error message from the response
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.'; // Fallback error message
        }
        console.error('Login failed', error);
      }
    );
  }

  goToRegisterPage(){
    this.route.navigate(['/register'])
  }

}
