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
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


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
    FormsModule,
    CommonModule,
    HttpClientModule
  ],
  providers:[BackendService],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.css'
})
export class DevicesComponent {
  devices: Device[] = [];
  newDevice: Device = { id: 0, name: '', type: '', customerId: 0 };

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.backendService.getDevices().subscribe((devices) => {
      this.devices = devices;
    });
  }

  addDevice(): void {
    // console.log(this.newDevice);
    // this.devices.push(this.newDevice);
    // console.log(this.newDevice);
    this.backendService.addDevice(this.newDevice).subscribe((device) => {
      this.devices.push(device);
      this.newDevice = { id: 0, name: '', type: '', customerId: 0 };  // Reset form
    });
  }

  deleteDevice(id: number): void {
    this.backendService.deleteDevice(id).subscribe(() => {
      this.devices = this.devices.filter(device => device.id !== id);
    });
  }

}
