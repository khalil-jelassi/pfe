// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    
    if (currentUser) {
      // Check if route has data.roles and user doesn't have required role
      if (route.data['roles'] && !route.data['roles'].includes(currentUser.role)) {
        this.router.navigate(['/dashboard']);
        return false;
      }
      
      return true;
    }

    this.router.navigate(['/welcome'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}