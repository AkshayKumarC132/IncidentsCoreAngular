import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service'; // Import your service
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NavbarComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [BackendService],
})
export class RegisterComponent {

  registerData = {
    username: '',
    email: '',
    password: '',
    name: '',
    role: 'msp_user' // Default role
  };

  errorMessage: string = '';

  constructor(private backendService: BackendService,private router: Router){

  }
  onSubmit() {
    this.backendService.register(this.registerData).subscribe(
      (response) => {
        console.log('Registration successful', response);
        // Redirect to the login page after successful registration
        this.router.navigate(['/login']);
      },
      (error) => {
        this.errorMessage = error.error.error;
        console.error('Registration failed', error);
      }
    );
  }

  goToLoginPage(){
    this.router.navigate(['/login'])
  }
}
