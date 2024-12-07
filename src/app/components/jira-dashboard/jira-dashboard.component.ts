import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { NavbarService } from '../../services/navbar.service';

@Component({
  selector: 'app-jira-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, NavbarComponent],
  templateUrl: './jira-dashboard.component.html',
  styleUrl: './jira-dashboard.component.css',
  providers: [BackendService],
})
export class JiraDashboardComponent {
  tickets: any[] = [];
  menuOption: any = 'top';
  statusFilter: string = '';
  priorityFilter: string = '';
  sortBy: string = 'id';  // Default sort field
  order: string = 'asc';  // Default sort order

  constructor(
    private backendService: BackendService,
    private navservice: NavbarService
  ) {
    this.navservice.navbarPosition$.subscribe((position) => {
      this.menuOption = position;
      console.log('Dashbaord ', this.menuOption);
    });
  }

  ngOnInit(): void {
    this.fetchJiraTickets();
  }

  // Method to fetch Jira tickets with applied filters and sorting
  fetchJiraTickets(): void {
    const params = new HttpParams()
      .set('status', this.statusFilter)
      .set('priority', this.priorityFilter)
      .set('sort_by', this.sortBy)
      .set('order', this.order);
    
    this.backendService.getJiraTickets(params).subscribe(
      (data) => {
        this.tickets = data.jira_tickets;
      },
      (error) => {
        console.error('Error fetching Jira tickets:', error);
        this.tickets = [];  // In case of an error, set tickets to an empty array.
      }
    );
  }

  // Optional: Function to reset filters if needed
  resetFilters(): void {
    this.statusFilter = '';
    this.priorityFilter = '';
    this.sortBy = 'id';
    this.order = 'asc';
    this.fetchJiraTickets(); // Refetch with default filters
  }

  // Method to apply filters and trigger data fetch
  applyFilters(): void {
    this.fetchJiraTickets();
  }

  // Method to toggle sorting order
  toggleSortOrder(field: string): void {
    if (this.sortBy === field) {
      this.order = this.order === 'asc' ? 'desc' : 'asc';  // Toggle order
    } else {
      this.sortBy = field;  // Set sort field
      this.order = 'asc';   // Default to ascending
    }
    this.fetchJiraTickets();
  }
}
