import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:5000/api/rh';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  // Employé
  getAllEmployes(): Observable<any> {
    return this.http.get(`${BASE_URL}/employes`);
  }
  getAllAbsences(): Observable<any> {
    return this.http.get(`${BASE_URL}/absences`);
  }

  createEmploye(data: any): Observable<any> {
    return this.http.post(`${BASE_URL}/employe`, data);
  }

  updateEmploye(id: string, data: any): Observable<any> {
    return this.http.put(`${BASE_URL}/employe/${id}`, data);
  }

  deleteEmploye(id: string): Observable<any> {
    return this.http.delete(`${BASE_URL}/employe/${id}`);
  }

  // Rapport
  createRapport(data: any): Observable<any> {
    return this.http.post(`${BASE_URL}/rapport`, data);
  }

  // Absence
  addAbsence(data: any): Observable<any> {
    return this.http.post(`${BASE_URL}/absence`, data);
  }

  updateAbsence(id: string, data: any): Observable<any> {
    return this.http.put(`${BASE_URL}/absence/${id}`, data);
  }

  deleteAbsence(id: string): Observable<any> {
    return this.http.delete(`${BASE_URL}/absence/${id}`);
  }

  getAllRapports(): Observable<any> {
    return this.http.get(`${BASE_URL}/rapports`);
  }
  
  
  updateRapport(id: string, data: any): Observable<any> {
    return this.http.put(`${BASE_URL}/rapport/${id}`, data);
  }
  
  deleteRapport(id: string): Observable<any> {
    return this.http.delete(`${BASE_URL}/rapport/${id}`);
  }

  getAllDemandes(): Observable<any> {
    return this.http.get(`${BASE_URL}/demandes-absence`);
  }
  
  traiterDemande(id: string, action: 'accepter' | 'refuser'): Observable<any> {
    return this.http.put(`${BASE_URL}/demande-absence/${id}`, { action });
  }

  
  
}
