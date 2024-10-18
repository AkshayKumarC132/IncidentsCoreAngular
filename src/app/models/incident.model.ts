export interface Incident {
    id: number;
    title: string;
    description: string;
    deviceId: number;  // Associated with a device
    severity: string;
    status: string;
  }
  