import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { BienService, Bien } from '../../core/services/bien/bien.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../core/services/notification/notification.service';
import Swal from 'sweetalert2';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PowensService } from '../../core/services/powens/powens.service';


@Component({
  selector: 'app-biens',
  templateUrl: './biens.component.html',
  styleUrls: ['./biens.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputGroupModule, InputGroupAddonModule]
})
export class BiensComponent implements OnInit {


  biens: Bien[] = [];
  bienForm!: FormGroup;
  showForm = false;

  constructor(private fb: FormBuilder, private bienService: BienService, private notif: NotificationService, private powensService: PowensService) { }

  ngOnInit(): void {

    this.powensService.detectPaiements();

    this.initForm();
    this.loadBiens();
  }

  initForm() {
    this.bienForm = this.fb.group({
      titre: [''],
      adresse: [''],
      ville: [''],
      codePostal: [''],
      superficie: [0],
      type: [''],
      meuble: [false],
      loyerMensuel: [0],
      chargesMensuelles: [0],
      prixAchat: [0],
      fraisNotaire: [0],
      fraisTravaux: [0],
      description: ['']
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  closeModals() {
    this.showForm = false;
  }

  loadBiens() {
    this.bienService.getBiens().subscribe(data => this.biens = data);
  }

  onSubmit() {
    if (this.bienForm.valid) {
      this.bienService.createBien(this.bienForm.value).subscribe(() => {
        this.loadBiens();
        this.bienForm.reset();
        this.showForm = false;
        this.notif.push('Votre bien a été ajouté avec succès !', 'success');

      });
    }
  }


  getRentabilite(bien: Bien): number {
    const revenuAnnuel = bien.loyerMensuel * 12;
    const coutTotal = bien.prixAchat + (bien.fraisNotaire || 0) + (bien.fraisTravaux || 0);
    return (revenuAnnuel / coutTotal) * 100;
  }


  deleteBien(id: number | undefined) {
    if (!id) return;

    Swal.fire({
      title: 'Supprimer ce bien ?',
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bienService.deleteBien(id).subscribe(() => {
          this.loadBiens();
          Swal.fire('Supprimé', 'Le bien a été supprimé.', 'success');
        });
      }
    });
  }



  voirDetails(bien: Bien) {
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

      /* Responsive tweak */
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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-house-icon lucide-map-pin-house"><path d="M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z"/><path d="M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2"/><path d="M18 22v-3"/><circle cx="10" cy="10" r="3"/></svg>
        <div><span class="swal2-detail-label">Adresse :</span><br>${bien.adresse}, ${bien.ville} ${bien.codePostal}</div>
      </div>
      <div class="swal2-detail-row">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ruler-icon lucide-ruler"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>
        <div><span class="swal2-detail-label">Superficie :</span><br>${bien.superficie} m²</div>
      </div>
      <div class="swal2-detail-row">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-euro-icon lucide-euro"><path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/></svg>
        <div><span class="swal2-detail-label">Loyer :</span><br>${bien.loyerMensuel} €/mois</div>
      </div>
      <div class="swal2-detail-row">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tv-icon lucide-tv"><path d="m17 2-5 5-5-5"/><rect width="20" height="15" x="2" y="7" rx="2"/></svg>
        <div><span class="swal2-detail-label">Meublé :</span><br>${bien.meuble ? 'Oui' : 'Non'}</div>
      </div>
      <div class="swal2-description">
        <span class="swal2-detail-label">Description :</span><br>${bien.description ? bien.description : 'Aucune description fournie.'}
      </div>
    </div>
    `,
      icon: 'info',
      confirmButtonText: 'Fermer',
      confirmButtonColor: '#6366f1',
      width: 700,
    });
  }





  modifierBien(bien: Bien) {
    Swal.fire({
      title: `<span style="font-weight:600;">Modifier le bien : </span>`,
      html: `
    <style>
      .swal2-form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        padding-top: 10px;
      }
      .input-wrapper {
        display: flex;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 6px;
        padding: 6px 10px;
        background: white;
      }
      .input-wrapper svg {
        margin-right: 8px;
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        color: #666;
      }
      .input-wrapper input,
      .input-wrapper textarea {
        border: none;
        outline: none;
        width: 100%;
        font-size: 14px;
      }
      .input-wrapper textarea {
        resize: vertical;
        min-height: 60px;
      }
      .checkbox-row {
        grid-column: span 2;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .full-row {
        grid-column: span 2;
      }
    </style>

    <div class="swal2-form">
      <div class="input-wrapper">
        ${this.getIcon('home')}<input id="titre" placeholder="Titre" value="${bien.titre}" />
      </div>
      <div class="input-wrapper">
        ${this.getIcon('tag')}<input id="type" placeholder="Type" value="${bien.type}" />
      </div>
      <div class="input-wrapper">
        ${this.getIcon('map')}<input id="adresse" placeholder="Adresse" value="${bien.adresse}" />
      </div>
      <div class="input-wrapper">
        ${this.getIcon('city')}<input id="ville" placeholder="Ville" value="${bien.ville}" />
      </div>
      <div class="input-wrapper">
        ${this.getIcon('code')}<input id="codePostal" placeholder="Code postal" value="${bien.codePostal}" />
      </div>
      <div class="input-wrapper">
        ${this.getIcon('area')}<input id="superficie" type="number" placeholder="Superficie (m²)" value="${bien.superficie}" />
      </div>
      <div class="input-wrapper">
        ${this.getIcon('euro')}<input id="loyerMensuel" type="number" placeholder="Loyer (€)" value="${bien.loyerMensuel}" />
      </div>
      <div class="input-wrapper">
        ${this.getIcon('charges')}<input id="chargesMensuelles" type="number" placeholder="Charges (€)" value="${bien.chargesMensuelles ?? ''}" />
      </div>
      <div class="input-wrapper">
        ${this.getIcon('money')}<input id="prixAchat" type="number" placeholder="Prix d’achat (€)" value="${bien.prixAchat}" />
      </div>
      <div class="input-wrapper">
        ${this.getIcon('notaire')}<input id="fraisNotaire" type="number" placeholder="Frais notaire (€)" value="${bien.fraisNotaire ?? ''}" />
      </div>
      <div class="input-wrapper">
        ${this.getIcon('tools')}<input id="fraisTravaux" type="number" placeholder="Frais travaux (€)" value="${bien.fraisTravaux ?? ''}" />
      </div>
      <div class="input-wrapper">
        ${this.getIcon('calendar')}<input id="dateAcquisition" type="date" value="${bien.dateAcquisition ? bien.dateAcquisition.toString().substring(0, 10) : ''}" />
      </div>
      <div class="input-wrapper full-row">
        ${this.getIcon('description')}<textarea id="description" placeholder="Description">${bien.description ?? ''}</textarea>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="meuble" ${bien.meuble ? 'checked' : ''} />
        <label for="meuble">Meublé</label>
      </div>
    </div>
    `,
      showCancelButton: true,
      confirmButtonText: 'Enregistrer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#999',
      preConfirm: () => {
        return {
          titre: (document.getElementById('titre') as HTMLInputElement).value,
          type: (document.getElementById('type') as HTMLInputElement).value,
          adresse: (document.getElementById('adresse') as HTMLInputElement).value,
          ville: (document.getElementById('ville') as HTMLInputElement).value,
          codePostal: (document.getElementById('codePostal') as HTMLInputElement).value,
          superficie: Number((document.getElementById('superficie') as HTMLInputElement).value),
          loyerMensuel: Number((document.getElementById('loyerMensuel') as HTMLInputElement).value),
          chargesMensuelles: Number((document.getElementById('chargesMensuelles') as HTMLInputElement).value),
          prixAchat: Number((document.getElementById('prixAchat') as HTMLInputElement).value),
          fraisNotaire: Number((document.getElementById('fraisNotaire') as HTMLInputElement).value),
          fraisTravaux: Number((document.getElementById('fraisTravaux') as HTMLInputElement).value),
          dateAcquisition: (document.getElementById('dateAcquisition') as HTMLInputElement).value
            ? new Date((document.getElementById('dateAcquisition') as HTMLInputElement).value).toISOString()
            : null,
          description: (document.getElementById('description') as HTMLTextAreaElement).value,
          meuble: (document.getElementById('meuble') as HTMLInputElement).checked,
        };
      }

    }).then(result => {
      if (result.isConfirmed && result.value) {
        this.bienService.updateBien(bien.id!, result.value).subscribe(() => {
          this.loadBiens();
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Bien modifié avec succès.',
            timer: 2000,
            showConfirmButton: false
          });
        });
      }
    });
  }


  getIcon(name: string): string {
    const icons: { [key: string]: string } = {
      home: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tag-icon lucide-tag"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>',
      tag: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-letter-text-icon lucide-letter-text"><path d="M15 12h6"/><path d="M15 6h6"/><path d="m3 13 3.553-7.724a.5.5 0 0 1 .894 0L11 13"/><path d="M3 18h18"/><path d="M3.92 11h6.16"/></svg>',
      map: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-house-icon lucide-map-pin-house"><path d="M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z"/><path d="M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2"/><path d="M18 22v-3"/><circle cx="10" cy="10" r="3"/></svg>',
      city: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building2-icon lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>',
      code: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code-icon lucide-code"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></svg>',
      area: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-land-plot-icon lucide-land-plot"><path d="m12 8 6-3-6-3v10"/><path d="m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12"/><path d="m6.49 12.85 11.02 6.3"/><path d="M17.51 12.85 6.5 19.15"/></svg>',
      euro: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-euro-icon lucide-euro"><path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/></svg>',
      charges: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-plus-icon lucide-message-square-plus"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 7v6"/><path d="M9 10h6"/></svg>',
      money: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hand-coins-icon lucide-hand-coins"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/></svg>',
      notaire: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-handshake-icon lucide-handshake"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>',
      tools: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pickaxe-icon lucide-pickaxe"><path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912"/><path d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393"/><path d="M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z"/><path d="M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319"/></svg>',
      calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-icon lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>',
      description: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-letter-text-icon lucide-letter-text"><path d="M15 12h6"/><path d="M15 6h6"/><path d="m3 13 3.553-7.724a.5.5 0 0 1 .894 0L11 13"/><path d="M3 18h18"/><path d="M3.92 11h6.16"/></svg>'
    };
    return icons[name] || '';
  }


  ouvrirFormulaireAjoutBien() {
    Swal.fire({
      title: 'Ajouter un bien',
      html: `
      <input id="titre" class="swal2-input" placeholder="Titre">
      <input id="adresse" class="swal2-input" placeholder="Adresse">
      <input id="ville" class="swal2-input" placeholder="Ville">
      <input id="codePostal" class="swal2-input" placeholder="Code postal">
      <input id="superficie" class="swal2-input" type="number" placeholder="Superficie">
      <input id="type" class="swal2-input" placeholder="Type (appart, maison...)">
      <select id="meuble" class="swal2-input">
        <option value="true">Meublé</option>
        <option value="false">Non meublé</option>
      </select>
      <input id="loyerMensuel" class="swal2-input" type="number" placeholder="Loyer mensuel">
      <input id="chargesMensuelles" class="swal2-input" type="number" placeholder="Charges mensuelles (optionnel)">
      <input id="prixAchat" class="swal2-input" type="number" placeholder="Prix d'achat">
      <input id="fraisNotaire" class="swal2-input" type="number" placeholder="Frais de notaire (optionnel)">
      <input id="fraisTravaux" class="swal2-input" type="number" placeholder="Frais travaux (optionnel)">
      <input id="dateAcquisition" class="swal2-input" type="date" placeholder="Date d'acquisition (optionnel)">
      <textarea id="description" class="swal2-textarea" placeholder="Description (optionnel)"></textarea>
    `,
      confirmButtonText: 'Ajouter',
      focusConfirm: false,
      preConfirm: () => {
        const get = (id: string) => (document.getElementById(id) as HTMLInputElement)?.value;
        const bien: Bien = {
          titre: get('titre'),
          adresse: get('adresse'),
          ville: get('ville'),
          codePostal: get('codePostal'),
          superficie: parseInt(get('superficie')),
          type: get('type'),
          meuble: get('meuble') === 'true',
          loyerMensuel: parseFloat(get('loyerMensuel')),
          chargesMensuelles: parseFloat(get('chargesMensuelles')) || undefined,
          prixAchat: parseFloat(get('prixAchat')),
          fraisNotaire: parseFloat(get('fraisNotaire')) || undefined,
          fraisTravaux: parseFloat(get('fraisTravaux')) || undefined,
          dateAcquisition: get('dateAcquisition') ? new Date(get('dateAcquisition')).toISOString() : undefined,
          description: get('description') || undefined
        };
        return bien;
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        this.bienService.createBien({ ...result.value }).subscribe({
          next: () => {
            this.loadBiens();

            Swal.fire('Bien ajouté !', '', 'success');

          },
          error: (err) => {
            console.error(err);
            Swal.fire('❌ Erreur', 'Impossible d’ajouter ce bien', 'error');
          }
        });
      }
    });

  }
}
