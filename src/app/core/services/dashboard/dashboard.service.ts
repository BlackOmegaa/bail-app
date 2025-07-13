import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface PaiementItem {
  locataire: string;
  avatar: string;
  logement: string;
  periode: string;
  montant: number;
  quittance: string;
  etat: 'Payé' | 'En cours' | 'En retard';
}

interface DashboardStats {
  locatairesActifs: number;
  bauxEnCours: number;
  loyersEncaissesCeMois: {
    total: number;
    variation: number;
  };
  loyersEnAttenteCeMois: number;
  loyersMensuels: number[];
  paiements: PaiementItem[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly baseUrl = 'http://localhost:3000/dashboard';

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/stats`);
  }

  getLoyersMensuels(): Observable<{
    loyersMensuelsPayes: number[];
    loyersMensuelsNonPayes: number[];
    totalRecu: number,
    totalNonPaye: number
  }> {
    return this.http.get<{
      loyersMensuelsPayes: number[], loyersMensuelsNonPayes: number[], totalRecu: number,
      totalNonPaye: number
    }>(`${this.baseUrl}/loyers-mensuels`);
  }

  getOccupationData() {
    return this.http.get<{ biens: any[]; baux: any[] }>(`${this.baseUrl}/dashboard-occupation`);
  }

}
