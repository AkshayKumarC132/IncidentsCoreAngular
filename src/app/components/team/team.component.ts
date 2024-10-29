import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Team } from '../../models/team.model';
import { Customer } from '../../models/customer.model';
import { User } from '../../models/user.model';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Msp } from '../../models/msp.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavbarService } from '../../services/navbar.service';


@Component({
  selector: 'app-team',
  standalone: true,
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
  providers: [BackendService],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NavbarComponent,
    ReactiveFormsModule, 
  ]
})
export class TeamComponent implements OnInit {
  darkMode: boolean = false; // Adjust according to your logic
  teams: Team[] = [];
  users: User[] = [];
  teamForm: FormGroup;
  clients: Customer[] = [];
  selectedTeam: Team | null = null;
  selectedClient: number | null = null;
  selectedTeamMember: number | null = null;
  newTeamName: string = '';
  selectedMsp : any;
  msps: Msp[] = []; // Define this property
  menuOption :any = 'top'

  constructor(private backendService: BackendService,private fb: FormBuilder, private navservice : NavbarService) {
    this.teamForm = this.fb.group({
      name: [''],
      members: [[]],
      msp_id: [''] // Add MSP ID to the form
    });

    this.navservice.navbarPosition$.subscribe(position => {
      this.menuOption = position;
      console.log("Dashbaord ", this.menuOption )
    });
  }

  ngOnInit(): void {
    this.loadTeams();
    this.loadUsers();
    this.loadClients();
    this.loadMsps(); // Load MSPs on initialization
  }

  // Toggle function if not already present
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }

  loadMsps(): void {
    this.backendService.getMsps().subscribe(data => {
      this.msps = data;
    });
  }

  loadTeams(): void {
    this.backendService.getTeams().subscribe(
      (data: Team[]) => this.teams = data,
      error => console.error('Error fetching teams', error)
    );
  }

  onSubmit(): void {
    if (this.teamForm.valid) {
      const teamData = this.teamForm.value;
      if (this.selectedTeam) {
        // Update existing team
        this.backendService.updateTeam(this.selectedTeam.id, teamData).subscribe(() => {
          this.loadTeams();
          this.teamForm.reset();
          this.selectedTeam = null;
        });
      } else {
        // Create new team
        this.backendService.addTeam(teamData).subscribe(() => {
          this.loadTeams();
          this.teamForm.reset();
        });
      }
    }
  }

  addTeam(teamData: any): void {
    this.backendService.addTeam(teamData).subscribe(
      () => {
        this.loadTeams();
        this.teamForm.reset();
      },
      error => console.error('Error adding team', error)
    );
  }

  updateTeam(teamId: number, teamData: any): void {
    this.backendService.updateTeam(teamId, teamData).subscribe(
      () => {
        this.loadTeams();
        this.teamForm.reset();
        this.selectedTeam = null;  // Clear selection
      },
      error => console.error('Error updating team', error)
    );
  }

  onEdit(team: Team): void {
    this.selectedTeam = team;
    this.teamForm.patchValue({
      name: team.name,
      members: team.members,
      msp_id: team.msp.id // Populate MSP ID for editing
    });
  }

  deleteTeam(teamId: number): void {
    this.backendService.deleteTeam(teamId).subscribe(() => {
      this.loadTeams();
    });
  }

  // deleteTeam(teamId: number): void {
  //   this.backendService.deleteTeam(teamId).subscribe(
  //     () => this.loadTeams(),
  //     error => console.error('Error deleting team', error)
  //   );
  // }

  loadUsers(): void {
    this.backendService.getUsers().subscribe(
      (data: User[]) => this.users = data,
      error => console.error('Error fetching users', error)
    );
  }

  loadClients(): void {
    this.backendService.getClients().subscribe(data => {
      this.clients = data;
    });
  }

  assignClientToMember(): void {
    if (this.selectedClient && this.selectedTeamMember) {
      this.backendService.assignTeamMember(this.selectedClient, this.selectedTeamMember).subscribe(() => {
        console.log('Client assigned to team member');
        this.loadClients(); // Reload clients after assignment
      });
    }
  }

  createNewTeam(): void {
    if (this.newTeamName.trim() === '' || !this.selectedMsp) {
      alert('Please enter a valid team name and select an MSP');
      return;
    }
  
    const newTeam = {
      name: this.newTeamName,
      msp: this.selectedMsp // Ensure you have this property defined
    };
  
    this.backendService.addTeam(newTeam).subscribe(
      (response) => {
        this.loadTeams();  // Refresh the team list after creation
        this.newTeamName = '';  // Reset the input field
        this.selectedMsp = null; // Reset selected MSP if needed
        alert('Team created successfully!');
      },
      (error) => {
        console.error('Error creating team:', error);
        alert('Failed to create team');
      }
    );
  }
  

  addMemberToTeam(userId: string): void {
    if (!this.selectedTeam) {
      alert('Please select a team first.');
      return;
    }

    const userIdNum = +userId; // Convert userId to number
    this.backendService.addTeamMember(this.selectedTeam.id, userIdNum).subscribe(
      (response) => {
        this.loadTeams();  // Refresh the team list to reflect changes
        alert('Member added successfully!');
      },
      (error) => {
        console.error('Error adding member:', error);
        alert('Failed to add member');
      }
    );
  }

  removeMemberFromTeam(memberId: number): void {
    if (!this.selectedTeam) {
      alert('Please select a team first.');
      return;
    }

    this.backendService.removeTeamMember(this.selectedTeam.id, memberId).subscribe(
      (response) => {
        this.loadTeams();  // Refresh the team list to reflect changes
        alert('Member removed successfully!');
      },
      (error) => {
        console.error('Error removing member:', error);
        alert('Failed to remove member');
      }
    );
  }
}
