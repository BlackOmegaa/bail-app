import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bien } from '../bien/bien.service';
import { Locataire } from '../locataires/locataires.service';

export interface Bail {
  id?: number;
  dateDebut: string;
  dateFin: string;
  montant: number;
  chargesMensuelles?: number;
  typeBail?: string;
  paiementLe?: number;
  caution?: number;
  bienId: number;
  locataireId: number;
  bien?: Bien;
  locataire?: Locataire;
  documentUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BauxService {
  private apiUrl = 'http://localhost:3000/baux';

  constructor(private http: HttpClient) { }

  getBaux(): Observable<Bail[]> {
    return this.http.get<Bail[]>(this.apiUrl);
  }

  getBailById(id: number): Observable<Bail> {
    return this.http.get<Bail>(`${this.apiUrl}/${id}`);
  }

  createBail(data: Bail): Observable<Bail> {
    return this.http.post<Bail>(this.apiUrl, data);
  }

  updateBail(id: number, data: Partial<Bail>): Observable<Bail> {
    return this.http.patch<Bail>(`${this.apiUrl}/${id}`, data);
  }

  deleteBail(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  uploadDocument(bailId: number, fileData: FormData): Observable<any> {
    return this.http.post(`http://localhost:3000/baux/${bailId}/upload`, fileData);
  }


}