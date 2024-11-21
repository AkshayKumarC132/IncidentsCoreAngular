import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Customer } from '../models/customer.model';
import { Device } from '../models/device.model';
import { Incident } from '../models/incident.model';
import { catchError } from 'rxjs/operators'; // Import catchError
import { Team } from '../models/team.model';
import { User } from '../models/user.model';
import { Msp } from '../models/msp.model';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private apiUrl = 'http://172.16.16.64:5000/api'; // Your backend API URL
  // private apiUrl = 'http://54.219.41.135:80/api';  // Your backend API URL
  isAdmin = false;
  constructor(private http: HttpClient) {}
  public getApiUrl(): string {
    return this.apiUrl;
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    if (!token) {
      console.error('No auth token found!');
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Token ${token}`);
  }

  // Register API call
  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register/`, data); // Adjust the API URL as per your backend
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login/`, data); // Adjust the URL as needed
  }

  // Customer API calls
  getCustomers(): Observable<Customer[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Customer[]>(`${this.apiUrl}/customers/`, { headers });
  }

  addCustomer(customerData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/customers/`, customerData, {
      headers,
    }); // Assuming POST to base URL
  }

  updateCustomer(customerData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(
      `${this.apiUrl}/customers/${customerData.id}/`,
      customerData,
      { headers }
    ); // Assuming PUT to the specific customer URL
  }

  // addCustomer(customer: Customer): Observable<Customer> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.post<Customer>(`${this.apiUrl}/customers`, customer, { headers });
  // }

  // updateCustomer(customer: Customer): Observable<Customer> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.put<Customer>(`${this.apiUrl}/customers/${customer.id}`, customer, { headers });
  // }

  deleteCustomer(customerId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/customers/${customerId}/`, {
      headers,
    });
  }

  getSeverities(): Observable<string[]> {
    // Adjust the return type as needed
    const headers = this.getAuthHeaders();
    return this.http.get<string[]>(`${this.apiUrl}/severities/`, { headers }); // Change URL as necessary
  }

  // Device API calls
  getDevices(): Observable<Device[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Device[]>(`${this.apiUrl}/devices/`, { headers });
  }

  addDevice(device: Device): Observable<Device> {
    const headers = this.getAuthHeaders();
    return this.http.post<Device>(`${this.apiUrl}/devices/`, device, {
      headers,
    });
  }

  updateDevice(device: Device): Observable<Device> {
    const headers = this.getAuthHeaders();
    return this.http.put<Device>(
      `${this.apiUrl}/devices/${device.id}/`,
      device,
      { headers }
    );
  }

  deleteDevice(deviceId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/devices/${deviceId}/`, {
      headers,
    });
  }

  // Incident API calls
  getIncidents() {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/incidents/`, { headers });
  }

  addIncident(incident: Incident): Observable<Incident> {
    const headers = this.getAuthHeaders();
    return this.http.post<Incident>(`${this.apiUrl}/incidents/`, incident, {
      headers,
    });
  }

  updateIncident(incident: Incident): Observable<Incident> {
    const headers = this.getAuthHeaders();
    return this.http.put<Incident>(
      `${this.apiUrl}/incidents/${incident.id}/`,
      incident,
      { headers }
    );
  }

  deleteIncident(incidentId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/incidents/${incidentId}/`, {
      headers,
    });
  }

  // Function to get dashboard summary data
  getIncidentData(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/dashboard-summary/`, { headers });
  }

  logout(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/logout/`, {}, { headers });
  }

  // Team API calls
  getTeams(): Observable<Team[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Team[]>(`${this.apiUrl}/teams/`, { headers });
  }

  addTeam(teamData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/teams/`, teamData, { headers });
  }

  updateTeam(teamId: number, teamData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/teams/${teamId}/`, teamData, {
      headers,
    });
  }

  deleteTeam(teamId: number): Observable<void> {
    // Add this method
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/teams/${teamId}/`, {
      headers,
    });
  }

  // Method to assign a team member to a client
  assignTeamMember(clientId: number, teamMemberId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    const body = { team_member_id: teamMemberId };
    return this.http.post(
      `${this.apiUrl}/clients/${clientId}/assign_team_member/`,
      body,
      { headers }
    );
  }

  assignClientsToTeamMember(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/api/assign-clients/`, data, {
      headers,
    });
  }

  unassignClients(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/api/assign-clients/`, {
      body: data,
      headers,
    }); // Use DELETE method for unassignment
  }

  getTeamMembers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/api/team-members/`, {
      headers,
    });
  }

  // Fetch all clients
  getClients(): Observable<Customer[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Customer[]>(`${this.apiUrl}/customers/`, { headers });
  }

  // Fetch all users
  getUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/users/`, { headers });
  }

  // Method to add or remove team members
  addTeamMember(teamId: number, userId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(
      `${this.apiUrl}/teams/${teamId}/add_member/`,
      { user_id: userId },
      { headers }
    );
  }

  removeTeamMember(teamId: number, userId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(
      `${this.apiUrl}/teams/${teamId}/remove_member/`,
      { user_id: userId },
      { headers }
    );
  }
  getMsps(): Observable<Msp[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Msp[]>(`${this.apiUrl}/msps/`, { headers });
  }

  // Function to save ConnectWise integration
  saveConnectWiseIntegration(payload: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/connectwise/setup/`, payload, {
      headers,
    });
  }

  // Function to save HaloPSA integration
  saveHaloPSAIntegration(payload: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/halopsa/setup/`, payload, {
      headers,
    });
  }

  // Function to fetch data
  fetchData(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/fetch-data/`, { headers });
  }

  // Fetch the high-level summary from the backend
  getDashboardSummary(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/dashboard-summary/`, { headers });
  }

  // Fetch detailed incidents based on status (active/resolved)
  getIncidentsByStatus(status: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/incidents/status/${status}/`, {
      headers,
    });
  }

  getIncidentsByDevice(severity: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/incidents/device/${severity}/`, {
      headers,
    });
  }

  getIncidentsBySeverity(device: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/incidents/severity/${device}/`, {
      headers,
    });
  }

  getUserPreferences(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/user/preferences/`, { headers });
  }

  saveUserPreferences(preferences: any): Observable<any> {
    const headers = this.getAuthHeaders();
    const formData = new FormData();
    for (const key in preferences) {
      if (preferences.hasOwnProperty(key)) {
        formData.append(key, preferences[key]);
      }
    }
    return this.http.post(`${this.apiUrl}/user/preferences/update/`, formData, {
      headers,
    });
  }

  runOrchestratioLayer(id: any) {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/orchestration/${id}/`, { headers });
  }

  getIncidentLogsByID(id: any) {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/incident/${id}/logs/`, { headers });
  }

  getAllIncidentLogs(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/incident-logs/`, { headers });
  }

  getIncidentLogs(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/incident-log-details/`, {
      headers,
    });
  }

  getAssignedTickets(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/get_assigned_tickets/`, {
      headers,
    });
  }

  /**
   * Start recording for a given ticket ID.
   * @param ticketId The ticket ID to start recording for.
   */
  startRecording(ticketId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    // const url = ${this.baseUrl}/start_recording/;
    return this.http.post(
      `${this.apiUrl}/start_recording/`,
      {
        ticket_id: ticketId,
      },
      { headers }
    );
  }

  /**
   * Stop recording for a given ticket ID.
   * @param ticketId The ticket ID to stop recording for.
   */
  stopRecording(ticketId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(
      `${this.apiUrl}/stop_recording/`,
      {
        ticket_id: ticketId,
      },
      { headers }
    );
  }

  /**
   * Upload a recording chunk.
   * @param file The chunk of the recording to upload.
   * @param ticketId The ticket ID the recording is associated with.
   */
  uploadRecordingChunk(file: Blob, ticketId: string): Observable<any> {
    const url = `${this.apiUrl}/stop_recording/`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ticket_id', ticketId);
    return this.http.post(url, formData);
  }

  uploadChunk(chunk: Blob, ticketId: string) {
    const headers = this.getAuthHeaders(); // Authorization or other required headers

    const formData = new FormData();
    formData.append('file', chunk); // Add the chunk to FormData
    formData.append('ticket_id', ticketId); // Add the ticket ID

    // Send the FormData
    return this.http.post(`${this.apiUrl}/upload_recording_chunk/`, formData, {
      headers, // Ensure headers don't include `Content-Type` as it will be set by `FormData`
    });
  }

  /**
   * Finalize the recording after all chunks are uploaded.
   * @param ticketId The ticket ID to finalize the recording for.
   */
  finalizeRecording(ticketId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/finalize_recording/`;
    return this.http.post(url, { ticket_id: ticketId }, { headers });
  }
}
