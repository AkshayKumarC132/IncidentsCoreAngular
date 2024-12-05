import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Customer } from '../models/customer.model';
import { Device } from '../models/device.model';
import { Incident } from '../models/incident.model';
import { Team } from '../models/team.model';
import { User } from '../models/user.model';
import { Msp } from '../models/msp.model';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  // private apiUrl = 'https://hask.app/api'; // Your backend API URL
  // private apiUrl = 'http://54.219.41.135:80/api';  // Your backend API URL
  private apiUrl = 'http://127.0.0.1:5000/api';

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();

  setIsAdmin(value: boolean) {
    this.isAdminSubject.next(value);
  }

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
    const token = localStorage.getItem('authToken');
    return this.http.get<Customer[]>(`${this.apiUrl}/customers/` + token);
  }

  addCustomer(customerData: any): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.post<any>(
      `${this.apiUrl}/customers/` + token,
      customerData
    ); // Assuming POST to base URL
  }

  updateCustomer(customerData: any): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.put<any>(
      `${this.apiUrl}/customers/${customerData.id}/` + token,
      customerData
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

  deleteCustomer(customerId: number): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.delete<void>(
      `${this.apiUrl}/customers/${customerId}/` + token
    );
  }

  getSeverities(): Observable<string[]> {
    // Adjust the return type as needed
    const token = localStorage.getItem('authToken');
    return this.http.get<string[]>(`${this.apiUrl}/severities/` + token); // Change URL as necessary
  }

  // Device API calls
  getDevices(): Observable<Device[]> {
    const token = localStorage.getItem('authToken');
    return this.http.get<Device[]>(`${this.apiUrl}/devices/` + token);
  }

  addDevice(device: Device): Observable<Device> {
    const token = localStorage.getItem('authToken');
    return this.http.post<Device>(`${this.apiUrl}/devices/` + token, device);
  }

  updateDevice(device: Device): Observable<Device> {
    // const headers = this.getAuthHeaders();

    const token = localStorage.getItem('authToken');
    return this.http.put<Device>(
      `${this.apiUrl}/devices/${device.id}/` + token,
      device
    );
  }

  deleteDevice(deviceId: number): Observable<void> {
    const token = localStorage.getItem('authToken');
    return this.http.delete<void>(
      `${this.apiUrl}/devices/${deviceId}/` + token
    );
  }

  // Incident API calls
  // getIncidents() {
  //   // const headers = this.getAuthHeaders();
  //   const token = localStorage.getItem('authToken');
  //   return this.http.get(`${this.apiUrl}/incidents/` + token);
  // }

  getIncidents(
    filter: string = '',
    sortBy: string = 'created_at',
    order: string = 'desc'
  ) {
    const token = localStorage.getItem('authToken');
    let params = new HttpParams()
      .set('pagent', filter)
      .set('sort_by', sortBy)
      .set('order', order);

    return this.http.get<any[]>(`${this.apiUrl}/incidents/${token}`, {
      params: params,
    });
  }

  addIncident(incident: Incident): Observable<Incident> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.post<Incident>(
      `${this.apiUrl}/incidents/` + token,
      incident
    );
  }

  updateIncident(incident: Incident): Observable<Incident> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.put<Incident>(
      `${this.apiUrl}/incidents/${incident.id}/` + token,
      incident
    );
  }

  deleteIncident(incidentId: number): Observable<void> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.delete<void>(
      `${this.apiUrl}/incidents/${incidentId}/` + token
    );
  }

  // Function to get dashboard summary data
  getIncidentData(): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    return this.http.get<any>(`${this.apiUrl}/dashboard-summary/` + token);
  }

  logout(): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.post(`${this.apiUrl}/logout/` + token, {});
  }

  // Team API calls
  getTeams(): Observable<Team[]> {
    const token = localStorage.getItem('authToken');
    return this.http.get<Team[]>(`${this.apiUrl}/teams/` + token);
  }

  addTeam(teamData: any): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.post(`${this.apiUrl}/teams/` + token, teamData);
  }

  updateTeam(teamId: number, teamData: any): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.put(`${this.apiUrl}/teams/${teamId}/` + token, teamData);
  }

  deleteTeam(teamId: number): Observable<void> {
    // Add this method
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.delete<void>(`${this.apiUrl}/teams/${teamId}/` + token);
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
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.post(`${this.apiUrl}/api/assign-clients/` + token, data);
  }

  unassignClients(data: any): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.delete(`${this.apiUrl}/api/assign-clients/` + token, {
      body: data,
    }); // Use DELETE method for unassignment
  }

  getTeamMembers(): Observable<User[]> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.get<User[]>(`${this.apiUrl}/api/team-members/` + token);
  }

  // Fetch all clients
  getClients(): Observable<Customer[]> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.get<Customer[]>(`${this.apiUrl}/customers/` + token);
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
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.get<Msp[]>(`${this.apiUrl}/msps/`);
  }

  // Function to save ConnectWise integration
  saveConnectWiseIntegration(payload: any): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.post(`${this.apiUrl}/connectwise/setup/` + token, payload);
  }

  // Function to save HaloPSA integration
  saveHaloPSAIntegration(payload: any): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.post(`${this.apiUrl}/halopsa/setup/` + token, payload);
  }

  // Function to fetch data
  fetchData(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/fetch-data/`, { headers });
  }

  // Fetch the high-level summary from the backend
  getDashboardSummary(): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage

    return this.http.get<any>(`${this.apiUrl}/dashboard-summary/` + token);
  }

  // Fetch detailed incidents based on status (active/resolved)
  getIncidentsByStatus(status: string): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.get(`${this.apiUrl}/incidents/status/${status}/` + token);
  }

  getIncidentsByDevice(severity: string): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.get(
      `${this.apiUrl}/incidents/device/${severity}/` + token
    );
  }

  getIncidentsBySeverity(device: string): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.get(
      `${this.apiUrl}/incidents/severity/${device}/` + token
    );
  }

  getUserPreferences(): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    return this.http.get(`${this.apiUrl}/user/preferences/` + token);
  }

  saveUserPreferences(preferences: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    for (const key in preferences) {
      if (preferences.hasOwnProperty(key)) {
        formData.append(key, preferences[key]);
      }
    }
    return this.http.post(
      `${this.apiUrl}/user/preferences/update/` + token,
      formData
    );
  }

  runOrchestratioLayer(id: any) {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.post(`${this.apiUrl}/orchestration/${id}/` + token, {});
  }

  getIncidentLogsByID(id: any) {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.get(`${this.apiUrl}/incident/${id}/logs/` + token);
  }

  getAllIncidentLogs(): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.get(`${this.apiUrl}/incident-logs/` + token);
  }

  getIncidentLogs(): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.get<any>(`${this.apiUrl}/incident-log-details/` + token);
  }

  getAssignedTickets(): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.get<any>(`${this.apiUrl}/get_assigned_tickets/` + token);
  }

  /**
   * Start recording for a given ticket ID.
   * @param ticketId The ticket ID to start recording for.
   */
  startRecording(ticketId: string): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    // const url = ${this.baseUrl}/start_recording/;
    return this.http.post(`${this.apiUrl}/start_recording/` + token, {
      ticket_id: ticketId,
    });
  }

  /**
   * Stop recording for a given ticket ID.
   * @param ticketId The ticket ID to stop recording for.
   */
  stopRecording(ticketId: string): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    return this.http.post(`${this.apiUrl}/stop_recording/` + token, {
      ticket_id: ticketId,
    });
  }

  /**
   * Upload a recording chunk.
   * @param file The chunk of the recording to upload.
   * @param ticketId The ticket ID the recording is associated with.
   */
  uploadRecordingChunk(file: Blob, ticketId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/stop_recording/` + token;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ticket_id', ticketId);
    return this.http.post(url, formData);
  }

  uploadChunk(chunk: Blob, ticketId: string) {
    // const headers = this.getAuthHeaders(); // Authorization or other required headers
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('file', chunk); // Add the chunk to FormData
    formData.append('ticket_id', ticketId); // Add the ticket ID

    // Send the FormData
    return this.http.post(
      `${this.apiUrl}/upload_recording_chunk/` + token,
      formData
    );
  }

  /**
   * Finalize the recording after all chunks are uploaded.
   * @param ticketId The ticket ID to finalize the recording for.
   */
  finalizeRecording(formData: FormData): Observable<any> {
    // const headers = this.getAuthHeaders();
    const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/finalize_recording/` + token;
    return this.http.post(url, formData);
  }

  extractTextFromVideo(ticket_id: any) {
    const url = `${this.apiUrl}/generate_workflow/`;
    const formData = new FormData();
    formData.append('ticket_id', ticket_id); // Add the ticket ID
    return this.http.post(url, formData);
  }

  updatePostResolution(incidentId: number, payload: any): Observable<any> {
    // const token = localStorage.getItem('authToken');
    const url = `${this.apiUrl}/incident/${incidentId}/post-resolution`;
    return this.http.post(url, payload);
  }

  fetchUsers(
    page: number,
    pageSize: number,
    searchQuery: string = ''
  ): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString())
      .set('search', searchQuery);
    const token = localStorage.getItem('authToken');
    return this.http.get(`${this.apiUrl}/gl-dashboard/` + token, { params });
  }

  updateRole(userId: number, role: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    return this.http.post(`${this.apiUrl}` + '/update-role/' + token, {
      user_id: userId,
      role,
    });
  }
}
