// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { ManageEmployesComponent } from './components/admin/manage-employes/manage-employes.component';
import { RoleGuard } from './guards/role.guard';
import { ManageRapportsComponent } from './components/admin/manage-rapports/manage-rapports.component';
import { ManageAbsencesComponent } from './components/admin/manage-absences/manage-absences.component';
import { ManageMesDemandesComponent } from './components/manage-mes-demandes/manage-mes-demandes.component';
import { ManageDemandesComponent } from './components/manage-demandes/manage-demandes.component';
import { EmployeRapportComponent } from './components/employe-rapport/employe-rapport.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'welcome', component: LandingpageComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/employes',
    component: ManageEmployesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin_RH'] }
  },
  {
    path: 'admin/rapports',
    component: ManageRapportsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin_RH', 'manager'] }
  },
  {
    path: 'admin/absences',
    component: ManageAbsencesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin_RH', 'manager'] }
  },
  {
    path: 'admin/demandes',
    component: ManageDemandesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin_RH', 'manager'] }
  },
  {
    path: 'employe/mes-demandes',
    component: ManageMesDemandesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['employé'] }
  },
  {
    path: 'employe/mes-rapport',
    component: EmployeRapportComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['employé'] }
  },
  // Wildcard route for 404
  { path: '**', redirectTo: '/welcome' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }