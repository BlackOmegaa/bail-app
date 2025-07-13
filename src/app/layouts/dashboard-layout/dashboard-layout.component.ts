import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { AuthService } from '../../core/services/auth/auth.service';


@Component({
  standalone: true,
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
  imports: [
    RouterModule,
    CommonModule,
    RouterLink],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-5px)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ opacity: 0, transform: 'translateY(-5px)' })),
      ]),
    ]),
  ]
})


export class DashboardLayoutComponent {

  constructor(public auth: AuthService) { }
  user: any;
  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.auth.getUserProfile().subscribe({
        next: (user) => {

          this.user = user;
        },
        error: (err) => {
          console.error('Erreur récupération user :', err);
        }
      });
    }
  }

  unreadCount = 1;
  isSidebarOpen = false;

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  closeMenuOnOutsideClick(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest('.relative');
    if (!clickedInside) {
      this.isMenuOpen = false;
    }
  }

}


