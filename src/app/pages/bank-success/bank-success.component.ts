import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PowensService } from '../../core/services/powens/powens.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bank-success',
  templateUrl: './bank-success.component.html',
  imports: [CommonModule]
})
export class BankSuccessComponent implements OnInit {
  status: 'loading' | 'success' | 'error' = 'loading';

  constructor(
    private route: ActivatedRoute,
    private powensService: PowensService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const connectionId = this.route.snapshot.queryParamMap.get('connection_id');

    if (!connectionId) {
      this.status = 'error';
      return;
    }

    this.powensService.saveConnectionId(connectionId).subscribe({
      next: () => {
        this.status = 'success';
        // Tu peux rediriger automatiquement après quelques secondes si tu veux
        // setTimeout(() => this.router.navigate(['/dashboard']), 3000);
      },
      error: (err) => {
        console.error('Erreur lors de l’enregistrement de la connexion bancaire', err);
        this.status = 'error';
      }
    });
  }
}
