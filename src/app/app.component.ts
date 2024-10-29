import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Incident';
  ngOnInit(): void {
    this.applyUserPreferences();
  }

  applyUserPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');

    // Apply theme
    if (preferences.theme) {
      document.body.classList.toggle('dark-mode', preferences.theme === 'dark');
    }

    // Set neumorphism colors as CSS variables
    if (preferences.backgroundColor) {
      document.documentElement.style.setProperty('--background-color', preferences.backgroundColor);
    }
    if (preferences.shadowColor) {
      document.documentElement.style.setProperty('--shadow-color', preferences.shadowColor);
    }
  }
}
