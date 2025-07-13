import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step-locataire',
  templateUrl: './step-locataire.component.html',
  styleUrls: ['./step-locataire.component.scss'],
  imports: [FormsModule]
})

export class StepLocataireComponent {
  @Input() currentStep!: number;
  @Output() next = new EventEmitter<void>();

  locataire = {
    nom: '',
    email: '',
    tel: '',
  };

  onSubmit() {
    // Tu pourras plus tard stocker les données ou les envoyer à l’API
    this.next.emit();
  }
}
