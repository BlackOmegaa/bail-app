import { Component, OnInit } from '@angular/core';
import { PowensService } from '../../core/services/powens/powens.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  imports: [CommonModule]
})
export class BankAccountsComponent implements OnInit {
  accounts: any[] = [];
  loading = true;
  error: string | null = null;
  refreshing = false;

  constructor(private powensService: PowensService) { }

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const connectionId = urlParams.get('connection_id');
    const accessToken = urlParams.get('access_token');
    const expiresIn = urlParams.get('expires_in');

    if (connectionId && accessToken && expiresIn) {
      this.powensService.saveTokens({
        connectionId,
        accessToken,
        expiresIn: parseInt(expiresIn)
      }).subscribe({
        next: () => {
          console.log('Access token enregistré avec succès');
          window.history.replaceState({}, '', window.location.pathname);
          this.loadAccounts();
        },
        error: (err) => {
          this.error = 'Erreur lors de l’enregistrement du token';
          console.error(err);
        }
      });
    } else {
      this.loadAccounts(); // juste chargement sans sync
    }
  }

  loadAccounts(): void {
    this.loading = true;
    this.powensService.getAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des comptes.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  triggerSync(): void {
    this.refreshing = true;
    this.powensService.synchronizeConnection().subscribe({
      next: () => {
        this.loadAccounts(); // rechargement après sync
        this.refreshing = false;
      },
      error: (err) => {
        this.error = 'Erreur lors de la synchronisation Powens.';
        console.error('Erreur de sync :', err);
        this.refreshing = false;
      }
    });
  }

  maskIban(iban: string): string {
    if (!iban) return '';
    return iban.slice(0, 4) + ' **** **** **** ' + iban.slice(-4);
  }

  getAccountTypeLabel(type: string): string {
    switch (type) {
      case 'checking': return 'Compte courant';
      case 'savings': return 'Compte épargne';
      case 'loan': return 'Compte prêt';
      case 'card': return 'Carte bancaire';
      default: return 'Type inconnu';
    }
  }
}
