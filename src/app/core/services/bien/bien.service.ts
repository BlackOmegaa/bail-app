import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Bien {
  id?: number;
  titre: string;
  adresse: string;
  ville: string;
  codePostal: string;
  superficie: number;
  type: string;
  meuble: boolean;
  loyerMensuel: number;
  chargesMensuelles?: number;
  prixAchat: number;
  fraisNotaire?: number;
  fraisTravaux?: number;
  dateAcquisition?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BienService {
  private apiUrl = 'https://bail-app-backend-production.up.railway.app/biens'; // à adapter selon env

  constructor(private http: HttpClient) { }

  getBiens(): Observable<Bien[]> {
    return this.http.get<Bien[]>(this.apiUrl);
  }

  getBienById(id: number): Observable<Bien> {
    return this.http.get<Bien>(`${this.apiUrl}/${id}`);
  }

  createBien(data: Bien): Observable<Bien> {
    return this.http.post<Bien>(this.apiUrl, data);
  }

  updateBien(id: number, data: Partial<Bien>): Observable<Bien> {
    return this.http.patch<Bien>(`${this.apiUrl}/${id}`, data);
  }

  deleteBien(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
