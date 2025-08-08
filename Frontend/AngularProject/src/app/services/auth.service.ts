// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

const API_URL = 'http://localhost:5000/api/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getUserFromLocalStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  signup(userData: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/signup`, userData)
      .pipe(
        map(response => {
          if (response.success) {
            return { status: 200, message: 'Inscription réussie' }; // Return success status
          }
          return response; // Handle other cases if needed
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }
  

  signin(credentials: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/signin`, credentials)
      .pipe(
        tap(response => {
          if (response.success) {
            this.setUserAndToken(response);
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/welcome']);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${API_URL}/me`)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  private setUserAndToken(response: any): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private getUserFromLocalStorage(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}