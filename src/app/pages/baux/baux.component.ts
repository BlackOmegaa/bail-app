import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BauxService, Bail } from '../../core/services/baux/baux.service';
import { BienService, Bien } from '../../core/services/bien/bien.service';
import { LocataireService, Locataire } from '../../core/services/locataires/locataires.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PowensService } from '../../core/services/powens/powens.service';

@Component({
  selector: 'app-baux',
  templateUrl: './baux.component.html',
  styleUrls: ['./baux.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, MatButtonModule],
})
export class BauxComponent implements OnInit {


  bailForm!: FormGroup;
  showForm = false;
  baux: Bail[] = [];
  biens: Bien[] = [];
  locataires: Locataire[] = [];
  selectedBail: Bail | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private bailService: BauxService,
    private bienService: BienService,
    private locataireService: LocataireService,
    private sanitizer: DomSanitizer,
    private powensService: PowensService

  ) { }



  ngOnInit(): void {

    this.initForm();
    this.fetchBaux();
    this.fetchBiens();
    this.fetchLocataires();
  }

  showPdf = false;

  openDocumentModal() {
    this.showPdf = true;
  }

  closePdf() {
    this.showPdf = false;
  }


  initForm() {
    this.bailForm = this.fb.group({
      dateDebut: [''],
      dateFin: [''],
      montant: [0],
      chargesMensuelles: [null],
      typeBail: [''],
      paiementLe: [null],
      caution: [null],
      bienId: [''],
      locataireId: [''],
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  fetchBaux() {
    this.bailService.getBaux().subscribe((data) => {
      this.baux = data;
    });
  }

  fetchBiens() {
    this.bienService.getBiens().subscribe((data) => {
      this.biens = data;
    });
  }

  fetchLocataires() {
    this.locataireService.getLocataires().subscribe((data) => {
      this.locataires = data;
    });
  }

  onSubmit() {
    const formData = this.bailForm.value;
    const bailData = {
      ...formData,
      bienId: Number(formData.bienId),
      locataireId: Number(formData.locataireId),
      documentUrl: null
    };

    // Étape 1 : Créer le bail
    this.bailService.createBail(bailData).subscribe({
      next: (createdBail) => {
        console.log('Bail créé:', createdBail);

        // Étape 2 : S’il y a un fichier, on l’upload maintenant que le bail existe
        if (this.selectedFile) {
          const uploadData = new FormData();
          uploadData.append('file', this.selectedFile);

          this.bailService.uploadDocument(createdBail.id!, uploadData).subscribe({
            next: () => {
              console.log('Fichier envoyé avec succès');
              this.fetchBaux();
              this.bailForm.reset();
              this.showForm = false;
            },
            error: (err) => {
              console.error('Erreur upload fichier', err);
            }
          });
        } else {
          this.fetchBaux();
          this.bailForm.reset();
          this.showForm = false;
        }
      },
      error: (err) => {
        console.error('Erreur création bail', err);
      }
    });
  }


  finalizeCreation() {
    this.bailForm.reset();
    this.selectedFile = null;
    this.showForm = false;
    this.fetchBaux();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  openBailModal(bail: Bail) {
    this.selectedBail = bail;
    this.showForm = false;
  }

  closeAllModals() {
    this.showForm = false;
    this.selectedBail = null;
  }

  viewDocument() {
    if (this.selectedBail?.documentUrl) {
      window.open(this.selectedBail.documentUrl, '_blank');
    }
  }

  getSanitizedDocumentUrl(): SafeResourceUrl | null {
    if (this.selectedBail?.documentUrl) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `http://localhost:3000/upload/${this.selectedBail.documentUrl}`
      );
    }
    return null;
  }

  openPdfInNewTab() {
    if (this.selectedBail?.documentUrl) {
      window.open(`http://localhost:3000/upload/${this.selectedBail?.documentUrl}`, '_blank');
    }
  }

  isMobile(): boolean {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

}
