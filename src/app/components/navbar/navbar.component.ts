import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
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
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  darkMode = false
  constructor(private router:Router){

  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-theme', this.darkMode);
    console.log('Dark mode toggled:', this.darkMode);  // Add this line
  }
  
  
  goToDashboard(){
    this.router.navigate(['/dashboard']);
  }
  goToCustomer(){
    this.router.navigate(['/customers']);
  }
  goToDevices(){
    this.router.navigate(['/devices']);
  }
  goToIncidents(){
    this.router.navigate(['/incidents']);
  }
  goToIntegrations(){
    this.router.navigate(['/integrations']);
  }
}
