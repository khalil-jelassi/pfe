import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = 'http://localhost:5000/api/employe';

@Injectable({ providedIn: 'root' })
export class EmployeService {
  constructor(private http: HttpClient) {}

  createDemandeAbsence(data: any): Observable<any> {
    return this.http.post(`${API}/demande-absence`, data);
  }

  getMesDemandes(): Observable<any> {
    return this.http.get(`${API}/mes-demandes`);
  }

  getDemandeById(id: string): Observable<any> {
    return this.http.get(`${API}/mes-demandes/${id}`);
  }

  deleteDemande(id: string): Observable<any> {
    return this.http.delete(`${API}/demande-absence/${id}`);
  }
  getMesAbsences(): Observable<any> {
    return this.http.get(`${API}/mes-absences`);
  }

  getMesRapports(): Observable<any> {
    return this.http.get(`${API}/mes-rapports`);
  }

}
