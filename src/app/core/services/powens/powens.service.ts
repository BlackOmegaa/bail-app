import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PowensService {
  private readonly apiUrl = 'https://bail-app-backend-production.up.railway.app/api/powens';

  constructor(private http: HttpClient) { }

  initUser() {
    return this.http.post<{ authToken: string }>(`${this.apiUrl}/init-user`, {});
  }

  getTempCode() {
    return this.http.get<{ code: string }>(`${this.apiUrl}/generate-temp-code`);
  }

  saveConnectionId(connectionId: string) {
    return this.http.post(`${this.apiUrl}/save-connection`, { connectionId });
  }
  getAccounts() {
    return this.http.get<any[]>(`${this.apiUrl}/accounts`);
  }
  synchronizeConnection() {
    return this.http.post(`${this.apiUrl}/synchronize`, {}); // pas de body
  }
  saveTokens(data: { connectionId: string; accessToken: string; expiresIn: number }) {
    return this.http.post(`${this.apiUrl}/save-tokens`, data);
  }

  detectPaiements() {
    return this.http.get(`${this.apiUrl}/detect-paiements`).subscribe({
      next: res => console.log('✅ Paiements détectés avec succès', res),
      error: err => console.error('❌ Erreur detect-paiements', err),
    });
  }


}
