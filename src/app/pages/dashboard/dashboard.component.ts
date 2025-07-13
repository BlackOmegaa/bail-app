import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../../core/services/dashboard/dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration } from 'chart.js';
import { NotificationService } from '../../core/services/notification/notification.service';
import { BankAccountsComponent } from "../bank-accounts/bank-accounts.component";
import { CarouselModule } from 'primeng/carousel';
import { SpeedDialModule } from 'primeng/speeddial';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';
import { PowensService } from '../../core/services/powens/powens.service';

@Component({
  selector: 'app-dashboard',
  imports: [BaseChartDirective, CommonModule, FormsModule, BankAccountsComponent, CarouselModule, ButtonModule, RippleModule, SpeedDialModule, TooltipModule, SplitButtonModule, MenuModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) doughnutChart?: BaseChartDirective;


  selectedYear = '2025';
  selectedMonth = 'Juin';
  availableYears = ['2023', '2024', '2025'];
  availableMonths = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  locatairesActifs = 0;
  bauxEnCours = 0;
  loyersEncaisses = 0;
  variationEncaisses = 0;
  loyersAttente = 0;
  loyersEncaissesTaux = 0;
  loyersAttenteTaux = 0;
  totalRecu = 0;
  totalNonPaye = 0;

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        data: [],
        label: 'Loyer encaissé',
        backgroundColor: [],
        borderRadius: 6,
        barPercentage: 0.9,
        categoryPercentage: 0.8,
      }
    ]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.raw} €`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#9ca3af',
          font: { size: 12 }
        }
      },
      y: {
        display: false
      }
    }
  };

  paiements: {
    locataire: string;
    avatar: string;
    logement: string;
    periode: string;
    montant: number;
    quittance: string;
    etat: 'Payé' | 'En cours' | 'En retard' | 'Incomplet' | 'Trop perçu';
    fiabilite?: number;
    email?: string;
  }[] = [];




  constructor(
    private dashboardService: DashboardService,
    private notif: NotificationService,
    private powensService: PowensService
  ) { }

  ngOnInit() {

    this.updateOccupationStats();


    this.dashboardService.getLoyersMensuels().subscribe((data) => {
      this.totalRecu = data.totalRecu;
      this.totalNonPaye = data.totalNonPaye;
    })

    this.dashboardService.getDashboardStats().subscribe((data) => {
      this.locatairesActifs = data.locatairesActifs;
      this.bauxEnCours = data.bauxEnCours;
      this.loyersEncaisses = data.loyersEncaissesCeMois.total;
      this.variationEncaisses = data.loyersEncaissesCeMois.variation;
      this.loyersAttente = data.loyersEnAttenteCeMois;
      this.paiements = data.paiements;

      console.log('PAIEMENTS:');
      data.paiements.forEach(p => console.log(p));

      const total = this.loyersEncaisses + this.loyersAttente;
      this.loyersEncaissesTaux = total > 0 ? Math.round(this.loyersEncaisses * 100 / total) : 0;
      this.loyersAttenteTaux = total > 0 ? Math.round(this.loyersAttente * 100 / total) : 0;
      this.doughnutChartData = {
        labels: ['Payé', 'Non reçu'],
        datasets: [{
          data: [this.loyersEncaissesTaux, this.loyersAttenteTaux],
          backgroundColor: ['#6366f1', '#3e39da'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      };

      setTimeout(() => this.doughnutChart?.update(), 0);

      // Met à jour les données du bar chart
      this.barChartData.datasets[0].data = data.loyersMensuels;

      const currentMonthIndex = new Date().getMonth(); // 0-11
      this.barChartData.datasets[0].backgroundColor = data.loyersMensuels.map((_, i) =>
        i === currentMonthIndex ? '#6366f1' : '#e5e7eb'
      );

      const loyersMensuelsPayes = [1000, 1200, 1300, 1250, 1500, 1600];
      const loyersMensuelsNonPayes = [200, 150, 100, 50, 300, 250];

      this.dashboardService.getLoyersMensuels().subscribe(data => {
        const currentMonthIndex = new Date().getMonth();

        this.barChartData.datasets = [
          {
            data: data.loyersMensuelsPayes,
            label: 'Loyers payés',
            backgroundColor: data.loyersMensuelsPayes.map((_, i) =>
              i === currentMonthIndex ? '#6366f1' : '#c7d2fe'
            ),
            borderRadius: 6,
            barPercentage: 0.8,
            categoryPercentage: 0.8,
          },
          {
            data: data.loyersMensuelsNonPayes,
            label: 'Loyers non payés',
            backgroundColor: data.loyersMensuelsNonPayes.map((_, i) =>
              i === currentMonthIndex ? '#f78a8a' : '#f1adad'
            ),
            borderRadius: 6,
            barPercentage: 0.8,
            categoryPercentage: 0.8,
          }
        ];

        setTimeout(() => this.chart?.update(), 0);
      });
    });
  }

  doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Payé', 'Non reçu'],
    datasets: [{
      data: [this.loyersEncaissesTaux, this.loyersAttenteTaux],
      backgroundColor: ['#6366f1', '#3e39da'],
      borderWidth: 2,
      borderColor: '#fff'
    }]

  };


  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,

    maintainAspectRatio: false,
    cutout: '75%', // Effet "anneau"
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#4b5563',
          font: { size: 12, family: 'Poppins' }
        }
      },
      tooltip: {
        callbacks: {
          label: ctx => ` ${ctx.raw} %`
        }
      }
    }
  };

  getFiabiliteColor(pourcentage: number): string {
    if (pourcentage >= 90) return '#6163f2';  // Indigo 500 – très fiable
    if (pourcentage >= 75) return '#6163f2';  // Indigo 400 – fiable
    if (pourcentage >= 60) return '#6163f2';  // Indigo 300 – moyen
    return '#6163f2';                         // Indigo 100 – à surveiller
  }

  notifications = [
    { title: 'Paiement de Richard reçu', date: 'Aujourd’hui - 08:43' },
    { title: 'Loyer Julie en retard', date: 'Hier - 17:22' },
    { title: 'Connexion bancaire mise à jour', date: '21 juin - 14:10' },
  ];


  responsiveOptions = [
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '1024px',
      numVisible: 2,
      numScroll: 1
    }
  ];


  getMenuItems(paiement: any): MenuItem[] {
    return [
      {
        label: 'Voir',
        icon: 'pi pi-eye',
        command: () => this.voirDetails(paiement),
      },
      {
        label: 'Modifier',
        icon: 'pi pi-pencil',
        command: () => this.modifier(paiement),
      },
      {
        label: 'Supprimer',
        icon: 'pi pi-trash',
        command: () => this.supprimer(paiement),
      },
    ];
  }

  voirDetails(paiement: any): void {
    // à implémenter
  }

  modifier(paiement: any): void {
    // à implémenter
  }

  supprimer(paiement: any): void {
    // à implémenter
  }

  occupationPourcent = 0;
  occupationLabel = '—';
  occupationIconSvg: 'excellent' | 'bon' | 'moyen' | 'mauvais' = 'bon'; // par défaut

  updateOccupationStats(): void {
    this.dashboardService.getOccupationData().subscribe(({ biens, baux }) => {
      const bienIdsLies = baux.map(b => b.bienId);
      const biensOccupes = biens.filter(b => bienIdsLies.includes(b.id));
      const totalBiens = biens.length;

      this.occupationPourcent = totalBiens > 0 ? Math.round((biensOccupes.length / totalBiens) * 100) : 0;

      // Mise à jour du statut
      if (this.occupationPourcent >= 90) {
        this.occupationLabel = 'Excellent';
        this.occupationIconSvg = 'excellent';
      } else if (this.occupationPourcent >= 70) {
        this.occupationLabel = 'Bon';
        this.occupationIconSvg = 'bon';
      } else if (this.occupationPourcent >= 50) {
        this.occupationLabel = 'Moyen';
        this.occupationIconSvg = 'moyen';
      } else {
        this.occupationLabel = 'Mauvais';
        this.occupationIconSvg = 'mauvais';
      }
    });
  }



}



