import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import type { ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration } from 'chart.js';



@Component({
  selector: 'app-dashboard',
  imports: [BaseChartDirective, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  selectedYear: string = '2025';
  selectedMonth: string = 'Juin';

  availableYears: string[] = ['2023', '2024', '2025'];
  availableMonths: string[] = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  // Bar chart des loyers par mois
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      { data: [820, 690, 1200, 950, 1020, 1100, 750, 1000, 1000, 1300, 730, 920], label: 'Loyers encaissés (€) ', backgroundColor: '#6366f1' }
    ]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true
      }
    }
  };

  // Tableau de suivi
  paiements = [
    {
      locataire: 'Lucie Martin',
      avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=lucie',
      logement: '45 rue des Lylas, Lyon',
      periode: 'Juin 2025 (3 juin)',
      montant: 820,
      quittance: 'Prête',
      etat: 'Payé'
    },
    {
      locataire: 'Mehdi Benyamina',
      avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=mehdi',
      logement: '12 av. Victor Hugo, Nice',
      periode: 'Juin 2025 (12 juin)',
      montant: 690,
      quittance: 'En cours',
      etat: 'En cours'
    },
    {
      locataire: 'Thomas Roussel',
      avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=thomas',
      logement: '77 bd Haussmann, Paris',
      periode: 'Juin 2025 (2 juin)',
      montant: 1200,
      quittance: 'En cours',
      etat: 'En retard'
    }
  ];

}
