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
import { BackendService } from '../../services/backend.service';
import { Customer } from '../../models/customer.model';
import { HttpClientModule } from '@angular/common/http';


@Component({
  standalone:true,
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],

  imports:[
    // BrowserModule,
    // BrowserAnimationsModule,
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
  providers: [BackendService]
})
export class CustomersComponent{
  customers: Customer[] = [];

  // customers = [{ id: 1, name: 'Customer 1' }];
  newCustomer: any = {
    name: '',
    email:'',
    phone:''
  };
  editMode: boolean = false;
  currentCustomerId: number | null = null;
  constructor(private backendService:BackendService){}

  ngOnInit(): void {
    this.backendService.getCustomers().subscribe((customers) => {
      this.customers = customers;
    });
  }



  addCustomer() {
    if (this.editMode) {
      this.customers = this.customers.map(c => c.id === this.currentCustomerId ? { ...c, name: this.newCustomer } : c);
      this.editMode = false;
    } else {
      this.newCustomer.id = Date.now();
      this.customers.push(this.newCustomer);
    }
    this.newCustomer = {};
    console.log(this.customers);
    
  }

  editCustomer(customer: any) {
    this.editMode = true;
    this.newCustomer = customer.name;
    this.currentCustomerId = customer.id;
  }

  deleteCustomer(id: number) {
    this.customers = this.customers.filter(c => c.id !== id);
  }

}