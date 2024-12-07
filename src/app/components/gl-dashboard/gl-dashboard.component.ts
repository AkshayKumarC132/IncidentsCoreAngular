import { Component, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BackendService } from '../../services/backend.service';
import { NavbarService } from '../../services/navbar.service';
import { RoleDialogComponent } from '../role-dialog/role-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-gl-dashboard',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './gl-dashboard.component.html',
  styleUrl: './gl-dashboard.component.css',
  providers: [BackendService],
})
export class GlDashboardComponent {
  menuOption: any = 'top';
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'role',
    'is_active',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>([]);
  searchForm: FormGroup;
  totalItems = 1;
  pageSize = 10;
  currentPage = 1;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private backendService: BackendService,
    private http: HttpClient,
    private navservice: NavbarService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.navservice.navbarPosition$.subscribe((position) => {
      this.menuOption = position;
      console.log('Dashbaord ', this.menuOption);
    });

    this.searchForm = this.fb.group({
      searchQuery: [''],
    });
  }

  ngOnInit(): void {
    this.fetchUsers(1, this.pageSize);
  }
  fetchUsers(page: number, pageSize: number): void {
    const searchQuery = this.searchForm.get('searchQuery')?.value || '';
    this.backendService.fetchUsers(page, pageSize, searchQuery).subscribe(
      (response) => {
        this.dataSource.data = response.users.results;
        this.totalItems = response.users.total_pages;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  pageChange(event: any): void {
    const page = event.pageIndex + 1;
    const pageSize = event.pageSize;
    this.fetchUsers(page, pageSize);
  }

  openRoleDialog(user: any): void {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      data: { user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchUsers(this.paginator?.pageIndex || 1, this.pageSize);
      }
    });
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchUsers(this.currentPage, this.pageSize);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalItems) {
      this.currentPage++;
      this.fetchUsers(this.currentPage, this.pageSize);
    }
  }

  onSearch(): void {
    this.fetchUsers(1, this.pageSize);
  }
}
