import { User } from '../../app/models/user.model'

export interface Member {
    id: number;
    username: string;
    email: string;
    name: string;
    role: string;
    is_active: boolean;
    created_at: string;
  }

export interface Team {
    id: number;
    name: string;
    members: Member[]; // Array of member IDs
    msp: {
      id: number; // Ensure this is the structure of MSP
      name: string;
    };
  }
