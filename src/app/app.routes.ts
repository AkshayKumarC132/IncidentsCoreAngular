import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DevicesComponent } from './components/devices/devices.component';
import { CustomersComponent } from './components/customers/customers.component';
import { IncidentsComponent } from './components/incidents/incidents.component';
import { IntegrationsComponent } from './components/integrations/integrations.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'customers', component: CustomersComponent },
    { path: 'devices', component: DevicesComponent },
    { path: 'incidents', component: IncidentsComponent },
    { path: 'integrations', component: IntegrationsComponent },
    { path: '',component: NavbarComponent},    

];


// const routes: Routes = [
//     { path: '', component: LoginComponent },
//     { path: 'dashboard', component: DashboardComponent },
//     { path: 'customers', component: CustomersComponent },
//     { path: 'devices', component: DevicesComponent },
//     { path: 'incidents', component: IncidentsComponent },
//     { path: 'integrations', component: IntegrationsComponent },
//   ];