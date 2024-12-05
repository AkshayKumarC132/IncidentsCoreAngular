import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { BackendService } from '../../services/backend.service';
import { HttpClientModule } from '@angular/common/http';
import { NavbarService } from '../../services/navbar.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    HttpClientModule,
    FormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  providers: [BackendService],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  menuOption: any = 'top';
  uploadedLogo: string | ArrayBuffer | null = null;
  preferences = {
    logo_shape: 'rectangle',
    logo_position: 'top-left',
  };
  logoStyles: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private backendService: BackendService,
    private navservice: NavbarService
  ) {
    // Initialize the form with default values

    this.navservice.navbarPosition$.subscribe((position) => {
      this.menuOption = position;
      console.log('Dashbaord ', this.menuOption);
    });

    this.profileForm = this.fb.group({
      theme: ['light'],
      notifications: [true],
      layout: ['default'],
      background_color: ['#e0e5ec'], // Default background color for neumorphism
      shadow_color: ['#a3b1c6'], // Default shadow color for neumorphism
      menu_position: ['top'], // Default menu options
      font_style: ['Arial'],
      font_size: [14],
      font_color: ['#000000'],
      logo_url: [null],
      logo_shape: ['rectangle'],
      logo_position: ['top-left'],
    });
  }

  ngOnInit(): void {
    this.loadUserPreferences();
    this.updateLogoStyle();
    this.profileForm.valueChanges.subscribe((preferences) => {
      this.applyUserPreferences(preferences);
    });
  }

  // Load preferences if previously saved
  loadUserPreferences() {
    this.backendService.getUserPreferences().subscribe(
      (preferences) => {
        this.profileForm.patchValue(preferences);
        console.log(this.profileForm);
      },
      (error) => console.error('Error loading preferences:', error)
    );
  }

  savePreferences() {
    const preferences = this.profileForm.value;
    if (this.profileForm.get('logo_url')?.value instanceof File) {
      preferences.logo_url = this.profileForm.get('logo_url')?.value;
    }
    console.log([preferences.logo_url]);
    this.backendService.saveUserPreferences(preferences).subscribe(
      (response) => {
        console.log('Preferences saved successfully:', response);
        this.navservice.setNavbarPosition(preferences.menu_position);
        this.navservice.setTheme(preferences.theme);
        this.applyUserPreferences(preferences);
        // alert('Preferences saved successfully!');
        Swal.fire({
          title: 'Preferences saved successfully!',
          icon: 'success',
          customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            confirmButton: 'swal-custom-button',
          },
        });
      },
      (error) => console.error('Error saving preferences:', error)
    );
  }

  resetToDefault(): void {
    this.profileForm.reset({
      theme: 'light',
      notifications: true,
      layout: 'default',
      background_color: '#e0e5ec',
      shadow_color: '#a3b1c6',
      menu_position: 'top',
      font_style: 'Arial',
      font_size: 14,
      font_color: '#000000',
      logo_url: null,
      logo_shape: 'rectangle',
      logo_position: 'top-left',
    });
    this.uploadedLogo = null;
    this.updateLogoStyle();
  }

  // onFileChange(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       if (e.target?.result !== undefined) {
  //         this.uploadedLogo = e.target.result;
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }
  onFileChange(event: any) {
    const file = event.target.files[0];
    this.profileForm.patchValue({ logo_url: file });
  }

  updateLogoStyle(): void {
    this.logoStyles = {
      'border-radius':
        this.profileForm.get('logo_shape')?.value === 'circle'
          ? '50%'
          : this.profileForm.get('logo_shape')?.value === 'square'
          ? '0%'
          : '4px', // Rectangle
    };
  }
  updateLogoPosition(): void {
    const position = this.profileForm.get('logo_position')?.value;
    this.logoStyles = {
      ...this.logoStyles,
      position: 'absolute',
      ...(position === 'top-left' && { top: '10px', left: '10px' }),
      ...(position === 'top-right' && { top: '10px', right: '10px' }),
      ...(position === 'center' && {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }),
    };
  }
  // Apply preferences dynamically
  applyUserPreferences(preferences: any) {
    console.log('Pref-----', preferences);
    document.body.classList.toggle('dark-mode', preferences.theme === 'dark');
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

    document.body.classList.toggle(
      'compact-layout',
      preferences.layout === 'compact'
    );
    document.body.classList.toggle(
      'spacious-layout',
      preferences.layout === 'spacious'
    );
  }

  confirmReset(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will reset all your preferences to default and save them to the database.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reset it!',
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
        this.resetToDefault();
        Swal.fire({
          title: 'Reset!',
          text: 'Your preferences have been reset to default.',
          icon: 'success',
          customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            confirmButton: 'swal-custom-button',
          },
        });
      }
    });
  }
}
