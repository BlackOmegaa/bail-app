import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Locataire {
  id?: number;
  civilite: string;
  prenom: string;
  nom: string;
  email: string;
  tel: string;
  adresse?: string;
  dateNaissance?: string;
  typeLocataire?: string;
  bailId?: number;
  fiabilite?: number;
  statutLoyer?: string;
}


@Injectable({
  providedIn: 'root',
})
export class LocataireService {

  private apiUrl = 'https://bail-app-backend-production.up.railway.app/locataires';

  constructor(private http: HttpClient) { }

  getLocataires(): Observable<Locataire[]> {
    return this.http.get<Locataire[]>(this.apiUrl);
  }

  getLocataireById(id: number): Observable<Locataire> {
    return this.http.get<Locataire>(`${this.apiUrl}/${id}`);
  }

  createLocataire(data: Locataire): Observable<Locataire> {
    return this.http.post<Locataire>(this.apiUrl, data);
  }

  updateLocataire(id: number, data: Partial<Locataire>): Observable<Locataire> {
    return this.http.patch<Locataire>(`${this.apiUrl}/${id}`, data);
  }

  deleteLocataire(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
