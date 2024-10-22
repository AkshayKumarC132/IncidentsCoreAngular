import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'; // Import MatSelectModule
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { Customer } from '../../models/customer.model';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { User } from '../../models/user.model';


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
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    NavbarComponent,
  ],
  providers: [BackendService]
})
export class CustomersComponent{
  customers: Customer[] = [];
  msps: any[] = []; // Array to hold MSP configurations
  // customers = [{ id: 1, name: 'Customer 1' }];
  teamMembers: User[] = []; // Array to hold team members
  newCustomer: any = {
    name: '',
    email:'',
    phone:''
  };
  editMode: boolean = false;
  currentCustomerId: number | null = null;
  selectedMspId: any;
  selectedClientId: any; // Variable to hold selected client ID for assignment
  selectedTeamMemberId: any; // Variable to hold selected team member ID for assignment

  constructor(private backendService:BackendService){}

  ngOnInit(): void {
    // Fetch customers
    this.backendService.getCustomers().subscribe((customers) => {
      this.customers = customers;
      
      // Fetch team members
      this.backendService.getTeamMembers().subscribe((teamMembers) => {
        this.teamMembers = teamMembers;
  
        // Merge customers with their assigned team members if applicable
        this.customers = this.customers.map((customer) => {
          const teamMember = this.teamMembers.find(member => member.customerId === customer.id);
          return { ...customer, team_member: teamMember || null }; // Assign team member if found
        });
      });
    });
  
    // Fetch MSP configurations
    this.backendService.getMsps().subscribe((msps) => {
      this.msps = msps;
    });
  }



  addCustomer(): void {
    if (this.editMode) {
      // Update existing customer
      const updatedCustomer = {
        id: this.currentCustomerId,
        name: this.newCustomer.name,
        email: this.newCustomer.email,
        phone: this.newCustomer.phone,
        msp_id: this.selectedMspId, // Include MSP ID for updates too
        team_member: this.selectedTeamMemberId // Include selected team member ID
      };

  
      this.backendService.updateCustomer(updatedCustomer).subscribe(
        (response) => {
          // Update the customers array with the edited customer
          this.customers = this.customers.map(c => c.id === this.currentCustomerId ? response : c);
          this.editMode = false;
          this.currentCustomerId = null; // Reset the current customer ID
        },
        error => console.error('Error updating customer', error)
      );
    } else {
      // Create new customer
      const newCustomerData = {
        name: this.newCustomer.name,
        email: this.newCustomer.email,
        phone: this.newCustomer.phone,
        msp_id: this.selectedMspId, // Selected MSP ID
        team_member: this.selectedTeamMemberId // Selected team member ID
      };
  
      this.backendService.addCustomer(newCustomerData).subscribe(
        (response) => {
          this.customers.push(response); // Push the new customer to the list
        },
        error => console.error('Error adding customer', error)
      );
    }
  
    this.newCustomer = {}; // Reset the newCustomer object
    console.log(this.customers);
  }

  editCustomer(customer: any) {
    this.editMode = true;
    this.newCustomer = customer.name;
    this.currentCustomerId = customer.id;
  }

  deleteCustomer(id: number): void {
    this.backendService.deleteCustomer(id).subscribe(
      () => {
        // Remove the customer from the list after successful deletion
        this.customers = this.customers.filter(customer => customer.id !== id);
        console.log(`Customer with id ${id} deleted successfully.`);
      },
      error => console.error('Error deleting customer', error)
    );
  }
  assignClientToTeamMember(): void {
    if (this.selectedClientId && this.selectedTeamMemberId) {
      const assignmentData = {
        client_id: this.selectedClientId,
        team_member_id: this.selectedTeamMemberId
      };

      this.backendService.assignClientsToTeamMember(assignmentData).subscribe(
        response => {
          console.log('Client assigned successfully:', response);
          // Optionally, you could update the UI here or show a success message
        },
        error => console.error('Error assigning client to team member', error)
      );
    } else {
      console.error('Please select both a client and a team member.');
    }
  }

  unassignClientFromTeam(customerId: number): void {
    this.backendService.unassignClients({ customer_id: customerId }).subscribe(() => {
      this.customers = this.customers.map(c => {
        if (c.id === customerId) {
          c.team_member = null; // Unassign the team member
        }
        return c;
      });
    });
  }
}