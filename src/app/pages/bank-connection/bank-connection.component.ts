import { Component } from '@angular/core';
import { PowensService } from '../../core/services/powens/powens.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bank-connection',
  templateUrl: './bank-connection.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class BankConnectionComponent {
  loading = false;
  error: string | null = null;

  constructor(private powens: PowensService) { }

  async connectBank() {
    this.loading = true;
    this.error = null;

    try {
      await this.powens.initUser().toPromise();

      const response = await this.powens.getTempCode().toPromise();
      if (!response?.code) {
        this.error = 'Erreur de récupération du code.';
        return;
      }

      const domain = 'gloomies-sandbox.biapi.pro';
      const clientId = '79182214';
      const redirectUri = encodeURIComponent('http://localhost:3000/api/powens/callback');

      const url = `https://webview.powens.com/connect?domain=${domain}&client_id=${clientId}&redirect_uri=${redirectUri}&code=${response.code}`;
      https://webview.powens.com/fr/connect?domain=gloomies-sandbox.biapi.pro&client_id=79182214&redirect_uri=http://localhost:4200/callback
      window.location.href = url;

    } catch (err) {
      this.error = 'Erreur de connexion bancaire.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}
