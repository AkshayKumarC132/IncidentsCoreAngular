import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { NavbarService } from '../../services/navbar.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms'; // Import FormsModule
// import { MatSnackBar } from '@angular/material/snack-bar';

interface ModelItem {
  name: string;
  size: number;
  isActive: boolean;
}

@Component({
  selector: 'app-model-management',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, NavbarComponent],
  templateUrl: './model-management.component.html',
  styleUrl: './model-management.component.css',
  providers: [BackendService],
})
export class ModelManagementComponent implements OnInit {
  models: any[] = [];
  newParameters: any = {};
  activeModelId: number | null = null;
  uploadProgress: number = 0; // Added property to track upload progress
  menuOption: any = 'top';
  editingModel: string | null = null;
  editButtonLabel: any;

  constructor(
    private backendservice: BackendService,
    private navservice: NavbarService
  ) // private snackBar: MatSnackBar
  {
    this.navservice.navbarPosition$.subscribe((position) => {
      this.menuOption = position;
      console.log('Dashbaord ', this.menuOption);
    });
  }

  ngOnInit(): void {
    // Fetch the list of models on load
    this.fetchModels();
  }

  fetchModels(): void {
    this.backendservice.fetchModels().subscribe(
      (response) => {
        this.models = response.models; // Populate the models array with the response
      },
      (error) => {
        console.error('Error fetching models:', error);
      }
    );
  }

  uploadModel(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      Swal.fire({
        icon: 'error',
        title: 'No file selected',
        text: 'Please select a file to upload.',
        customClass: {
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          htmlContainer: 'swal-custom-html',
          confirmButton: 'swal-custom-button',
        },
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.backendservice.uploadModel(formData).subscribe({
      next: (response) => {
        // On success, fetch the models again
        this.fetchModels();
        Swal.fire({
          icon: 'success',
          title: 'Model uploaded successfully',
          text: response.message,
          customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            htmlContainer: 'swal-custom-html',
            confirmButton: 'swal-custom-button',
          },
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text:
            error.error?.error ||
            'An error occurred while uploading the model.',
          customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            htmlContainer: 'swal-custom-html',
            confirmButton: 'swal-custom-button',
          },
        });
      },
    });
  }

  setActive(modelId: number): void {
    this.backendservice.setActiveModel(modelId).subscribe((response) => {
      this.fetchModels();
    });
  }

  startUpload(): void {
    // Trigger uploadModel manually if needed
    document.getElementById('file-upload')?.click();
  }

  deleteModel(modelId: number): void {
    this.backendservice.deleteModel(modelId).subscribe(() => {
      this.fetchModels();
    });
  }

  editModel(modelName: string, updatedParameters: any): void {
    this.backendservice.editModel(modelName, updatedParameters).subscribe(
      (response: any) => {
        Swal.fire({
          title: 'Success',
          text: response.message,
          icon: 'success',
          customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            htmlContainer: 'swal-custom-html',
            confirmButton: 'swal-custom-button',
          },
        });
        // this.snackBar.open(response.message, 'Close', { duration: 3000 });
        this.fetchModels(); // Refresh the model list
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: 'Failed to update model: ' + error.error.error,
          icon: 'error',
          customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            htmlContainer: 'swal-custom-html',
            confirmButton: 'swal-custom-button',
          },
        });
        // this.snackBar.open(
        //   'Failed to update model: ' + error.error.error,
        //   'Close',
        //   { duration: 5000 }
        // );
      }
    );
  }

  startEditing(modelName: string): void {
    this.editingModel = modelName;
  }

  cancelEditing(): void {
    this.editingModel = null;
  }
}
