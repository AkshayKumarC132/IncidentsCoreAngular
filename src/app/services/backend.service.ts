import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Customer } from '../models/customer.model';
import { Device } from '../models/device.model';
import { Incident } from '../models/incident.model';
import { catchError } from 'rxjs/operators';  // Import catchError
import { Team } from '../models/team.model';
import { User } from '../models/user.model';
import { Msp } from '../models/msp.model';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = 'http://127.0.0.1:5000/api';  // Your backend API URL

  constructor(private http: HttpClient) { }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    return new HttpHeaders().set('Authorization', `Token ${token}`);
  }

  // Register API call
  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register/`, data);  // Adjust the API URL as per your backend
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
    return this.http.post<any>(`${this.apiUrl}/customers/`, customerData,{ headers }); // Assuming POST to base URL
  }

  updateCustomer(customerData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/customers/${customerData.id}/`, customerData,{ headers }); // Assuming PUT to the specific customer URL
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
    return this.http.delete<void>(`${this.apiUrl}/customers/${customerId}/`, { headers });
  }

  // Device API calls
  getDevices(): Observable<Device[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Device[]>(`${this.apiUrl}/devices/`, { headers });
  }

  addDevice(device: Device): Observable<Device> {
    const headers = this.getAuthHeaders();
    return this.http.post<Device>(`${this.apiUrl}/devices/`, device, { headers });
  }

  updateDevice(device: Device): Observable<Device> {
    const headers = this.getAuthHeaders();
    return this.http.put<Device>(`${this.apiUrl}/devices/${device.id}/`, device, { headers });
  }

  deleteDevice(deviceId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/devices/${deviceId}/`, { headers });
  }

  // Incident API calls
  getIncidents(): Observable<Incident[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Incident[]>(`${this.apiUrl}/incidents/`, { headers });
  }

  addIncident(incident: Incident): Observable<Incident> {
    const headers = this.getAuthHeaders();
    return this.http.post<Incident>(`${this.apiUrl}/incidents`, incident, { headers });
  }

  updateIncident(incident: Incident): Observable<Incident> {
    const headers = this.getAuthHeaders();
    return this.http.put<Incident>(`${this.apiUrl}/incidents/${incident.id}/`, incident, { headers });
  }

  deleteIncident(incidentId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/incidents/${incidentId}/`, { headers });
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
    return this.http.put(`${this.apiUrl}/teams/${teamId}/`, teamData, { headers });
  }

  deleteTeam(teamId: number): Observable<void> {  // Add this method
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/teams/${teamId}/`, { headers });
  }

  // Method to assign a team member to a client
  assignTeamMember(clientId: number, teamMemberId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    const body = { team_member_id: teamMemberId };
    return this.http.post(`${this.apiUrl}/clients/${clientId}/assign_team_member/`, body, { headers });
  }

  assignClientsToTeamMember(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/api/assign-clients/`, data,{ headers });
  }

  unassignClients(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/api/assign-clients/`, { body: data , headers }); // Use DELETE method for unassignment
  }

  getTeamMembers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/api/team-members/`,{ headers });
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
    return this.http.post(`${this.apiUrl}/teams/${teamId}/add_member/`, { user_id: userId }, { headers });
  }
  
  removeTeamMember(teamId: number, userId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/teams/${teamId}/remove_member/`, { user_id: userId }, { headers });
  }
  getMsps(): Observable<Msp[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Msp[]>(`${this.apiUrl}/msps/`, { headers });
  }
}
