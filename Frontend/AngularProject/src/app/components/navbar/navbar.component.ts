// navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/NotificationService.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: any;
  unreadCount = 0;
  notifications: any[] = [];
  showNotifications = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.user = this.authService.currentUserValue;
  }

  ngOnInit() {
    // Subscribe to unread notification count
    this.notificationService.getUnreadCount().subscribe(count => {
      this.unreadCount = count;
    });
    
    // Load notifications when needed
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      // Refresh notifications when opened
      this.notificationService.getNotifications();
    }
  }

  markAsRead(id: string) {
    this.notificationService.markAsRead(id).subscribe(() => {
      // Update local notification state
      this.notifications = this.notifications.map(n => {
        if (n._id === id) {
          return { ...n, read: true };
        }
        return n;
      });
      
      // Update unread count
      this.notificationService.loadUnreadCount();
    });
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe(() => {
      // Update local notification state
      this.notifications = this.notifications.map(n => {
        return { ...n, read: true };
      });
      
      // Update unread count
      this.unreadCount = 0;
    });
  }

  logout() {
    this.authService.logout();
  }
}