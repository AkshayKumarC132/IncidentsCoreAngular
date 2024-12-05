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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faDashboard,
  faUsers,
  faLaptop,
  faExclamationTriangle,
  faPlug,
  faUser,
  faUsersCog,
  faSignOutAlt,
  faMoon,
  faSun,
  faClipboardList,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

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
    FontAwesomeModule,
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
  faDashboard = faDashboard;
  faCustomers = faUsers;
  faDevices = faLaptop;
  faIncidents = faExclamationTriangle;
  faIntegrations = faPlug;
  faProfile = faUser;
  faTeam = faUsersCog;
  faLogout = faSignOutAlt;
  faDarkMode = faMoon;
  faLightMode = faSun;
  faLogs = faClipboardList;
  isAdmin = false;
  logoShape: string = 'rectangle'; // Default shape
  logoPosition: string = 'top-left'; // Default position
  userRole: any;

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
    try {
      // Check for the access token in local storage
      const accessToken = localStorage.getItem('authToken');

      // If the access token exists, call the getUserPreferences method
      if (accessToken) {
        this.getUserPreferences();
        if (localStorage.getItem('isAdmin') === 'true') {
          this.isAdmin = true;
        }
      }
    } catch (e) {
      // Handle error if localStorage is not available
    }
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
        this.userRole = preferences.role;
        if (preferences.logo_url) {
          console.log(this.logoUrl);
          this.logoUrl = `${this.backendService.getApiUrl()}${
            preferences.logo_url
          }`;
        }
        console.log(this.logoUrl);
        this.menuPosition = preferences.menu_position || 'top';
        this.navservice.menuOption = preferences.menu_position || 'top';
        this.logoShape = preferences.logo_shape || 'rectangle';
        this.logoPosition = preferences.logo_position || 'top-left';
        this.setNavbarPosition(preferences.menu_position);
        this.navservice.setTheme(preferences.theme);

        // Apply theme
        document.body.classList.toggle(
          'dark-mode',
          preferences.theme === 'dark'
        );

        document.documentElement.style.setProperty(
          '--background-color',
          preferences.background_color
        );
        document.documentElement.style.setProperty(
          '--shadow-color',
          preferences.shadow_color
        );
        document.documentElement.style.setProperty(
          '--font-style',
          preferences.font_style
        );
        document.documentElement.style.setProperty(
          '--font-size',
          `${preferences.font_size}px`
        );
        document.documentElement.style.setProperty(
          '--font-color',
          preferences.font_color
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

        // Adjust logo shape dynamically
        const logoElement = document.querySelector(
          '.company-logo'
        ) as HTMLElement;
        if (logoElement) {
          logoElement.style.borderRadius =
            this.logoShape === 'circle' ? '50%' : '0';
        }

        // Adjust logo position dynamically
        if (this.logoPosition && logoElement) {
          // Reset any previous logo position classes
          logoElement.classList.remove(
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right'
          );

          // Add the appropriate class based on logoPosition
          logoElement.classList.add(this.logoPosition); // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
        }
        this.applyLayoutClass();
        // }
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
  goToHumanAgentDashboard() {
    this.router.navigate(['/human-agent-dashboard']);
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

  goToGlDashboard() {
    this.router.navigate(['/gl-dashboard']);
  }

  shouldDisplayNavItems(): boolean {
    const currentRoute = this.router.url;
    return (
      !currentRoute.includes('/login') && !currentRoute.includes('/register')
    );
  }

  onLogout(): void {
    Swal.fire({
      title: 'Are you sure you want to logout?',
      // text: 'You will need to log in again to access your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        htmlContainer: 'swal-custom-html', // Use htmlContainer instead of content
        confirmButton: 'swal-custom-button',
        cancelButton: 'swal-custom-button',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.backendService.logout().subscribe(
          (response) => {
            console.log('Logout successful', response);

            // Clear the token from local storage
            localStorage.removeItem('authToken');
            localStorage.clear();

            // Reset theme and layout preferences
            this.resetUserPreferences();

            // Redirect to the login page
            this.router.navigate(['/login']);

            Swal.fire({
              title: 'Logged out!',
              text: 'You have been logged out successfully.',
              icon: 'success',
              customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                confirmButton: 'swal-custom-button',
              },
            });
          },
          (error) => {
            console.error('Logout failed', error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to logout. Please try again.',
              icon: 'error',
              customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                confirmButton: 'swal-custom-button',
              },
            });
          }
        );
      }
    });
  }

  resetUserPreferences() {
    // Remove CSS variables
    document.documentElement.style.removeProperty('--background-color');
    document.documentElement.style.removeProperty('--shadow-color');
    // Remove theme classes
    document.body.classList.remove('dark-mode');
    document.body.classList.remove('compact-layout');
    document.body.classList.remove('spacious-layout');

    // Reset font-related styles
    document.documentElement.style.removeProperty('--font-style');
    document.documentElement.style.removeProperty('--font-size');
    document.documentElement.style.removeProperty('--font-color');
  }

  // Method to navigate to Team component
  goToTeam(): void {
    this.router.navigate(['/team']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToLogView(): void {
    this.router.navigate(['/log-view']);
  }
}
