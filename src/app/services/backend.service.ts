import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError  } from 'rxjs';
import { Customer } from '../models/customer.model';
import { Device } from '../models/device.model';
import { Incident } from '../models/incident.model';
import { catchError } from 'rxjs/operators';  // Import catchError

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

  // Register API call
  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register/`, data);  // Adjust the API URL as per your backend
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login/`, data); // Adjust the URL as needed
  }
   // Customer API calls
   getCustomers(): Observable<Customer[]> {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.get<Customer[]>(`${this.apiUrl}/customers/`,{ headers });
  }

  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/customers`, customer);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/customers/${customer.id}`, customer);
  }

  deleteCustomer(customerId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/customers/${customerId}`);
  }

  // Device API calls
  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.apiUrl}/devices/`);
  }

  addDevice(device: Device): Observable<Device> {
    return this.http.post<Device>(`${this.apiUrl}/devices`, device);
  }

  updateDevice(device: Device): Observable<Device> {
    return this.http.put<Device>(`${this.apiUrl}/devices/${device.id}`, device);
  }

  deleteDevice(deviceId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/devices/${deviceId}`);
  }

  // Incident API calls
  getIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.apiUrl}/incidents/`);
  }

  addIncident(incident: Incident): Observable<Incident> {
    return this.http.post<Incident>(`${this.apiUrl}/incidents`, incident);
  }

  updateIncident(incident: Incident): Observable<Incident> {
    return this.http.put<Incident>(`${this.apiUrl}/incidents/${incident.id}`, incident);
  }

  deleteIncident(incidentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/incidents/${incidentId}`);
  }

  // Function to get data from API
  getIncidentData(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('authToken')}` // Include the token
    });
    return this.http.get<any>(`${this.apiUrl}/dashboard-summary/`,{ headers });
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('authToken'); // Retrieve the token from local storage
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}` // Include the token in the Authorization header
    });
    return this.http.post(`${this.apiUrl}/logout/`, {}, { headers }); // Send the token in the headers
  }
}
