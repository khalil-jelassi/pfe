import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ManageEmployesComponent } from './components/admin/manage-employes/manage-employes.component';
import { ManageRapportsComponent } from './components/admin/manage-rapports/manage-rapports.component';
import { ManageAbsencesComponent } from './components/admin/manage-absences/manage-absences.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ManageMesDemandesComponent } from './components/manage-mes-demandes/manage-mes-demandes.component';
import { ManageDemandesComponent } from './components/manage-demandes/manage-demandes.component';
import { EmployeRapportComponent } from './components/employe-rapport/employe-rapport.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    DashboardComponent,
    ManageEmployesComponent,
    ManageRapportsComponent,
    ManageAbsencesComponent,
    NavbarComponent,
    ManageMesDemandesComponent,
    ManageDemandesComponent,
    EmployeRapportComponent,
    LandingpageComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],  bootstrap: [AppComponent]
})
export class AppModule { }
