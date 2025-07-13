import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://bail-app-backend-production.up.railway.app/auth';
  private tokenKey = 'token';

  constructor(private http: HttpClient, private router: Router) { }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { name, email, password });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    if (this.router.url === '/login') {
      history.replaceState({ message: 'Vous avez été déconnecté.' }, '');
      window.location.reload();
    } else {
      this.router.navigate(['/login'], {
        state: { message: 'Vous avez été déconnecté.' }
      });
    }

  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserProfile(): Observable<any> {
    const token = this.getToken();



    if (!token) throw new Error('No token found');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.baseUrl}/me`, { headers });
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.role || null;
    } catch (e) {
      return null;
    }
  }

  updateProfile(data: { name: string; email: string }) {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.baseUrl}/update-profile`, data, { headers });
  }

  updatePassword(data: { oldPassword: string; newPassword: string }) {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.baseUrl}/update-password`, data, { headers });
  }


}