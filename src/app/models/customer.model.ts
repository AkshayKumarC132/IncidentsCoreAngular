export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    team_member: { id: number; name: string;username:string } | null; // Update to include team member details
}
  