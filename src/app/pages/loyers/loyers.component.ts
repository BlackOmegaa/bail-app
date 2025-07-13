import { Component, OnInit } from '@angular/core';
import { PaiementLoyerService, PaiementLoyer, PaiementStats } from '../../core/services/paiement-loyer/paiement-loyer.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PowensService } from '../../core/services/powens/powens.service';


@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-loyers',
  templateUrl: './loyers.component.html',
  styleUrls: ['./loyers.component.scss']
})


export class LoyersComponent implements OnInit {
  paiementsActuels: PaiementLoyer[] = [];

  stats: PaiementStats | null = null;

  constructor(
    private paiementService: PaiementLoyerService,
    private authService: AuthService,
    private powensService: PowensService
  ) { }

  ngOnInit(): void {


    this.authService.getUserProfile().subscribe(user => {
      const bailleurId = user.id;
      const now = new Date();
      const moisActuel = now.getMonth() + 1;
      const anneeActuelle = now.getFullYear();

      this.paiementService.getPaiementsByBailleur(bailleurId).subscribe(paiements => {
        this.paiementsActuels = paiements.filter(p =>
          p.mois === moisActuel && p.annee === anneeActuelle
        );
      });

      this.paiementService.getPaiementStats(bailleurId).subscribe(stats => {
        this.stats = stats;
      });
    });
  }

  getNomMois(mois: number): string {
    const date = new Date(2000, mois - 1); // les mois en JS commencent à 0
    return date.toLocaleString('fr-FR', { month: 'long' });
  }

  changerStatut(paiement: PaiementLoyer, nouveauStatut: 'payé' | 'en retard' | 'en cours' | 'incomplet' | 'trop perçu') {
    const dataToSend = {
      statut: nouveauStatut,
      ...(nouveauStatut === 'payé' ? { datePaiement: new Date().toISOString() } : {})
    } as any;


    this.paiementService.updatePaiement(paiement.id!, dataToSend).subscribe((updated) => {
      paiement.statut = updated.statut;
      paiement.datePaiement = updated.datePaiement;
    });
  }


  getBadgeClass(statut: string): string {
    switch (statut) {
      case 'payé':
        return 'badge-paye';
      case 'en cours':
        return 'badge-en-cours';
      case 'en retard':
        return 'badge-en-retard';
      case 'incomplet':
        return 'badge-en-cours';
      case 'trop perçu':
        return 'badge-en-retard';
      default:
        return '';
    }
  }




}
