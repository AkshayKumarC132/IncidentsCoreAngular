import { Component } from '@angular/core';
import { Device } from '../../models/device.model';
import { BackendService } from '../../services/backend.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'; // Import MatSelectModule
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    NavbarComponent,
  ],
  providers:[BackendService],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.css'
})
export class DevicesComponent {
  newDevice: any = {}; // Object to hold new device data
  devices: any[] = []; // Array to hold device data
  customers: any[] = []; // Array to hold customer data
  selectedCustomerId: any; // Variable to hold the selected customer ID

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.backendService.getDevices().subscribe((devices) => {
      this.devices = devices;
    });
    this.backendService.getCustomers().subscribe((customers) => {
      this.customers = customers; // Correct assignment
    });
  }

  addDevice(): void {
    if (this.newDevice && this.selectedCustomerId) {
      const deviceToAdd = { 
        name: this.newDevice.name, 
        device_type: this.newDevice.type, 
        ip_address: this.newDevice.ip_address, 
        client_id: this.selectedCustomerId 
      };

      this.backendService.addDevice(deviceToAdd).subscribe(response => {
        this.devices.push(response); // Add the newly created device to the local list
        this.newDevice = {}; // Reset new device data
        this.selectedCustomerId = null; // Reset selected customer ID after adding
      });
    }
  }

  deleteDevice(deviceId: number): void {
    this.backendService.deleteDevice(deviceId).subscribe(() => {
      this.devices = this.devices.filter(device => device.id !== deviceId); // Remove the deleted device from the local list
    });
  }

}
