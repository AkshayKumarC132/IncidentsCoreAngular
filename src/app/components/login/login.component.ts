import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service'; // Import your service
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { NavbarService } from '../../services/navbar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [BackendService],
})
export class LoginComponent {
  loginData = {
    username: '',
    password: '',
  };

  errorMessage: string = '';
  menuOption: any = 'top';

  constructor(
    private backendService: BackendService,
    private route: Router,
    private navservice: NavbarService
  ) {
    this.navservice.navbarPosition$.subscribe((position) => {
      this.menuOption = position;
      console.log('Dashbaord ', this.menuOption);
    });
  }

  onSubmit() {
    this.backendService.login(this.loginData).subscribe(
      (response) => {
        console.log('Login successful', response);
        const userRole = response.data[0].role;

        if (userRole === 'human_agent') {
          this.navservice.setIsAdmin(false);
          localStorage.setItem('isAdmin', 'false');
          localStorage.setItem('role', userRole);
          this.route.navigate(['/human-agent-dashboard']); // Redirect for human agent role
        } else if (userRole === 'gl') {
          this.navservice.setIsAdmin(true);
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('role', userRole);
          this.route.navigate(['/gl-dashboard']); // Redirect for gl role
        } else {
          this.navservice.setIsAdmin(true);
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('role', userRole);
          this.route.navigate(['/dashboard']); // Redirect for any other role
        }
        // Store the token in local storage or a service for later use
        localStorage.setItem('authToken', response.token); // Store the token

        // Redirect to the dashboard or any other page on success
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

  goToRegisterPage() {
    this.route.navigate(['/register']);
  }
}
