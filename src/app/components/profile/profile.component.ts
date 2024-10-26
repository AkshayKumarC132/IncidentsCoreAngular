import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { BackendService } from '../../services/backend.service';
import { HttpClientModule } from '@angular/common/http';
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

  constructor(private fb: FormBuilder) {
    // Initialize the form with default values
    this.profileForm = this.fb.group({
      theme: ['light'],
      notifications: [true],
      layout: ['default'],
      backgroundColor: ['#e0e5ec'],  // Default background color for neumorphism
      shadowColor: ['#a3b1c6'],      // Default shadow color for neumorphism
    });
  }

  ngOnInit(): void {
    this.loadUserPreferences();
  }

  // Load preferences if previously saved
  loadUserPreferences() {
    const savedPreferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    if (savedPreferences) {
      this.profileForm.patchValue(savedPreferences);
    }
  }

  // Save preferences
  savePreferences() {
    const preferences = this.profileForm.value;
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    console.log('Preferences saved:', preferences);
    alert('Preferences saved!');
    // Apply the preferences immediately
    this.applyUserPreferences(preferences);
  }
  // Apply preferences dynamically
  applyUserPreferences(preferences: any) {
    // Apply theme
    document.body.classList.toggle('dark-mode', preferences.theme === 'dark');

    // Set CSS variables for background and shadow colors
    document.documentElement.style.setProperty('--background-color', preferences.backgroundColor);
    document.documentElement.style.setProperty('--shadow-color', preferences.shadowColor);

    // Adjust layout if needed (for compact or spacious layouts)
    document.body.classList.toggle('compact-layout', preferences.layout === 'compact');
    document.body.classList.toggle('spacious-layout', preferences.layout === 'spacious');
  }
}