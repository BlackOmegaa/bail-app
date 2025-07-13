import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaiementLoyer {
  id?: number;
  datePaiement?: Date;
  mois: number;
  annee: number;
  statut: 'payé' | 'en cours' | 'en retard' | 'incomplet' | 'trop perçu';
  montant: number;
  bailId: number;
  locataireId: number;
  locataire?: {
    prenom: string;
    nom: string;
  };
}

export interface PaiementStats {
  tauxPaye: number;
  variationPaye: number;
  tauxRetard: number;
  variationRetard: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaiementLoyerService {
  private apiUrl = 'https://bail-app-backend-production.up.railway.app/paiements-loyer';

  constructor(private http: HttpClient) { }

  getPaiementsByLocataire(locataireId: number): Observable<PaiementLoyer[]> {
    return this.http.get<PaiementLoyer[]>(`${this.apiUrl}/locataire/${locataireId}`);
  }


  createPaiement(paiement: PaiementLoyer): Observable<PaiementLoyer> {
    return this.http.post<PaiementLoyer>(this.apiUrl, paiement);
  }

  updatePaiement(id: number, data: Partial<PaiementLoyer>): Observable<PaiementLoyer> {
    console.log('Données envoyées pour updatePaiement :', { id, ...data });

    return this.http.patch<PaiementLoyer>(`${this.apiUrl}/${id}`, data);
  }

  deletePaiement(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getPaiementsByBailleur(bailleurId: number): Observable<PaiementLoyer[]> {
    return this.http.get<PaiementLoyer[]>(`${this.apiUrl}/bailleur/${bailleurId}`);
  }

  getPaiementStats(bailleurId: number): Observable<{
    tauxPaye: number;
    variationPaye: number;
    tauxRetard: number;
    variationRetard: number;
  }> {
    return this.http.get<{
      tauxPaye: number;
      variationPaye: number;
      tauxRetard: number;
      variationRetard: number;
    }>(`${this.apiUrl}/stats/${bailleurId}`);
  }




}
