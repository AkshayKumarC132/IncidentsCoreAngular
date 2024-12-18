import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { NavbarService } from '../../services/navbar.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms'; // Import FormsModule

interface ModelItem {
  name: string;
  size: number;
  isActive: boolean;
}

@Component({
  selector: 'app-model-management',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HttpClientModule, FormsModule],
  templateUrl: './model-management.component.html',
  styleUrl: './model-management.component.css',
  providers: [BackendService],
})
export class ModelManagementComponent implements OnInit {
  userRole: string = '';
  modelList: ModelItem[] = [];
  fileToUpload: File | null = null;
  menuOption: 'top' | 'left' = 'top';
  selectedModel: any = null;

  get hasAccess(): boolean {
    const allowedRoles = ['admin', 'godlike', 'msp_superuser'];
    return allowedRoles.includes(this.userRole);
  }

  constructor(
    private backendService: BackendService,
    private navservice: NavbarService
  ) {
    this.navservice.navbarPosition$.subscribe((position) => {
      this.menuOption = position as 'top' | 'left';
      console.log('Dashbaord ', this.menuOption);
    });
  }

  ngOnInit(): void {
    this.fetchModels();
    this.fetchRole();
  }

  setActive(modelName: string, modelType: string) {
    this.backendService.setActiveModel(modelName, modelType).subscribe({
      next: () => {
        Swal.fire({
          title: 'Success',
          text: `Model ${modelName} has been set as active`,
          icon: 'success',
          customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            htmlContainer: 'swal-custom-html',
            confirmButton: 'swal-custom-button',
          },
        });
        this.fetchModels();
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'Failed to set model as active',
          icon: 'error',
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

  fetchRole() {
    this.backendService.getUserRole().subscribe((data) => {
      console.log(data);
      this.userRole = data.role;
    });
  }

  fetchModels() {
    this.backendService.listModels().subscribe({
      next: (data) => {
        this.modelList = data.models.map((item: any) => ({
          name: item.name,
          size: item.size,
          isActive: item.is_active,
        }));
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'Failed to fetch models',
          icon: 'error',
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

  handleFileInput(event: any) {
    this.fileToUpload = event.target.files[0];
  }

  uploadModel(modelType: string) {
    if (this.fileToUpload) {
      const formData = new FormData();
      formData.append('file', this.fileToUpload);
      formData.append('model_type', modelType);

      this.backendService.uploadModel(formData).subscribe(() => {
        this.fetchModels();
      });
    }
  }

  deleteModel(modelName: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You won't be able to revert this!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
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
        this.backendService.deleteModel(modelName).subscribe(
          () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Your model has been deleted.',
              icon: 'success',
              customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                htmlContainer: 'swal-custom-html',
                confirmButton: 'swal-custom-button',
              },
            });
            this.fetchModels();
          },
          (error) => {
            Swal.fire({
              title: 'Error!',
              text: 'There was an error deleting the model.',
              icon: 'error',
              customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                htmlContainer: 'swal-custom-html',
                confirmButton: 'swal-custom-button',
              },
            });
          }
        );
      }
    });
  }
  editModel(item: ModelItem) {
    this.selectedModel = {
      name: item.name,
      parameters: {
        ...this.getMockParameters(item.name), // Replace this with actual API response when integrated.
      },
    };
  }
  // editModel(modelName: string) {
  //   const model = this.modelList.find((item) => item.name === modelName);
  //   if (model) {
  //     this.selectedModel = { ...model, parameters: {} }; // Ensure selectedModel is of type ModelItem
  //   }
  // }

  closeModal() {
    this.selectedModel = null;
  }

  updateModel() {
    if (!this.selectedModel) {
      Swal.fire({
        title: 'Error',
        text: 'No model selected. Please select a model to update.',
        icon: 'error',
      });
      return;
    }
  
    // Ensure that model parameters are valid before updating
    if (!this.selectedModel.parameters || Object.keys(this.selectedModel.parameters).length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'Model parameters are missing or invalid.',
        icon: 'error',
      });
      return;
    }
  
    this.backendService.updateModel(this.selectedModel.name, this.selectedModel.parameters).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Success',
          text: `Model ${this.selectedModel.name} has been updated successfully.`,
          icon: 'success',
        });
        this.closeModal(); // Close the modal after a successful update
        this.fetchModels(); // Refresh the list of models
      },
      error: (error) => {
        const errorMessage = error?.error?.message || 'Failed to update the model. Please try again.';
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
        });
      },
    });
  }
  
  getModelParameters(modelName: string): string[] {
    return Object.keys(this.selectedModel?.parameters || {});
  }

  getMockParameters(modelName: string): Record<string, any> {
    // Mock function to simulate parameters (Replace with actual API data)
    return {
      n_estimators: 200,
      max_depth: 10,
      min_samples_split: 4,
    };
  }
}
