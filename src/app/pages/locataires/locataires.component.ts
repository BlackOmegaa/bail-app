import { Component, OnInit } from '@angular/core';
import { LocataireService, Locataire } from '../../core/services/locataires/locataires.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PaiementLoyerService, PaiementLoyer } from '../../core/services/paiement-loyer/paiement-loyer.service';
import { BauxService } from '../../core/services/baux/baux.service';
import { fadeSlide } from '../../shared/animations/animation';
import { PowensService } from '../../core/services/powens/powens.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-locataires',
  templateUrl: './locataires.component.html',
  styleUrls: ['./locataires.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  animations: [fadeSlide]
})





export class LocatairesComponent implements OnInit {
  locataires: Locataire[] = [];
  selectedLocataire: Locataire | null = null;
  showAddModal = false;
  locataireForm!: FormGroup;
  paiements: PaiementLoyer[] = [];
  baux: any[] = [];
  fiabiliteMessage: { message: string, color: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private locataireService: LocataireService,
    private paiementService: PaiementLoyerService,
    private bauxService: BauxService,
    private powensService: PowensService
  ) { }

  ngOnInit() {
    this.bauxService.getBaux().subscribe(baux => {
      this.baux = baux;
    });

    this.locataireForm = this.fb.group({
      civilite: [''],
      prenom: [''],
      nom: [''],
      email: [''],
      tel: [''],
      adresse: [''],
      dateNaissance: [''],
      typeLocataire: [''],
    });

    this.refresh();


    this.locataireService.getLocataires().subscribe(async locs => {
      this.locataires = [];

      for (let loc of locs) {
        const fiab = loc.fiabilite;//this.calcFiabilite(loc);
        const statutLoyer = await this.getLoyerStatut(loc);
        this.locataires.push({ ...loc, fiabilite: fiab, statutLoyer });
      }
    });

  }

  refresh() {
    this.locataireService.getLocataires().subscribe((data) => {
      this.locataires = data.map((loc) => ({
        ...loc,
        fiabilite: loc.fiabilite//this.calcFiabilite(loc),
      }));
    });
  }

  //calcFiabilite(loc: Locataire): number {
  //return Math.floor(Math.random() * 40) + 60;
  //}

  getFiabiliteColor(fiabilite: number = 0): string {
    if (fiabilite >= 90) return 'excellent';
    if (fiabilite >= 75) return 'good';
    if (fiabilite >= 50) return 'medium';
    return 'low';
  }

  openForm() {
    this.showAddModal = true;
    this.selectedLocataire = null;
  }

  closeModal() {
    this.showAddModal = false;
    this.locataireForm.reset();
  }

  onSubmit() {
    if (this.locataireForm.valid) {
      this.locataireService.createLocataire(this.locataireForm.value).subscribe(() => {
        this.refresh();
        this.locataireForm.reset();
        this.closeModal();
      });
    }
  }

  openDetails(locataire: Locataire) {
    this.selectedLocataire = locataire;
    this.showAddModal = false;

    this.paiementService.getPaiementsByLocataire(locataire.id!).subscribe((data) => {
      this.paiements = data;
    });

    this.getFiabiliteMessage(locataire).then((res) => {
      this.fiabiliteMessage = res;
    });
  }


  closeAll() {
    this.selectedLocataire = null;
    this.showAddModal = false;
  }

  getLoyerStatut(locataire: Locataire): Promise<string> {
    return new Promise((resolve) => {
      this.paiementService.getPaiementsByLocataire(locataire.id!).subscribe(paiements => {
        const sorted = paiements.sort((a, b) => {
          if (a.annee !== b.annee) return b.annee - a.annee;
          return b.mois - a.mois;
        });
        const paiementPlusRecent = sorted[0];

        if (!paiementPlusRecent) {
          resolve('En cours'); // ou 'Non défini' si tu veux être explicite
        } else {
          // On fait confiance à la valeur du backend
          resolve(this.formatStatut(paiementPlusRecent.statut));
        }
      });
    });
  }

  private formatStatut(statut: string): string {
    const s = statut.toLowerCase();
    if (s === 'payé' || s === 'paye') return 'Payé';
    if (s === 'en cours' || s === 'encours') return 'En cours';
    if (s === 'en retard' || s === 'retard') return 'En retard';
    if (s === 'incomplet' || s === 'incomplet') return 'Incomplet';
    if (s === 'trop perçu' || s === 'trop perçu') return 'Trop perçu';
    return 'En cours'; // fallback par défaut
  }


  formatMois(mois: number): string {
    return mois < 10 ? `0${mois}` : `${mois}`;
  }


  ajouterLocataire() {
    Swal.fire({
      title: 'Ajouter un locataire',
      html: `
      <input id="civilite" class="swal2-input" placeholder="Civilité (ex: M. ou Mme)">
      <input id="prenom" class="swal2-input" placeholder="Prénom">
      <input id="nom" class="swal2-input" placeholder="Nom">
      <input id="email" class="swal2-input" placeholder="Email" type="email">
      <input id="tel" class="swal2-input" placeholder="Téléphone">
      <input id="adresse" class="swal2-input" placeholder="Adresse (facultatif)">
      <input id="dateNaissance" class="swal2-input" placeholder="Date de naissance" type="date">
      <input id="typeLocataire" class="swal2-input" placeholder="Type de locataire (facultatif)">
    `,
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#999',
      focusConfirm: false,
      preConfirm: () => {
        const civilite = (document.getElementById('civilite') as HTMLInputElement).value;
        const prenom = (document.getElementById('prenom') as HTMLInputElement).value;
        const nom = (document.getElementById('nom') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const tel = (document.getElementById('tel') as HTMLInputElement).value;
        const adresse = (document.getElementById('adresse') as HTMLInputElement).value;
        const dateNaissance = (document.getElementById('dateNaissance') as HTMLInputElement).value;
        const typeLocataire = (document.getElementById('typeLocataire') as HTMLInputElement).value;

        if (!civilite || !prenom || !nom || !email || !tel) {
          Swal.showValidationMessage('Tous les champs obligatoires doivent être remplis.');
          return;
        }

        const locataire: Locataire = {
          civilite,
          prenom,
          nom,
          email,
          tel,
          adresse: adresse || undefined,
          dateNaissance: dateNaissance ? new Date(dateNaissance).toISOString() : undefined,
          typeLocataire: typeLocataire || undefined
        };

        return locataire;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const locataire: Locataire = result.value;
        this.locataireService.createLocataire(locataire).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Locataire ajouté avec succès.',
              timer: 2000,
              showConfirmButton: false
            });
            this.refresh(); // ou toute méthode que tu utilises pour rafraîchir l'affichage
          },
          error: () => {
            Swal.fire('Erreur', 'Impossible d’ajouter le locataire.', 'error');
          }
        });
      }
    });
  }

  voirBienLie(locataire: Locataire) {
    this.bauxService.getBaux().subscribe(baux => {
      const bailLie = baux.find(b => b.locataire?.id === locataire.id);

      if (!bailLie || !bailLie.bien) {
        Swal.fire({
          icon: 'info',
          title: 'Aucun bien lié',
          text: 'Ce locataire n’est lié à aucun bien actuellement.',
          confirmButtonText: 'Fermer',
          confirmButtonColor: '#6366f1'
        });
        return;
      }

      const bien = bailLie.bien;

      Swal.fire({
        title: `<span style="font-weight:600; font-size:18px;">Détails du bien : ${bien.titre}</span>`,
        html: `
      <style>
        .swal2-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 12px;
          padding: 10px 0;
          text-align: left;
        }

        .swal2-detail-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #f9fafb;
          border-radius: 8px;
          padding: 10px;
          font-size: 14px;
          color: #333;
        }

        .swal2-detail-row svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          color: #6366f1;
          margin-top: 2px;
        }

        .swal2-detail-label {
          font-weight: 600;
          color: #555;
        }

        .swal2-description {
          grid-column: span 2;
          padding: 10px;
          background: #f3f4f6;
          border-radius: 8px;
          font-size: 14px;
          color: #444;
          line-height: 1.5;
        }

        @media (max-width: 600px) {
          .swal2-details-grid {
            grid-template-columns: 1fr !important;
          }

          .swal2-description {
            grid-column: span 1 !important;
          }

          .swal2-detail-row {
            font-size: 13px;
            padding: 8px;
          }

          .swal2-detail-row svg {
            width: 16px;
            height: 16px;
          }
        }
      </style>

      <div class="swal2-details-grid">
        <div class="swal2-detail-row">
          <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-map-pin-house" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z"/><path d="M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2"/><path d="M18 22v-3"/><circle cx="10" cy="10" r="3"/></svg>
          <div><span class="swal2-detail-label">Adresse :</span><br>${bien.adresse}, ${bien.ville} ${bien.codePostal}</div>
        </div>
        <div class="swal2-detail-row">
          <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-ruler" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>
          <div><span class="swal2-detail-label">Superficie :</span><br>${bien.superficie} m²</div>
        </div>
        <div class="swal2-detail-row">
          <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-euro" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/></svg>
          <div><span class="swal2-detail-label">Loyer :</span><br>${bien.loyerMensuel} €/mois</div>
        </div>
        <div class="swal2-detail-row">
          <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-tv" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="m17 2-5 5-5-5"/><rect width="20" height="15" x="2" y="7" rx="2"/></svg>
          <div><span class="swal2-detail-label">Meublé :</span><br>${bien.meuble ? 'Oui' : 'Non'}</div>
        </div>
        <div class="swal2-description">
          <span class="swal2-detail-label">Description :</span><br>${bien.description || 'Aucune description fournie.'}
        </div>
      </div>
      `,
        icon: 'info',
        confirmButtonText: 'Fermer',
        confirmButtonColor: '#6366f1',
        width: 700,
      });
    });
  }


  voirContrat(locataire: Locataire) {
    const bail = this.baux.find(b => b.locataire.id === locataire.id);
    const documentUrl = bail?.documentUrl;

    if (!documentUrl) {
      Swal.fire({
        icon: 'info',
        title: 'Aucun contrat disponible',
        text: 'Aucun document de contrat n’est lié à ce locataire.',
        confirmButtonText: 'Fermer',
        confirmButtonColor: '#6366f1',
      });
      return;
    }

    const fullUrl = `http://localhost:3000/upload/${documentUrl}`;

    Swal.fire({
      title: `<span style="font-weight:600; font-size:18px;">Contrat de location</span>`,
      html: `
      <style>
        .pdf-frame {
          width: 100%;
          height: 70vh;
          border: none;
          border-radius: 8px;
          box-shadow: 0 0 0 1px #e5e7eb;
        }
        .download-btn {
          display: inline-block;
          margin-top: 10px;
          background-color: #6366f1;
          color: white;
          padding: 8px 14px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
        }
        .download-btn:hover {
          background-color: #4f46e5;
        }
      </style>
      <iframe src="${fullUrl}" class="pdf-frame"></iframe>
      <a class="download-btn" href="${fullUrl}" target="_blank" download>Télécharger le document</a>
    `,
      showConfirmButton: true,
      confirmButtonText: 'Fermer',
      confirmButtonColor: '#6366f1',
      width: '90%',
      padding: '1rem',
    });
  }

  async getFiabiliteMessage(locataire: Locataire): Promise<{ message: string, color: string }> {
    return new Promise((resolve) => {
      this.paiementService.getPaiementsByLocataire(locataire.id!).subscribe(paiements => {
        if (!paiements || paiements.length === 0) {
          resolve({ message: 'Locataire récent – données insuffisantes.', color: '#9ca3af' }); // Gris
          return;
        }

        const sorted = paiements.sort((a, b) => {
          if (a.annee !== b.annee) return b.annee - a.annee;
          return b.mois - a.mois;
        });

        const now = new Date();
        const dernierPaiement = sorted[0];
        const moisDernierPaiement = (dernierPaiement.annee * 12) + (dernierPaiement.mois);
        const moisActuel = (now.getFullYear() * 12) + (now.getMonth() + 1); // +1 car JS month = 0-indexed
        const moisDeRetard = moisActuel - moisDernierPaiement;

        const total = paiements.length;
        const retards = paiements.filter(p => p.statut.toLowerCase().includes('retard')).length;
        const payés = paiements.filter(p => p.statut.toLowerCase().includes('payé')).length;

        if (moisDeRetard >= 2) {
          resolve({ message: `Ce locataire ne paie plus depuis ${moisDeRetard} mois.`, color: '#ef4444' }); // Rouge
        } else if (retards === 0 && payés === total) {
          resolve({ message: 'Ce locataire est irréprochable.', color: '#3b82f6' }); // Bleu
        } else if (retards <= total * 0.3) {
          resolve({ message: 'Ce locataire est fiable malgré quelques retards.', color: '#10b981' }); // Vert
        } else {
          resolve({ message: 'Ce locataire a tendance à payer avec du retard.', color: '#f97316' }); // Orange
        }
      });
    });
  }

  getMessageFiabilite(locataire: Locataire): string {
    const paiements = this.paiements.filter(p =>
      p.locataire?.prenom === locataire.prenom &&
      p.locataire?.nom === locataire.nom
    );

    if (paiements.length < 3) {
      return 'Pas assez de données pour évaluer ce locataire.';
    }

    const total = paiements.length;
    const payes = paiements.filter(p => p.statut.toLowerCase() === 'payé').length;
    const retards = paiements.filter(p => p.statut.toLowerCase() === 'en retard').length;

    if (payes === total) {
      return 'Ce locataire est irréprochable.';
    }

    if (payes >= total - 1 && retards <= 1) {
      return 'Ce locataire est globalement fiable.';
    }

    if (retards > total / 2) {
      return `Ce locataire a tendance à payer avec du retard.`;
    }

    const moisNonPayes = paiements.filter(p => p.statut.toLowerCase() !== 'payé').length;
    if (moisNonPayes >= 3) {
      return `Ce locataire ne paye plus depuis ${moisNonPayes} mois.`;
    }

    return 'Comportement de paiement variable.';
  }


}
