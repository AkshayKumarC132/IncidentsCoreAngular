import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { BackendService } from '../../services/backend.service';
import { HttpClientModule } from '@angular/common/http';
import { NavbarService } from '../../services/navbar.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports:[
    CommonModule, 
    ReactiveFormsModule,
    NavbarComponent,
    HttpClientModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  providers:[BackendService]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  menuOption: any = 'top';

  constructor(private fb: FormBuilder, private backendService:BackendService, private navservice: NavbarService) {
    // Initialize the form with default values

    this.navservice.navbarPosition$.subscribe(position => {
      this.menuOption = position;
      console.log("Dashbaord ", this.menuOption )
    });
    
    this.profileForm = this.fb.group({
      theme: ['light'],
      notifications: [true],
      layout: ['default'],
      background_color: ['#e0e5ec'],// Default background color for neumorphism
      shadow_color: ['#a3b1c6'], // Default shadow color for neumorphism
      menu_position: ['top'],// Default menu Options
      logo_url: [null]
    });
  }

  ngOnInit(): void {
    this.loadUserPreferences();
  }

  // Load preferences if previously saved
  loadUserPreferences() {
    this.backendService.getUserPreferences().subscribe(
      (preferences) => {
        this.profileForm.patchValue(preferences);
        console.log(this.profileForm)
      },
      (error) => console.error("Error loading preferences:", error)
    );
  }

  savePreferences() {
    const preferences = this.profileForm.value;
    if (this.profileForm.get('logo_url')?.value instanceof File) {
      preferences.logo_url = this.profileForm.get('logo_url')?.value;
    }

    this.backendService.saveUserPreferences(preferences).subscribe(
      (response) => {
        console.log(response)
        alert('Preferences saved successfully!');
        // Apply the preferences immediately
        this.applyUserPreferences(preferences);
      },
      (error) => console.error("Error saving preferences:", error)
    );
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    this.profileForm.patchValue({ logo_url: file });
  }
  // Apply preferences dynamically
  applyUserPreferences(preferences: any) {
    // Apply theme
    document.body.classList.toggle('dark-mode', preferences.theme === 'dark');

    // Set CSS variables for background and shadow colors
    document.documentElement.style.setProperty('--background-color', preferences.background_color);
    document.documentElement.style.setProperty('--shadow-color', preferences.shadow_color);

    // Adjust layout if needed (for compact or spacious layouts)
    document.body.classList.toggle('compact-layout', preferences.layout === 'compact');
    document.body.classList.toggle('spacious-layout', preferences.layout === 'spacious');
  }
}