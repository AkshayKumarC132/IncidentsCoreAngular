import { Component, Inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BackendService } from '../../services/backend.service';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule, // Import MatDialogModule here
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
  ],
  templateUrl: './role-dialog.component.html',
  styleUrls: ['./role-dialog.component.css'], // Fixed 'styleUrl' to 'styleUrls'
  providers: [BackendService],
})
export class RoleDialogComponent {
  newRole: string;

  constructor(
    public dialogRef: MatDialogRef<RoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private glDashboardService: BackendService
  ) {
    this.newRole = data.user.role;
  }

  saveRole(): void {
    this.glDashboardService
      .updateRole(this.data.user.id, this.newRole)
      .subscribe({
        next: () => {
          alert('Role updated successfully');
          this.dialogRef.close(true);
        },
        error: (err) => {
          alert(
            'Error updating role: ' +
              (err?.message || 'No Permission or Unknown Error')
          );
        },
      });
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
