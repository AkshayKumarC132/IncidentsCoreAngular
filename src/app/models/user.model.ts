export interface User {
    customerId: number;
    id: number;
    username: string;
    email: string;
    name: string;
    role: string;  // Admin, MSP SuperUser, MSP User
    isActive: boolean;
    createdAt: string;  // ISO date string for created_at
  }
  