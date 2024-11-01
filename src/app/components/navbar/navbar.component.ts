import { Component, OnInit } from '@angular/core';
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
import { BackendService } from '../../services/backend.service';
import { NavbarService } from '../../services/navbar.service';

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
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  darkMode = false;
  logoUrl: string =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSU4XJGamDxhlvThNq1qYu0npxuH0GsUq1wQ&s'; // Store logo URL
  menuPosition: string = 'top';
  currentTheme: string = 'light';

  constructor(
    private router: Router,
    private backendService: BackendService,
    private navservice: NavbarService
  ) {
    this.navservice.theme$.subscribe((theme) => {
      this.currentTheme = theme;
      console.log(this.currentTheme, '----Selected Theme');
      // You can also perform any additional logic based on the current theme here
    });
    this.navservice.navbarPosition$.subscribe((position) => {
      this.menuPosition = position;
      console.log('Dashbaord ', this.menuPosition);
    });
  }

  ngOnInit(): void {
    this.getUserPreferences();
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }

  setNavbarPosition(position: 'top' | 'left') {
    this.navservice.setNavbarPosition(position);
  }

  // this.logoUrl = `${this.backendService.getApiUrl()}${preferences.logo_url}`;

  getUserPreferences() {
    this.backendService.getUserPreferences().subscribe(
      (preferences) => {
        if (preferences.logo_url) {
          console.log(this.logoUrl);
          this.logoUrl = `${this.backendService.getApiUrl()}${
            preferences.logo_url
          }`;
          console.log(this.logoUrl);
          this.menuPosition = preferences.menu_position || 'top';
          this.navservice.menuOption = preferences.menu_position || 'top';
          this.setNavbarPosition(preferences.menu_position);
          this.navservice.setTheme(preferences.theme);

          // Apply theme
          document.body.classList.toggle(
            'dark-mode',
            preferences.theme === 'dark'
          );

          // Set CSS variables for background and shadow colors
          document.documentElement.style.setProperty(
            '--background-color',
            preferences.background_color
          );
          document.documentElement.style.setProperty(
            '--shadow-color',
            preferences.shadow_color
          );

          // Adjust layout if needed (for compact or spacious layouts)
          document.body.classList.toggle(
            'compact-layout',
            preferences.layout === 'compact'
          );
          document.body.classList.toggle(
            'spacious-layout',
            preferences.layout === 'spacious'
          );
          this.applyLayoutClass();
        }
        // Set other preferences if needed
      },
      (error) => {
        console.error('Error fetching user preferences', error);
      }
    );
  }

  applyLayoutClass() {
    document.body.classList.remove('left-menu-active', 'top-menu-active');
    if (this.menuPosition === 'left') {
      document.body.classList.add('left-menu-active');
    } else {
      document.body.classList.add('top-menu-active');
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  goToCustomer() {
    this.router.navigate(['/customers']);
  }
  goToDevices() {
    this.router.navigate(['/devices']);
  }
  goToIncidents() {
    this.router.navigate(['/incidents']);
  }
  goToIntegrations() {
    this.router.navigate(['/integrations']);
  }

  shouldDisplayNavItems(): boolean {
    const currentRoute = this.router.url;
    return (
      !currentRoute.includes('/login') && !currentRoute.includes('/register')
    );
  }

  onLogout() {
    this.backendService.logout().subscribe(
      (response) => {
        console.log('Logout successful', response);
        // Clear the token from local storage
        localStorage.removeItem('authToken');

        // Reset theme and layout preferences
        this.resetUserPreferences();
        // Redirect to the login page
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Logout failed', error);
      }
    );
  }

  resetUserPreferences() {
    // Remove CSS variables
    document.documentElement.style.removeProperty('--background-color');
    document.documentElement.style.removeProperty('--shadow-color');
    // Remove theme classes
    document.body.classList.remove('dark-mode');
    document.body.classList.remove('compact-layout');
    document.body.classList.remove('spacious-layout');
  }

  // Method to navigate to Team component
  goToTeam(): void {
    this.router.navigate(['/team']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
