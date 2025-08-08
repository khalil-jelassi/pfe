// services/notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private socket: Socket;
  private apiUrl = 'http://localhost:5000/api';
  private socketUrl = 'http://localhost:5000';
  private unreadCountSubject = new BehaviorSubject<number>(0);
  private notificationsSubject = new BehaviorSubject<any[]>([]);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.socket = io(this.socketUrl);

    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.setupSocketConnection(user);
        this.loadUnreadCount();
      } else {
        this.disconnectSocket();
      }
    });
  }

  private setupSocketConnection(user: any) {
    if (user.role === 'manager' || user.role === 'Admin_RH') {
      this.socket.emit('joinRoom', 'manager');
    }

    this.socket.on('new_notification', (notification) => {
      const currentNotifications = this.notificationsSubject.value;
      this.notificationsSubject.next([notification, ...currentNotifications]);

      const currentCount = this.unreadCountSubject.value;
      this.unreadCountSubject.next(currentCount + 1);
    });
  }

  private disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  getNotifications(): Observable<any[]> {
    this.http.get<any>(`${this.apiUrl}/notifications`).subscribe(
      response => {
        if (response.success) {
          this.notificationsSubject.next(response.data);
        }
      }
    );
    return this.notificationsSubject.asObservable();
  }

  loadUnreadCount() {
    this.http.get<any>(`${this.apiUrl}/notifications/count`).subscribe(
      response => {
        if (response.success) {
          this.unreadCountSubject.next(response.count);
        }
      }
    );
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  markAsRead(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/notifications/${id}`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/notifications`, {});
  }
}
